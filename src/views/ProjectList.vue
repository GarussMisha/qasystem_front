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
      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="project in projects" :key="project.id" @click="goToProjectDetail(project.id)">
              <td>{{ project.id }}</td>
              <td :title="project.projectName">{{ truncateText(project.projectName, 30) }}</td>
              <td :title="project.projectDescription">{{ truncateText(project.projectDescription, 30) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Модальное окно -->
      <CreateProjectModal v-if="showModal" @close="showModal = false" @create="handleCreateProject" />
    </div>
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
    truncateText(text, length) {
      if (text.length > length) {
        let truncated = text.substr(0, length);
        if (truncated.lastIndexOf(' ') > 0) {
          truncated = truncated.substr(0, truncated.lastIndexOf(' '));
        }
        return truncated + '...';
      }
      return text;
    },
    // Метод для загрузки проектов
    async fetchProjects() {
      await this.projectStore.fetchProjects();
    },
    // Метод для создания проекта
    async handleCreateProject(projectData) {
      await this.projectStore.addProject(projectData);
      this.showModal = false; // Закрываем модальное окно
    },
    goToProjectDetail(projectId) {
      console.log({projectId})
      this.$router.push({ name: 'ProjectDetail', params: { id: projectId}});
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

.table-container {
  width: 100%;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: rgb(255, 255, 255);
  color: #000000;
  box-shadow: 2 20px 50px rgb(255, 255, 255);
}

th {
  padding: 5px;
  text-align: left;
  background-color: #23005a;
  color: white;
  font-weight: bold;
}

th:hover {
  background-color: #2e0077;
}

td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #000000;
}

tr {
  cursor: pointer; /* Делаем курсор рукой при наведении */
}

tr:hover {
  background-color: #e9e9e9;
}
</style>