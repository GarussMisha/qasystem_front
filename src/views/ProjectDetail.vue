<template>
  <header class="project-detail">
    <div class="project-header">
      <h1 class="project-name">{{ project?.projectName }}</h1>
      <p class="project-description">{{ project?.projectDescription || 'Описание отсутствует' }}</p>
    </div>

    <div v-if="loading">Загрузка данных проекта...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <div class="button-container">
        <button @click="showCreateTestCaseModal = true" class="create-testcase-button">
          Создать тест-кейс
        </button>
      </div>
      <div class="testcase-rows">
        <div class="testcase-row" v-for="testCase in testCases" :key="testCase.id">
          <div class="testcase-content">
            <h3>{{ testCase.testcaseName }}</h3>
            <p>{{ testCase.testcaseDescription }}</p>
          </div>
        </div>
        <p v-if="testCases.length === 0" class="no-testcases-message">
          Тест-кейсы отсутствуют
        </p>
      </div>

      <CreateTestCaseModal
        v-if="showCreateTestCaseModal"
        @close="showCreateTestCaseModal = false"
        @create="handleCreateTestCase"
      />
    </div>
  </header>
</template>

<script>
import CreateTestCaseModal from '@/components/CreateTestCaseModal.vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/ProjectStore';
// Важно: теперь импортируем то, что реально экспортируем из ProjectDataStore
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'ProjectDetail',
  components: {
    CreateTestCaseModal,
  },
  data() {
    return {
      projectId: null,
      project: null,
      testCases: [],
      loading: true,
      error: null,
      showCreateTestCaseModal: false,
    };
  },
  methods: {
    async fetchProjectData() {
      this.loading = true;
      this.error = null;

      try {
        // Берём store проектов
        const projectStore = useProjectStore();
        // Берём store тестовых данных
        const dataStore = useProjectDataStore();

        // 1) Загружаем проект
        await projectStore.fetchProjectById(this.projectId);
        this.project = projectStore.projects[this.projectId];

        // 2) Загружаем тест-кейсы (из dataStore)
        //    допустим, метод называется loadTestCasesByProjectId
        await dataStore.loadTestCasesByProjectId(this.projectId);

        // 3) Достаём массив тест-кейсов
        //    если у вас state = { testCasesByProject: { [projectId]: [ ... ] } }
        //    то:
        this.testCases = dataStore.testCasesByProject[this.projectId] || [];
      } catch (e) {
        this.error = 'Ошибка загрузки данных проекта';
        console.error(e);
      } finally {
        this.loading = false;
      }
    },

    async handleCreateTestCase(testCaseData) {
      try {
        const dataStore = useProjectDataStore();

        // Добавляем новый тест-кейс
        await dataStore.createTestCase(this.projectId, testCaseData);

        // Обновляем список тест-кейсов
        await dataStore.loadTestCasesByProjectId(this.projectId);
        this.testCases = dataStore.testCasesByProject[this.projectId] || [];

        // Закрываем модалку
        this.showCreateTestCaseModal = false;
      } catch (error) {
        console.error('Ошибка при создании тест-кейса:', error);
      }
    },
  },
  mounted() {
    const route = useRoute();
    this.projectId = route.params.id;
    this.fetchProjectData();
  },
};
</script>

<style scoped>
/* Общие стили страницы */
.project-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

/* Заголовок */
.project-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #292961;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.project-name {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.project-description {
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

/* Кнопки */
.button-container {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
}

button {
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-testcase-button {
  background-color: #28a745;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.create-testcase-button:hover {
  background-color: #218838;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* Список строк тест-кейсов */
.testcase-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 20px;
}

.testcase-row {
  padding: 15px 20px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease, transform 0.2s ease;
  cursor: pointer;
}

.testcase-row:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.testcase-content h3 {
  font-size: 16px;
  margin: 0 0 5px;
  color: #292961;
  font-weight: 600;
}

.testcase-content p {
  margin: 0;
  font-size: 14px;
  color: #555;
}

/* Сообщение об отсутствии тест-кейсов */
.no-testcases-message {
  text-align: center;
  font-size: 14px;
  color: #888;
  margin-top: 20px;
}
</style>