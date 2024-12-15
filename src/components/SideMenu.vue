<template>
    <div class="side-menu" :class="{ 'side-menu-expanded': isExpanded }">
      <!-- Кнопка для раскрытия/скрытия меню -->
      <button class="toggle-button" @click="toggleMenu">
        {{ isExpanded ? '<<' : '>>' }}
      </button>
  
      <!-- Кнопки меню -->
      <div class="menu-buttons">
        <button @click="goToInfo" :style="{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.4s ease' }">Информация</button>
        <button @click="goToProfile" :style="{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.4s ease' }">Профиль</button>
        <button @click="goToProjectList" :style="{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.4s ease' }">Проекты</button>
    </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'SideMenu',
    data() {
      return {
        isExpanded: false
      };
    },
    methods: {
      toggleMenu() {
        this.isExpanded = !this.isExpanded;
        this.$emit('toggle', this.isExpanded);
      },
      goToInfo() {
        this.$router.push({ name: 'InfoPage' });
      },
      goToProfile() {
        this.$router.push({ name: 'ProfilePage' });
      },
      goToProjectList() {
        this.$router.push({ name: 'ProjectList' });
      },
    }
  };
  </script>
  
  <style scoped>
  /* Основной стиль меню */
  .side-menu {
    position: fixed;
    top: 60spx; /* Отступ от HeadBar */
    left: 0;
    height: calc(100vh - 60px); /* Высота меню минус высота HeadBar */
    width: 50px; /* Свернутое состояние: ширина 50px */
    background-color: #ffffff;
    color: white;
    transition: width 0.5s ease; /* Плавное изменение ширины */
    overflow: hidden; /* Скрываем содержимое, если меню свернуто */
    z-index: 1; /* Убедитесь, что меню находится поверх других элементов */
    border-right: 0.6px solid #23005a; /* Цвет и толщина полосы */
  }
  
  /* Раскрытое состояние меню */
  .side-menu-expanded {
    width: 200px; /* Раскрытое состояние: ширина 200px */
  }
  
  /* Кнопка для раскрытия/скрытия меню */
  .toggle-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: transparent;
    border: none;
    color: rgb(0, 0, 0);
    font-size: 20px;
    cursor: pointer;
    z-index: 1001; /* Убедитесь, что кнопка находится поверх меню */
  }
  
  /* Кнопки меню */
  .menu-buttons {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-top: 50px;
    padding: 10px;
  }
  
  .menu-buttons button {
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #ffffff;
    color: #23005a;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-family: 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 400;
    text-align: left;
  }
  
  .menu-buttons button:hover {
    background-color: #e3e3e3;
  }
  </style>