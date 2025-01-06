<template>
  <header class="path-bar">
    <div class="path-text">
      <p>{{ breadcrumbString }}</p>
    </div>
  </header>
</template>

<script>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/ProjectStore';

export default {
  name: 'PathBar',
  setup() {
    const route = useRoute();
    const projectStore = useProjectStore(); // Хранилище для работы с проектами
    const breadcrumbs = ref([]);

    // Обновляем хлебные крошки при изменении маршрута
    const updateBreadcrumbs = async () => {
      const segments = route.path.split('/').filter(Boolean); // Разбиваем путь на сегменты
      const breadcrumbParts = [];

      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];

        // Если сегмент — это ID проекта, пытаемся заменить его на имя проекта
        if (!isNaN(segment)) {
          const projectId = parseInt(segment, 10);
          let project = projectStore.getProjectById(projectId); // Проверяем в локальном хранилище

          // Если проекта нет в локальном хранилище, загружаем его из API
          if (!project) {
            await projectStore.fetchProjectById(projectId); // Предполагается, что метод fetchProjectById есть в store
            project = projectStore.getProjectById(projectId);
          }

          breadcrumbParts.push(project?.projectName || `Проект ${projectId}`);
        } else {
          // Если сегмент не ID, оставляем его как есть
          breadcrumbParts.push(segment.charAt(0).toUpperCase() + segment.slice(1));
        }
      }

      breadcrumbs.value = ['Home', ...breadcrumbParts];
    };

    // Обновляем хлебные крошки при изменении маршрута
    watch(() => route.path, updateBreadcrumbs, { immediate: true });

    const breadcrumbString = computed(() => breadcrumbs.value.join(' > '));

    return {
      breadcrumbString,
    };
  },
};
</script>

<style scoped>
.path-bar {
  display: flex;
  align-items: center;
  padding: 10px 20px;
  background-color: #292961; /* Темно-синий фон */
  color: white;
  font-size: 14px;
  font-weight: bold;

  box-shadow: 0 2px 4px rgb(255, 255, 255);
}

.path-text p {
  margin: 0;
}

.path-text {
  display: flex;
  gap: 5px;
}
</style>