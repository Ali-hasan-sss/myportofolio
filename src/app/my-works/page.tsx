"use client";

import React, { useEffect } from "react";
import useProjectsStore from "@/store/useMyWorksStore";
import NavBar from "../../components/header/navbar";
import ServiceCard from "@/components/cards/serviceCard";

interface project {
  _id: string;
  name: string;
  link: string;
  imagePath: string;
}
export default function Mywork() {
  const { projects, fetchProjects } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
    console.log(projects);
  }, []);

  return (
    <div className="mx-auto min-h-screen ">
      <NavBar />
      <h1 className="text-2xl text-white font-bold mb-4 text-center">اعمالي</h1>
      <div className="flex flex-wrap items-center justify-center gap-6">
        {projects.map((project: project) => (
          <ServiceCard
            key={project._id}
            title={project.name}
            link={project.link}
            image={project.imagePath}
          />
        ))}
      </div>
    </div>
  );
}
