<template>
  <header class="head-bar">
    <div class="left-buttons">
      <button @click="goToHome">Logo</button>
    </div>
    <div class="right-buttons">
      <button @click="goToInfo">Информация</button>
      <button @click="goToProfile">Профиль</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeadBar',
  methods: {
    goToInfo() {
        this.$router.push({ name: 'InfoPage'})
    },
    goToHome() {
        this.$router.push({ name: 'Home'})
    },
    goToProfile() {
        this.$router.push({ name: 'ProfilePage'})
    }
  }
};
</script>

<style scoped>
.head-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #23005a;
  color: white;
}

/* Общий селектор для всех кнопок внутри HeadBar */
.head-bar button {
  margin-right: 10px;
  margin-left: 10px;
  padding: 5px 10px;
  color: rgb(10, 0, 90);
  background-color: #ffffff;
  border-radius: 7px;
  border: none;
  cursor: pointer;

  font-family: 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 400;
}

.head-bar button:hover {
    background-color: #e3e3e3;
}
</style>