import mongoose from "mongoose";
import bcrypt from "bcrypt";

// Define the User model
const UserSchema = new mongoose.Schema({
  Username: String,
  Password: String, // Hashed password
});

let User;
try {
  User = mongoose.model("User");
} catch {
  User = mongoose.model("User", UserSchema);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    // Connect to MongoDB
    if (!mongoose.connection.readyState) {
      await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
      });
    }

    // Check if any user exists
    const existingUser = await User.findOne({});

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "المدير موجود بالفعل",
      });
    }

    // Create default admin user
    const username = "alihasan";
    const password = "1992";

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const newUser = new User({
      Username: username,
      Password: hashedPassword,
    });

    await newUser.save();

    res.status(200).json({
      success: true,
      message: "تم إنشاء المدير بنجاح",
      credentials: {
        username: username,
        password: password,
      },
    });
  } catch (error) {
    console.error("Error initializing admin:", error);
    res.status(500).json({
      success: false,
      message: "حدث خطأ في إنشاء المدير",
    });
  }
}
