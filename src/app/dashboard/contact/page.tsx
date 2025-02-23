"use client";
import { BASE_URL } from "@/app/api";
import axios from "axios";
import { useEffect, useState } from "react";
import useSocialMediaStore from "@/store/useSocialMediaStore";
import { toast } from "sonner";

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
}
interface social {
  iconUrl: string;
  url: string;
  _id: string;
}
function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [newLink, setNewLink] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    socialLinks,
    fetchSocialLinks,
    addSocialLink,
    deleteSocialLink,
    loading,
  } = useSocialMediaStore();

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`${BASE_URL}messag`);
        setMessages(response.data);
      } catch (err) {
        console.error("فشل في جلب الرسائل", err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, []);

  const deleteMessage = async (messageId: string) => {
    try {
      await axios.delete(`${BASE_URL}messag?id=${messageId}`);
      setMessages(messages.filter((msg) => msg._id !== messageId));
    } catch (error) {
      console.error("خطأ أثناء حذف الرسالة:", error);
    }
  };

  const handleAdd = async () => {
    if (!selectedFile || !newLink) {
      toast.warning("الرجاء اختيار صورة وإدخال رابط الحساب!");
      return;
    }

    const formData = new FormData();
    formData.append("icon", selectedFile);
    formData.append("url", newLink);

    await addSocialLink(formData);
    setSelectedFile(null);
    setNewLink("");
  };

  if (loadingMessages) {
    return <div>جاري تحميل الرسائل...</div>;
  }

  return (
    <div style={{ direction: "rtl", padding: "20px 40px" }} className="w-full">
      <h2 className="text-2xl font-bold mb-4">الرسائل الواردة</h2>

      <table className="min-w-full bg-gray-800 rounded-xl shadow-md">
        <thead>
          <tr className="bg-gray-900 text-white">
            <th className="text-center px-4 py-2">الاسم</th>
            <th className="text-center px-4 py-2">البريد الإلكتروني</th>
            <th className="text-center px-4 py-2">نص الرسالة</th>
            <th className="text-center px-4 py-2">الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((message, index) => (
            <tr
              key={message._id}
              className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"}
            >
              <td className="text-center px-4 py-2">{message.name}</td>
              <td className="text-center px-4 py-2">{message.email}</td>
              <td className="text-center px-4 py-2">{message.message}</td>
              <td className="text-center px-4 py-2">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteMessage(message._id)}
                >
                  حذف
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6 bg-gray-800 p-4 rounded-xl shadow-md">
        <h3 className="text-xl font-bold mb-2 text-white">إضافة وسيلة تواصل</h3>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
          className="mb-2 block w-full text-white"
        />
        <input
          type="text"
          placeholder="أدخل رابط وسيلة التواصل"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          className="p-2 w-full mb-2 bg-gray-900 text-white rounded"
        />
        <button
          onClick={handleAdd}
          disabled={loading}
          className={`w-full bg-green-400 hover:bg-green-500 p-2 rounded text-white`}
        >
          + إضافة
        </button>
        <table className="min-w-full bg-gray-800 rounded-xl shadow-md">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="text-center px-4 py-2">الرابط</th>
              <th className="text-center px-4 py-2">الايقونة </th>
              <th className="text-center px-4 py-2">الاجرائات </th>
            </tr>
          </thead>
          <tbody>
            {socialLinks.map((item: social, index: number) => (
              <tr
                key={item.url}
                className={index % 2 === 0 ? "bg-gray-700" : "bg-gray-600"}
              >
                <td className="text-center px-4 py-2">{item.url}</td>
                <td className="text-center px-4 py-2">
                  <img src={item.iconUrl} className="w-5 h-5" />
                </td>
                <td className="text-center px-4 py-2">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded"
                    onClick={() => deleteSocialLink(item._id)}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminMessages;
