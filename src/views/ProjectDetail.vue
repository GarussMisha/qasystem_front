<template>
  <div class="project-detail">
    <div v-if="loading">Загрузка проекта...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <div v-else>
      <h1>{{ project?.projectName }}</h1>
      <p>{{ project?.projectDescription }}</p>
      <button @click="showCreateTestCaseModal = true" class="create-testcase-button">Создать тест-кейс</button>
            <!-- Список тест-кейсов -->
      <div v-if="project?.testCases?.length > 0">
        
        <h2>Тест-кейсы</h2>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="testCase in project.testCases" :key="testCase.id">
              <td>{{ testCase.id }}</td>
              <td>{{ testCase.testcaseName }}</td>
              <td>{{ testCase.testcaseDescription }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else>
        <p>Тест-кейсы отсутствуют.</p>
      </div>
      <CreateTestCaseModal v-if="showCreateTestCaseModal" @close="showCreateTestCaseModal = false" @create="handleCreateTestCase" />

      <!-- Кнопка "Назад" -->
      <button @click="goBack" class="back-button">Назад</button>
    </div>
  </div>
</template>

<script>
import { useProjectStore } from '@/stores/AllProjectStore';
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router'; // Добавляем необходимые импорты
import CreateTestCaseModal from '@/components/CreateTestCaseModal.vue';


export default {
  name: 'ProjectDetail',
  components: {
    CreateTestCaseModal, // Регистрируем модальное окно
  },
  data() {
    return {
      showCreateTestCaseModal: false,
    //showDeleteTestCaseModal: false,
    };
  },
  setup() {
    const projectStore = useProjectStore();
    const route = useRoute();
    const router = useRouter();

    const projectId = route.params.id; // Получаем ID проекта из маршрута

    // Загружаем проект при монтировании
    const fetchProject = async () => {
      await projectStore.fetchProjectById(projectId);
    };

    const project = computed(() => projectStore.projects[projectId]);
    const loading = computed(() => projectStore.loading);
    const error = computed(() => projectStore.error);

    const goBack = () => {
      router.go(-1);
    };

    onMounted(fetchProject);

    return {
      project,
      loading,
      error,
      goBack,
      projectId, // Возвращаем projectId для доступа в methods
      projectStore,
    };
  },
  methods: {
    async handleCreateTestCase(testCaseData) {
      console.log(`id = ${this.projectId}`); // Доступ к projectId через this
      console.log(`testCaseData = ${testCaseData}`);
      await this.projectStore.addTestCaseToProject(this.projectId, testCaseData);
      this.showCreateTestCaseModal = false; // Закрываем модальное окно
    },

  },
};
</script>
  
  <style scoped>
  .project-detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
    color: #333;
  }
  
  .error-message {
    color: red;
    font-size: 14px;
  }
  
  .create-testcase-button {
    background-color: #28a745;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .create-testcase-button:hover {
    background-color: #218838;
  }
  
  .test-cases-list {
    margin-top: 20px;
    width: 100%;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    color: #333;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #ddd;
  }
  
  th {
    background-color: #f2f2f2;
  }
  
  .back-button {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
  }
  
  .back-button:hover {
    background-color: #5a6268;
  }
  </style>