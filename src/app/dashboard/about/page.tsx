"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  Edit,
  Download,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Loader2,
} from "lucide-react";
import { BASE_URL } from "@/app/api";
import Modal from "@/components/Modal";
import { InputField, TextareaField, FileField } from "@/components/FormField";
import Button from "@/components/Button";
import apiClient from "@/utils/axios";

interface AboutData {
  _id?: string;
  name: string;
  cvPath?: string;
  image?: string;
  description: string;
  education: string;
  adress: string;
  date_of_birth: string;
  email: string;
  phoneNo: string;
  profession: string;
}

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<AboutData>({
    name: "",
    description: "",
    education: "",
    adress: "",
    date_of_birth: "",
    email: "",
    phoneNo: "",
    profession: "",
  });
  const [errors, setErrors] = useState<Partial<AboutData>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCV, setSelectedCV] = useState<File | null>(null);

  // جلب البيانات
  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("جاري جلب البيانات من:", `${BASE_URL}about`);

      const response = await apiClient.get("about");

      console.log("استجابة الخادم:", response.data);
      const data = response.data;

      if (data && Object.keys(data).length > 0) {
        setAboutData(data);
        setFormData({
          name: data.name || "",
          description: data.description || "",
          education: data.education || "",
          adress: data.adress || "",
          date_of_birth: data.date_of_birth || "",
          email: data.email || "",
          phoneNo: data.phoneNo || "",
          profession: data.profession || "",
        });
      } else {
        console.log("لا توجد بيانات في الخادم");
        setAboutData(null);
      }
    } catch (error: unknown) {
      console.error("خطأ في جلب البيانات:", error);

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ECONNABORTED"
      ) {
        toast.error("انتهت مهلة الاتصال. تحقق من اتصالك بالإنترنت");
      } else if (error && typeof error === "object" && "response" in error) {
        // خطأ من الخادم
        toast.error(`خطأ في الخادم: ${(error as any).response.status}`);
      } else if (error && typeof error === "object" && "request" in error) {
        // خطأ في الاتصال
        toast.error("فشل في الاتصال بالخادم. تحقق من أن الخادم يعمل");
      } else {
        // خطأ آخر
        toast.error("حدث خطأ غير متوقع في جلب البيانات");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // فتح المودال للتعديل
  const handleEdit = () => {
    if (aboutData) {
      setFormData({
        name: aboutData.name || "",
        description: aboutData.description || "",
        education: aboutData.education || "",
        adress: aboutData.adress || "",
        date_of_birth: aboutData.date_of_birth || "",
        email: aboutData.email || "",
        phoneNo: aboutData.phoneNo || "",
        profession: aboutData.profession || "",
      });
    }
    setSelectedImage(null);
    setSelectedCV(null);
    setErrors({});
    setIsModalOpen(true);
  };

  // معالجة تغيير الحقول
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // مسح الخطأ عند الكتابة
    if (errors[name as keyof AboutData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // معالجة تغيير الملفات
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "image" | "cv"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "image") {
        setSelectedImage(file);
      } else {
        setSelectedCV(file);
      }
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Partial<AboutData> = {};

    if (!formData.name.trim()) {
      newErrors.name = "الاسم مطلوب";
    }

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "البريد الإلكتروني غير صحيح";
    }

    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "رقم الهاتف مطلوب";
    }

    if (!formData.profession.trim()) {
      newErrors.profession = "المهنة مطلوبة";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ البيانات
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const formDataToSend = new FormData();

      // إضافة البيانات النصية
      Object.keys(formData).forEach((key) => {
        const value = formData[key as keyof AboutData];
        if (value) {
          formDataToSend.append(key, value as string);
        }
      });

      // إضافة الملفات
      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }
      if (selectedCV) {
        formDataToSend.append("cv", selectedCV);
      }

      const response = await apiClient.post("about", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("تم حفظ البيانات بنجاح");
      setAboutData(response.data);
      setIsModalOpen(false);
      await fetchData(); // إعادة جلب البيانات للتأكد من التحديث
    } catch (error: unknown) {
      console.error("خطأ في حفظ البيانات:", error);

      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        error.code === "ECONNABORTED"
      ) {
        toast.error("انتهت مهلة الاتصال. تحقق من اتصالك بالإنترنت");
      } else if (error && typeof error === "object" && "response" in error) {
        toast.error(`خطأ في الخادم: ${(error as any).response.status}`);
      } else if (error && typeof error === "object" && "request" in error) {
        toast.error("فشل في الاتصال بالخادم. تحقق من أن الخادم يعمل");
      } else {
        toast.error("حدث خطأ غير متوقع في حفظ البيانات");
      }
    } finally {
      setSaving(false);
    }
  };

  // تحميل السيرة الذاتية
  const handleDownloadCV = () => {
    if (aboutData?.cvPath) {
      window.open(aboutData.cvPath, "_blank");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">معلومات شخصية</h1>
          <p className="text-gray-400">
            إدارة المعلومات الشخصية والبيانات الأساسية
          </p>
        </div>
        <Button onClick={handleEdit} icon={<Edit className="w-4 h-4" />}>
          تعديل البيانات
        </Button>
      </div>

      {/* Data Display */}
      {aboutData && (
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Image */}
            <div className="lg:col-span-1">
              <div className="text-center">
                {aboutData.image ? (
                  <img
                    src={aboutData.image}
                    alt="Profile"
                    className="w-48 h-48 object-cover rounded-full mx-auto mb-4 border-4 border-gray-600"
                  />
                ) : (
                  <div className="w-48 h-48 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
                <h2 className="text-xl font-semibold text-white">
                  {aboutData.name}
                </h2>
                <p className="text-gray-400">{aboutData.profession}</p>
              </div>
            </div>

            {/* Information */}
            <div className="lg:col-span-2 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm text-gray-400">البريد الإلكتروني</p>
                    <p className="text-white">{aboutData.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Phone className="w-5 h-5 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-400">رقم الهاتف</p>
                    <p className="text-white">{aboutData.phoneNo}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <div>
                    <p className="text-sm text-gray-400">العنوان</p>
                    <p className="text-white">{aboutData.adress}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm text-gray-400">تاريخ الميلاد</p>
                    <p className="text-white">{aboutData.date_of_birth}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <GraduationCap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-400">التعليم</p>
                    <p className="text-white">{aboutData.education}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700 rounded-lg">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                  <div>
                    <p className="text-sm text-gray-400">المهنة</p>
                    <p className="text-white">{aboutData.profession}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {aboutData.description && (
                <div className="p-4 bg-gray-700 rounded-lg">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    نبذة عني
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {aboutData.description}
                  </p>
                </div>
              )}

              {/* CV Download */}
              {aboutData.cvPath && (
                <div className="flex justify-center">
                  <Button
                    onClick={handleDownloadCV}
                    variant="success"
                    icon={<Download className="w-4 h-4" />}
                  >
                    تحميل السيرة الذاتية
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="تعديل المعلومات الشخصية"
        size="lg"
        loading={saving}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <InputField
                label="الاسم الكامل"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="أدخل اسمك الكامل"
                required
                error={errors.name}
              />

              <InputField
                label="المهنة"
                name="profession"
                value={formData.profession}
                onChange={handleInputChange}
                placeholder="أدخل مهنتك"
                required
                error={errors.profession}
              />

              <InputField
                label="البريد الإلكتروني"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="أدخل بريدك الإلكتروني"
                required
                error={errors.email}
              />

              <InputField
                label="رقم الهاتف"
                name="phoneNo"
                value={formData.phoneNo}
                onChange={handleInputChange}
                placeholder="أدخل رقم هاتفك"
                required
                error={errors.phoneNo}
              />
            </div>

            {/* Additional Information */}
            <div className="space-y-4">
              <InputField
                label="العنوان"
                name="adress"
                value={formData.adress}
                onChange={handleInputChange}
                placeholder="أدخل عنوانك"
                error={errors.adress}
              />

              <InputField
                label="تاريخ الميلاد"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleInputChange}
                placeholder="أدخل تاريخ ميلادك"
                error={errors.date_of_birth}
              />

              <InputField
                label="التعليم"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                placeholder="أدخل مؤهلك التعليمي"
                error={errors.education}
              />
            </div>
          </div>

          {/* Description */}
          <TextareaField
            label="نبذة عني"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="اكتب نبذة مختصرة عن نفسك وخبراتك"
            rows={4}
            error={errors.description}
          />

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FileField
              label="الصورة الشخصية"
              name="image"
              accept="image/*"
              onChange={(e) => handleFileChange(e, "image")}
            />

            <FileField
              label="السيرة الذاتية (PDF)"
              name="cv"
              accept=".pdf"
              onChange={(e) => handleFileChange(e, "cv")}
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button type="submit" loading={saving} disabled={saving}>
              حفظ التغييرات
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
