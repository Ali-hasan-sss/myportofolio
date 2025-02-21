"use client";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "../ThemeSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";

export default function NavBar() {
  const pathName = usePathname();
  const [IsOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Skills", link: "/skills" },
    { label: "Projects", link: "/my-works" },
    { label: "Contact", link: "/contact" },
  ];

  return (
    <>
      {/* ✅ Navbar ثابت في الأعلى */}
      <div className="fixed top-0 left-0 w-full bg-gray-900/90 backdrop-blur-md shadow-lg z-50">
        <div className="px-4 md:px-12 py-4 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-white">
            Ali <span className="text-red-600">Hasan</span>
          </h1>

          {/* ✅ مبدّل الثيم */}
          <ThemeSwitcher className="hidden md:block" />

          {/* ✅ الروابط للشاشات الكبيرة */}
          <ul className="hidden md:flex space-x-6 text-lg">
            {navItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.link}
                  className={`hover:text-red-600 transition-colors ${
                    pathName === item.link ? "text-red-600" : "text-white"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* ✅ زر القائمة (الهاتف) */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg hover:bg-gray-600 transition"
            onClick={() => setIsOpen(!IsOpen)}
          >
            <RiMenu3Fill className="text-2xl text-white" />
          </button>
        </div>
      </div>

      {/* ✅ لضمان عدم تداخل المحتوى مع النافبار */}
      <div className="pt-[72px]" />

      {/* ✅ القائمة الجانبية (الهاتف) مع أنيميشن */}
      <AnimatePresence>
        {IsOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed top-0 right-0 w-3/4 max-w-[300px] h-full bg-gray-800 text-white shadow-lg z-50 p-6 flex flex-col"
          >
            {/* زر الإغلاق */}
            <button
              className="self-end text-2xl mb-6 text-red-500 hover:text-red-700"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>

            {/* روابط القائمة الجانبية */}
            <ul className="flex flex-col space-y-4 text-lg">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className={`block py-2 px-4 rounded-md hover:bg-red-600 transition ${
                      pathName === item.link ? "bg-red-500" : "bg-gray-700"
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* ✅ مبدّل الثيم داخل القائمة الجانبية */}
            <div className="mt-auto">
              <ThemeSwitcher />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
