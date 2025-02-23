"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BASE_URL } from "../api";
import axios from "axios";
import Loader from "@/components/loader";
interface About {
  image: string;
  name: string;
  education: string;
  profession: string;
  phoneNo: string;
  email: string;
  adress: string;
  date_of_birth: string;
  description: string;
}

export default function About() {
  const [aboutData, setAboutData] = useState<About | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State للأخطاء

  // جلب البيانات من API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Start loading
        const response = await axios.get(`${BASE_URL}about`);
        setAboutData(response.data[0]); // Assume there's only one record
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching about data:", err.message);
          setError(err.message || "Failed to fetch data");
        } else {
          console.error("An unknown error occurred", err);
          setError("An unknown error occurred.");
        }
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchData();
  }, []);
  return (
    <div className=" mx-auto min-h-screen">
      <h1 className="text-3xl text-white font-bold mb-6 text-center">
        About <span className="text-red-500"> Me</span>
      </h1>
      {/* Loading State */}
      {loading && <Loader />}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-500">
          <p className="text-red-500">تفقد اتصالك بالشبكة</p>
        </div>
      )}

      {/* Data Display or Edit Form */}
      {!loading && !error && aboutData && (
        <>
          <section className="min-h-screen py-[30px] text-white p-6 flex flex-col items-center">
            {/* صورة الموبايل */}
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex md:hidden justify-center mb-6"
            >
              {aboutData.image && (
                <img
                  src={aboutData.image}
                  alt="Profile"
                  className="w-[300px] h-[300px] object-cover rounded-lg"
                />
              )}
            </motion.div>

            {/* المحتوى الأساسي */}
            <div className="max-w-[1200px]  px-[10px] md:px-[50px]  w-full flex flex-col md:flex-row items-center  justify-between gap-6 px-6">
              {/* صورة اللابتوب */}
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="hidden md:flex justify-center"
              >
                {aboutData.image && (
                  <img
                    src={aboutData.image}
                    alt="Profile"
                    className="w-[400px] h-[400px] object-cover rounded-lg"
                  />
                )}
              </motion.div>

              {/* المعلومات النصية */}
              <motion.div
                initial={{ x: 100, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="flex flex-col   text-white items-center md:items-start text-center md:text-left"
              >
                <h1 className="text-xl text-white font-bold mb-4">
                  Name:{" "}
                  <span className="text-red-500 text-2xl">
                    {aboutData.name}
                  </span>
                </h1>
                <h2 className="text-xl text-white font-bold mb-4">
                  Profession:
                  <span className="text-red-500"> {aboutData.profession}</span>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4">
                  Education:
                  <span className="text-red-500"> {aboutData.education} </span>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4">
                  Phone:{" "}
                  <span className="text-red-500">{aboutData.phoneNo}</span>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4">
                  Email: <span className="text-red-500">{aboutData.email}</span>
                </h2>
                <h2 className="text-xl text-white font-bold mb-4">
                  Address:{" "}
                  <span className="text-red-500">{aboutData.adress}</span>
                </h2>

                {/* وصف عني */}
                <p className="text-white max-w-[400px] text-xl break-words">
                  About
                  <span className="text-red-500 font-bold mr-2 text-2xl">
                    me:
                  </span>
                  {aboutData.description}
                </p>
              </motion.div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
