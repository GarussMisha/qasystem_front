// Импортируем функцию defineStore из Pinia
import { defineStore } from 'pinia';

// Импортируем функции для работы с API из файла api.js
import { getAllProjects, createProject, getProjectById, deleteProjectById } from '@/api/api';

// Создаём хранилище с именем 'project'
export const useProjectStore = defineStore('project', {
  // Определяем состояние (state) хранилища
  state: () => ({
    projects: [], // Список всех проектов
    loading: false, // Флаг загрузки (используется для индикации процесса загрузки)
    error: null, // Сообщение об ошибке (если что-то пошло не так)
  }),

  // Определяем геттеры (getters) для вычисляемых свойств
  getters: {
    // Геттер для получения количества проектов
    projectCount: (state) => state.projects.length,
  },

  // Определяем действия (actions) для изменения состояния
  actions: {
    // Действие для получения всех проектов с сервера
    async fetchProjects() {
      this.loading = true; // Устанавливаем флаг загрузки
      this.error = null; // Сбрасываем ошибку

      try {
        // Получаем список проектов с сервера
        this.projects = await getAllProjects();
      } catch (error) {
        // Если произошла ошибка, сохраняем её в состояние
        this.error = 'Ошибка при загрузке проектов.';
      } finally {
        // В любом случае снимаем флаг загрузки
        this.loading = false;
      }
    },

    // Действие для создания нового проекта
    async addProject(projectData) {
      try {
        // Отправляем данные нового проекта на сервер
        const newProject = await createProject(projectData);
        // Добавляем созданный проект в список проектов в хранилище
        this.projects.push(newProject);
      } catch (error) {
        // Если произошла ошибка, сохраняем её в состояние
        this.error = 'Ошибка при создании проекта.';
      }
    },

    // Действие для получения проекта по его id
    async getProject(id) {
      try {
        // Получаем проект с сервера по его id
        return await getProjectById(id);
      } catch (error) {
        // Если произошла ошибка, сохраняем её в состояние
        this.error = 'Ошибка при получении проекта.';
      }
    },

    // Действие для удаления проекта по его id
    async deleteProject(id) {
      try {
        // Удаляем проект на сервере по его id
        await deleteProjectById(id);
        // Удаляем проект из списка проектов в хранилище
        this.projects = this.projects.filter((project) => project.id !== id);
      } catch (error) {
        // Если произошла ошибка, сохраняем её в состояние
        this.error = 'Ошибка при удалении проекта.';
      }
    },
  },
});