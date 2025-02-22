import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/app/api";

const useSkillsStore = create((set) => ({
  skills: [],
  loading: false, // إضافة حالة اللودينغ
  fetchSkills: async () => {
    set({ loading: true }); // تشغيل اللودينغ
    try {
      const response = await axios.get(`${BASE_URL}skills`);
      set({ skills: response.data });
    } catch (error) {
      console.error("Error fetching skills", error);
    } finally {
      set({ loading: false }); // تشغيل اللودينغ
    }
  },
  addSkill: async (skillData) => {
    set({ loading: true }); // تشغيل اللودينغ

    try {
      await axios.post(`${BASE_URL}skills`, skillData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error adding skill", error);
    } finally {
      set({ loading: false }); // تشغيل اللودينغ
    }
  },
  deleteSkill: async (id) => {
    set({ loading: true }); // تشغيل اللودينغ

    try {
      await axios.delete(`${BASE_URL}skills?id=${id}`);
      set((state) => ({
        skills: state.skills.filter((skill) => skill._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting skill", error);
    } finally {
      set({ loading: false }); // تشغيل اللودينغ
    }
  },
}));

export default useSkillsStore;
