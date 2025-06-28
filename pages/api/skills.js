import mongoose from "mongoose";
import upload from "../../config/multer";
import { cloudinary } from "../../config/cloudinary";

// تعريف مخطط Skill في Mongoose
const SkillSchema = new mongoose.Schema({
  name: String,
  imageUrl: String, // حفظ رابط الصورة بدل المسار المحلي
  proficiency: Number,
  cloudinaryId: String, // لحذف الصورة عند تحديثها أو حذفها
});

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

// التأكد من الاتصال بـ MongoDB
if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("✅ Connected to MongoDB"))
    .catch((err) => {
      console.error("❌ Failed to connect to MongoDB", err);
      throw err;
    });
}

// تعطيل BodyParser لاستخدام Multer
export const config = {
  api: {
    bodyParser: false,
  },
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
      const skills = await Skill.find();
      res.status(200).json(skills);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { name, proficiency } = req.body;

      if (!name || isNaN(proficiency)) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      try {
        const image = req.file; // Multer يقوم بتخزين الصورة مؤقتًا

        // رفع الصورة إلى Cloudinary مباشرة
        const uploadedImage = await cloudinary.uploader.upload(image.path, {
          folder: "skills",
        });

        const newSkill = new Skill({
          name,
          imageUrl: uploadedImage.secure_url, // رابط Cloudinary الفعلي
          cloudinaryId: uploadedImage.public_id, // معرف الصورة في Cloudinary
          proficiency: parseInt(proficiency, 10),
        });

        await newSkill.save();
        res.status(201).json(newSkill);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
  } else if (method === "PUT") {
    upload.single("image")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { id, name, proficiency } = req.body;

      if (!id || !name || isNaN(proficiency)) {
        return res.status(400).json({ message: "Invalid update data" });
      }

      try {
        const skill = await Skill.findById(id);
        if (!skill) {
          return res.status(404).json({ message: "Skill not found" });
        }

        // إذا كانت هناك صورة جديدة، احذف القديمة وارفع الجديدة
        let imageUrl = skill.imageUrl;
        let cloudinaryId = skill.cloudinaryId;

        if (req.file) {
          if (cloudinaryId) {
            await cloudinary.uploader.destroy(cloudinaryId);
          }

          const uploadedImage = await cloudinary.uploader.upload(
            req.file.path,
            {
              folder: "skills",
            }
          );

          imageUrl = uploadedImage.secure_url;
          cloudinaryId = uploadedImage.public_id;
        }

        // تحديث البيانات
        skill.name = name;
        skill.proficiency = parseInt(proficiency, 10);
        skill.imageUrl = imageUrl;
        skill.cloudinaryId = cloudinaryId;

        await skill.save();
        res.status(200).json(skill);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
  } else if (method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Missing skill ID" });
    }

    try {
      const skill = await Skill.findById(id);
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }

      // حذف الصورة من Cloudinary إذا كانت موجودة
      if (skill.cloudinaryId) {
        await cloudinary.uploader.destroy(skill.cloudinaryId);
      }

      await Skill.findByIdAndDelete(id);
      res.status(200).json({ message: "Skill deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
