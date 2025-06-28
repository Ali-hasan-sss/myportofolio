import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import { BASE_URL } from "@/app/api";

interface User {
  id: string;
  username: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // فحص حالة المصادقة عند تحميل الصفحة
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      // التحقق من صحة التوكن مع الخادم
      try {
        const response = await axios.get(`${BASE_URL}auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.success) {
          const user = JSON.parse(userStr);
          setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          // التوكن غير صالح
          logout();
        }
      } catch (error) {
        // خطأ في الاتصال أو توكن غير صالح
        logout();
      }
    } catch (error) {
      console.error("Error checking auth status:", error);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    try {
      const response = await axios.post(`${BASE_URL}auth`, {
        Username: username,
        Password: password,
      });

      if (response.data.success) {
        const { token, user } = response.data;

        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });

        toast.success(`مرحباً ${user.username}! تم تسجيل الدخول بنجاح`);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "فشل في تسجيل الدخول";
      return { success: false, message };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");

    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });

    toast.success("تم تسجيل الخروج بنجاح");
    router.push("/dashboard/login");
  }, [router]);

  const requireAuth = useCallback(
    (redirectTo = "/dashboard/login") => {
      if (!authState.isAuthenticated && !authState.isLoading) {
        router.push(redirectTo);
        return false;
      }
      return true;
    },
    [authState.isAuthenticated, authState.isLoading, router]
  );

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("authToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, []);

  return {
    ...authState,
    login,
    logout,
    requireAuth,
    getAuthHeaders,
    checkAuthStatus,
  };
}
