<template>
  <div id="app">
    <HeadBar />
    <router-view />
  </div>
</template>

<script>
import HeadBar from '@/components/HeadBar.vue';

export default {
  name: 'App',
  components: {
    HeadBar, // Регестрируем HeadBar
  },
};
</script>

<style>
/* Подключение шрифта через Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');


/* Убираем отступы в проекте. */
body, html { 
  margin: 0; 
  padding: 0;
  font-family: 'Roboto', sans-serif; /* Устанавливаем шрифт по умолчанию */
  font-weight: 700;
}



#app {
  font-family: 'Roboto', sans-serif;
 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2165aa;
}
</style>