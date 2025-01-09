<template>
    <div class="home-page">
      <div class="home-container">
        <!-- Первый блок - Информация о пользователе -->
        <div class="user-info">
          <h2>Информация о пользователе</h2>
          <p>Здесь будет отображаться информация о текущем пользователе: имя, роль, статус и другая важная информация.</p>
        </div>
  
        <!-- Второй блок - Обновления сайта -->
        <div class="site-updates">
          <h2>Обновления сайта</h2>
          <p>На этой панели отображаются последние обновления и новости портала. Ознакомьтесь с новым функционалом и улучшениями.</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'HomePage',
  };
  </script>
  
  <style scoped>
  /* Стиль для всей страницы */
  .home-page {
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #f6f6f6; /* Светло-серый фон */
    min-height: 100vh; /* Минимальная высота на всю высоту экрана */
    padding: 20px; /* Отступы со всех сторон */
    box-sizing: border-box;
  }
  
  /* Контейнер для блоков */
  .home-container {
    display: flex;
    gap: 20px; /* Отступ между блоками */
    width: 100%; /* Контейнер занимает всю ширину */
    max-width: 1200px; /* Ограничение ширины для больших экранов */
    box-sizing: border-box;
  }
  
  /* Блок информации о пользователе */
  .user-info {
    flex: 0 0 40%; /* Занимает 40% ширины */
    background-color: #9e9e9e; /* Серый фон */
    color: #fff; /* Белый текст */
    padding: 20px; /* Внутренние отступы */
    border-radius: 8px; /* Закруглённые углы */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Лёгкая тень */
    box-sizing: border-box;
  }
  
  /* Блок обновлений сайта */
  .site-updates {
    flex: 0 0 60%; /* Занимает 60% ширины */
    background-color: #424242; /* Тёмно-серый фон */
    color: #fff; /* Белый текст */
    padding: 20px; /* Внутренние отступы */
    border-radius: 8px; /* Закруглённые углы */
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Лёгкая тень */
    box-sizing: border-box;
  }
  </style>
  