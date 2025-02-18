import { create } from "zustand";
import axios from "axios";
import { BASE_URL } from "@/app/api";

const useProjectsStore = create((set) => ({
  projects: [],
  fetchProjects: async () => {
    try {
      const response = await axios.get(`${BASE_URL}projects`);
      set({ projects: response.data });
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  },
  addProject: async (worksData) => {
    try {
      await axios.post(`${BASE_URL}projects`, worksData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error adding project", error);
    }
  },
  deleteProject: async (id) => {
    try {
      await axios.delete(`${BASE_URL}projects?id=${id}`);
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting project", error);
    }
  },
}));

export default useProjectsStore;
