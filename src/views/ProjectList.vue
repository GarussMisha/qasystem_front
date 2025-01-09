<!-- ProjectList.vue -->
<template>
  <div class="page-container">
    <!-- Заголовок страницы в прямоугольнике -->
    <div class="page-header">
      <h1 class="page-title">
        Список проектов
        <span class="page-id"></span>
      </h1>
    </div>

    <!-- Блок действий (справа) -->
    <div class="top-actions">
      <!-- Фильтр (заглушка) -->
      <div class="filter-dropdown">
        <select v-model="selectedFilter">
          <option value="">Фильтрация</option>
          <option value="filter1">Проекты созданные мной</option>
          <option value="filter2">Активные проекты</option>
          <option value="filter3">Завершенные проекты</option>
        </select>
      </div>

      <!-- Поле поиска (по имени или ID) -->
      <div class="search-area">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Поиск проекта"
        />
      </div>

      <!-- Кнопка создания проекта -->
      <button class="btn btn-create" @click="showCreateProjectModal = true">
        Создать проект
      </button>
    </div>
    



    <!-- Контейнер для списка проектов (с закруглёнными краями) -->
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

    <!-- Модальное окно создания проекта (условно) -->
    <CreateProjectModal
      v-if="showCreateProjectModal"
      @close="showCreateProjectModal = false"
    />

    <!-- Кнопка назад -->
    <div class="bottom-actions">
      <button class="btn btn-back" @click="goBack">Назад</button>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/ProjectStore';
import CreateProjectModal from '@/components/modal/project/CreateProjectModal.vue';

export default {
  name: 'ProjectList',
  components: {
    CreateProjectModal,
  },
  setup() {
    const router = useRouter();
    const projectStore = useProjectStore();

    const showCreateProjectModal = ref(false);
    const selectedFilter = ref('');
    const searchQuery = ref('');

    // При заходе на страницу загружаем все проекты (forceRefresh = true),
    // чтобы получить актуальные данные.
    onMounted(async () => {
      await projectStore.loadAllProjects(true);
    });

    // Фильтрация: только по имени или по ID
    const filteredProjects = computed(() => {
      const query = searchQuery.value.trim().toLowerCase();
      if (!query) {
        return projectStore.allProjects;
      }
      return projectStore.allProjects.filter((project) => {
        const matchName = project.projectName?.toLowerCase().includes(query);
        const matchId = String(project.id).includes(query);
        return matchName || matchId;
      });
    });

    // Переход на детальную страницу проекта
    const goToProjectDetail = (projectId) => {
      router.push({ name: 'ProjectDetail', params: { projectId } });
    };

    // Возврат на главную
    const goBack = () => {
      router.push('/');
    };

    return {
      showCreateProjectModal,
      selectedFilter,
      searchQuery,
      filteredProjects,
      goToProjectDetail,
      goBack,
    };
  },
};
</script>


