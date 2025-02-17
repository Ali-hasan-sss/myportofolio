"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import NavBar from "../../components/header/navbar";
interface skill {
  _id: string;
  imagePath: string;
  name: string;
  proficiency: number;
}
export default function Skills() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get("/api/skills");
        setSkills(response.data);
      } catch (error) {
        console.error("Error fetching skills", error);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="min-h-screen mx-auto px-4">
      <NavBar />
      <h1 className="text-3xl text-white font-bold mb-6 text-center">
        مهاراتي
      </h1>

      <div className="flex flex-wrap items-center justify-center gap-6">
        {skills.map((skill: skill) => (
          <div
            key={skill._id}
            className="bg-gray-700 w-[200px] shadow-lg rounded-lg p-6 text-center transition-transform hover:scale-105"
          >
            {/* صورة المهارة */}
            <img
              src={skill.imagePath || "/images/default.jpg"}
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
