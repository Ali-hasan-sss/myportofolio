import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "توكن المصادقة مطلوب",
      });
    }

    // التحقق من صحة التوكن
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    res.status(200).json({
      success: true,
      user: {
        id: decoded.userId,
        username: decoded.username,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "انتهت صلاحية التوكن",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "توكن غير صالح",
      });
    }

    res.status(500).json({
      success: false,
      message: "حدث خطأ في الخادم",
    });
  }
}
