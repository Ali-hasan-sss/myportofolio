"use client";
import React, { useState, useEffect } from "react";
import useSkillsStore from "@/store/useSkillsStore";

// تعريف واجهة للمهارة
interface Skill {
  _id: string;
  name: string;
  proficiency: number;
  imageUrl?: string; // افترضنا أن الصورة تُخزن على المسار وليس على ملف
}

const SkillsManager = () => {
  const { skills, fetchSkills, addSkill, deleteSkill } = useSkillsStore();
  const [newSkill, setNewSkill] = useState<Skill>({
    _id: "",
    name: "",
    proficiency: 0,
    imageUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  // لمعالجة تغيير الملف
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files ? e.target.files[0] : null);
  };

  // عند إرسال النموذج
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", newSkill.name);
    formData.append("proficiency", newSkill.proficiency.toString());
    if (file) formData.append("image", file);

    await addSkill(formData);
    fetchSkills();

    setNewSkill({ _id: "", name: "", proficiency: 0, imageUrl: "" });
    setFile(null);
    setIsModalOpen(false);
  };

  return (
    <div className="container mx-auto p-4 w-full" style={{ direction: "rtl" }}>
      <h1 className="text-2xl font-bold mb-4">إدارة المهارات</h1>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        إضافة مهارة جديدة
      </button>

      {isModalOpen ? (
        <div className="fixed">
          <h2 className="text-xl font-bold mb-4">إضافة مهارة جديدة</h2>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="اسم المهارة"
              value={newSkill.name}
              onChange={(e) =>
                setNewSkill({ ...newSkill, name: e.target.value })
              }
              className="border px-2 py-1 w-full mb-2"
            />
            <input
              type="number"
              placeholder="نسبة الإتقان"
              value={newSkill.proficiency}
              onChange={(e) =>
                setNewSkill({
                  ...newSkill,
                  proficiency: parseFloat(e.target.value) || 0, // تحويل النص إلى رقم مع التحقق من المدخلات
                })
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
              className="bg-red-400 text-white px-4 py-2 mx-2 rounded"
              onClick={() => setIsModalOpen(false)}
            >
              الغاء
            </button>
          </form>
        </div>
      ) : (
        <table className="min-w-full bg-gray-800 rounded-xl">
          <thead>
            <tr className="">
              <th className=" text-center  px-4 py-2">الاسم</th>
              <th className=" text-center px-4 py-2">نسبة الاتقان </th>
              <th className=" text-center  px-4 py-2">الصورة</th>

              <th className=" text-center px-4 py-2">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {skills.map((Skill: Skill, index: number) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-900 " : "bg-gray-800 "
                } `}
              >
                <td className="text-center  px-4 py-2">{Skill.name}</td>
                <td className=" text-center px-4 py-2">{Skill.proficiency}</td>
                <td className="  px-4 py-2">
                  <img
                    src={Skill.imageUrl || "/images/default.jpg"}
                    alt={Skill.name}
                    className="w-12 h-12 object-cover mx-auto"
                  />
                </td>
                <td className=" text-center px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-3 mx-2 py-1 rounded mr-2"
                    onClick={() => deleteSkill(Skill._id)}
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
      )}
    </div>
  );
};

export default SkillsManager;
