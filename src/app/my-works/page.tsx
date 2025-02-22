"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion"; // استيراد Framer Motion
import useProjectsStore from "@/store/useMyWorksStore";
import ServiceCard from "@/components/cards/serviceCard";
import Loader from "@/components/loader";

interface project {
  _id: string;
  name: string;
  link: string;
  imagePath: string;
}

export default function Mywork() {
  const { projects, fetchProjects, loading } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="mx-auto min-h-screen">
      <h1 className="text-2xl text-white font-bold mb-4 text-center">
        My <span className="text-red-500"> Works</span>
      </h1>
      {loading && <Loader />}
      <div className="flex flex-wrap items-center justify-center gap-6">
        {projects.map((project: project, index: number) => (
          <motion.div
            key={project._id}
            initial={{ x: index % 2 === 0 ? -200 : 200, opacity: 0 }} // حركة من اليسار أو اليمين
            whileInView={{ x: 0, opacity: 1 }} // عند دخول العنصر إلى الشاشة
            transition={{ duration: 0.8, delay: index * 0.2 }} // تأخير بسيط لكل عنصر
            viewport={{ once: true }} // تشغيل الأنيميشن مرة واحدة فقط
          >
            <ServiceCard
              title={project.name}
              link={project.link}
              image={project.imagePath || "/default-image.jpg"} // تعيين صورة افتراضية عند غياب الصورة
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
