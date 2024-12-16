<template>
  <header class="project-list">
    <div class="project-text">
      <h1>Страница проектов</h1>
      <p>Здесь отображаются все проекты</p>
    </div>
    <div v-if="loading">Загрузка проектов...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <button @click="showModal = true" class="create-project-button">Создать проект</button>
      <ul>
        <li v-for="project in projects" :key="project.id">
          <strong>ID:</strong> {{ project.id }} | <strong>Название:</strong> {{ project.projectName }}
        </li>
      </ul>
    </div>
    <!-- Модальное окно -->
    <CreateProjectModal v-if="showModal" @close="showModal = false" @create="handleCreateProject" />
  </header>
</template>

<script>
import { useProjectStore } from '@/stores/projectStore'; // Импортируем хранилище
import CreateProjectModal from '@/components/CreateProjectModal.vue'; // Импортируем модальное окно

export default {
  name: 'ProjectList',
  components: {
    CreateProjectModal, // Регистрируем модальное окно
  },
  data() {
    return {
      projectStore: useProjectStore(), // Инициализируем хранилище
      showModal: false, // Флаг для отображения модального окна
    };
  },
  computed: {
    projects() {
      return this.projectStore.projects;
    },
    loading() {
      return this.projectStore.loading;
    },
    error() {
      return this.projectStore.error;
    },
  },
  methods: {
    // Метод для загрузки проектов
    async fetchProjects() {
      await this.projectStore.fetchProjects();
    },
    // Метод для создания проекта
    async handleCreateProject(projectData) {
      await this.projectStore.addProject(projectData);
      this.showModal = false; // Закрываем модальное окно
    },
  },
  async created() {
    // Загружаем проекты при создании компонента
    await this.fetchProjects();
  },
};
</script>

<style scoped>
.project-list {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  background-color: #9e9e9e;
  color: white;
}

.error-message {
  color: red;
  font-size: 14px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  background-color: #fff;
  color: #333;
  padding: 10px;
  margin: 5px 0;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 300px; /* Устанавливаем ширину для списка */
}

li strong {
  margin-right: 5px; /* Добавляем отступ между текстом и ID/названием */
}

.create-project-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.create-project-button:hover {
  background-color: #218838;
}
</style>