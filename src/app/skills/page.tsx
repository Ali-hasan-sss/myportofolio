"use client";

import React, { useEffect } from "react";
import useSkillsStore from "@/store/useSkillsStore";
interface skill {
  _id: string;
  imageUrl: string;
  name: string;
  proficiency: number;
}
export default function Skills() {
  const { skills, fetchSkills } = useSkillsStore();

  useEffect(() => {
    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen mx-auto px-4">
      <h1 className="text-3xl text-white font-bold mb-6 text-center">
        My <span className="text-red-500"> Skills</span>
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {skills.map((skill: skill) => (
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
        ))}
      </div>
    </div>
  );
}
