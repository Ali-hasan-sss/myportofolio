"use client";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Image,
  Loader2,
  Code,
} from "lucide-react";
import Modal from "@/components/Modal";
import { InputField, FileField } from "@/components/FormField";
import Button from "@/components/Button";
import apiClient from "@/utils/axios";

// تعريف واجهة للمشروع
interface Project {
  _id: string;
  name: string;
  projectUrl?: string;
  codeUrl?: string;
  imagePath?: string;
  cloudinaryId?: string;
}

interface FormData {
  name: string;
  projectUrl: string;
  codeUrl: string;
}

export default function MyWorksManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    projectUrl: "",
    codeUrl: "",
  });
  const [errors, setErrors] = useState<
    Partial<{ name: string; projectUrl: string; codeUrl: string }>
  >({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // جلب المشاريع
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("projects");
      setProjects(response.data);
    } catch (error: any) {
      console.error("خطأ في جلب المشاريع:", error);
      toast.error("فشل في جلب المشاريع");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // فتح المودال للإضافة
  const handleAdd = () => {
    setEditingProject(null);
    setFormData({ name: "", projectUrl: "", codeUrl: "" });
    setSelectedImage(null);
    setErrors({});
    setIsModalOpen(true);
  };

  // فتح المودال للتعديل
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      projectUrl: project.projectUrl || "",
      codeUrl: project.codeUrl || "",
    });
    setSelectedImage(null);
    setErrors({});
    setIsModalOpen(true);
  };

  // فتح مودال تأكيد الحذف
  const handleDeleteClick = (project: Project) => {
    setProjectToDelete(project);
    setIsDeleteModalOpen(true);
  };

  // حذف المشروع
  const handleDelete = async () => {
    if (!projectToDelete) return;

    try {
      setSaving(true);
      await apiClient.delete(`projects?id=${projectToDelete._id}`);
      toast.success("تم حذف المشروع بنجاح");
      setProjects(
        projects.filter((project) => project._id !== projectToDelete._id)
      );
      setIsDeleteModalOpen(false);
      setProjectToDelete(null);
    } catch (error: any) {
      console.error("خطأ في حذف المشروع:", error);
      toast.error("فشل في حذف المشروع");
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
    const newErrors: Partial<{
      name: string;
      projectUrl: string;
      codeUrl: string;
    }> = {};

    if (!formData.name.trim()) {
      newErrors.name = "اسم المشروع مطلوب";
    }

    if (!formData.projectUrl.trim()) {
      newErrors.projectUrl = "رابط المشروع مطلوب";
    } else if (!isValidUrl(formData.projectUrl)) {
      newErrors.projectUrl = "يرجى إدخال رابط صحيح";
    }

    if (!formData.codeUrl.trim()) {
      newErrors.codeUrl = "رابط الكود مطلوب";
    } else if (!isValidUrl(formData.codeUrl)) {
      newErrors.codeUrl = "يرجى إدخال رابط صحيح";
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

  // حفظ المشروع
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("projectUrl", formData.projectUrl);
      formDataToSend.append("codeUrl", formData.codeUrl);

      if (selectedImage) {
        formDataToSend.append("image", selectedImage);
      }

      if (editingProject) {
        // تعديل مشروع موجود
        formDataToSend.append("id", editingProject._id);
        const response = await apiClient.put("projects", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم تحديث المشروع بنجاح");
        setProjects(
          projects.map((project) =>
            project._id === editingProject._id ? response.data : project
          )
        );
      } else {
        // إضافة مشروع جديد
        const response = await apiClient.post("projects", formDataToSend, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("تم إضافة المشروع بنجاح");
        setProjects([...projects, response.data]);
      }

      setIsModalOpen(false);
      setEditingProject(null);
      setFormData({ name: "", projectUrl: "", codeUrl: "" });
      setSelectedImage(null);
    } catch (error: any) {
      console.error("خطأ في حفظ المشروع:", error);
      toast.error("فشل في حفظ المشروع");
    } finally {
      setSaving(false);
    }
  };

  // إغلاق المودال
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    setFormData({ name: "", projectUrl: "", codeUrl: "" });
    setSelectedImage(null);
    setErrors({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-300">جاري تحميل المشاريع...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">إدارة معرض الأعمال</h1>
          <p className="text-gray-400">
            إضافة وتعديل وحذف المشاريع في معرض الأعمال
          </p>
        </div>
        <Button onClick={handleAdd} icon={<Plus className="w-4 h-4" />}>
          إضافة مشروع جديد
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {projects.map((project) => (
          <div
            key={project._id}
            className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200"
          >
            {/* Project Image */}
            <div className="flex justify-center mb-4">
              {project.imagePath ? (
                <img
                  src={project.imagePath}
                  alt={project.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gray-700 rounded-lg flex items-center justify-center">
                  <Image className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </div>

            {/* Project Info */}
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold text-white mb-2">
                {project.name}
              </h3>

              <div className="space-y-2">
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    عرض المشروع
                  </a>
                )}

                {project.codeUrl && (
                  <a
                    href={project.codeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-green-400 hover:text-green-300 text-sm transition-colors"
                  >
                    <Code className="w-3 h-3" />
                    عرض الكود
                  </a>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                onClick={() => handleEdit(project)}
                variant="secondary"
                size="sm"
                icon={<Edit className="w-3 h-3" />}
                className="flex-1"
              >
                تعديل
              </Button>
              <Button
                onClick={() => handleDeleteClick(project)}
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
      {projects.length === 0 && (
        <div className="text-center py-12">
          <Image className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">
            لا توجد مشاريع
          </h3>
          <p className="text-gray-400 mb-4">
            ابدأ بإضافة مشاريعك لعرضها في معرض الأعمال
          </p>
          <Button onClick={handleAdd} icon={<Plus className="w-4 h-4" />}>
            إضافة أول مشروع
          </Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingProject ? "تعديل المشروع" : "إضافة مشروع جديد"}
        size="md"
        loading={saving}
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <InputField
            label="اسم المشروع"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="مثال: موقع تجارة إلكترونية"
            required
            error={errors.name}
          />

          <InputField
            label="رابط المشروع (Live Demo)"
            name="projectUrl"
            value={formData.projectUrl}
            onChange={handleInputChange}
            placeholder="https://myproject.com"
            required
            error={errors.projectUrl}
          />

          <InputField
            label="رابط الكود (GitHub)"
            name="codeUrl"
            value={formData.codeUrl}
            onChange={handleInputChange}
            placeholder="https://github.com/username/project"
            required
            error={errors.codeUrl}
          />

          <FileField
            label="صورة المشروع"
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
              {editingProject ? "تحديث المشروع" : "إضافة المشروع"}
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
              حذف المشروع
            </h3>
            <p className="text-gray-300">
              هل أنت متأكد من حذف مشروع{" "}
              <span className="font-semibold text-white">
                {projectToDelete?.name}
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
              حذف المشروع
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
