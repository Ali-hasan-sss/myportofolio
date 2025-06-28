import mongoose from "mongoose";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";

// إعداد Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// إعداد multer لتخزين الملفات مؤقتًا في الذاكرة
const upload = multer({ storage: multer.memoryStorage() });

// تعريف الـ Schema لقاعدة البيانات
const AboutSchema = new mongoose.Schema({
  image: String, // رابط الصورة من Cloudinary
  name: String,
  education: String,
  profession: String,
  phoneNo: String,
  email: String,
  adress: String,
  date_of_birth: String,
  description: String,
  cvPath: String, // رابط السيرة الذاتية في Cloudinary
  cvCloudinaryId: String, // معرف السيرة الذاتية في Cloudinary
});

let About;

try {
  About = mongoose.model("About");
} catch (error) {
  About = mongoose.model("About", AboutSchema);
  console.error(error);
}

// التأكد من الاتصال بقاعدة البيانات
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ Failed to connect to MongoDB", err);
      throw err;
    });
}

// تعطيل body parser الافتراضي بسبب استخدام multer
export const config = {
  api: {
    bodyParser: false,
  },
};

// دالة لرفع الملف إلى Cloudinary
const uploadToCloudinary = (buffer, resourceType = "image") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: resourceType === "image" ? "about_images" : "about_cvs",
        resource_type: resourceType,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default async function handler(req, res) {
  // إعدادات CORS
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // معالجة preflight requests
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { method } = req;

  if (method === "GET") {
    try {
      const about = await About.findOne();
      res.status(200).json(about || {});
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (method === "POST") {
    upload.fields([
      { name: "image", maxCount: 1 },
      { name: "cv", maxCount: 1 },
    ])(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "خطأ في رفع الملفات" });
      }

      const { files, body } = req;
      const {
        name,
        description,
        education,
        phoneNo,
        email,
        date_of_birth,
        adress,
        profession,
      } = body;

      try {
        let existingAbout = await About.findOne();
        let imageUrl = existingAbout?.image; // الاحتفاظ بالصورة القديمة في حالة عدم وجود صورة جديدة
        let cvUrl = existingAbout?.cvPath; // الاحتفاظ بالسيرة الذاتية القديمة في حالة عدم وجود سيرة جديدة

        // رفع الصورة الجديدة إن وجدت
        if (files?.image?.[0]) {
          imageUrl = await uploadToCloudinary(files.image[0].buffer, "image");
        }

        // رفع السيرة الذاتية الجديدة إن وجدت
        if (files?.cv?.[0]) {
          cvUrl = await uploadToCloudinary(files.cv[0].buffer, "raw");
        }

        if (existingAbout) {
          // تعديل البيانات الحالية
          existingAbout.image = imageUrl || existingAbout.image;
          existingAbout.name = name || existingAbout.name;
          existingAbout.description = description || existingAbout.description;
          existingAbout.education = education || existingAbout.education;
          existingAbout.phoneNo = phoneNo || existingAbout.phoneNo;
          existingAbout.email = email || existingAbout.email;
          existingAbout.adress = adress || existingAbout.adress;
          existingAbout.date_of_birth =
            date_of_birth || existingAbout.date_of_birth;
          existingAbout.profession = profession || existingAbout.profession;
          existingAbout.cvPath = cvUrl || existingAbout.cvPath;

          await existingAbout.save();
          res.status(200).json(existingAbout);
        } else {
          // إنشاء سجل جديد
          const newAbout = new About({
            image: imageUrl,
            name,
            description,
            education,
            adress,
            date_of_birth,
            email,
            phoneNo,
            profession,
            cvPath: cvUrl,
          });
          await newAbout.save();
          res.status(201).json(newAbout);
        }
      } catch (err) {
        console.error("❌ خطأ أثناء معالجة الطلب:", err);
        res.status(500).json({ message: "خطأ في الخادم أثناء الحفظ" });
      }
    });
  } else if (method === "DELETE") {
    try {
      const existingAbout = await About.findOne();
      if (existingAbout) {
        // حذف الصورة من Cloudinary إن وجدت
        if (existingAbout.image) {
          await cloudinary.uploader.destroy(
            existingAbout.image.split("/").pop().split(".")[0]
          );
        }

        // حذف السيرة الذاتية من Cloudinary إن وجدت
        if (existingAbout.cvPath) {
          await cloudinary.uploader.destroy(existingAbout.cvCloudinaryId, {
            resource_type: "raw",
          });
        }
      }

      await About.deleteMany();
      res.status(200).json({ message: "تم حذف جميع البيانات بنجاح" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`الطريقة ${method} غير مدعومة`);
  }
}
