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
.home-page {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f6f6f6;
  min-height: 100vh;
  padding: 20px;
  box-sizing: border-box;
}

.home-container {
  display: flex;
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  box-sizing: border-box;
}

.user-info {
  flex: 0 0 40%;
  background-color: #9e9e9e;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}

.site-updates {
  flex: 0 0 60%;
  background-color: #424242;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
</style>
