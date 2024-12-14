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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>