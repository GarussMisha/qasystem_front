// src/stores/TestCaseChecklistStore.js
import { defineStore } from "pinia";
import { getProjectById, createTestCaseInProject } from '@/api/api';

export const useTestCaseChecklistStore = defineStore('testCaseChecklistStore', {
    state: () => ({
        testCases: {}, // Формат: { projectId: [testCase1, testCase2] }
        checklists: {}, // Формат: { projectId: [checklist1, checklist2] }
        loading: false,
        error: null,
    }),

    getters: {
        testCasesByProject: (state) => (projectId) => state.testCases[projectId] || [],
        checklistsByProject: (state) => (projectId) => state.checklists[projectId] || [],
    },

    actions: {
        async loadProjectData(projectId) {
            this.loading = true;
            this.error = null;
            try {
                const project = await getProjectById(projectId);
                this.testCases[projectId] = project.testCases || [];
                this.checklists[projectId] = project.checklists || [];
            } catch (error) {
                this.error = `Ошибка загрузки данных проекта: ${error.message}`;
            } finally {
                this.loading = false;
            }
        },

        async addTestCase(projectId, testCaseData) {
            try {
                const newTestCase = await createTestCaseInProject(projectId, testCaseData);
                if (!this.testCases[projectId]) {
                    this.testCases[projectId] = [];
                }
                this.testCases[projectId].push(newTestCase);
            } catch (error) {
                this.error = error.message;
                console.error(`TestCaseChecklistStore - Ошибка добавления тест-кейса в проект ${projectId}:`, error);
            }
        },

        async addChecklist(projectId, checklistData) {
            // Здесь реализуйте логику добавления чек-листа
        },
    },
});
