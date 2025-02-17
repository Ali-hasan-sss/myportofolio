import { create } from "zustand";
import axios from "axios";

const useProjectsStore = create((set) => ({
  projects: [],
  fetchProjects: async () => {
    try {
      const response = await axios.get("/api/projects");
      set({ projects: response.data });
    } catch (error) {
      console.error("Error fetching projects", error);
    }
  },
  addProject: async (worksData) => {
    try {
      await axios.post("/api/projects", worksData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error adding project", error);
    }
  },
  deleteProject: async (id) => {
    try {
      await axios.delete(`/api/projects?id=${id}`);
      set((state) => ({
        projects: state.projects.filter((project) => project._id !== id),
      }));
    } catch (error) {
      console.error("Error deleting project", error);
    }
  },
}));

export default useProjectsStore;
