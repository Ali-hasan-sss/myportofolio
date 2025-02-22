import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/app/api";
const useSocialMediaStore = create((set) => ({
  socialLinks: [],
  loading: false,
  error: null,

  // ✅ جلب بيانات وسائل التواصل من API
  fetchSocialLinks: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await axios.get(`${BASE_URL}contact`);
      set({ socialLinks: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // ✅ إضافة وسيلة تواصل جديدة
  addSocialLink: async (newLink) => {
    set({ loading: true });
    try {
      const { data } = await axios.post(`${BASE_URL}contact`, newLink);
      set({ socialLinks: data, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // ✅ حذف وسيلة تواصل معينة
  deleteSocialLink: async (url) => {
    set({ loading: true });
    try {
      const { data } = await axios.delete(`${BASE_URL}contact?id=${url}`);
      set({ socialLinks: data.socialLinks, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },
}));

export default useSocialMediaStore;
