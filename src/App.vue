<template>
  <div id="app">
    <SideMenu @toggle="handleSideMenuToggle" />
    <div class="content" :style="{ marginLeft: contentMargiLeft }">
      <div class="path-bar-wrapper">
        <PathBar />
      </div>
      <router-view />
    </div>
  </div>
</template>


<script>
import SideMenu from '@/components/SideMenu.vue';
import PathBar from '@/components/PathBar.vue';

export default {
  name: 'App',
  components: {
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

body, html { 
  margin: 0; 
  padding: 0;
  font-family: 'Roboto', sans-serif;
  height: 100%; /* Убедимся, что html и body занимают всю высоту */
}

.path-bar-wrapper {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #f5f5f5;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}



#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2165aa;
}

.content {
  transition: margin-left 0.4s ease;
  padding-top: var(--header-height);
}

::-webkit-scrollbar {
  width: 8px;               /* ширина полосы */
  background-color: transparent; /* цвет фона за полосой */
}

/* Фон «дорожки» (track) */
::-webkit-scrollbar-track {
  background: #d8d8d8e2;      /* светлый фон дорожки */
  border-radius: 4px;
}

/* Сам «ползунок» (thumb) */
::-webkit-scrollbar-thumb {
  background-color: #b9b2f8ec; /* цвет ползунка */
  border-radius: 22px;        /* скруглённые углы */
  border: 4px solid transparent; /* добавляем небольшую «рамку» */
}

/* При наведении на ползунок */
::-webkit-scrollbar-thumb:hover {
  background-color: #a19ae0ec; /* чуть темнее при hover */
}
</style>