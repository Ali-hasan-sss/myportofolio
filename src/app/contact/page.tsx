"use client";
import axios from "axios";
import React, { useState } from "react";
import { BASE_URL } from "../api";
import BtnLoading from "@/components/btnLoading";
import SocialNedia from "@/components/socialMedia";
import { toast } from "sonner";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isloding, setISloading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // تأكد من وجود البيانات
    if (!name || !email || !message) {
      toast("الرجاء ملئ كافة الحقول", {
        style: {
          backgroundColor: "#e1b846", // لون الخلفية
          color: "#f8fafc", // لون النص
          border: "1px solid #e1b846", // إطار مخصص
        },
      });
      return;
    }

    // إرسال البيانات إلى API
    try {
      setISloading(true);
      // إرسال البيانات إلى API باستخدام axios
      const response = await axios.post(`${BASE_URL}messag`, {
        name,
        email,
        message,
      });

      if (response.status === 200) {
        setName("");
        setEmail("");
        setMessage("");
        toast("تم ارسال الرسالة بنجاح", {
          style: {
            backgroundColor: "#05cc05", // لون الخلفية
            color: "#f8fafc", // لون النص
            border: "1px solid #f32815", // إطار مخصص
          },
        });
      } else {
        toast(" حدث خطأ اثناء ارسال الرسالة", {
          style: {
            backgroundColor: "#f32815", // لون الخلفية
            color: "#f8fafc", // لون النص
            border: "1px solid #f32815", // إطار مخصص
          },
        });
      }
    } catch (error) {
      console.error("خطأ في إرسال الرسالة: ", error);
    } finally {
      setISloading(false);
    }
  };

  return (
    <div className=" min-h-screen flex items-center w-full justify-center">
      <div className="container  flex flex-col w-full items-center justify-center">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Contact <span className="text-red-500"> Me</span>
        </h1>
        <div className="flex flex-col md:flex-row justify-between w-full items-center md:justify-between gap-4">
          <form
            onSubmit={handleSubmit}
            className=" p-6 rounded-lg w-[350px] shadow-lg"
          >
            <div className="mb-4">
              <input
                type="text"
                placeholder="your name ..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="your Email ..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="your Message ..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="border-2 border-gray-300 text-black rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
                rows={5}
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {!isloding ? " إرسال" : <BtnLoading />}
            </button>
          </form>

          <div className="flex items-center justify-center mt-[50px] md:w-[400px] w-[300px]  flex-col gap-5 ">
            <p className="text-lg text-white">
              You can send a direct message or get in touch by clicking on one
              of the social media icons below.
            </p>
            <SocialNedia />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
