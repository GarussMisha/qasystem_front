<template>
  <div class="side-menu" :class="{ 'side-menu-expanded': isExpanded }">
    <!-- Кнопка для раскрытия/скрытия меню -->
    <button class="toggle-button" @click="toggleMenu">
      <span class="text-collapsed" :style="{ opacity: isExpanded ? 0 : 1, transition: 'opacity 0.2s ease' }">|||</span>
      <span class="text-expanded" :style="{ opacity: isExpanded ? 1 : 0, transition: 'opacity 0.2s ease' }">|||</span>
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
.side-menu {
  position: fixed;
  top: 60px;
  left: 0;
  height: calc(100vh - 60px);
  width: 40px;
  background-color: #ffffff;
  color: white;
  transition: width 0.5s ease;
  overflow: hidden;
  z-index: 1;
  border-right: 0.6px solid #23005a;
}

.side-menu-expanded {
  width: 200px;
}

.toggle-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  color: rgb(0, 0, 0);
  font-size: 20px;
  cursor: pointer;
  z-index: 1001;
}

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

.text-collapsed,
.text-expanded {
  position: absolute;
  top: 15px;
  left: 10%;
  transform: translate(-50%, -50%);
}
</style>