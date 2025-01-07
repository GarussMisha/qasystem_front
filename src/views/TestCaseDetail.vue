<template>
  <header class="testcase-detail">
    <div class="testcase-header">
      <h1 class="testcase-name">{{ testCase?.testcaseName || 'Название отсутствует' }}</h1>
      <p class="testcase-description">{{ testCase?.testcaseDescription || 'Описание отсутствует' }}</p>
    </div>

    <!-- Индикация загрузки или ошибки -->
    <div v-if="loading" class="loading">Загрузка данных тест-кейса...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <div class="testcase-info">
        <p><strong>Проект:</strong> {{ projectId }}</p>
        <p><strong>Тест-кейс ID:</strong> {{ testCaseId }}</p>
      </div>

      <!-- Кнопки действий -->
      <div class="button-container">
        <button class="edit-button">Редактировать</button>
        <button class="delete-button">Удалить</button>
        <button class="back-button" @click="goBack">Назад</button>
      </div>
    </div>
  </header>
</template>

<script>
import { useRoute } from 'vue-router';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'TestCaseDetail',
  data() {
    return {
      testCase: null,
      loading: true,
      error: null,
      projectId: null,
      testCaseId: null,
    };
  },
  methods: {
    async fetchTestCaseData() {
      this.loading = true;
      this.error = null;

      try {
        const projectDataStore = useProjectDataStore();
        this.testCase = projectDataStore.getTestCaseById(Number(this.testCaseId));

        if (!this.testCase) {
          this.error = 'Тест-кейс не найден.';
        }
      } catch (e) {
        this.error = 'Ошибка при загрузке данных тест-кейса.';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    goBack() {
      this.$router.push(`/projects/${this.projectId}`);
    },
  },
  mounted() {
    const route = useRoute();
    this.projectId = route.params.projectId;
    this.testCaseId = route.params.testCaseId;

    this.fetchTestCaseData();
  },
};
</script>

<style scoped>
/* Общие стили страницы */
.testcase-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

/* Заголовок */
.testcase-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #292961;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.testcase-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.testcase-description {
  font-size: 14px;
  color: #d0d0ff;
  margin: 0;
}

/* Ошибка */
.error-message {
  color: #dc3545;
  font-size: 14px;
  margin-top: 20px;
  text-align: center;
}

/* Информация о тест-кейсе */
.testcase-info {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.testcase-info p {
  font-size: 14px;
  margin: 10px 0;
}

/* Кнопки действий */
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

button {
  font-size: 12px;
  font-weight: bold;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-button {
  background-color: #007bff;
  color: white;
}

.edit-button:hover {
  background-color: #0056b3;
}

.delete-button {
  background-color: #dc3545;
  color: white;
}

.delete-button:hover {
  background-color: #c82333;
}

.back-button {
  background-color: #6c757d;
  color: white;
}

.back-button:hover {
  background-color: #5a6268;
}
</style>
