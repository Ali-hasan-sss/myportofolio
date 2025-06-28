"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Mail,
  MessageSquare,
  Loader2,
  ExternalLink,
  Calendar,
  User,
  AtSign,
} from "lucide-react";
import Modal from "@/components/Modal";
import { InputField, FileField } from "@/components/FormField";
import Button from "@/components/Button";
import apiClient from "@/utils/axios";

// تعريف واجهة للرسالة
interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}

// تعريف واجهة لوسيلة التواصل الاجتماعي
interface SocialLink {
  _id: string;
  url: string;
  iconUrl: string;
  cloudinaryId?: string;
}

interface FormData {
  url: string;
}

export default function ContactManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleteMessageModalOpen, setIsDeleteMessageModalOpen] =
    useState(false);
  const [socialToDelete, setSocialToDelete] = useState<SocialLink | null>(null);
  const [messageToDelete, setMessageToDelete] = useState<Message | null>(null);

  const [formData, setFormData] = useState<FormData>({
    url: "",
  });
  const [errors, setErrors] = useState<Partial<{ url: string }>>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // جلب الرسائل
  const fetchMessages = async () => {
    try {
      const response = await apiClient.get("messag");
      setMessages(response.data);
    } catch (error: any) {
      console.error("خطأ في جلب الرسائل:", error);
      if (error.code === "ECONNREFUSED" || error.message?.includes("connect")) {
        toast.error(
          "لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم على المنفذ 3000"
        );
      } else {
        toast.error("فشل في جلب الرسائل");
      }
    }
  };

  // جلب وسائل التواصل الاجتماعي
  const fetchSocialLinks = async () => {
    try {
      const response = await apiClient.get("contact");
      setSocialLinks(response.data);
    } catch (error: any) {
      console.error("خطأ في جلب وسائل التواصل:", error);
      if (error.code === "ECONNREFUSED" || error.message?.includes("connect")) {
        toast.error(
          "لا يمكن الاتصال بالخادم. تأكد من تشغيل الخادم على المنفذ 3000"
        );
      } else {
        toast.error("فشل في جلب وسائل التواصل");
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchMessages(), fetchSocialLinks()]);
      setLoading(false);
    };
    loadData();
  }, []);

  // فتح المودال لإضافة وسيلة تواصل
  const handleAdd = () => {
    setFormData({ url: "" });
    setSelectedImage(null);
    setErrors({});
    setIsModalOpen(true);
  };

  // فتح مودال تأكيد حذف وسيلة تواصل
  const handleDeleteSocialClick = (social: SocialLink) => {
    setSocialToDelete(social);
    setIsDeleteModalOpen(true);
  };

  // فتح مودال تأكيد حذف رسالة
  const handleDeleteMessageClick = (message: Message) => {
    setMessageToDelete(message);
    setIsDeleteMessageModalOpen(true);
  };

  // حذف وسيلة تواصل
  const handleDeleteSocial = async () => {
    if (!socialToDelete) return;

    try {
      setSaving(true);
      await apiClient.delete(`contact?id=${socialToDelete._id}`);
      toast.success("تم حذف وسيلة التواصل بنجاح");
      setSocialLinks(
        socialLinks.filter((social) => social._id !== socialToDelete._id)
      );
      setIsDeleteModalOpen(false);
      setSocialToDelete(null);
    } catch (error: any) {
      console.error("خطأ في حذف وسيلة التواصل:", error);
      toast.error("فشل في حذف وسيلة التواصل");
    } finally {
      setSaving(false);
    }
  };

  // حذف رسالة
  const handleDeleteMessage = async () => {
    if (!messageToDelete) return;

    try {
      setSaving(true);
      await apiClient.delete(`messag?id=${messageToDelete._id}`);
      toast.success("تم حذف الرسالة بنجاح");
      setMessages(
        messages.filter((message) => message._id !== messageToDelete._id)
      );
      setIsDeleteMessageModalOpen(false);
      setMessageToDelete(null);
    } catch (error: any) {
      console.error("خطأ في حذف الرسالة:", error);
      toast.error("فشل في حذف الرسالة");
    } finally {
      setSaving(false);
    }
  };

  // معالجة تغيير الحقول
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // معالجة تغيير الصورة
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  // التحقق من صحة البيانات
  const validateForm = (): boolean => {
    const newErrors: Partial<{ url: string }> = {};

    if (!formData.url.trim()) {
      newErrors.url = "رابط وسيلة التواصل مطلوب";
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = "يرجى إدخال رابط صحيح";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // التحقق من صحة الرابط
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // حفظ وسيلة التواصل
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!selectedImage) {
      toast.error("يرجى اختيار أيقونة لوسيلة التواصل");
      return;
    }

    try {
      setSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("url", formData.url);
      formDataToSend.append("icon", selectedImage);

      const response = await apiClient.post("contact", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("تم إضافة وسيلة التواصل بنجاح");
      setSocialLinks([...socialLinks, response.data]);

      setIsModalOpen(false);
      setFormData({ url: "" });
      setSelectedImage(null);
    } catch (error: any) {
      console.error("خطأ في حفظ وسيلة التواصل:", error);
      toast.error("فشل في حفظ وسيلة التواصل");
    } finally {
      setSaving(false);
    }
  };

  // إغلاق المودال
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ url: "" });
    setSelectedImage(null);
    setErrors({});
  };

  // تنسيق التاريخ
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ar-SA", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            إدارة الرسائل والتواصل
          </h1>
          <p className="text-gray-400">
            إدارة الرسائل الواردة ووسائل التواصل الاجتماعي
          </p>
        </div>
        <Button onClick={handleAdd} icon={<Plus className="w-4 h-4" />}>
          إضافة وسيلة تواصل
        </Button>
      </div>

      {/* Messages Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-semibold text-white">
            الرسائل الواردة ({messages.length})
          </h2>
        </div>

        {messages.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-xl">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              لا توجد رسائل
            </h3>
            <p className="text-gray-400">لم يتم استلام أي رسائل بعد</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {messages.map((message) => (
              <div
                key={message._id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {message.name}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <AtSign className="w-3 h-3" />
                        {message.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Calendar className="w-3 h-3" />
                    {formatDate(message.createdAt)}
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4 mb-4">
                  <p className="text-gray-300 leading-relaxed">
                    {message.message}
                  </p>
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={() => handleDeleteMessageClick(message)}
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-3 h-3" />}
                  >
                    حذف الرسالة
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Social Links Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <ExternalLink className="w-5 h-5 text-green-500" />
          <h2 className="text-xl font-semibold text-white">
            وسائل التواصل الاجتماعي ({socialLinks.length})
          </h2>
        </div>

        {socialLinks.length === 0 ? (
          <div className="text-center py-8 bg-gray-800 rounded-xl">
            <ExternalLink className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              لا توجد وسائل تواصل
            </h3>
            <p className="text-gray-400 mb-4">
              ابدأ بإضافة وسائل التواصل الاجتماعي
            </p>
            <Button onClick={handleAdd} icon={<Plus className="w-4 h-4" />}>
              إضافة أول وسيلة تواصل
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {socialLinks.map((social) => (
              <div
                key={social._id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
              >
                <div className="flex items-center justify-center mb-4">
                  <img
                    src={social.iconUrl}
                    alt="Social Icon"
                    className="w-12 h-12 object-cover rounded-lg"
                  />
                </div>

                <div className="text-center mb-4">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    عرض الرابط
                  </a>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={() => handleDeleteSocialClick(social)}
                    variant="danger"
                    size="sm"
                    icon={<Trash2 className="w-3 h-3" />}
                  >
                    حذف
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Social Link Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title="إضافة وسيلة تواصل جديدة"
        size="md"
        loading={saving}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="رابط وسيلة التواصل"
            name="url"
            value={formData.url}
            onChange={handleInputChange}
            placeholder="https://example.com"
            required
            error={errors.url}
          />

          <FileField
            label="أيقونة وسيلة التواصل"
            name="icon"
            accept="image/*"
            onChange={handleImageChange}
            required
          />

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCloseModal}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button type="submit" loading={saving} disabled={saving}>
              إضافة وسيلة التواصل
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Social Link Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="تأكيد الحذف"
        size="sm"
        loading={saving}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              حذف وسيلة التواصل
            </h3>
            <p className="text-gray-300">
              هل أنت متأكد من حذف وسيلة التواصل{" "}
              <span className="font-semibold text-white">
                {socialToDelete?.url}
              </span>
              ؟
            </p>
            <p className="text-sm text-gray-400 mt-2">
              لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteSocial}
              loading={saving}
              disabled={saving}
              icon={<Trash2 className="w-4 h-4" />}
            >
              حذف وسيلة التواصل
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Message Confirmation Modal */}
      <Modal
        isOpen={isDeleteMessageModalOpen}
        onClose={() => setIsDeleteMessageModalOpen(false)}
        title="تأكيد الحذف"
        size="sm"
        loading={saving}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              حذف الرسالة
            </h3>
            <p className="text-gray-300">
              هل أنت متأكد من حذف رسالة من{" "}
              <span className="font-semibold text-white">
                {messageToDelete?.name}
              </span>
              ؟
            </p>
            <p className="text-sm text-gray-400 mt-2">
              لا يمكن التراجع عن هذا الإجراء.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setIsDeleteMessageModalOpen(false)}
              disabled={saving}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteMessage}
              loading={saving}
              disabled={saving}
              icon={<Trash2 className="w-4 h-4" />}
            >
              حذف الرسالة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
