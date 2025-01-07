<template>
  <header class="project-list">
    <div class="project-header">
      <h1>Проекты</h1>
    </div>
    <!-- Индикация загрузки или ошибки -->
    <div v-if="loading">Загрузка проектов...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <!-- Кнопки создания и удаления -->
      <div class="button-container">
        <button @click="showCreateProjectModal = true" class="create-project-button">
          Создать проект
        </button>
        <button @click="showDeleteProjectModal = true" class="delete-project-button">
          Удалить проект
        </button>
      </div>
      <!-- Таблица проектов -->
      <div class="project-rows">
        <div
          class="project-row"
          v-for="project in projects"
          :key="project.id"
          @click="goToProjectDetail(project.id)"
        >
          <div class="project-content">
            <h3>{{ project.projectName }}</h3>
            <p>{{ truncateText(project.projectDescription, 100) }}</p>
          </div>
        </div>
      </div>
      <!-- Модальное окно создания проекта -->
      <CreateProjectModal
        v-if="showCreateProjectModal"
        @close="showCreateProjectModal = false"
        @create="handleCreateProject"
      />

      <!-- Модальное окно удаления проекта -->
      <DeleteProjectModal
        v-if="showDeleteProjectModal"
        @delete="handleDeleteProject"
        @close="showDeleteProjectModal = false"
      />
    </div>
  </header>
</template>

<script>
import CreateProjectModal from '@/components/CreateProjectModal.vue'; // Модальное окно для создания
import DeleteProjectModal from '@/components/DeleteProjectModal.vue'; // Модальное окно для удаления
import { useProjectStore } from '@/stores/ProjectStore';

export default {
  name: 'ProjectList',
  components: {
    CreateProjectModal,
    DeleteProjectModal,
  },
  data() {
    return {
      showCreateProjectModal: false,
      showDeleteProjectModal: false,
    };
  },
  computed: {
    // Берем наш store
    projectStore() {
      return useProjectStore();
    },
    // Извлекаем массив всех проектов
    projects() {
      return this.projectStore.allProjects;
    },
    loading() {
      return this.projectStore.loading;
    },
    error() {
      return this.projectStore.error;
    },
  },
  methods: {
    truncateText(text, length) {
      if (!text) return '';
      if (text.length > length) {
        let truncated = text.substr(0, length);
        if (truncated.lastIndexOf(' ') > 0) {
          truncated = truncated.substr(0, truncated.lastIndexOf(' '));
        }
        return truncated + '...';
      }
      return text;
    },
    // Загружаем проекты
    async fetchProjects() {
      await this.projectStore.loadAllProjects();
    },
    // Создаём проект (обработчик события из CreateProjectModal)
    async handleCreateProject(projectData) {
      await this.projectStore.createNewProject(projectData);
      this.showCreateProjectModal = false;
    },
    // Удаляем проект (обработчик события из DeleteProjectModal)
    async handleDeleteProject(projectId) {
      console.log('Deleting project with ID:', projectId);
      await this.projectStore.deleteProject(projectId);
      this.showDeleteProjectModal = false;
    },
    // Переходим на детальную страницу проекта
    goToProjectDetail(projectId) {
      this.$router.push({ name: 'ProjectDetail', params: { projectId: projectId } });
    },
  },
  async created() {
    // При загрузке компонента сразу тянем список проектов
    await this.fetchProjects();
  },
};
</script>

<style scoped>
/* Общие стили */
.project-list {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

/* Заголовок */
.project-header {
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #ddd;
}

.project-header h1 {
  font-size: 28px;
  margin: 0;
}

.project-header p {
  margin: 0;
  font-size: 14px;
  color: #666;
}

/* Список строк проектов */
.project-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

/* Строка проекта */
.project-row {
  padding: 15px 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.project-row:hover {
  background-color: #f1f1f1;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.project-content h3 {
  font-size: 16px;
  margin: 0 0 5px;
  color: #007bff;
  font-weight: 600;
}

.project-content p {
  margin: 0;
  font-size: 13px;
  color: #6c757d;
}

/* Разделитель между строками */
.project-row + .project-row {
  border-top: 1px solid #e9ecef;
}

/* Контейнер для кнопок */
.button-container {
  display: flex;
  justify-content: flex-end; /* Расположение кнопок справа */
  gap: 10px; /* Расстояние между кнопками */
  margin-top: 10px;
}

/* Базовые стили кнопок */
button {
  font-size: 12px; /* Сделаем кнопки меньше */
  font-weight: bold;
  padding: 5px 10px; /* Уменьшенный внутренний отступ */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* Кнопка "Создать проект" */
.create-project-button {
  background-color: #28a745;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-project-button:hover {
  background-color: #218838;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Кнопка "Удалить проект" */
.delete-project-button {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-project-button:hover {
  background-color: #c82333;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Адаптивность кнопок */
button:active {
  transform: translateY(2px);
}

</style>