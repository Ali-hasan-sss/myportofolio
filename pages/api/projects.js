import mongoose from "mongoose";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../../config/cloudinary"; // تأكد من ضبط Cloudinary بشكل صحيح

// ✅ ضبط التخزين في Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "portfolio_projects", // المجلد في Cloudinary
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

const ProjectsSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  imagePath: String, // رابط الصورة في Cloudinary
  cloudinaryId: String, // معرف الصورة في Cloudinary لحذفها لاحقًا
  projectUrl: { type: String, required: true, trim: true },
  codeUrl: { type: String, required: true, trim: true },
  link: { type: String, trim: true }, // حقل قديم للتوافق مع البيانات الموجودة
});

const Project =
  mongoose.models.Project || mongoose.model("Project", ProjectsSchema);

mongoose
  .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,DELETE,PATCH,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  const { method } = req;

  // ✅ جلب جميع المشاريع
  if (method === "GET") {
    try {
      const projects = await Project.find();
      res.status(200).json(projects);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // ✅ إضافة مشروع جديد مع صورة
  else if (method === "POST") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: err.message || "Invalid file upload" });
      }

      const { name, projectUrl, codeUrl } = req.body;
      if (!name?.trim() || !projectUrl?.trim() || !codeUrl?.trim()) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      try {
        const newProject = new Project({
          name: name.trim(),
          imagePath: req.file ? req.file.path : "", // رابط الصورة في Cloudinary
          cloudinaryId: req.file ? req.file.filename : "", // معرف الصورة في Cloudinary
          projectUrl: projectUrl.trim(),
          codeUrl: codeUrl.trim(),
          link: projectUrl.trim(), // تعيين الحقل القديم للتوافق
        });

        await newProject.save();
        res.status(201).json(newProject);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
  }

  // ✅ تعديل مشروع مع تحديث الصورة (مع حذف الصورة القديمة من Cloudinary)
  else if (method === "PUT") {
    upload.single("image")(req, res, async (err) => {
      if (err) {
        return res
          .status(400)
          .json({ message: err.message || "Invalid file upload" });
      }

      const { id, name, projectUrl, codeUrl } = req.body;
      if (!id || !name?.trim() || !projectUrl?.trim() || !codeUrl?.trim()) {
        return res.status(400).json({ message: "Invalid update data" });
      }

      try {
        const project = await Project.findById(id);
        if (!project) {
          return res.status(404).json({ message: "Project not found" });
        }

        // ✅ حذف الصورة القديمة من Cloudinary إذا كانت موجودة
        if (req.file && project.cloudinaryId) {
          await cloudinary.uploader.destroy(project.cloudinaryId);
        }

        project.name = name.trim();
        project.projectUrl = projectUrl.trim();
        project.codeUrl = codeUrl.trim();
        project.link = projectUrl.trim(); // تعيين الحقل القديم للتوافق
        if (req.file) {
          project.imagePath = req.file.path;
          project.cloudinaryId = req.file.filename;
        }

        await project.save();
        res.status(200).json(project);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    });
  }

  // ✅ حذف مشروع مع حذف صورته من Cloudinary
  else if (method === "DELETE") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ message: "Missing project ID" });
    }

    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      // ✅ حذف الصورة من Cloudinary إذا كانت موجودة
      if (project.cloudinaryId) {
        await cloudinary.uploader.destroy(project.cloudinaryId);
      }

      await Project.findByIdAndDelete(id);
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // ❌ رفض أي طريقة غير مدعومة
  else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
