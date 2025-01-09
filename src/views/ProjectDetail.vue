<!-- ProjectDetail.vue -->
<template>
  <div class="page-container">
    <!-- Шапка с информацией о проекте -->
    <div class="page-header">
      <h1 class="page-title">
        {{ project?.projectName }}
        <span class="page-id">(id:{{ project?.id }})</span>
      </h1>
      <p class="page-description">{{ project?.projectDescription }}</p>

      <!-- Дата создания проекта -->
      <p class="page-created">
        Дата создания: 
        <span v-if="project?.dateOfCreated">
          {{ formatDate(project.dateOfCreated) }}
        </span>
        <span v-else>Неизвестно</span>
      </p>

      <!-- Блок кнопок (Редактировать/Удалить) -->
      <div class="page-actions">
        <button class="btn btn-edit" @click="editProject">Редактировать проект</button>
        <button class="btn btn-delete" @click="deleteProject">Удалить проект</button>
      </div>
    </div>

    <!-- Блок действий (справа) -->
    <div class="top-actions">
      <!-- Фильтр (заглушка) -->
      <div class="filter-dropdown">
        <select v-model="selectedFilter">
          <option value="">Фильтрация</option>
          <option value="filter1">Тест-кейсы созданные мной</option>
          <option value="filter1">Тест-кейсы назначенные на меня</option>
          <option value="filter2">Активные Тест-кейсы</option>
          <option value="filter3">Завершенные Тест-кейсы</option>
        </select>
      </div>

      <!-- Поле поиска (по имени или ID тест-кейса) -->
      <div class="search-area">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск тест-кейса"
        />
      </div>
      
      <!-- Кнопка создания тест-кейса -->
      <button class="btn btn-create" @click="createTestCase">
        Создать тест-кейс
      </button>
    </div>

    <!-- Контейнер для списка тест-кейсов -->
    <div class="list-container">
      <ul class="list">
        <li
          v-for="testcase in filteredTestCases"
          :key="testcase.id"
          class="list-item"
          @click="goToTestCaseDetail(testcase.id)"
        >
          <h2 class="item-title">
            {{ testcase.testcaseName }}
            <span class="item-id">(id:{{ testcase.id }})</span>
          </h2>
          <p class="item-desc">
            <span v-if="testcase.testcaseDescription">
              {{ testcase.testcaseDescription }}
            </span>
            <span v-else>Нет описания</span>
          </p>
        </li>
      </ul>
    </div>

    <!-- Модальные окна -->
    <DeleteProjectModal
      v-if="showDeleteModal"
      :projectId="project.id"
      :projectName="project.projectName"
      @close="showDeleteModal = false"
      @deleted="handleProjectDeleted"
    />

    <EditProjectModal
      v-if="showEditModal"
      :projectId="project.id"
      :currentName="project.projectName"
      :currentDescription="project.projectDescription"
      @close="showEditModal = false"
      @edited="handleProjectEdited"
    />

    <CreateTestCaseModal
      v-if="showCreateTestCaseModal"
      :projectId="project.id"
      @close="showCreateTestCaseModal = false"
    />

        <!-- Кнопка назад -->
    <div class="bottom-actions">
      <button class="btn btn-back" @click="goBack">Назад</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/ProjectStore';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

import DeleteProjectModal from '@/components/modal/project/DeleteProjectModal.vue';
import EditProjectModal from '@/components/modal/project/EditProjectModal.vue';
import CreateTestCaseModal from '@/components/modal/testCase/CreateTestCaseModal.vue';

export default {
  name: 'ProjectDetail',
  components: {
    DeleteProjectModal,
    EditProjectModal,
    CreateTestCaseModal,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const projectStore = useProjectStore();
    const projectDataStore = useProjectDataStore();

    const project = ref(null);
    const loading = ref(false);
    const error = ref(null);

    const selectedFilter = ref('');
    const searchQuery = ref('');

    // Флаги для отображения модальных окон
    const showDeleteModal = ref(false);
    const showEditModal = ref(false);
    const showCreateTestCaseModal = ref(false);

    // Получаем projectId из параметров URL
    const projectId = Number(route.params.projectId);

    // Загружаем данные при монтировании
    onMounted(async () => {
      loading.value = true;
      error.value = null;
      try {
        // 1) Загружаем/получаем из store сам проект
        await projectStore.fetchProjectById(projectId);
        project.value = projectStore.getProjectById(projectId);

        // 2) Загружаем тест-кейсы проекта
        await projectDataStore.loadTestCasesByProjectId(projectId);
      } catch (err) {
        error.value = err.message || 'Ошибка при загрузке проекта или тест-кейсов';
        console.error('ProjectDetail - onMounted error:', err);
      } finally {
        loading.value = false;
      }
    });

    // Список всех тест-кейсов для данного проекта
    const testCasesForProject = computed(() => {
      return projectDataStore.testCasesForProject(projectId);
    });

    // Поиск по имени или ID тест-кейса
    const filteredTestCases = computed(() => {
      if (!searchQuery.value.trim()) {
        return testCasesForProject.value;
      }
      const query = searchQuery.value.toLowerCase();
      return testCasesForProject.value.filter((testcase) => {
        const matchName = testcase.testcaseName?.toLowerCase().includes(query);
        const matchId = String(testcase.id).includes(query);
        return matchName || matchId;
      });
    });

    // Действия пользователя
    const formatDate = (dateString) => {
      // Простейший формат (YYYY-MM-DD или локальный):
      if (!dateString) return '';
      return new Date(dateString).toLocaleString();
    };

    const editProject = () => {
      showEditModal.value = true;
    };

    const deleteProject = () => {
      showDeleteModal.value = true;
    };

    const createTestCase = () => {
      showCreateTestCaseModal.value = true;
    };

    const handleProjectDeleted = () => {
      // После успешного удаления проекта перенаправляем на страницу со списком проектов
      router.push('/projects');
    };

    const handleProjectEdited = (updatedProject) => {
      // Обновляем локальное состояние 'project' с обновлёнными данными
      project.value = updatedProject;
      // Если необходимо, можно также обновить тест-кейсы или другие связанные данные
      // Например:
      // projectDataStore.loadTestCasesByProjectId(projectId);
    };

    const goToTestCaseDetail = (testCaseId) => {
      router.push({
        name: 'TestCaseDetail',
        params: { projectId, testCaseId },
      });
    };

    const goBack = () => {
      router.push('/projects');
    };

    return {
      project,
      loading,
      error,
      selectedFilter,
      searchQuery,
      filteredTestCases,
      formatDate,

      // Флаги модальных окон
      showDeleteModal,
      showEditModal,
      showCreateTestCaseModal,

      // Методы
      editProject,
      deleteProject,
      createTestCase,
      handleProjectDeleted,
      handleProjectEdited,
      goToTestCaseDetail,
      goBack,
    };
  },
};
</script>

