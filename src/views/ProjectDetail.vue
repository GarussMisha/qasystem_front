// Заглушка

<template>
    <header class="project-detail">
        <div class="buttons">
            <button>Кнопка 1</button>
            <button>Кнопка 2</button>
            <button>Кнопка 3</button>
        </div>
    </header>
</template>

<script>
export default {
    name: 'ProjectDetail',
};
</script>

<style scoped>
.head-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #333;
  color: white;
}

</style>