import { defineStore } from 'pinia';
import {
        // Методы для тест-кейсов:
        getAllTestCases,
        getTestCaseById,
        createTestCaseInProject,
        getAllTestCaseByProjectId,
        updateTestCaseById,
        deleteTestCaseById,
        
        // TODO: методы для будущих объектов (чек-листы, статусы и др.)
        // createChecklistInProject,
        // getChecklistByProjectId,
        // updateChecklist,
        // ...
      } from '@/api/api';

export const useProjectDataStore = defineStore('projectDataStore', {
    state: () => ({
      // Тест-кейсы можно хранить как глобально, так и по проектам:
      // Например, объект вида { [projectId]: [testCase1, testCase2, ...] }:
      testCasesByProject: {},
      allTestCases: [],

      // В будущем можно добавить другие коллекции (чек-листы, статусы, шаги):
      // checklistsByProject: {},
      // stepsByTestCase: {},
      loading: false,
      error: null,
    }),
  
    getters: {
      // Пример геттера: получить тест-кейсы конкретного проекта
      testCasesForProject: (state) => (projectId) => {
        return state.testCasesByProject[projectId] || [];
      },
  
      // Если нужно подсчитать общее количество тест-кейсов по проекту
      testCaseCountForProject: (state) => (projectId) => {
        const list = state.testCasesByProject[projectId];
        return list ? list.length : 0;
      },
      
      getTestCaseById: (state) => (testCaseId) => {
        console.log(`ProjectDataStore - getTestCaseById - Ищем тест-кейс ${testCaseId}`)
        // Ищем в allTestCases
        const testCase = state.allTestCases.find(tc => tc.id === testCaseId);
        if (testCase) return testCase;
      
        // Если в allTestCases не нашли, ищем по проектам
        for (const projectId in state.testCasesByProject) {
          const projectTestCases = state.testCasesByProject[projectId];
          const testCaseInProject = projectTestCases.find(tc => tc.id === testCaseId);
          if (testCaseInProject) return testCaseInProject;
        }
        
        // Если не найдено, возвращаем null
        return null;
      },
      // TODO: геттеры для будущих объектов
      // checklistsForProject: (state) => (projectId) => {
      //   return state.checklistsByProject[projectId] || [];
      // },
    },
  
    actions: {
        /**
         * Загрузить все тест-кейсы (глобально)
         * (Если понадобится — например, страница со всеми тест-кейсами в системе)
         */
        async loadAllTestCases() {
            this.loading = true;
            this.error = null;
            try {
              const allTestCases = await getAllTestCases();
              this.allTestCases = allTestCases;
            } catch (error) {
              this.error = error.message;
              console.error('TestDataStore - loadAllTestCases error:', error);
            } finally {
              this.loading = false;
            }
        },
    
        /**
         * Загрузить тест-кейсы по ID проекта
         */
        async loadTestCasesByProjectId(projectId) {
            this.loading = true;
            this.error = null;
            try {
              const testCases = await getAllTestCaseByProjectId(projectId);
              this.testCasesByProject[projectId] = testCases;
            } catch (error) {
              this.error = error.message;
              console.error(`TestDataStore - loadTestCasesByProjectId error (projectId: ${projectId}):`, error);
            } finally {
              this.loading = false;
            }
        },
    
        /**
         * Загрузить один тест-кейс по его ID (не всегда нужно, но на всякий случай)
         */
        async fetchTestCaseById(testCaseId) {
            this.loading = true;
            this.error = null;
            try {
              const testCase = await getTestCaseById(testCaseId);
              console.log(`ProjectDataStore - fetchTestCaseById - Дописать загрузку тест кейса testCaseId = ${testCaseId} testCase = ${testCase}`)
            // Если нужно сохранить его «точечно»
            // Но нужно знать projectId, чтобы положить куда-то конкретно
            // Если бэкенд возвращает testCase.projectId:
            // const pId = testCase.projectId;
            // if (!this.testCasesByProject[pId]) {
            //   this.testCasesByProject[pId] = [];
            // }
            // Находим индекс, если нужно обновить
            // или добавляем / вставляем
            } catch (error) {
              this.error = error.message;
              console.error(`TestDataStore - fetchTestCaseById error (testCaseId: ${testCaseId}):`, error);
            } finally {
              this.loading = false;
            }
        },
    
        /**
         * Создать тест-кейс в конкретном проекте
         */
        async createTestCase(projectId, testCaseData) {
            console.log(`createTestCase - testCaseData = ${testCaseData}`)
            this.error = null;
            try {
              const newTestCase = await createTestCaseInProject(projectId, testCaseData);
              if (!this.testCasesByProject[projectId]) {
                  this.testCasesByProject[projectId] = [];
              }
              this.testCasesByProject[projectId].push(newTestCase);
            } catch (error) {
              this.error = error.message;
              console.error(`TestDataStore - createTestCase error (projectId: ${projectId}):`, error);
            }
        },
    
        /**
         * Обновить (редактировать) тест-кейс в проекте
         */
        async updateTestCase(projectId, testCaseId, editTestCaseData) {
            this.error = null;
            try {
                const updatedTestCase = await updateTestCaseById(projectId, testCaseId, editTestCaseData);
                // Обновим в state
                const arr = this.testCasesByProject[projectId] || [];
                const index = arr.findIndex((tc) => tc.id === testCaseId);
                if (index !== -1) {
                    arr[index] = updatedTestCase;
                }
            } catch (error) {
              this.error = error.message;
              console.error(
                  `TestDataStore - updateTestCase error (projectId: ${projectId}, testCaseId: ${testCaseId}):`,
                  error
            );
            }
        },

        async deleteTestCase(projectId, testCaseId) {
            console.log(`ProjectDataStore - deleteTestCase = ${testCaseId}`)
            this.error = null
            try {
                await deleteTestCaseById(testCaseId);
                if (this.testCasesByProject[projectId]) {
                    this.testCasesByProject[projectId] = this.testCasesByProject[projectId].filter(
                      (testCase) => testCase.id !== testCaseId
                    );
                  }
              
                  // Удаляем тест-кейс из allTestCases
                  this.allTestCases = this.allTestCases.filter(
                    (testCase) => testCase.id !== testCaseId
                  );
                  console.log(`Тест-кейс с ID ${testCaseId} успешно удалён из проекта ${projectId}`);
            } catch (error) {
                this.error = error.message;
                console.error(`ProjectDataStore  - deleteTestCase error testCaseId: ${testCaseId}:`,error);
            }
        },
        /**
         * Вспомогательный метод: добавляет или обновляет тест-кейс в allTestCases
         * (чтобы не дублировать логику в каждом экшене)
         */
        _saveOrUpdateInAllTestCases(testCase) {
            const idx = this.allTestCases.findIndex(tc => tc.id === testCase.id);
            if (idx === -1) {
            // Не нашли — добавляем
              this.allTestCases.push(testCase);
            } else {
            // Нашли — обновляем
              this.allTestCases[idx] = testCase;
            }
        },
        
        /**
         * TODO: Методы для будущих сущностей (чек-листы, статусы, шаги и т.д.)
         * async loadChecklists(projectId) { ... }
         * async createChecklist(projectId, checklistData) { ... }
         * etc.
         */
    },
});