import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// Define the User model
const UserSchema = new mongoose.Schema({
  Username: String,
  Password: String,
});

let User;
try {
  User = mongoose.model("User");
} catch (err) {
  User = mongoose.model("User", UserSchema);
  console.log(err);
}

if (!mongoose.connection.readyState) {
  mongoose
    .connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => {
      console.error("Failed to connect to MongoDB", err);
      throw err;
    });
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { Username, Password } = req.body;

    if (!Username || !Password) {
      return res.status(400).json({
        success: false,
        message: "اسم المستخدم وكلمة المرور مطلوبان",
      });
    }

    try {
      // البحث عن المستخدم
      const user = await User.findOne({ Username });

      if (!user) {
        return res.status(401).json({
          success: false,
          message: "بيانات غير صحيحة",
        });
      }

      // التحقق من كلمة المرور
      const isPasswordValid = await bcrypt.compare(Password, user.Password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: "بيانات غير صحيحة",
        });
      }

      // إنشاء JWT token
      const token = jwt.sign(
        {
          userId: user._id,
          username: user.Username,
        },
        process.env.JWT_SECRET || "your-secret-key",
        { expiresIn: "24h" }
      );

      // تسجيل محاولة تسجيل الدخول الناجحة
      console.log(`User ${user.Username} logged in successfully`);

      res.status(200).json({
        success: true,
        token,
        user: {
          id: user._id,
          username: user.Username,
        },
      });
    } catch (err) {
      console.error("Login error:", err);
      res.status(500).json({
        success: false,
        message: "حدث خطأ في الخادم",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
