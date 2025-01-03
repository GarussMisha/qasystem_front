// src/stores/ProjectStore.js
import { defineStore } from "pinia";
import { getAllProjects, getProjectById, createProject, deleteProjectById } from '@/api/api';

export const useProjectStore = defineStore('projectStore', {
    state: () => ({
        projects: {},
        loading: false,
        error: null,
    }),
    
    getters: {
        allProjects: (state) => Object.values(state.projects),
        projectCount: (state) => Object.keys(state.projects).length,
    },
    
    actions: {
        async loadProjects() {
            this.loading = true;
            this.error = null;
            try {
                const projects = await getAllProjects();
                this.projects = projects.reduce((acc, project) => {
                    acc[project.id] = { ...project };
                    return acc;
                }, {});
            } catch (error) {
                this.error = error.message;
                console.error('ProjectStore - Ошибка загрузки всех проектов: ', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchProjectById(projectId) {
            this.loading = true;
            this.error = null;
            try {
                const project = await getProjectById(projectId);
                this.projects[projectId] = { ...project };
            } catch (error) {
                this.error = `Ошибка загрузки проекта: ${error.message}`;
            } finally {
                this.loading = false;
            }
        },

        async addProject(projectData) {
            try {
                const newProject = await createProject(projectData);
                this.projects[newProject.id] = { ...newProject };
            } catch (error) {
                this.error = error.message;
                console.error('ProjectStore - Ошибка создания проекта:', error);
            }
        },

        async removeProjectById(projectId) {
            try {
                await deleteProjectById(projectId);
                delete this.projects[projectId];
            } catch (error) {
                this.error = error.message;
                console.error(`ProjectStore - Ошибка удаления проекта с ID ${projectId}:`, error);
            }
        },
    },
});