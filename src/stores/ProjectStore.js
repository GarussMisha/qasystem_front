import { defineStore } from "pinia";
import { 
        getAllProjects,
        createProject,
        getProjectById,
        deleteProjectById,
        updateProjectById,
        } from '@/api/api';

export const useProjectStore = defineStore('projectsStore', {
    state: () => ({
        projects: {}, //Храним проекты в формате { [projectId]: { id, name, description, ... } }
        loading: false,
    }),
    
    getters: {
        allProjects_store: (state) => Object.values(state.projects), // Вернёт массив всех проектов
        projectCount_store: (state) => Object.keys(state.projects).length, // Вернёт количество проектов
        getProjectById_store: (state) => (projectId) => {return state.projects[projectId] || {}; }, // Получить проект по ID (пригодится, если хотим брать данные из state без запроса)
    },
    
    actions: {
      // 1.1. Загрузить все проекты
      async loadAllProjects() { 
        this.loading = true;
        try {
            const allProjects = await getAllProjects();
            const mappedProjects = allProjects.reduce((acc, project) => {
                acc[project.id] = project;
                return acc;
            }, {});
            this.projects = mappedProjects;
        } catch (error) {
            console.error('ProjectStore - loadAllProjects error:', error);
        } finally {
            this.loading = false;
        }
      },
      // 1.2. Загрузить конкретный проект по ID (и обновить его в state)
      async fetchProjectById(projectId) {
        if (this.projects[projectId]){
          return this.projects[projectId]
        }
        try {
          const project = await getProjectById(projectId);
          this.projects[projectId] = project;
        } catch (error) {
          console.error(`ProjectStore - fetchProjectById error (id: ${projectId}):`, error);
          return {};
        }
      },
      // 1.3. Создать новый проект
      async createNewProject({ name, description }) {
        try {
          const projectData = {
            projectName: name,
            projectDescription: description,
          }
          const newProject = await createProject(projectData);
          this.projects[newProject.id] = newProject;
          return true;
        } catch (error) {
          console.error('ProjectStore - createNewProject error:', error);
          return false;
        }
      },
      // 1.4. Обновить (отредактировать) существующий проект
      async updateProject(projectId, { projectName, projectDescription }) {
        if (!this.projects[projectId]) {
          console.error(`ProjectStore - updateProject - Проект с ID ${projectId} не найден в хранилище.`);
          return false;
        }
        try {
          const oldProject = this.projects[projectId] || {};
          const dataToSend = {
            id: oldProject.id,
            projectName: projectName || oldProject.projectName,
            projectDescription: projectDescription || oldProject.projectDescription,
          };
          const updatedProject = await updateProjectById(projectId, dataToSend);
          this.projects[projectId] = updatedProject;
          return true;
        } catch (error) {
          console.error(`ProjectStore - updateProject - error (id: ${projectId}):`, error);
          return false;
        }
      },
      // 1.5. Удалить проект по ID
      async deleteProject(projectId) {
        if (!this.projects[projectId]) {
          console.warn(`ProjectStore - deleteProject - Проект с ID ${projectId} не найден в хранилище. Удаление не требуется.`);
          return false;
        }
        try {
          await deleteProjectById(projectId);
          delete this.projects[projectId];
          return true;
        } catch (error) {
          console.error(`ProjectStore - deleteProject - error (id: ${projectId}):`, error);
          return false;
        }
      },
    },
});