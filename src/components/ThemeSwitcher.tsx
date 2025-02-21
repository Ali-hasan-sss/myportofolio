"use client";

import { useEffect, useState } from "react";
import { useTheme } from "../../context/them_contest";
import { motion } from "framer-motion";
interface ThemeSwitcherProops {
  className?: string;
}
export default function ThemeSwitcher({ className }: ThemeSwitcherProops) {
  const { color, setColor } = useTheme();
  const [bgColor, setBgColor] = useState(color);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // تطبيق تغيير اللون تدريجيًا
    const timeout = setTimeout(() => setBgColor(color), 200);
    return () => clearTimeout(timeout);
  }, [color]);

  // قائمة الألوان
  const colors = [
    "#000000",
    "#67ebf0",
    "#21fd3a",
    "#10b981",
    "#facc15",
    "#2556a5",
  ];

  // التبديل بين إظهار وإخفاء القائمة
  const toggleDropdown = () => setIsOpen(!isOpen);

  // اختيار اللون وتحديث الخلفية
  const handleColorSelect = (color: string) => {
    setColor(color);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      {/* أنيميشن لتغيير لون الخلفية */}
      <motion.div
        animate={{ backgroundColor: bgColor }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 -z-10"
      />

      <div className="relative inline-flex items-center p-4">
        {/* زر تغيير اللون */}
        <button
          onClick={toggleDropdown}
          className=" text-white rounded-full   w-[20px] h-[20px] bg-red-400"
        ></button>

        {/* القائمة المنسدلة بجانب الزر مع أنيميشن */}
        <motion.div
          initial={{ x: -10, opacity: 0, scale: 0.9 }}
          animate={
            isOpen
              ? { x: 0, opacity: 1, scale: 1 }
              : { x: -10, opacity: 0, scale: 0.9 }
          }
          transition={{ duration: 0.5, ease: "easeOut" }}
          className={`absolute left-full ml-3 flex gap-2 p-2 ${
            isOpen ? "flex" : "hidden"
          }`}
        >
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => handleColorSelect(color)}
              className="w-[20px] h-[20px] rounded-full border border-red-500 hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}
