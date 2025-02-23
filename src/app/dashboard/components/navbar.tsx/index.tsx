"use client";
import { usePathname } from "next/navigation";

export default function DashboardNav() {
  const pathName = usePathname();
  const navItems = [
    { label: "Home", link: "/dashboard" },
    { label: "About", link: "/dashboard/about" },
    { label: "Skills", link: "/dashboard/skills" },
    { label: "Projects", link: "/dashboard/my-work" },
    { label: "Contact", link: "/dashboard/contact" },
  ];
  return (
    <div
      className="w-1/5 shadow-xl"
      style={{ overflowY: "auto", maxHeight: "calc(100vh - 4rem)" }}
    >
      <ul className="flex  flex-col items-center space-y-5 overflow-Y-auto py-[50px]  text-xl">
        {navItems.map((item, index) => (
          <li key={index}>
            <a
              href={item.link}
              className={` hover:text-red-600 ${
                pathName === item.link ? "text-red-600" : "text-white"
              }`}
            >
              {item.label}{" "}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
