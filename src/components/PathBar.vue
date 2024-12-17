<template>
  <header class="path-bar">
    <div class="path-text">
      <p>{{ path }}</p>
    </div>
  </header>
</template>

<script>
//import { useProjectStore } from '@/stores/projectStore'; // Импортируем хранилище проектов

export default {
  name: 'PathBar',
  data() {
    return {
      path: '', // Здесь будет храниться текущий путь
    };
  },
};
</script>

<style scoped>
.path-bar {
  display: flex;
  height: 20px;
  align-items: center;
  padding: 5px 20px;
  background-color: #dddddd;
  color: rgb(0, 0, 0);
}
</style>