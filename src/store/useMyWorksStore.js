import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/app/api";

const useProjectsStore = create((set) => ({
  projects: [],
  loading: false, // إضافة حالة اللودينغ

  fetchProjects: async () => {
    set({ loading: true }); // تشغيل اللودينغ
    try {
      const response = await axios.get(`${BASE_URL}projects`);
      set({ projects: response.data });
    } catch (error) {
      console.error("Error fetching projects", error);
    } finally {
      set({ loading: false }); // إيقاف اللودينغ
    }
  },

  addProject: async (worksData) => {
    set({ loading: true });
    try {
      await axios.post(`${BASE_URL}projects`, worksData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error adding project", error);
    } finally {
      set({ loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true });
    try {
      await axios.delete(`${BASE_URL}projects?id=${id}`);
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting project", error);
    } finally {
      set({ loading: false });
    }
  },
}));

export default useProjectsStore;
