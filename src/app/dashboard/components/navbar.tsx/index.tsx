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
    <div className="flex items-center justify-between px-[50px] py-4  bg-black">
      <h1 className="font-bold text-3xl pt-2 text-white h-[40px]">
        Ali <span className="text-red-600">Hasan</span>
      </h1>
      <ul className="flex space-x-5 text-xl">
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
