// Заглушка

<template>
    <header class="info-page">
        <div class="info">
            <h1>Страница с информацией</h1>
        </div>
    </header>
</template>

<script>
export default {
    name: 'InfoPage',
};
</script>

<style scoped>
.info-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #9e9e9e;
  color: white;
}

</style>