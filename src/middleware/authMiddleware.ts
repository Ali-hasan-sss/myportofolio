import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    username: string;
  };
}

export function authMiddleware(handler: Function) {
  return async (req: AuthenticatedRequest, res: NextResponse) => {
    try {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");

      if (!token) {
        return NextResponse.json(
          { success: false, message: "توكن المصادقة مطلوب" },
          { status: 401 }
        );
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as any;

      // إضافة معلومات المستخدم للطلب
      req.user = {
        userId: decoded.userId,
        username: decoded.username,
      };

      return handler(req, res);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { success: false, message: "توكن غير صالح" },
        { status: 401 }
      );
    }
  };
}

export function optionalAuthMiddleware(handler: Function) {
  return async (req: AuthenticatedRequest, res: NextResponse) => {
    try {
      const token = req.headers.get("authorization")?.replace("Bearer ", "");

      if (token) {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || "your-secret-key"
        ) as any;
        req.user = {
          userId: decoded.userId,
          username: decoded.username,
        };
      }

      return handler(req, res);
    } catch (error) {
      // تجاهل أخطاء المصادقة في middleware الاختياري
      return handler(req, res);
    }
  };
}
