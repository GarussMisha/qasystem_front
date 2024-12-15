// Заглушка

<template>
    <header class="profil-page">
        <div class="profil">
            <h1>Страница профиля</h1>
            <p>На этой странице находится информация о профиле пользователя</p>
        </div>
    </header>
</template>

<script>
export default {
    name: 'ProfilPage',
};
</script>

<style scoped>
.profil-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #9e9e9e;
  color: white;
}

</style>