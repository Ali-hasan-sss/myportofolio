"use client";
import React, { useState, useEffect } from "react";
import useProjectsStore from "@/store/useMyWorksStore";
import { toast } from "sonner";
interface project {
  _id: string;
  imagePath: string;
  name: string;
  link: string;
}
const MyWorksManager = () => {
  const { projects, fetchProjects, addProject, deleteProject } =
    useProjectsStore();

  const [newProject, setNewproject] = useState({ name: "", link: "" });
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
    console.log(projects);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newProject.name);
    formData.append("link", newProject.link);
    if (file) formData.append("image", file);

    try {
      await addProject(formData); // تأكد من أن دالة addProject موجودة
      fetchProjects(); // تأكد من أن دالة fetchProjects موجودة

      setNewproject({ name: "", link: "" });
      setFile(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error adding project:", error);
      toast.error("حدث خطأ أثناء إضافة المشروع.");
    }
  };

  return (
    <div
      className="container w-full mx-auto p-4 rtl"
      style={{ direction: "rtl" }}
    >
      <h1 className="text-2xl font-bold mb-4">إدارة معرض الاعمال</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        إضافة عمل جديد
      </button>
      <table className="min-w-full bg-gray-800 rounded-xl">
        <thead>
          <tr className="">
            <th className=" text-center  px-4 py-2">الاسم</th>
            <th className=" text-center px-4 py-2">الرابط </th>
            <th className=" text-center  px-4 py-2">الصورة</th>

            <th className=" text-center px-4 py-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project: project, index: number) => (
            <tr
              key={project._id}
              className={`${
                index % 2 === 0 ? "bg-gray-900 " : "bg-gray-800 "
              } `}
            >
              <td className="text-center  px-4 py-2">{project.name}</td>
              <td className=" text-center px-4 py-2">{project.link}</td>
              <td className="  px-4 py-2">
                <img
                  src={project.imagePath || "/images/default.jpg"}
                  alt={project.name}
                  className="w-12 h-12 object-cover mx-auto"
                />
              </td>
              <td className=" text-center px-4 py-2">
                <button
                  className="bg-red-500 text-white px-3 mx-2 py-1 rounded mr-2"
                  onClick={() => deleteProject(project._id)}
                >
                  حذف
                </button>
                <button className="bg-yellow-500 text-white px-3 mx-2 py-1 rounded">
                  تعديل
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="text-gray-800">.</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      {isModalOpen && (
        <div>
          <h2 className="text-xl font-bold mb-4">إضافة مشروع جديد</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="اسم المشروع"
              value={newProject.name}
              onChange={(e) =>
                setNewproject({ ...newProject, name: e.target.value })
              }
              className="border px-2 py-1 w-full mb-2"
            />
            <input
              type="text"
              placeholder="رابط المشروع"
              value={newProject.link}
              onChange={(e) =>
                setNewproject({ ...newProject, link: e.target.value })
              }
              className="border px-2 py-1 w-full mb-2"
            />
            <input type="file" onChange={handleFileChange} className="mb-2" />
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              إضافة
            </button>
            <button
              className="bg-red-400 text-white px-4 py-2  mx-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              الغاء
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MyWorksManager;
