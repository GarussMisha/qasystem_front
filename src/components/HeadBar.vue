<template>
  <header class="head-bar">
    <div class="left-buttons">
      <button>Logo</button>
    </div>
    <div class="right-buttons">
      <button>Информация</button>
      <button>Профиль</button>
    </div>
  </header>
</template>

<script>
export default {
  name: 'HeadBar',
};
</script>

<style scoped>
.head-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #23005a;
  color: white;
}

.left-buttons button {
  margin-right: 10px;
  padding: 5px 10px;
  color: rgb(10, 0, 90);
  background-color: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px 10px;
}

.right-buttons button {
  margin-left: 10px;
  padding: 5px 10px;
  color: rgb(10, 0, 90);
  background-color: #ffffff;
  border-radius: 10px;
  cursor: pointer;
  padding: 5px 10px;
}

.buttons button { /* Исправленный селектор */
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #c20c0c;
  color: rgb(110, 9, 9);
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.left-buttons button:hover { 
    background-color: #e3e3e3;
}

.right-buttons button:hover { 
  background-color: #e3e3e3;
}
</style>