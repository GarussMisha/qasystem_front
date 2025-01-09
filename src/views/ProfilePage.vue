<template>
  <header class="profile-page">
    <div class="profile-header">
      <h1>Профиль пользователя</h1>
      <p>Здесь вы можете увидеть информацию о своём профиле, проекты и настройки.</p>
    </div>

    <div class="profile-content">
      <!-- Основная информация -->
      <div class="profile-section">
        <h2>Основная информация</h2>
        <ul>
          <li><strong>Имя:</strong> Иван Иванов</li>
          <li><strong>Email:</strong> ivan.ivanov@example.com</li>
          <li><strong>Роль:</strong> Тестировщик</li>
          <li><strong>Дата регистрации:</strong> 01 января 2023</li>
        </ul>
      </div>

      <!-- Проекты пользователя -->
      <div class="profile-section">
        <h2>Проекты пользователя</h2>
        <ul>
          <li>Проект 1: Управление тестированием</li>
          <li>Проект 2: Автоматизация отчетов</li>
          <li>Проект 3: Веб-приложение для баг-трекинга</li>
        </ul>
      </div>

      <!-- Настройки -->
      <div class="profile-section">
        <h2>Настройки</h2>
        <p>Вы можете изменить данные профиля, пароль и уведомления.</p>
        <button class="settings-button">Изменить настройки</button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

.profile-header {
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #292961;
  color: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.profile-header h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.profile-header p {
  font-size: 14px;
  color: #d0d0ff;
  margin: 0;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.profile-section h2 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #292961;
}

.profile-section ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.profile-section ul li {
  margin-bottom: 10px;
  font-size: 14px;
  line-height: 1.5;
}

.profile-section ul li strong {
  font-weight: bold;
  color: #292961;
}

.settings-button {
  font-size: 14px;
  font-weight: bold;
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.settings-button:hover {
  background-color: #218838;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.settings-button:active {
  transform: translateY(2px);
}
</style>
