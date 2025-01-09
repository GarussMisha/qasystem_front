// ProjectStore.js
import { defineStore } from "pinia";
import { 
  getAllProjects,
  createProject,
  getProjectById,
  deleteProjectById,
  updateProjectById,
} from '@/api/api';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export const useProjectStore = defineStore('projectsStore', {
  state: () => ({
    projects: {},
    loading: false,
    error: null,
  }),

  getters: {
    allProjects: (state) => Object.values(state.projects),
    projectCount: (state) => Object.keys(state.projects).length,
    getProjectById: (state) => (projectId) => state.projects[projectId] || {},
  },

  actions: {
    // Добавили forceRefresh
    async loadAllProjects(forceRefresh = false) {
      // если forceRefresh = true — всегда загружаем заново
      if (!forceRefresh && this.allProjects.length > 0) {
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const allProjects = await getAllProjects();
        const mappedProjects = allProjects.reduce((acc, project) => {
          acc[project.id] = project;
          return acc;
        }, {});
        this.projects = mappedProjects;
      } catch (error) {
        this.error = error;
        console.error('ProjectStore - loadAllProjects error:', error);
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectById(projectId) {
      if (this.projects[projectId]) {
        return this.projects[projectId];
      }
      this.loading = true;
      this.error = null;
      try {
        const project = await getProjectById(projectId);
        this.projects[projectId] = project;
        return project;
      } catch (error) {
        this.error = error;
        console.error(`ProjectStore - fetchProjectById error (id: ${projectId}):`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createNewProject({ name, description }) {
      this.loading = true;
      this.error = null;
      try {
        const projectData = {
          projectName: name,
          projectDescription: description,
        };
        const newProject = await createProject(projectData);
        this.projects[newProject.id] = newProject;
        return newProject;
      } catch (error) {
        this.error = error;
        console.error('ProjectStore - createNewProject error:', error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(projectId, { projectName, projectDescription }) {
      if (!this.projects[projectId]) {
        console.error(`ProjectStore - updateProject - Проект с ID ${projectId} не найден в хранилище.`);
        return null;
      }
      this.loading = true;
      this.error = null;
      try {
        const oldProject = this.projects[projectId];
        const dataToSend = {
          id: oldProject.id,
          projectName: projectName !== undefined ? projectName : oldProject.projectName,
          projectDescription: projectDescription !== undefined ? projectDescription : oldProject.projectDescription,
        };
        const updatedProject = await updateProjectById(projectId, dataToSend);
        this.projects[projectId] = updatedProject;
        return updatedProject;
      } catch (error) {
        this.error = error;
        console.error(`ProjectStore - updateProject - error (id: ${projectId}):`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async deleteProject(projectId) {
      if (!this.projects[projectId]) {
        console.warn(`ProjectStore - deleteProject - Проект с ID ${projectId} не найден в хранилище. Удаление не требуется.`);
        return false;
      }
      this.loading = true;
      this.error = null;
      try {
        await deleteProjectById(projectId);
        delete this.projects[projectId];
        const projectDataStore = useProjectDataStore();
        projectDataStore.deleteTestCasesByProjectId(projectId);
        return true;
      } catch (error) {
        this.error = error;
        console.error(`ProjectStore - deleteProject - error (id: ${projectId}):`, error);
        return false;
      } finally {
        this.loading = false;
      }
    },
  },
});
