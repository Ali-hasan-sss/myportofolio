"use client";
import { usePathname } from "next/navigation";
import { logout } from "@/utils/auth";
import {
  Home,
  User,
  Code,
  Briefcase,
  MessageSquare,
  LogOut,
  Settings,
} from "lucide-react";

export default function DashboardNav() {
  const pathName = usePathname();

  const navItems = [
    { label: "الرئيسية", link: "/dashboard", icon: Home },
    { label: "حول", link: "/dashboard/about", icon: User },
    { label: "المهارات", link: "/dashboard/skills", icon: Code },
    { label: "المشاريع", link: "/dashboard/my-work", icon: Briefcase },
    { label: "الرسائل", link: "/dashboard/contact", icon: MessageSquare },
    { label: "الإعدادات", link: "/dashboard/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="w-64 bg-gray-800 shadow-xl h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-700 flex-shrink-0">
        <h1 className="text-xl font-bold text-white">لوحة التحكم</h1>
        <p className="text-gray-400 text-sm">إدارة الموقع الشخصي</p>
      </div>

      {/* Navigation (scrollable) */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = pathName === item.link;

              return (
                <li key={index}>
                  <a
                    href={item.link}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* Footer with logout (always at bottom) */}
      <div className="p-4 border-t border-gray-700 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
