<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Удалить тест-кейс</h2>
      <div v-if="testCasesList.length > 0" class="form-group">
        <label for="testCaseSelect">Выберите тест-кейс:</label>
        <select id="testCaseSelect" v-model="selectedTestCaseId" required>
          <option value="" disabled>Выберите тест-кейс</option>
          <option
            v-for="testCase in testCasesList"
            :key="testCase.id"
            :value="testCase.id"
          >
            {{ testCase.testcaseName }}
          </option>
        </select>
        <p>Вы уверены, что хотите удалить тест-кейс?</p>
      </div>
      <div v-else>
        <p>Тест-кейсы отсутствуют для текущего проекта.</p>
      </div>
      <div class="button-group">
        <button
          type="button"
          @click="confirmDelete"
          class="delete-button"
          :disabled="!selectedTestCaseId"
        >
          Удалить
        </button>
        <button type="button" @click="closeModal" class="cancel-button">
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'DeleteTestCaseModal',
  props: {
    projectId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      selectedTestCaseId: '', // ID выбранного тест-кейса
    };
  },
  setup(props) {
    const projectDataStore = useProjectDataStore();

    // Получаем список тест-кейсов для проекта
    const testCasesList = computed(() => {
      const testCases = projectDataStore.testCasesByProject[props.projectId];
      console.log('Тест-кейсы для проекта:', testCases);
      if (!testCases) {
        console.warn(`Тест-кейсы для проекта с ID ${props.projectId} отсутствуют.`);
        return [];
      }
      return testCases;
    });

    return {
      testCasesList,
    };
  },
  methods: {
    confirmDelete() {
      if (this.selectedTestCaseId) {
        console.log('Удаление тест-кейса с ID:', this.selectedTestCaseId);
        this.$emit('delete', this.selectedTestCaseId);
      }
    },
    closeModal() {
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

.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Учитываем padding в общей ширине */
  color: #333;
}

.modal-content p {
  margin-bottom: 20px;
  color: #333;
  text-align: center; /* Выравниваем текст по центру */
}

.button-group {
  display: flex;
  justify-content: space-between; /* Равномерно распределяем кнопки */
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; /* Растягиваем кнопку на всю доступную ширину */
  margin-right: 10px; /* Добавляем отступ между кнопками */
}

.delete-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.delete-button:hover:not(:disabled) {
  background-color: #c82333;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; /* Растягиваем кнопку на всю доступную ширину */
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style>
