"use client";
import { BASE_URL } from "@/app/api";
import axios from "axios";
import { useEffect, useState } from "react";
interface messag {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // جلب الرسائل من API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(`${BASE_URL}messag`);
        if (!response.ok) {
          throw new Error("فشل في جلب الرسائل");
        }
        const data = await response.json();
        setMessages(data);
      } catch (err) {
        setError("حدث خطأ أثناء جلب الرسائل");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);
  const deleteMessage = async (messageId: string) => {
    try {
      const response = await axios.delete(`${BASE_URL}messag?id=${messageId}`);
      console.log("تم حذف الرسالة بنجاح", response.data);
      // هنا يمكن إضافة إعادة تحميل البيانات أو تحديث الواجهة بعد الحذف
    } catch (error) {
      console.error("خطأ أثناء حذف الرسالة:", error);
    }
  };
  if (loading) {
    return <div>جاري تحميل الرسائل...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ direction: "rtl", padding: "20px 40px" }}>
      <h2 className="text-2xl font-bold">الرسائل الواردة</h2>

      <table className="min-w-full bg-gray-800 rounded-xl">
        <thead>
          <tr className="">
            <th className=" text-center  px-4 py-2">الاسم</th>
            <th className=" text-center px-4 py-2">البريد الالكتروني </th>
            <th className=" text-center  px-4 py-2">نص الرسالة</th>

            <th className=" text-center px-4 py-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message: messag, index: number) => (
            <tr
              key={message._id}
              className={`${
                index % 2 === 0 ? "bg-gray-900 " : "bg-gray-800 "
              } `}
            >
              <td className="text-center  px-4 py-2">{message.name}</td>
              <td className=" text-center px-4 py-2">{message.email}</td>
              <td className=" text-center px-4 py-2">{message.message}</td>

              <td className=" text-center px-4 py-2">
                <button
                  className="bg-red-500 text-white px-3 mx-2 py-1 rounded mr-2"
                  onClick={() => deleteMessage(message._id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
          <tr>
            <td className="text-gray-800">.</td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default AdminMessages;
