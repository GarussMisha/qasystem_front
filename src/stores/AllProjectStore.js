// src/stores/AllProjectStore.js
import { defineStore } from "pinia";
import { getAllProjects, 
        getProjectById, 
        createProject, 
        deleteProjectById, 
        createTestCaseInProject 
    } from '@/api/api';

export const useProjectStore = defineStore ('projectStore', {
    state: () => ({
        projects: {},
        loading: false,
        error: null,
    }),
    
    getters: {
        allProjects: (state) => Object.values(state.projects),
        projectCount: (state) => Object.keys(state.projects).length,
        testCasecByProdject: (state) => (projectId) => state.projects[projectId]?.testCases || [],
        checklistsByProject: (state) => (projectId) => state.projects[projectId]?.checklists || [],
    },
    
    actions: {
        async loadProjects() {
            this.loading = true;
            this.error = null;
            try {
                const projects = await getAllProjects();
                // Преобразуем данные в формат: { [projectId]: { ...projectData, testCases: [], checklists: [] } }
                this.projects = projects.reduce((acc, project) => {
                acc[project.id] = { ...project, testCases: [], checklists: [] };
                return acc;
                }, {});
            } catch (error) {
                this.error = error.message;
                console.error('AllProjectStore - Ошибка загрузки всех проектов: ', error);
            } finally {
                this.loading = false;
            }
        },
        async fetchProjectById(projectId) {
            this.loading = true;
            this.error = null;
            try {
              const project = await getProjectById(projectId);
              this.projects[projectId] = { 
                ...project, 
                testCases: project.testCases || [], 
                checklists: project.checklists || [] 
              }; // Сохраняем проект с его сущностями
            } catch (error) {
              this.error = `Ошибка загрузки проекта: ${error.message}`;
            } finally {
              this.loading = false;
            }
          },
        async addProject(projectData) {
            try {
                const newProject = await createProject(projectData);
                this.projects[newProject.id] = { ...newProject, testCases: [], checklists: [] };
            } catch (error) {
                this.error = error.message;
                console.error('AllProjectStore - Ошибка создания проекта:', error);
            }
        },

        async removeProjectById(projectId) {
            try {
                await deleteProjectById(projectId);
                delete this.projects[projectId];
            } catch (error) {
                this.error = error.message;
                console.error(`AllProjectStore - Ошибка удаления проекта с ID ${projectId}:`, error);
            }
        },

        async addTestCaseToProject(projectId, testCaseData) {
            console.log('СОздание тест-кейса в хранилице addTestCaseToProject')
            try{
                const newTestCase = await createTestCaseInProject(projectId, testCaseData);
                if (!this.projects[projectId].testCases) {this.projects[projectId].testCases = [];}

                 // Убедитесь, что newTestCase содержит нужные поля
                console.log('Созданный тест-кейс:', newTestCase);

                this.projects[projectId].testCases.push(newTestCase);
            } catch (error) {
                this.error = error.message;
                console.error(`AllProjectStore - Ошибка добавления тест-кейса в проект ${projectId}:`, error);
            }
        },
    },
}); 