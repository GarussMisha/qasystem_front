// Заглушка

<template>
    <header class="home-page">
        <div class="buttons">
            <button>Кнопка 1</button>
            <button>Кнопка 2</button>
            <button>Кнопка 3</button>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HomePage',
};
</script>

<style>
.home-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
}

.buttons button {
  margin-left: 10px;
  padding: 5px 10px;
  background-color: #555;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.buttons button:hover {
  background-color: #777;
}
</style>