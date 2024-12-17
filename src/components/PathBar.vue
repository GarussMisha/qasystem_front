<template>
    <header class="path-bar">
      <div class="path-text">
        <p>Строка с открытым путем пример профиль > проект > тесткейс</p>
      </div>
    </header>
</template>
  
<script>
  export default {
    name: 'PathBar',
  };
</script>
  
<style scoped>
.path-bar {
  display: flex;
  height: 20px;
  align-items: center;
  padding: 5px 20px;
  background-color: #dddddd;
  color: rgb(0, 0, 0);
  }
</style>