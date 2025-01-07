<template>
  <header class="project-detail">
    <div class="project-header">
      <h1 class="project-name">{{ project?.projectName }}</h1>
      <p class="project-description">{{ project?.projectDescription || 'Описание отсутствует' }}</p>
    </div>
    <!-- Индикация загрузки или ошибки -->
    <div v-if="loading">Загрузка данных проекта...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <!-- Кнопки создания и удаления -->
      <div class="button-container">
        <button @click="showCreateTestCaseModal = true" class="create-testcase-button">
          Создать тест-кейс
        </button>
        <button @click="showDeleteTestCaseModal = true" class="delete-testcase-button">
          Удалить тест-кейс
        </button>
      </div>
      <!-- Таблица проектов -->
       <div class="testcase-rows">
        <div class="testcase-row" v-for="testCase in testCases" :key="testCase.id" @click="goToTestCaseDetail(projectId, testCase.id)">
          <div class="testcase-content">
            <h3>{{ testCase.testcaseName }}</h3>
            <p>{{ testCase.testcaseDescription }}</p>
          </div>
        </div>
       </div>
       <div>
        <button class="back-button" @click="goBack">Назад</button>
       </div>
      <!-- Модальное окно создания тест-кейса -->
      <CreateTestCaseModal
        v-if="showCreateTestCaseModal"
        @close="showCreateTestCaseModal = false"
        @create="handleCreateTestCase"
      />

      <!-- Модальное окно удаления тест-кейса -->
      <DeleteTestCaseModal
        v-if="showDeleteTestCaseModal"
        :projectId="projectId"
        @close="showDeleteTestCaseModal = false"
        @delete="handleDeleteTestCase"
      />
    </div>
  </header>
</template>

<script>
import CreateTestCaseModal from '@/components/CreateTestCaseModal.vue';
import DeleteTestCaseModal from '@/components/DeleteTestCaseModal.vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/ProjectStore';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'ProjectDetail',
  components: {
    CreateTestCaseModal,
    DeleteTestCaseModal,
  },
  data() {
    return {
      projectId: null,
      project: null,
      testCases: [],
      loading: true,
      error: null,
      showCreateTestCaseModal: false,
      showDeleteTestCaseModal: false,
    };
  },
  methods: {
    async fetchProjectData() {
      this.loading = true;
      this.error = null;

      try {
        const projectStore = useProjectStore();
        const dataStore = useProjectDataStore();

        // Загружаем проект
        await projectStore.fetchProjectById(this.projectId);
        this.project = projectStore.projects[this.projectId];

        // Загружаем тест-кейсы
        await dataStore.loadTestCasesByProjectId(this.projectId);
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

    async handleDeleteTestCase(testCaseId) {
      try {
        const dataStore = useProjectDataStore();
        console.log(`Попытка удалить this.projectId = ${this.projectId} testCaseId = ${testCaseId}`)
        // Удаляем тест-кейс
        await dataStore.deleteTestCase(this.projectId, testCaseId);

        // Обновляем список тест-кейсов
        await dataStore.loadTestCasesByProjectId(this.projectId);
        this.testCases = dataStore.testCasesByProject[this.projectId] || [];

        // Закрываем модалку
        this.showDeleteTestCaseModal = false;
      } catch (error) {
        console.error('Ошибка при удалении тест-кейса:', error);
      }
    },
    goToTestCaseDetail(projectId, testCaseId) {
      console.log(`goToTestCaseDetail - projectId = ${projectId}, testCaseId = ${testCaseId}`)
      this.$router.push({ name: 'TestCaseDetail', params: { projectId: projectId, testCaseId: testCaseId} });
    },
    goBack() {
      this.$router.push(`/projects`);
    },
  },
  mounted() {
    const route = useRoute();
    this.projectId = route.params.projectId;
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

.delete-testcase-button {
  background-color: #dc3545;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.delete-testcase-button:hover {
  background-color: #c82333;
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
.back-button {
  background-color: #6c757d;
  color: white;
}

.back-button:hover {
  background-color: #5a6268;
}
</style>