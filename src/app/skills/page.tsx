"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion"; // استيراد Framer Motion
import useSkillsStore from "@/store/useSkillsStore";
import Loader from "@/components/loader";
interface skill {
  _id: string;
  imageUrl: string;
  name: string;
  proficiency: number;
}
export default function Skills() {
  const { skills, fetchSkills, loading } = useSkillsStore();

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="mx-auto min-h-screen overflow-hidden py-5">
      <h1 className="text-3xl text-white font-bold mb-6 text-center">
        My <span className="text-red-500"> Skills</span>
      </h1>
      {loading && <Loader />}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {skills.map((skill: skill, index: number) => (
          <motion.div
            key={skill._id}
            initial={{ x: index % 2 === 0 ? -200 : 200, opacity: 0 }} // حركة من اليسار أو اليمين
            whileInView={{ x: 0, opacity: 1 }} // عند دخول العنصر إلى الشاشة
            transition={{ duration: 0.8, delay: index * 0.2 }} // تأخير بسيط لكل عنصر
            viewport={{ once: true }} // تشغيل الأنيميشن مرة واحدة فقط
          >
            <div
              key={skill._id}
              className="bg-gray-700 w-[200px] shadow-lg rounded-lg p-6 text-center transition-transform hover:scale-105"
            >
              {/* صورة المهارة */}
              <img
                src={skill.imageUrl || "/images/default.jpg"}
                alt={skill.name}
                className="w-20 h-20 object-contain mx-auto mb-4"
              />

              {/* اسم المهارة */}
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                {skill.name}
              </h2>

              {/* شريط نسبة المهارة */}
              <div className="relative w-full bg-gray-300 dark:bg-gray-600 h-4 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-green-400 dark:from-blue-700 dark:to-green-500 transition-all duration-500 ease-in-out"
                  style={{ width: `${skill.proficiency}%` }}
                />
                <span className="absolute inset-0 flex justify-center items-center text-xs font-bold text-white">
                  {skill.proficiency}%
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
