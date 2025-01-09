<template>
  <header class="head-bar">
    <div class="left-buttons">
      <button class="site-logo" @click="goToHome">QASystem</button>
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

.site-logo {
    background-color: #23005a; /* Тёмно-фиолетовый фон */
    color: #fff; /* Белый текст */
    border: none; /* Убираем границы */
    padding: 0.8rem 1.5rem; /* Внутренние отступы для красивой формы */
    font-size: 1.5rem; /* Размер текста */
    font-weight: bold; /* Жирный текст для акцента */
    border-radius: 8px; /* Закруглённые углы */
    cursor: pointer; /* Указывает, что это кнопка */
    text-transform: uppercase; /* Все буквы заглавные */
    letter-spacing: 1px; /* Расстояние между буквами */
    transition: background-color 0.3s ease, transform 0.2s ease; /* Анимация */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Тень для объёмного эффекта */
}

.site-logo:hover {
    background-color: #370087; /* Более яркий оттенок при наведении */
    transform: scale(1.05); /* Лёгкое увеличение при наведении */
}

.site-logo:active {
    background-color: #170033; /* Темнее при нажатии */
    transform: scale(0.95); /* Лёгкое уменьшение при нажатии */
}

</style>