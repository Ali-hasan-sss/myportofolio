// utils/auth.ts
import jwt from "jsonwebtoken";
import Cookies from "js-cookie";

interface AuthToken {
  username: string;
  iat: number;
  exp: number;
}

export const isAuthorized = (): boolean => {
  if (typeof window === "undefined") return false;

  const token = Cookies.get("authToken") || localStorage.getItem("authToken");
  if (!token) return false;

  try {
    // فحص صحة التوكن محلياً فقط
    const decoded = jwt.decode(token) as AuthToken;
    if (!decoded) return false;

    // فحص انتهاء صلاحية التوكن
    const currentTime = Date.now() / 1000;
    if (decoded.exp && decoded.exp < currentTime) {
      Cookies.remove("authToken");
      localStorage.removeItem("authToken");
      return false;
    }

    return true;
  } catch (_error) {
    Cookies.remove("authToken");
    localStorage.removeItem("authToken");
    return false;
  }
};

export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return Cookies.get("authToken") || localStorage.getItem("authToken");
};

export const logout = (): void => {
  if (typeof window === "undefined") return;
  Cookies.remove("authToken");
  localStorage.removeItem("authToken");
  window.location.href = "/dashboard/login";
};

export const requireAuth = (): boolean => {
  if (!isAuthorized()) {
    if (typeof window !== "undefined") {
      window.location.href = "/dashboard/login";
    }
    return false;
  }
  return true;
};
