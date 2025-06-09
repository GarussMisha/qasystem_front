import { defineStore } from 'pinia';
import projectApi from '@/api/project.api'; // Убедитесь, что путь правильный

export const useProjectStore = defineStore('project', {
  state: () => ({
    projects: [],
    currentProject: null,
    lastFetchAll: null,
    lastFetchSingle: {},
  }),

  actions: {
    // Загрузка всех проектов (с кэшированием на 1 минуту)
    async loadProjects() {
      const isStale = Date.now() - (this.lastFetchAll || 0) > 60000; // 1 минута
      
      if (!this.projects.length || isStale) {
        try {
          const data = await projectApi.getAll();
          this.projects = data;
          this.lastFetchAll = Date.now();
        } catch (error) {
          console.error('Ошибка загрузки проектов:', error);
          throw error;
        }
      }
    },

    // Загрузка конкретного проекта
    async loadProject(projectId) {
      const isStale = Date.now() - (this.lastFetchSingle[projectId] || 0) > 30000; // 30 секунд
      
      if (!this.currentProject?.id === projectId || isStale) {
        try {
          const data = await projectApi.getById(projectId);
          this.currentProject = data;
          this.lastFetchSingle[projectId] = Date.now();
          
          // Обновляем в общем списке
          const index = this.projects.findIndex(p => p.id === projectId);
          if (index !== -1) this.projects.splice(index, 1, data);
        } catch (error) {
          console.error(`Ошибка загрузки проекта ${projectId}:`, error);
          throw error;
        }
      }
    },

    // Создание проекта
    async createProject(projectData) {
      try {
        const newProject = await projectApi.create(projectData);
        this.projects.push(newProject);
        return newProject;
      } catch (error) {
        console.error('Ошибка создания проекта:', error);
        throw error;
      }
    },

    // Удаление проекта
    async deleteProject(projectId) {
      try {
        await projectApi.deleteById(projectId);
        this.projects = this.projects.filter(p => p.id !== projectId);
        if (this.currentProject?.id === projectId) this.currentProject = null;
      } catch (error) {
        console.error(`Ошибка удаления проекта ${projectId}:`, error);
        throw error;
      }
    },

    // Обновление проекта
    async updateProject(projectId, updateData) {
      try {
        const updatedProject = await projectApi.changeById(projectId, updateData);
        
        // Обновляем текущий проект
        if (this.currentProject?.id === projectId) {
          this.currentProject = updatedProject;
        }
        
        // Обновляем в общем списке
        const index = this.projects.findIndex(p => p.id === projectId);
        if (index !== -1) this.projects.splice(index, 1, updatedProject);
        
        return updatedProject;
      } catch (error) {
        console.error(`Ошибка обновления проекта ${projectId}:`, error);
        throw error;
      }
    },
  },

  getters: {
    getProjectById: (state) => (projectId) => {
      return state.projects.find(project => project.id === projectId);
    },
  },
});