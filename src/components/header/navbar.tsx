"use client";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "../ThemeSwitcher";

export default function NavBar() {
  const pathName = usePathname();
  const navItems = [
    { label: "Home", link: "/" },
    { label: "About", link: "/about" },
    { label: "Skills", link: "/skills" },
    { label: "Projects", link: "/my-works" },
    { label: "Contact", link: "/contact" },
  ];
  return (
    <div className=" px-[10px] md:px-[50px] py-4">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl pt-2 text-white h-[40px]">
          Ali <span className="text-red-600">Hasan</span>
        </h1>

        {/* مبدّل الثيم */}
        <ThemeSwitcher className="hidden md:block" />

        {/* قائمة الروابط: تظهر فقط على الشاشات الكبيرة */}
        <ul className="hidden md:flex md:space-x-5 text-xl">
          {navItems.map((item, index) => (
            <li key={index}>
              <a
                href={item.link}
                className={`hover:text-red-600 ${
                  pathName === item.link ? "text-red-600" : "text-white"
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <ThemeSwitcher className=" md:hidden" />
    </div>
  );
}
