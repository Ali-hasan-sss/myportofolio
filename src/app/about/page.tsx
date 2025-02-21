"use client";
import { useEffect, useState } from "react";
import { BASE_URL } from "../api";
import axios from "axios";
import NavBar from "@/components/header/navbar";
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
    <div className=" mx-auto ">
      <NavBar />
      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-8 text-red-500">
          <p>{error}</p>
        </div>
      )}

      {/* Data Display or Edit Form */}
      {!loading && !error && aboutData && (
        <>
          <section className=" min-h-screen text-white  p-6">
            <div className=" items-center justify-center mb-4 flex md:hidden">
              {aboutData.image && (
                <img
                  src={`data:image/jpeg;base64,${aboutData.image}`}
                  alt="Profile"
                  className="w-[400px] h-[400px]  object-cover"
                />
              )}
            </div>
            {/* Display Image */}
            <div className="flex items-center justify-between gap-4 px-[50px] py-[30px]">
              <div className=" items-center justify-center mb-4 hidden md:flex">
                {aboutData.image && (
                  <img
                    src={`data:image/jpeg;base64,${aboutData.image}`}
                    alt="Profile"
                    className="w-[400px] h-[400px]  object-cover"
                  />
                )}
              </div>

              <div className="flex flex-col items-start">
                <h1 className="text-xl  text-center font-bold mb-4">
                  Name :
                  <span className="text-red-500 text-2xl">
                    {aboutData.name}
                  </span>
                </h1>
                <h2 className="text-xl  text-center font-bold mb-4">
                  Profession:
                  <span className="text-red-500"> {aboutData.profession}</span>
                </h2>
                <h2 className="text-xl  text-center font-bold mb-4">
                  Education :
                  <span className="text-red-500"> {aboutData.education} </span>
                </h2>

                <h2 className="text-2xl text-center font-bold mb-4">
                  Phone:
                  <span className="text-red-500"> {aboutData.phoneNo}</span>
                </h2>
                <h2 className="text-2xl  text-center font-bold mb-4">
                  Email:
                  <span className="text-red-500"> {aboutData.email}</span>
                </h2>
                <h2 className="text-2xl  text-center font-bold mb-4">
                  Adress:
                  <span className="text-red-500"> {aboutData.adress}</span>
                </h2>

                {/* Display Description */}
                <p className=" text-xl ">
                  <span className="text-red-500 font-bold mr-2 mb-4 text-2xl">
                    About me:
                  </span>
                  {aboutData.description}
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
