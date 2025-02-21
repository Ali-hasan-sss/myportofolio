"use client";
import ThemeSwitcher from "../ThemeSwitcher";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { RiMenu3Fill } from "react-icons/ri";

export default function NavBar() {
  const [pathName, setPathName] = useState<string | null>(null);
  const [IsOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setPathName(window.location.pathname); // يتم التحديث بعد تحميل الصفحة
  }, []);
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
      <div className="fixed top-0 left-0 w-full  backdrop-blur-md shadow-sm z-50">
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
            className="fixed top-20  backdrop-blur-md right-0 w-full text-white shadow-lg  p-6 flex flex-col"
          >
            {/* ✅ مبدّل الثيم داخل القائمة الجانبية */}
            <div className="flex items-center justify-between">
              <ThemeSwitcher />
              <button
                className="self-end text-2xl mb-6 text-red-500 hover:text-red-700"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </div>

            {/* روابط القائمة الجانبية */}
            <ul className="flex flex-col backdrop-blur-md w-full space-y-4 text-lg">
              {navItems.map((item, index) => (
                <li key={index}>
                  <a
                    href={item.link}
                    className={`block py-2 px-4 text-center rounded-md hover:bg-red-600 transition ${
                      pathName === item.link ? "bg-red-500" : ""
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
