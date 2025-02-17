// pages/dashboard/index.tsx
"use client";
import { useEffect } from "react";
import { isAuthorized } from "../../utils/auth";

export default function Dashboard() {
  useEffect(() => {
    if (!isAuthorized()) {
      window.location.href = "/dashboard/login"; // Redirect to login if not authorized
    }
  }, []);

  return <div className=""></div>;
}
