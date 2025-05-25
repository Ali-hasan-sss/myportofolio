// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;

  const isAuthPage = request.nextUrl.pathname.startsWith("/login");

  // إذا لم يكن هناك توكن والمستخدم يحاول الدخول للوحة التحكم
  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // إذا كان هناك توكن وحاول يدخل صفحة تسجيل الدخول → إعادة توجيه للداشبورد
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next(); // أكمل الطلب عادي
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
