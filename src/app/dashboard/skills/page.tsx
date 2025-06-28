"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Edit, Trash2, Code, Star, Loader2 } from "lucide-react";
import Modal from "@/components/Modal";
import { InputField, FileField } from "@/components/FormField";
import Button from "@/components/Button";
import apiClient from "@/utils/axios";

// تعريف واجهة للمهارة
interface Skill {
  _id: string;
  name: string;
  proficiency: number;
  imageUrl?: string;
  cloudinaryId?: string;
}

interface FormData {
  name: string;
  proficiency: number;
}

export default function SkillsManager() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    proficiency: 0,
  });
  const [errors, setErrors] = useState<
    Partial<{ name: string; proficiency: string }>
  >({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // جلب المهارات
  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("skills");
      setSkills(response.data);
    } catch (error: any) {
      console.error("خطأ في جلب المهارات:", error);
      toast.error("فشل في جلب المهارات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // فتح المودال للإضافة
  const handleAdd = () => {
    setEditingSkill(null);
    setFormData({ name: "", proficiency: 0 });
    setSelectedImage(null);
    setErrors({});
    setIsModalOpen(true);
  };

  // فتح المودال للتعديل
  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      proficiency: skill.proficiency,
    });
    setSelectedImage(null);
    setErrors({});
    setIsModalOpen(true);
  };

  // فتح مودال تأكيد الحذف
  const handleDeleteClick = (skill: Skill) => {
    setSkillToDelete(skill);
    setIsDeleteModalOpen(true);
  };

  // حذف المهارة
  const handleDelete = async () => {
    if (!skillToDelete) return;

    try {
      setSaving(true);
      await apiClient.delete(`skills?id=${skillToDelete._id}`);
      toast.success("تم حذف المهارة بنجاح");
      setSkills(skills.filter((skill) => skill._id !== skillToDelete._id));
      setIsDeleteModalOpen(false);
      setSkillToDelete(null);
    } catch (error: any) {
      console.error("خطأ في حذف المهارة:", error);
      toast.error("فشل في حذف المهارة");
    } finally {
      setSaving(false);
    }
  };

  // معالجة تغيير الحقول
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "proficiency") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

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
    const newErrors: Partial<{ name: string; proficiency: string }> = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم المهارة مطلوب";
    }

    if (formData.proficiency < 0 || formData.proficiency > 100) {
      newErrors.proficiency = "نسبة الإتقان يجب أن تكون بين 0 و 100";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // حفظ المهارة
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("proficiency", formData.proficiency.toString());

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      if (editingSkill) {
        // تعديل مهارة موجودة
        formDataToSend.append("id", editingSkill._id);
        const response = await apiClient.put("skills", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم تحديث المهارة بنجاح");
        setSkills(
          skills.map((skill) =>
            skill._id === editingSkill._id ? response.data : skill
          )
        );
      } else {
        // إضافة مهارة جديدة
        const response = await apiClient.post("skills", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم إضافة المهارة بنجاح");
        setSkills([...skills, response.data]);
      }

      setIsModalOpen(false);
      setEditingSkill(null);
      setFormData({ name: "", proficiency: 0 });
      setSelectedImage(null);
    } catch (error: any) {
      console.error("خطأ في حفظ المهارة:", error);
      toast.error("فشل في حفظ المهارة");
    } finally {
      setSaving(false);
    }
  };

  // إغلاق المودال
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSkill(null);
    setFormData({ name: "", proficiency: 0 });
    setSelectedImage(null);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">جاري تحميل المهارات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">إدارة المهارات</h1>
          <p className="text-gray-400">إضافة وتعديل وحذف المهارات التقنية</p>
        </div>
        <Button onClick={handleAdd} icon={<Plus className="w-4 h-4" />}>
          إضافة مهارة جديدة
        </Button>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {skills.map((skill) => (
          <div
            key={skill._id}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
          >
            {/* Skill Image */}
            <div className="flex justify-center mb-4">
              {skill.imageUrl ? (
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Code className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Skill Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {skill.name}
              </h3>

              {/* Proficiency Bar */}
              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>

              <div className="flex items-center justify-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-300">
                  {skill.proficiency}%
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(skill)}
                variant="secondary"
                size="sm"
                icon={<Edit className="w-3 h-3" />}
                className="flex-1"
              >
                تعديل
              </Button>
              <Button
                onClick={() => handleDeleteClick(skill)}
                variant="danger"
                size="sm"
                icon={<Trash2 className="w-3 h-3" />}
                className="flex-1"
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {skills.length === 0 && (
        <div className="text-center py-12">
          <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            لا توجد مهارات
          </h3>
          <p className="text-gray-400 mb-4">
            ابدأ بإضافة مهاراتك التقنية لعرضها في ملفك الشخصي
          </p>
          <Button onClick={handleAdd} icon={<Plus className="w-4 h-4" />}>
            إضافة أول مهارة
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingSkill ? "تعديل المهارة" : "إضافة مهارة جديدة"}
        size="md"
        loading={saving}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="اسم المهارة"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="مثال: React.js"
            required
            error={errors.name}
          />

          {/* Proficiency Slider */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              نسبة الإتقان: {formData.proficiency}%
            </label>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="100"
                value={formData.proficiency}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    proficiency: parseInt(e.target.value),
                  }));
                  if (errors.proficiency) {
                    setErrors((prev) => ({ ...prev, proficiency: undefined }));
                  }
                }}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                style={{
                  background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${formData.proficiency}%, #374151 ${formData.proficiency}%, #374151 100%)`,
                }}
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
            {errors.proficiency && (
              <p className="text-sm text-red-500">{errors.proficiency}</p>
            )}
          </div>

          <FileField
            label="صورة المهارة"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
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
              {editingSkill ? "تحديث المهارة" : "إضافة المهارة"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
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
              حذف المهارة
            </h3>
            <p className="text-gray-300">
              هل أنت متأكد من حذف مهارة{" "}
              <span className="font-semibold text-white">
                {skillToDelete?.name}
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
              onClick={handleDelete}
              loading={saving}
              disabled={saving}
              icon={<Trash2 className="w-4 h-4" />}
            >
              حذف المهارة
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
