<template>
    <header class="head-bar">
        <div class="buttons">
            <button>Кнопка 1</button>
            <button>Кнопка 2</button>
            <button>Кнопка 4</button>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeadBar',
};
</script>

<style>
.head-bar {
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