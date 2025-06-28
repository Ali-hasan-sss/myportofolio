"use client";
import { useState, useEffect } from "react";
import DashboardNav from "./components/navbar.tsx";
import DashboardHeader from "@/components/DashboardHeader";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 to-gray-800 overflow-hidden">
      {/* Header */}
      <DashboardHeader
        onMenuToggle={() => setIsMenuOpen(!isMenuOpen)}
        isMenuOpen={isMenuOpen}
      />

      <div className="flex h-[calc(100vh-64px)] relative">
        {/* Mobile overlay - إصلاح مشكلة العتامة */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } lg:block lg:w-64 z-40 relative h-full min-h-0`}
        >
          <div className="h-full min-h-0 overflow-y-auto dashboard-sidebar">
            <DashboardNav />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto dashboard-content min-h-0">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
