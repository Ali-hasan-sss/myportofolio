// middleware.ts

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const pathname = request.nextUrl.pathname;

  console.log(
    "Middleware - Path:",
    pathname,
    "Token:",
    token ? "exists" : "none"
  );

  // إذا كان هناك توكن وحاول يدخل صفحة تسجيل الدخول → إعادة توجيه للداشبورد
  if (token && pathname === "/dashboard/login") {
    console.log("Middleware - Redirecting to dashboard (user has token)");
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // إذا لم يكن هناك توكن والمستخدم يحاول الدخول للوحة التحكم (باستثناء صفحة تسجيل الدخول)
  if (
    !token &&
    pathname.startsWith("/dashboard") &&
    pathname !== "/dashboard/login"
  ) {
    console.log("Middleware - Redirecting to login (no token)");
    return NextResponse.redirect(new URL("/dashboard/login", request.url));
  }

  console.log("Middleware - Continuing request");
  return NextResponse.next(); // أكمل الطلب عادي
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
