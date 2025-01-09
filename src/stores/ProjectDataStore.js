// ProjectDataStore.js
import { defineStore } from 'pinia';
import {
  getAllTestCases,
  getTestCaseById,
  createTestCaseInProject,
  getAllTestCaseByProjectId,
  updateTestCaseById,
  deleteTestCaseById,
} from '@/api/api';

export const useProjectDataStore = defineStore('projectDataStore', {
  state: () => ({
    testCasesByProject: {},
    allTestCases: {},
    loading: false,
    error: null,
    loadedTestCasesByProject: {},
  }),

  getters: {
    allTestCasesArray: (state) => Object.values(state.allTestCases),
    testCasesForProject: (state) => (projectId) => state.testCasesByProject[projectId] || [],
    testCaseCountForProject: (state) => (projectId) => {
      const list = state.testCasesByProject[projectId];
      return list ? list.length : 0;
    },
    getTestCaseById: (state) => (testCaseId) => state.allTestCases[testCaseId] || null,
  },

  actions: {
    // Добавили forceRefresh
    async loadAllTestCases(forceRefresh = false) {
      if (!forceRefresh && Object.keys(this.allTestCases).length > 0) {
        console.log("ProjectDataStore - loadAllTestCases - Данные уже есть, пропускаем загрузку.");
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const allTestCases = await getAllTestCases();
        this.allTestCases = allTestCases.reduce((acc, testCase) => {
          acc[testCase.id] = testCase;
          return acc;
        }, {});
      } catch (error) {
        this.error = error.message;
        console.error('ProjectDataStore - loadAllTestCases error:', error);
      } finally {
        this.loading = false;
      }
    },

    async loadTestCasesByProjectId(projectId, forceRefresh = false) {
      if (!forceRefresh && this.loadedTestCasesByProject[projectId]) {
        console.log(`ProjectDataStore - loadTestCasesByProjectId - Тест-кейсы для проекта ${projectId} уже загружены.`);
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const testCases = await getAllTestCaseByProjectId(projectId);
        this.testCasesByProject[projectId] = testCases;
        testCases.forEach(testCase => this._saveOrUpdateInAllTestCases(testCase));
        this.loadedTestCasesByProject[projectId] = true; // Устанавливаем флаг как загруженный
      } catch (error) {
        this.error = error.message;
        console.error(`ProjectDataStore - loadTestCasesByProjectId error (projectId: ${projectId}):`, error);
      } finally {
        this.loading = false;
      }
    },

        /**
     * Загрузка отдельного тест-кейса по ID
     * @param {Number} testCaseId - ID тест-кейса
     * @returns {Object|null} - Объект тест-кейса или null в случае ошибки
     */
        async fetchTestCaseById(testCaseId) {
          if (this.allTestCases[testCaseId]) {
            console.log(`ProjectDataStore - fetchTestCaseById - Тест-кейс с ID ${testCaseId} уже загружен.`);
            return this.allTestCases[testCaseId];
          }
          this.loading = true;
          this.error = null;
          try {
            const testCase = await getTestCaseById(testCaseId);
            if (!testCase || !testCase.id) {
              throw new Error(`Сервер вернул некорректный тест-кейс или тест-кейс с ID ${testCaseId} не найден.`);
            }
            if (!this.testCasesByProject[testCase.project]) {
              this.testCasesByProject[testCase.project] = [];
            }
            const existingIndex = this.testCasesByProject[testCase.project].findIndex(tc => tc.id === testCase.id);
            if (existingIndex !== -1) {
              this.testCasesByProject[testCase.project][existingIndex] = testCase;
            } else {
              this.testCasesByProject[testCase.project].push(testCase);
            }
            this._saveOrUpdateInAllTestCases(testCase);
            return testCase;
          } catch (error) {
            this.error = error.message;
            console.error(`ProjectDataStore - fetchTestCaseById error (testCaseId: ${testCaseId}):`, error);
            return null;
          } finally {
            this.loading = false;
          }
        },

    async createTestCase(projectId, { name, description, steps }) {
      this.error = null;
      this.loading = true;
      try {
        const requestData = {
          testcaseName: name,
          testcaseDescription: description,
          steps: steps.map(step => ({
            step: step.step,
            resultStep: step.resultStep
          })),
        };
        const newTestCase = await createTestCaseInProject(projectId, requestData);
        if (!newTestCase || !newTestCase.id) {
          throw new Error('Сервер вернул некорректный тест-кейс или тест-кейс без ID.');
        }
        if (!this.testCasesByProject[projectId]) {
          this.testCasesByProject[projectId] = [];
        }
        this.testCasesByProject[projectId].push(newTestCase);
        this._saveOrUpdateInAllTestCases(newTestCase);
        return newTestCase;
      } catch (error) {
        this.error = error.message;
        console.error(`ProjectDataStore - createTestCase error (projectId: ${projectId}):`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async updateTestCase(projectId, testCaseId, editTestCaseData) {
      this.loading = true;
      this.error = null;
      try {
        const updatedTestCase = await updateTestCaseById(projectId, testCaseId, editTestCaseData);
        if (!updatedTestCase || !updatedTestCase.id) {
          console.log(1)
          throw new Error('Сервер вернул некорректный тест-кейс или тест-кейс без ID.');
        }
        console.log(2)
        // Обновляем хранилище
        if (!this.testCasesByProject[projectId]) {
          this.testCasesByProject[projectId] = [];
          console.log(3)
        }

        const index = this.testCasesByProject[projectId].findIndex(tc => tc.id === testCaseId);
        if (index !== -1) {
          console.log(4)
          this.testCasesByProject[projectId][index] = updatedTestCase;
        } else {
          console.log(5)
          this.testCasesByProject[projectId].push(updatedTestCase);
        }

        // Обновляем allTestCases
        this.allTestCases[updatedTestCase.id] = updatedTestCase;
        console.log(6)
        return updatedTestCase;
      } catch (error) {
        this.error = error.message;
        console.error(`ProjectDataStore - updateTestCase error (testCaseId: ${testCaseId}):`, error);
        return null;
      } finally {
        this.loading = false;
      }
    },


    async deleteTestCase(projectId, testCaseId) {
      this.error = null;
      this.loading = true;
      try {
        await deleteTestCaseById(testCaseId);
        if (this.testCasesByProject[projectId]) {
          this.testCasesByProject[projectId] = this.testCasesByProject[projectId].filter(
            (testCase) => testCase.id !== testCaseId
          );
          if (this.testCasesByProject[projectId].length === 0) {
            delete this.loadedTestCasesByProject[projectId]; // Сбрасываем флаг, если тест-кейсов нет
          }
        }
        delete this.allTestCases[testCaseId];
        return true;
      } catch (error) {
        this.error = error.message;
        console.error(`ProjectDataStore - deleteTestCase error testCaseId: ${testCaseId}:`, error);
        return false;
      } finally {
        this.loading = false;
      }
    },

    deleteTestCasesByProjectId(projectId) {
      try {
        if (!this.testCasesByProject[projectId]) {
          console.warn(`ProjectDataStore - deleteTestCasesByProjectId - Проект с ID ${projectId} не найден.`);
          return;
        }
        const projectTestCases = this.testCasesByProject[projectId];
        projectTestCases.forEach(testCase => {
          delete this.allTestCases[testCase.id];
        });
        delete this.testCasesByProject[projectId];
      } catch (error) {
        console.error(`ProjectDataStore - deleteTestCasesByProjectId - Ошибка при удалении:`, error);
      }
    },

    _saveOrUpdateInAllTestCases(testCase) {
      if (!testCase || !testCase.id) {
        console.error('ProjectDataStore - _saveOrUpdateInAllTestCases - Тест-кейс некорректный:', testCase);
        return;
      }
      this.allTestCases[testCase.id] = testCase;
    },
  },
});
