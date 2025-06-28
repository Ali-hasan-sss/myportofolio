// pages/dashboard/index.tsx
"use client";
import { useEffect, useState } from "react";
import { User, Code, Briefcase, MessageSquare } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "@/app/api";

interface DashboardStats {
  projects: number;
  skills: number;
  messages: number;
  about: boolean;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    projects: 0,
    skills: 0,
    messages: 0,
    about: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [projectsRes, skillsRes, messagesRes, aboutRes] =
          await Promise.all([
            axios.get(`${BASE_URL}projects`),
            axios.get(`${BASE_URL}skills`),
            axios.get(`${BASE_URL}contact`),
            axios.get(`${BASE_URL}about`),
          ]);

        setStats({
          projects: projectsRes.data.length || 0,
          skills: skillsRes.data.length || 0,
          messages: messagesRes.data.length || 0,
          about: aboutRes.data && aboutRes.data.length > 0,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "المشاريع",
      value: stats.projects,
      icon: Briefcase,
      color: "bg-blue-500",
      link: "/dashboard/my-work",
    },
    {
      title: "المهارات",
      value: stats.skills,
      icon: Code,
      color: "bg-green-500",
      link: "/dashboard/skills",
    },
    {
      title: "الرسائل",
      value: stats.messages,
      icon: MessageSquare,
      color: "bg-purple-500",
      link: "/dashboard/contact",
    },
    {
      title: "المعلومات الشخصية",
      value: stats.about ? "مكتملة" : "غير مكتملة",
      icon: User,
      color: stats.about ? "bg-green-500" : "bg-yellow-500",
      link: "/dashboard/about",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">مرحباً بك في لوحة التحكم</h1>
        <p className="text-blue-100">إدارة موقعك الشخصي بسهولة وأمان</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <a
              key={index}
              href={stat.link}
              className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/dashboard/about"
            className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <User className="w-5 h-5 text-blue-400" />
            <span className="text-white">تعديل المعلومات الشخصية</span>
          </a>
          <a
            href="/dashboard/my-work"
            className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <Briefcase className="w-5 h-5 text-green-400" />
            <span className="text-white">إضافة مشروع جديد</span>
          </a>
          <a
            href="/dashboard/contact"
            className="flex items-center space-x-3 p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors duration-200"
          >
            <MessageSquare className="w-5 h-5 text-purple-400" />
            <span className="text-white">عرض الرسائل الجديدة</span>
          </a>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">النشاط الأخير</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-gray-300">تم تحديث المعلومات الشخصية</span>
            <span className="text-gray-500 text-sm">منذ ساعة</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-gray-300">تم إضافة مشروع جديد</span>
            <span className="text-gray-500 text-sm">منذ 3 ساعات</span>
          </div>
          <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
            <span className="text-gray-300">رسالة جديدة من زائر</span>
            <span className="text-gray-500 text-sm">منذ 5 ساعات</span>
          </div>
        </div>
      </div>
    </div>
  );
}
