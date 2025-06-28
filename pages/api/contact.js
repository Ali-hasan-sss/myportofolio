import mongoose from "mongoose";
import upload from "../../config/multer";
import { cloudinary } from "../../config/cloudinary";

// تعريف مخطط SocialLink في Mongoose
const ContactSchema = new mongoose.Schema({
  socialLinks: [
    {
      iconUrl: String, // رابط الصورة من Cloudinary
      cloudinaryId: String, // معرف الصورة في Cloudinary لحذفها عند التحديث أو الحذف
      url: String, // رابط الحساب
    },
  ],
});

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", ContactSchema);

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

  if (method === "GET") {
    try {
      const contact = await Contact.findOne();
      res.status(200).json(contact?.socialLinks || []);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else if (method === "POST") {
    upload.single("icon")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { url } = req.body;

      if (!url || !req.file) {
        return res
          .status(400)
          .json({ message: "Both image and URL are required." });
      }

      try {
        // رفع الصورة إلى Cloudinary
        const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
          folder: "social_icons",
        });

        let contact = await Contact.findOne();

        if (!contact) {
          contact = new Contact({ socialLinks: [] });
        }

        contact.socialLinks.push({
          iconUrl: uploadedImage.secure_url,
          cloudinaryId: uploadedImage.public_id,
          url,
        });

        await contact.save();
        res.status(201).json(contact.socialLinks);
      } catch (uploadErr) {
        res.status(500).json({ message: "Error uploading image" });
        console.log(uploadErr);
      }
    });
  } else if (method === "PUT") {
    upload.single("icon")(req, res, async (err) => {
      if (err) return res.status(400).json({ message: err.message });

      const { oldUrl, newUrl } = req.body;

      if (!oldUrl || !newUrl) {
        return res
          .status(400)
          .json({ message: "Both old URL and new URL are required." });
      }

      try {
        const contact = await Contact.findOne();
        if (!contact)
          return res.status(404).json({ message: "No social links found." });

        const linkIndex = contact.socialLinks.findIndex(
          (link) => link.url === oldUrl
        );
        if (linkIndex === -1)
          return res.status(404).json({ message: "Link not found." });

        let imageUrl = contact.socialLinks[linkIndex].iconUrl;
        let cloudinaryId = contact.socialLinks[linkIndex].cloudinaryId;

        if (req.file) {
          // حذف الصورة القديمة إذا كانت موجودة
          if (cloudinaryId) {
            await cloudinary.uploader.destroy(cloudinaryId);
          }

          // رفع الصورة الجديدة
          const uploadedImage = await cloudinary.uploader.upload(
            req.file.path,
            {
              folder: "social_icons",
            }
          );

          imageUrl = uploadedImage.secure_url;
          cloudinaryId = uploadedImage.public_id;
        }

        // تحديث الرابط والصورة الجديدة
        contact.socialLinks[linkIndex].url = newUrl;
        contact.socialLinks[linkIndex].iconUrl = imageUrl;
        contact.socialLinks[linkIndex].cloudinaryId = cloudinaryId;

        await contact.save();
        res.status(200).json(contact.socialLinks);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
    });
  } else if (method === "DELETE") {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ message: "Missing social ID" });
    }

    try {
      const contact = await Contact.findOne();
      if (!contact) {
        return res.status(404).json({ message: "No social links found." });
      }

      // البحث عن الرابط في المصفوفة باستخدام ObjectId
      const linkIndex = contact.socialLinks.findIndex((link) =>
        link._id.equals(new mongoose.Types.ObjectId(id))
      );

      if (linkIndex === -1) {
        return res.status(404).json({ message: "Link not found." });
      }

      const cloudinaryId = contact.socialLinks[linkIndex].cloudinaryId;

      // حذف الصورة من Cloudinary إذا كانت موجودة
      if (cloudinaryId) {
        await cloudinary.uploader.destroy(cloudinaryId);
      }

      // إزالة الرابط من المصفوفة
      contact.socialLinks.splice(linkIndex, 1);
      await contact.save();

      res.status(200).json({
        message: "Deleted successfully",
        socialLinks: contact.socialLinks,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
    res.status(405).end(`Method ${method} Not Allowed`);
  }
}
