import mongoose from "mongoose";
import multer from "multer";

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "public/images"); // حفظ الصور في مجلد 'public/images'
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname); // إنشاء اسم فريد للصورة
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // تحديد حجم الملف إلى 5MB كحد أقصى
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed!"), false); // رفض الملفات غير الصور
    }
    cb(null, true); // قبول الملفات الصور
  },
}).fields([{ name: "image", maxCount: 1 }]);

const SkillSchema = new mongoose.Schema({
  name: String,
  imagePath: String,
  proficiency: Number,
});

const Skill = mongoose.models.Skill || mongoose.model("Skill", SkillSchema);

if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      throw err;
    });
}

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const { method } = req;

  if (method === "GET") {
    try {
      const skills = await Skill.find();
      res.status(200).json(skills);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (method === "POST") {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: err.message || "Invalid file upload" });
      }

      const { name, proficiency } = req.body;
      const { files } = req;

      if (!name || isNaN(proficiency)) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      try {
        const newSkill = new Skill({
          name,
          imagePath: files.image ? `/images/${files.image[0].filename}` : "",
          proficiency: parseInt(proficiency, 10),
        });

        await newSkill.save();
        res.status(201).json(newSkill);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
  } else if (method === "PUT") {
    upload(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: err.message || "Invalid file upload" });
      }

      const { id, name, proficiency } = req.body;
      const { file } = req;

      if (!id || !name || isNaN(proficiency)) {
        return res.status(400).json({ message: "Invalid update data" });
      }

      try {
        const skill = await Skill.findById(id);
        if (!skill) {
          return res.status(404).json({ message: "Skill not found" });
        }

        skill.name = name;
        skill.proficiency = parseInt(proficiency, 10);
        if (file) {
          skill.imagePath = `/images/${file.filename}`;
        }

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
