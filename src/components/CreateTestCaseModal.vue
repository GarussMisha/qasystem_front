<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2>Создать тест-кейс</h2>
      <form @submit.prevent="submitForm">
        <input v-model="testCaseData.testCaseName" placeholder="Название тест-кейса" required />
        <textarea v-model="testCaseData.testCaseDescription" placeholder="Описание" required></textarea>
        <!-- Можно добавить поле для шагов теста, если нужно -->
        <button type="submit">Создать</button>
        <button type="button" @click="closeModal" class="cancel-button">Отмена</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreateTestCaseModal',
  data() {
    return {
      testCaseData: {
        testCaseName: '',
        testCaseDescription: '',
        steps: [], // Можно расширить для добавления шагов
      },
    };
  },
  methods: {
    submitForm() {
      // Проверка на наличие данных в обязательных полях
      if (!this.testCaseData.testCaseName || !this.testCaseData.testCaseDescription) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
      }

      // Отправляем данные на создание тест-кейса в родительский компонент
      this.$emit('create', this.testCaseData);

      // Очистка формы после отправки
      this.testCaseData.testCaseName = '';
      this.testCaseData.testCaseDescription = '';
      this.testCaseData.steps = [];
    },
    closeModal() {
      // Закрываем модальное окно
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  width: 100%;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
}

.cancel-button:hover {
  background-color: #c82333;
}
</style>
