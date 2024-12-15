<template>
  <div id="app">
    <HeadBar />
    <SideMenu @toggle="handleSideMenuToggle" />
    <div class="content" :style="{ marginLeft: contentMargiLeft }">
      <router-view />
    </div>
  </div>
</template>

<script>
import HeadBar from '@/components/HeadBar.vue';
import SideMenu from '@/components/SideMenu.vue'

export default {
  name: 'App',
  components: {
    HeadBar, // Регестрируем HeadBar
    SideMenu, // Регестрируем SideMenu
  },
  data() {
    return {
      isSideMenuExpanded: false
    };
  },
  computed: {
    contentMargiLeft() {
      return this.isSideMenuExpanded ? '200px' : '50px';
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

.content {
  transition: margin-left 0.5s ease; /* Плавное изменение отступа от SideMenu*/
}
</style>