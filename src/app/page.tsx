"use client";
import { motion } from "framer-motion";
import { useEffect } from "react";
import Mywork from "./my-works/page";
import About from "./about/page";
import Skills from "./skills/page";
import ContactForm from "./contact/page";
import useProjectsStore from "@/store/useMyWorksStore";

export default function Home() {
  const { fetchProjects } = useProjectsStore();

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div className="flex flex-col items-senter justify-center gap-[50px]">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <About />
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        viewport={{ once: true }}
      >
        <Mywork />
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        viewport={{ once: true }}
      >
        <Skills />
      </motion.div>

      <motion.div
        initial={{ y: 100, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        viewport={{ once: true }}
      >
        <ContactForm />
      </motion.div>
    </div>
  );
}
