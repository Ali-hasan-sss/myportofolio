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
});

let About;
try {
  About = mongoose.model("About");
} catch (error) {
  About = mongoose.model("About", AboutSchema);
  console.log(error);
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

// دالة لرفع الصورة إلى Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "about_images" }, // يمكنك تغيير اسم المجلد
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const about = await About.find();
      res.status(200).json(about);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: "خطأ في رفع الصورة" });
      }

      const { file } = req;
      const {
        name,
        description,
        education,
        phoneNo,
        email,
        date_of_birth,
        adress,
        profession,
      } = req.body;

      try {
        let existingAbout = await About.findOne();
        let imageUrl = existingAbout?.image; // الاحتفاظ بالصورة القديمة في حالة عدم وجود صورة جديدة

        if (file) {
          imageUrl = await uploadToCloudinary(file.buffer); // رفع الصورة إلى Cloudinary
        }

        if (existingAbout) {
          // تعديل البيانات الحالية
          existingAbout.image = imageUrl;
          existingAbout.name = name || existingAbout.name;
          existingAbout.description = description || existingAbout.description;
          existingAbout.education = education || existingAbout.education;
          existingAbout.phoneNo = phoneNo || existingAbout.phoneNo;
          existingAbout.email = email || existingAbout.email;
          existingAbout.adress = adress || existingAbout.adress;
          existingAbout.date_of_birth =
            date_of_birth || existingAbout.date_of_birth;
          existingAbout.profession = profession || existingAbout.profession;

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
