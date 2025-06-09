<template>
  <div class="profile-page">
    <!-- Заголовок страницы -->
    <div class="profile-header">
      <h1>Профиль пользователя</h1>
      <p>Здесь вы можете увидеть информацию о своём профиле, список проектов и настройки.</p>
    </div>

    <div class="profile-content">
      <!-- Левая колонка: Информация пользователя + Настройки -->
      <div class="left-column">
        <!-- Основная информация -->
        <div class="profile-card">
          <h2>Основная информация</h2>
          <ul class="info-list">
            <li>
              <span class="label">Имя:</span>
              <span class="value">Иван Иванов</span>
            </li>
            <li>
              <span class="label">Email:</span>
              <span class="value">ivan.ivanov@example.com</span>
            </li>
            <li>
              <span class="label">Роль:</span>
              <span class="value">Тестировщик</span>
            </li>
            <li>
              <span class="label">Дата регистрации:</span>
              <span class="value">01 января 2023</span>
            </li>
          </ul>
        </div>

        <!-- Настройки -->
        <div class="profile-card">
          <h2>Настройки</h2>
          <p>Вы можете изменить данные профиля, пароль и настройки уведомлений.</p>
          <button class="settings-button">Изменить настройки</button>
        </div>
      </div>

      <!-- Правая колонка: Проекты и Активность -->
      <div class="right-column">
        <!-- Список проектов -->
        <div class="profile-card">
          <h2>Мои проекты</h2>
          <table class="projects-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Статус</th>
              </tr>
            </thead>
            <tbody>
              <tr class="table-row" @click="goToProject(1)">
                <td>#1</td>
                <td>Управление тестированием</td>
                <td>Активный</td>
              </tr>
              <tr class="table-row" @click="goToProject(2)">
                <td>#2</td>
                <td>Автоматизация отчётов</td>
                <td>Завершён</td>
              </tr>
              <tr class="table-row" @click="goToProject(3)">
                <td>#3</td>
                <td>Веб-приложение баг-трекинга</td>
                <td>Активный</td>
              </tr>
              <tr v-if="false">
                <td colspan="3" class="empty">Проекты не найдены</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="profile-card">
          <h2>Последние активности</h2>
          <ul class="activity-list">
            <li>
              05.06.2025: Создан новый тест-кейс в проекте «Управление тестированием»
            </li>
            <li>
              04.06.2025: Обновлён чек-лист «Smoke-тесты» в проекте «Автоматизация отчётов»
            </li>
            <li>
              02.06.2025: В проекте «Веб-приложение баг-трекинга» закрыт баг #45
            </li>
            <li v-if="false" class="empty">Активность отсутствует</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goToProject(projectId) {
  router.push({ name: 'ProjectDetail', params: { projectId } })
}
</script>

<style scoped>
.profile-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #ffffff;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
}

.profile-header {
  background-color: #292961;
  color: #fff;
  padding: 20px 24px;
  border-radius: 8px;
  margin-bottom: 24px;
}

.profile-header h1 {
  margin: 0 0 8px;
  font-size: 24px;
}

.profile-header p {
  margin: 0;
  font-size: 14px;
  color: #d0d0ff;
}

.profile-content {
  display: flex;
  gap: 20px;
}

.left-column,
.right-column {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.profile-card {
  background-color: #ffffff;
  border-radius: 8px;
  padding: 16px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.profile-card h2 {
  margin: 0 0 12px;
  font-size: 18px;
  color: #292961;
  font-weight: bold;
}

.info-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.info-list li {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 14px;
  color: #333;
}

.info-list .label {
  font-weight: 600;
  width: 140px;
  color: #292961;
}

.info-list .value {
  flex: 1;
}

.settings-button {
  margin-top: 12px;
  font-size: 14px;
  font-weight: bold;
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.settings-button:hover {
  background-color: #218838;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.settings-button:active {
  transform: translateY(1px);
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.projects-table th,
.projects-table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.projects-table th {
  background-color: #f0f0f0;
  font-weight: 600;
  color: #333;
  text-align: left;
}

.table-row {
  cursor: pointer;
}

.table-row:hover {
  background-color: #f5f5f5;
}

.empty {
  text-align: center;
  padding: 12px;
  color: #888;
  font-style: italic;
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 14px;
  color: #444;
}

.activity-list li {
  margin-bottom: 8px;
  line-height: 1.5;
}

.activity-list .empty {
  color: #888;
  font-style: italic;
  text-align: center;
}

@media (max-width: 1000px) {
  .profile-content {
    flex-direction: column;
  }
}
</style>
