<template>
  <div class="home-page">
    <div class="home-container">
      <div class="user-info">
        <h2>Информация, связанная с пользователем</h2>
        <p>Срок выполнения задач. Какие задачи стоит выполнить в первую очередь по приоритету. Просроченные задачи. Задачи в планах.</p>
      </div>

      <div class="site-updates">
        <h2>Обновления</h2>
        <p>Последние обновления в проектах на которые подписан пользователь.</p>
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
  background-color: #ffffff;
  padding: 40px;
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
  height: 80vh;
}

.site-updates {
  flex: 0 0 60%;
  background-color: #424242;
  color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  height: 80vh;
}
</style>
