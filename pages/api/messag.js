import nodemailer from "nodemailer";
import mongoose from "mongoose";

// الاتصال بقاعدة البيانات
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return; // إذا كان متصلاً، فلا داعي لإعادة الاتصال
  }
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB", err);
    throw err;
  }
};

// تعريف مخطط الرسائل
const messageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// التأكد من عدم إعادة تعريف الموديل
const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default async function handler(req, res) {
  await connectDB(); // تأكد من الاتصال بقاعدة البيانات

  if (req.method === "POST") {
    // عند إرسال رسالة عبر POST
    const { name, email, message } = req.body;

    // تحقق من الحقول
    if (!name || !email || !message) {
      return res.status(400).json({ error: "جميع الحقول مطلوبة" });
    }

    try {
      // إرسال البريد الإلكتروني باستخدام nodemailer
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `رسالة جديدة من ${name}`,
        text: `المرسل: ${name} \nالبريد: ${email} \nالرسالة: ${message}`,
      };

      await transporter.sendMail(mailOptions); // إرسال الرسالة عبر البريد الإلكتروني

      // تخزين الرسالة في قاعدة البيانات
      const newMessage = new Message({
        name,
        email,
        message,
      });

      await newMessage.save(); // حفظ الرسالة في قاعدة البيانات

      return res.status(200).json({ message: "تم إرسال الرسالة بنجاح" });
    } catch (error) {
      console.error("خطأ أثناء الإرسال:", error);
      return res.status(500).json({ error: "حدث خطأ أثناء إرسال الرسالة" });
    }
  } else if (req.method === "GET") {
    // عند استرجاع الرسائل عبر GET
    try {
      const messages = await Message.find(); // جلب جميع الرسائل
      res.status(200).json(messages);
    } catch (error) {
      console.error("خطأ أثناء جلب الرسائل:", error);
      res.status(500).json({ error: "خطأ في الخادم" });
    }
  } else if (req.method === "DELETE") {
    // عند حذف رسالة عبر DELETE
    const { id } = req.query; // استلام معرّف الرسالة من الـ query

    if (!id) {
      return res.status(400).json({ error: "معرّف الرسالة مطلوب" });
    }

    try {
      // حذف الرسالة من قاعدة البيانات
      const deletedMessage = await Message.findByIdAndDelete(id);

      if (!deletedMessage) {
        return res.status(404).json({ error: "لم يتم العثور على الرسالة" });
      }

      return res.status(200).json({ message: "تم حذف الرسالة بنجاح" });
    } catch (error) {
      console.error("خطأ أثناء حذف الرسالة:", error);
      return res.status(500).json({ error: "خطأ في الخادم أثناء الحذف" });
    }
  }
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  } else {
    res.status(405).json({ error: "طريقة غير مدعومة" });
  }
}
