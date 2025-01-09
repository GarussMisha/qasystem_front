<template>
  <header class="path-bar" v-if="showPathBar">
    <div class="path-text">
      <!-- Хлебные крошки -->
      <router-link
        v-if="breadcrumbParts.projects"
        :to="{ path: '/projects' }"
        class="breadcrumb-link"
        :class="{ active: isCurrentRoute('/projects') }"
        @click.prevent="navigateTo('/projects')"
      >
        Проекты
      </router-link>
      <span v-if="breadcrumbParts.projects && breadcrumbParts.projectName"> > </span>
      <router-link
        v-if="breadcrumbParts.projectName"
        :to="{ path: `/projects/${breadcrumbParts.projectId}` }"
        class="breadcrumb-link"
        :class="{ active: isCurrentRoute(`/projects/${breadcrumbParts.projectId}`) }"
        @click.prevent="navigateTo(`/projects/${breadcrumbParts.projectId}`)"
      >
        {{ breadcrumbParts.projectName }}
      </router-link>
      <span v-if="breadcrumbParts.projectName && breadcrumbParts.testCaseName"> > </span>
      <router-link
        v-if="breadcrumbParts.testCaseName"
        :to="{ path: `/projects/${breadcrumbParts.projectId}/testcase/${breadcrumbParts.testCaseId}` }"
        class="breadcrumb-link"
        :class="{ active: isCurrentRoute(`/projects/${breadcrumbParts.projectId}/testcase/${breadcrumbParts.testCaseId}`) }"
        @click.prevent="navigateTo(`/projects/${breadcrumbParts.projectId}/testcase/${breadcrumbParts.testCaseId}`)"
      >
        {{ breadcrumbParts.testCaseName }}
      </router-link>
    </div>
  </header>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/ProjectStore';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'PathBar',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const projectStore = useProjectStore();
    const testCaseStore = useProjectDataStore();

    // Вычисляемое свойство для projectName
    const projectName = computed(() => {
      const projectId = parseInt(route.params.projectId, 10);
      const project = projectStore.getProjectById(projectId);
      return project?.projectName || `Проект ${projectId}`;
    });

    // Вычисляемое свойство для testCaseName
    const testCaseName = computed(() => {
      const testCaseId = parseInt(route.params.testCaseId, 10);
      const testCase = testCaseStore.getTestCaseById(testCaseId);
      return testCase?.testcaseName || `Тест-кейс ${testCaseId}`;
    });

    // Отображение PathBar
    const showPathBar = computed(() => {
      const hiddenPaths = ['/', '/profile', '/info'];
      return !hiddenPaths.includes(route.path);
    });

    // Формирование хлебных крошек
    const breadcrumbParts = computed(() => {
      const parts = { projects: true };

      if (route.path.startsWith('/projects/') && route.params.projectId) {
        const projectId = route.params.projectId;
        parts.projectId = projectId;
        parts.projectName = projectName.value;
      }

      if (route.path.includes('/testcase/') && route.params.testCaseId) {
        const testCaseId = route.params.testCaseId;
        parts.testCaseId = testCaseId;
        parts.testCaseName = testCaseName.value;
      }

      return parts;
    });

    // Проверка текущего маршрута
    const isCurrentRoute = (path) => route.path === path;

    // Навигация по клику
    const navigateTo = (path) => {
      if (!isCurrentRoute(path)) {
        router.push(path);
      }
    };

    // Обновление данных при изменении маршрута
    const updateBreadcrumbs = async () => {
      const projectId = route.params.projectId;
      if (projectId) {
        await projectStore.fetchProjectById(parseInt(projectId, 10));
      }

      const testCaseId = route.params.testCaseId;
      if (testCaseId) {
        await testCaseStore.fetchTestCaseById(parseInt(testCaseId, 10));
      }
    };

    onMounted(updateBreadcrumbs);
    watch(() => route.path, updateBreadcrumbs);

    return {
      showPathBar,
      breadcrumbParts,
      isCurrentRoute,
      navigateTo,
    };
  },
};
</script>


<style scoped>
.path-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #292961;
  color: white;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 2px 4px rgb(255, 255, 255);
}

.path-text {
  display: flex;
  gap: 5px;
}

.breadcrumb-link {
  color: white;
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb-link.active {
  cursor: default;
  text-decoration: underline;
}
</style>
