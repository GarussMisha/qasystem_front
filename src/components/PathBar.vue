<template>
  <header class="path-bar">
    <div class="path-text">
      <!-- Простейший вариант: просто выводим строку "Home > projects > 25" -->
      <p>{{ breadcrumbString }}</p>
    </div>
  </header>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: 'PathBar',
  setup() {
    const route = useRoute();

    // Разбиваем путь на сегменты и делаем "Home > project > 25" и т.д.
    const breadcrumbString = computed(() => {
      if (!route.path) return '';
      const segments = route.path.split('/').filter(Boolean); 
      // Для пути "/projects/12/testcases" получим ["projects", "12", "testcases"]
      if (segments.length === 0) {
        return 'Home';
      }
      // Превращаем в "Home > projects > 12 > testcases"
      return 'Home > ' + segments.join(' > ');
    });

    return {
      breadcrumbString
    };
  },
};
</script>

<style scoped>
.path-bar {
  display: flex;
  align-items: center;
  padding: 5px 20px;
  background-color: #dddddd;
  color: #000000;
}
</style>
