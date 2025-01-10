<template>
  <div id="app">
    <HeadBar />
    <SideMenu @toggle="handleSideMenuToggle" />
    <div class="content" :style="{ marginLeft: contentMargiLeft }">
      <PathBar />
      <router-view />
    </div>
  </div>
</template>

<script>
import HeadBar from '@/components/HeadBar.vue';
import SideMenu from '@/components/SideMenu.vue';
import PathBar from '@/components/PathBar.vue';

export default {
  name: 'App',
  components: {
    HeadBar,
    SideMenu,
    PathBar,
  },
  data() {
    return {
      isSideMenuExpanded: false
    };
  },
  computed: {
    contentMargiLeft() {
      return this.isSideMenuExpanded ? '200px' : '40px';
    }
  },
  methods: {
    handleSideMenuToggle(isExpanded) {
      this.isSideMenuExpanded = isExpanded;
    }
  }
};
</script>

<style>
/* Подключение шрифта через Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap');

body, html { 
  margin: 0; 
  padding: 0;
  font-family: 'Roboto', sans-serif;
  height: 100%; /* Убедимся, что html и body занимают всю высоту */
}

:root {
  --header-height: 60px;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2165aa;
}

.content {
  transition: margin-left 0.5s ease;
  padding-top: var(--header-height);
}
</style>