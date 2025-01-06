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
        error: null,
    }),
    
    getters: {
        allProjects: (state) => Object.values(state.projects), // Вернёт массив всех проектов
        projectCount: (state) => Object.keys(state.projects).length, // Вернёт количество проектов
        getProjectById: (state) => (projectId) => {
            return state.projects[projectId]; // Получить проект по ID (пригодится, если хотим брать данные из state без запроса)
          },
    },
    
    actions: {
        async loadAllProjects() { // Загрузить все проекты
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
                this.error = error.message;
                console.error('ProjectStore - loadAllProjects error:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchProjectById(projectId) { // Загрузить конкретный проект по ID (и обновить его в state)
            this.loading = true;
            this.error = null;
            try {
              const project = await getProjectById(projectId);
              this.projects[projectId] = project;
            } catch (error) {
              this.error = error.message;
              console.error(`ProjectStore - fetchProjectById error (id: ${projectId}):`, error);
            } finally {
              this.loading = false;
            }
        },

        async createNewProject(projectData) { // Создать новый проект
            this.error = null;
            try {
              const newProject = await createProject(projectData);
              // Помещаем его в state
              this.projects[newProject.id] = newProject;
            } catch (error) {
              this.error = error.message;
              console.error('ProjectStore - createNewProject error:', error);
            }
          },
      

        async updateProject(projectId, editProjectData) { // Обновить (отредактировать) существующий проект
            this.error = null;
            try {
              const oldProject = this.projects[projectId] || {};

              const dataToSend = {
                id: oldProject.id,
                projectName: oldProject.projectName,                     // Берём старое имя
                projectDescription: editProjectData.projectDescription,      // Новое описание
                // ...если нужны ещё поля, добавьте их
              };

              
              const updatedProject = await updateProjectById(projectId, dataToSend);
              // Здесь updatedProject может быть частичным
              this.projects[projectId] = updatedProject;
              
            } catch (error) {
              this.error = error.message;
              console.error(`ProjectStore - updateProject error (id: ${projectId}):`, error);
            }
        },
      
        async deleteProject(projectId) { // Удалить проект по ID
            this.error = null;
            try {
              await deleteProjectById(projectId);
              delete this.projects[projectId]; // Убираем из state
            } catch (error) {
              this.error = error.message;
              console.error(`ProjectStore - deleteProject error (id: ${projectId}):`, error);
            }
        },
    },
});