"use client";
import NavBar from "@/components/header/navbar";
import axios from "axios";
import React, { useState } from "react";

const ContactForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<string>("");
  const [isloding, setISloading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // تأكد من وجود البيانات
    if (!name || !email || !message) {
      setStatus("الرجاء ملء جميع الحقول.");
      return;
    }

    // إرسال البيانات إلى API
    try {
      setISloading(true);
      // إرسال البيانات إلى API باستخدام axios
      const response = await axios.post("/api/messag", {
        name,
        email,
        message,
      });

      if (response.status === 200) {
        setName("");
        setEmail("");
        setMessage("");
        setStatus("تم إرسال الرسالة بنجاح.");
      } else {
        setStatus("حدث خطأ أثناء إرسال الرسالة.");
      }
    } catch (error) {
      console.error("خطأ في إرسال الرسالة: ", error);
      setStatus("حدث خطأ أثناء إرسال الرسالة.");
    } finally {
      setISloading(false);
    }
  };

  return (
    <>
      <NavBar />
      <div className="container mx-auto p-4 max-w-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          اتصل بنا
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800 p-6 rounded-lg shadow-lg"
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="الاسم"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="الرسالة"
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
            {!isloding ? " إرسال" : "جاري الارسال ..."}
          </button>
        </form>
        {status && <p className="mt-4 text-center text-red-500">{status}</p>}
      </div>
    </>
  );
};

export default ContactForm;
