// Заглушка

<template>
    <header class="project-list">
        <div class="project-text">
            <h1>Страница проектов</h1>
            <p>Здесь отображаются всё проекты</p>
        </div>
        <div v-if="loading">Загрузка проектов...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <div v-else>
          <ul>
            <li v-for="project in projects" :key="project.id">
              {{ project.name }}
            </li>
          </ul>
        </div>
    </header>
</template>

<script>
import { useProjectStore } from '@/stores/projectStore'; // Импортируем хранилище
export default {
    name: 'ProjectList',
    data() {
      return {
        projectStore: useProjectStore(), // Инициализируем хранилище
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
    },
    async created() {
      // Загружаем проекты при создании компонента
      await this.fetchProjects();
    }

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
}
</style>