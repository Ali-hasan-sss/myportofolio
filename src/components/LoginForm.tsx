"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { Eye, EyeOff, Lock, User, Loader2, AlertCircle } from "lucide-react";
import { BASE_URL } from "@/app/api";
import Cookies from "js-cookie";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
}

export default function LoginForm({
  onSuccess,
  redirectTo = "/dashboard",
}: LoginFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    Username: "",
    Password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [initLoading, setInitLoading] = useState(false);

  // فحص إذا كان المستخدم مسجل دخول بالفعل
  useEffect(() => {
    const checkExistingAuth = async () => {
      console.log("بدء فحص التوكن...");
      try {
        const token = Cookies.get("authToken");
        console.log("التوكن الموجود:", token ? "موجود" : "غير موجود");

        if (token) {
          // التحقق من صحة التوكن مع الخادم
          try {
            console.log("التحقق من صحة التوكن مع الخادم...");
            const response = await axios.get(`${BASE_URL}auth/verify`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            console.log("استجابة التحقق:", response.data);

            if (response.data.success) {
              // التوكن صالح، إعادة التوجيه
              console.log("التوكن صالح، إعادة التوجيه إلى:", redirectTo);
              router.push(redirectTo);
              return;
            }
          } catch (error) {
            console.log("خطأ في التحقق من التوكن:", error);
            // التوكن غير صالح، حذفه
            Cookies.remove("authToken");
            localStorage.removeItem("authToken");
            localStorage.removeItem("user");
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
      } finally {
        console.log("إنهاء فحص التوكن، إظهار النموذج");
        setInitialLoading(false);
      }
    };

    checkExistingAuth();
  }, [router, redirectTo]);

  // دالة إنشاء المدير
  const handleInitAdmin = async () => {
    setInitLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}auth/init`);
      if (response.data.success) {
        toast.success("تم إنشاء المدير بنجاح!");
        toast.info(
          `اسم المستخدم: ${response.data.credentials.username} | كلمة المرور: ${response.data.credentials.password}`
        );
      } else {
        toast.error(response.data.message);
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error("حدث خطأ في إنشاء المدير");
      }
    } finally {
      setInitLoading(false);
    }
  };

  // إظهار spinner أثناء الفحص الأولي
  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">جاري التحقق من حالة تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // مسح الخطأ عند الكتابة
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLocked) {
      toast.error("تم قفل الحساب مؤقتاً. حاول مرة أخرى لاحقاً");
      return;
    }

    if (!formData.Username || !formData.Password) {
      setError("يرجى ملء جميع الحقول");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("محاولة تسجيل الدخول...", { username: formData.Username });

      const response = await axios.post(`${BASE_URL}auth`, formData, {
        timeout: 10000, // 10 ثواني timeout
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("استجابة الخادم:", response.data);

      if (response.data.success) {
        const { token, user } = response.data;

        // حفظ التوكن في الكوكيز (يوم واحد)
        Cookies.set("authToken", token, { expires: 1 });
        // حفظ التوكن في localStorage (اختياري للواجهة الأمامية)
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));

        // إعادة تعيين المحاولات
        setAttempts(0);

        toast.success(`مرحباً ${user.username}! تم تسجيل الدخول بنجاح`);

        // استدعاء callback إذا وجد
        onSuccess?.();

        // الانتقال إلى الصفحة المطلوبة
        router.push(redirectTo);
      } else {
        throw new Error(response.data.message || "فشل في تسجيل الدخول");
      }
    } catch (err: unknown) {
      console.error("خطأ في تسجيل الدخول:", err);

      let errorMessage = "حدث خطأ غير متوقع";

      if (err instanceof AxiosError) {
        if (err.response) {
          // خطأ من الخادم
          errorMessage = err.response.data?.message || "بيانات غير صحيحة";
          console.log("خطأ الخادم:", err.response.status, err.response.data);
        } else if (err.request) {
          // خطأ في الاتصال
          errorMessage = "فشل في الاتصال بالخادم. تحقق من اتصالك بالإنترنت";
          console.log("خطأ الاتصال:", err.request);
        } else {
          // خطأ آخر
          errorMessage = "حدث خطأ في إعداد الطلب";
          console.log("خطأ في الطلب:", err.message);
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      setError(errorMessage);

      // زيادة عدد المحاولات
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);

      // قفل الحساب بعد 5 محاولات فاشلة
      if (newAttempts >= 5) {
        setIsLocked(true);
        toast.error("تم قفل الحساب مؤقتاً بسبب المحاولات المتكررة");

        // إعادة فتح الحساب بعد 15 دقيقة
        setTimeout(() => {
          setIsLocked(false);
          setAttempts(0);
          toast.info("تم إعادة فتح الحساب. يمكنك المحاولة مرة أخرى");
        }, 15 * 60 * 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleSubmit(e as any);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">تسجيل الدخول</h1>
          <p className="text-gray-400">أدخل بياناتك للوصول إلى لوحة التحكم</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-lg shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username Input */}
            <div>
              <label
                htmlFor="Username"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                اسم المستخدم
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="Username"
                  name="Username"
                  value={formData.Username}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="أدخل اسم المستخدم"
                  required
                  disabled={loading || isLocked}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                كلمة المرور
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="Password"
                  name="Password"
                  value={formData.Password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-12 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="أدخل كلمة المرور"
                  required
                  disabled={loading || isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  disabled={loading || isLocked}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Attempts Warning */}
            {attempts > 0 && attempts < 5 && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-400 text-sm">
                  محاولات فاشلة: {attempts}/5 - سيتم قفل الحساب بعد 5 محاولات
                </p>
              </div>
            )}

            {/* Account Locked */}
            {isLocked && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">
                  تم قفل الحساب مؤقتاً. حاول مرة أخرى بعد 15 دقيقة
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || isLocked}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>جاري التحقق...</span>
                </>
              ) : (
                <span>تسجيل الدخول</span>
              )}
            </button>

            {/* Init Admin Button */}
            <div className="pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={handleInitAdmin}
                disabled={initLoading}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
              >
                {initLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    <span>جاري إنشاء المدير...</span>
                  </>
                ) : (
                  <span>إنشاء المدير الأول</span>
                )}
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">
                اضغط هنا لإنشاء المدير الأول إذا لم يكن موجود
              </p>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            © 2024 علي حسن. جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </div>
  );
}
