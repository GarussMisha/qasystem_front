<template>
  <div class="debug-page">
    <div class="debug-container">
      <div class="info">
        <h2>На этой странице проверяется функциональность запросов к бэкенду.</h2>
        <button @click="fetchProjects" class="fetch-button">
          Загрузить проекты
        </button>
        <p v-if="loading">Загрузка...</p>
        <p v-if="error" class="error-message">{{ error }}</p>
      </div>

      <div class="list-container">
        <ul class="list">
          <li
            v-for="project in filteredProjects"
            :key="project.id"
            class="list-item"
            @click="goToProjectDetail(project.id)"
          >
            <h2 class="item-title">
              {{ project.projectName }}
              <span class="item-id">(id:{{ project.id }})</span>
            </h2>
            <p class="item-desc">{{ project.projectDescription }}</p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import projectApi from '@/api/project.api'; // Импортируем API

export default {
  name: 'DebugPage',
  data() {
    return {
      projects: [],       // Здесь будут храниться проекты
      loading: false,     // Флаг загрузки
      error: null        // Сообщение об ошибке
    };
  },
  computed: {
    // Если нужна фильтрация проектов
    filteredProjects() {
      return this.projects;
    }
  },
  methods: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      
      try {
        // Вызываем метод getAll из project.api.js
        this.projects = await projectApi.getAll();
      } catch (err) {
        this.error = `Ошибка при загрузке проектов: ${err.message}`;
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
    
    goToProjectDetail(id) {
      // Ваш метод для перехода к деталям проекта
      console.log('Переход к проекту с ID:', id);
    }
  }
};
</script>

<style scoped>
.debug-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  padding: 40px;
  box-sizing: border-box;
}

.debug-container {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
}

.info {
  flex: 0 0 40%;
  background-color: #9e9e9e;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  height: 80vh;
}

.fetch-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-size: 16px;
}

.fetch-button:hover {
  background-color: #45a049;
}

.error-message {
  color: #ff6b6b;
  margin-top: 10px;
}

.list-container {
  flex: 1;
}

.list {
  list-style: none;
  padding: 0;
}

.list-item {
  background-color: #f5f5f5;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.list-item:hover {
  background-color: #e0e0e0;
}

.item-title {
  margin: 0 0 5px 0;
  color: #333;
}

.item-id {
  color: #666;
  font-size: 14px;
}

.item-desc {
  margin: 0;
  color: #666;
}
</style>