import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/app/api";

const useSkillsStore = create((set) => ({
  skills: [],
  fetchSkills: async () => {
    try {
      const response = await axios.get(`${BASE_URL}skills`);
      set({ skills: response.data });
    } catch (error) {
      console.error("Error fetching skills", error);
    }
  },
  addSkill: async (skillData) => {
    try {
      await axios.post("/api/skills", skillData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error adding skill", error);
    }
  },
  deleteSkill: async (id) => {
    try {
      await axios.delete(`${BASE_URL}?id=${id}`);
      set((state) => ({
        skills: state.skills.filter((skill) => skill._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting skill", error);
    }
  },
}));

export default useSkillsStore;
