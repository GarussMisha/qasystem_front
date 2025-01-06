<template>
  <div class="modal-overlay" @mousedown.self="$emit('close')">
    <div class="modal-content" @click.stop>
      <h2>Создать тест-кейс</h2>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="projectName">Название тест-кейса:</label>
          <input v-model="testCaseData.testcaseName" placeholder="Название тест-кейса" required />
        </div>
        <div class="form-group">
          <label for="projectDescription">Описание тест-кейса:</label>
          <textarea v-model="testCaseData.testcaseDescription" placeholder="Описание"></textarea>
        </div>
        <div class="button-group">
          <button type="submit" class="submit-button">Создать</button>
        <button type="button" @click="closeModal" class="cancel-button">Отмена</button>
        </div>
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
        testcaseName: '',
        testcaseDescription: '',
        steps: [],
      },      
    };
  },
  methods: {
    submitForm() {
      this.$emit('create', this.testCaseData); // Отправляем данные формы в родительский компонент
    },
    closeModal() {
      this.$emit('close'); // Закрываем модальное окно
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
  user-select: none;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-sizing: border-box; /* Учитываем padding в общей ширине */
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center; /* Выравниваем заголовок по центру */
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Учитываем padding в общей ширине */
  color: #333;
}

.button-group {
  display: flex;
  justify-content: space-between; /* Равномерно распределяем кнопки */
}

.submit-button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; /* Растягиваем кнопку на всю доступную ширину */
  margin-right: 10px; /* Добавляем отступ между кнопками */
}

.submit-button:hover {
  background-color: #218838;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; /* Растягиваем кнопку на всю доступную ширину */
}

.cancel-button:hover {
  background-color: #c82333;
}

textarea {
  width: 100%; /* Ширина фиксированная или относительная */
  resize: vertical; /* Разрешаем только изменение высоты */
  max-height: 300px; /* Максимальная высота */
  min-height: 100px; /* Минимальная высота */
  overflow: auto; /* Добавляем прокрутку, если содержимое превышает максимальную высоту */
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>