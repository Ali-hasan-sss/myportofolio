import axios from "axios";
import { BASE_URL } from "@/app/api";

// إنشاء instance من axios مع إعدادات مخصصة
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 ثانية
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // تعطيل credentials لتجنب مشاكل CORS
});

// إضافة interceptor للطلبات
apiClient.interceptors.request.use(
  (config) => {
    console.log("إرسال طلب إلى:", config.url);
    return config;
  },
  (error) => {
    console.error("خطأ في الطلب:", error);
    return Promise.reject(error);
  }
);

// إضافة interceptor للاستجابات
apiClient.interceptors.response.use(
  (response) => {
    console.log("استجابة من:", response.config.url, response.status);
    return response;
  },
  (error) => {
    console.error("خطأ في الاستجابة:", error);

    if (error.code === "ECONNABORTED") {
      console.error("انتهت مهلة الاتصال");
    } else if (error.response) {
      console.error(
        "خطأ في الخادم:",
        error.response.status,
        error.response.data
      );
    } else if (error.request) {
      console.error("خطأ في الاتصال:", error.request);
    }

    return Promise.reject(error);
  }
);

export default apiClient;
