"use client";
import { useState } from "react";
import { Bell, Search, User, Settings, LogOut, Menu, X } from "lucide-react";
import { logout } from "@/utils/auth";

interface DashboardHeaderProps {
  title?: string;
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export default function DashboardHeader({
  title = "لوحة التحكم",
  onMenuToggle,
  isMenuOpen = false,
}: DashboardHeaderProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notifications] = useState([
    { id: 1, message: "رسالة جديدة من زائر", time: "منذ 5 دقائق", read: false },
    { id: 2, message: "تم تحديث المشروع بنجاح", time: "منذ ساعة", read: true },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Menu toggle and title */}
        <div className="flex items-center space-x-4">
          {onMenuToggle && (
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          )}
          <h1 className="text-xl font-bold text-white">{title}</h1>
        </div>

        {/* Right side - Search, notifications, user menu */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="البحث..."
              className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button className="p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 relative">
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-white font-medium hidden md:block">
                المدير
              </span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                <div className="py-2">
                  <a
                    href="/dashboard"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <User className="w-4 h-4" />
                    <span>الملف الشخصي</span>
                  </a>
                  <a
                    href="/dashboard/settings"
                    className="flex items-center space-x-3 px-4 py-2 text-gray-300 hover:bg-gray-700 transition-colors duration-200"
                  >
                    <Settings className="w-4 h-4" />
                    <span>الإعدادات</span>
                  </a>
                  <hr className="border-gray-700 my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 text-red-400 hover:bg-red-500 hover:text-white w-full transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notifications Panel */}
      {showUserMenu && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="text-white font-medium">الإشعارات</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-700 hover:bg-gray-700 transition-colors duration-200 ${
                    !notification.read ? "bg-blue-500/10" : ""
                  }`}
                >
                  <p className="text-white text-sm">{notification.message}</p>
                  <p className="text-gray-400 text-xs mt-1">
                    {notification.time}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-400">
                لا توجد إشعارات جديدة
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
