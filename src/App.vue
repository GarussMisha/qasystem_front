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
body, html {
  margin: 0; /* Убираем отступы по умолчанию для body и html */
  padding: 0; /* Убираем отступы по умолчанию для body и html */
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2165aa;
}
</style>