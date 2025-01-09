<!-- CreateTestCaseModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Создать тест-кейс</h2>
      <form @submit.prevent="submitForm">
        <!-- Название тест-кейса -->
        <div class="form-group">
          <label for="testcaseName">Название тест-кейса:</label>
          <input
            id="testcaseName"
            v-model="name"
            type="text"
            maxlength="64"
            required
            placeholder="Введите название тест-кейса"
          />
          <span class="char-count">{{ name.length }}/64</span>
        </div>

        <!-- Описание тест-кейса -->
        <div class="form-group">
          <label for="testcaseDescription">Описание тест-кейса:</label>
          <textarea
            id="testcaseDescription"
            v-model="description"
            maxlength="255"
            placeholder="Введите описание тест-кейса (необязательно)"
          ></textarea>
          <span class="char-count">{{ description.length }}/255</span>
        </div>

        <!-- Шаги тест-кейса (опционально) -->
        <div class="steps-group">
          <label>Шаги (необязательно):</label>
          <div
            v-for="(step, index) in steps"
            :key="index"
            class="step-item"
          >
            <input
              v-model="step.step"
              type="text"
              placeholder="Название шага / Действие"
              required
            />
            <input
              v-model="step.resultStep"
              type="text"
              placeholder="Ожидаемый результат"
              required
            />
            <button
              type="button"
              class="remove-step"
              @click="removeStep(index)"
              :disabled="loading"
            >
              &times;
            </button>
          </div>
          <button
            type="button"
            class="add-step"
            @click="addStep"
            :disabled="loading"
          >
            + Добавить шаг
          </button>
        </div>

        <!-- Отображение ошибки -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Кнопки -->
        <div class="button-group">
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'Создание...' : 'Создать' }}
          </button>
          <button type="button" @click="closeModal" class="cancel-button" :disabled="loading">
            Отмена
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'CreateTestCaseModal',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    const projectDataStore = useProjectDataStore();

    const name = ref('');
    const description = ref('');
    const steps = ref([]);

    const loading = ref(false);
    const error = ref(null);

    const submitForm = async () => {
      // Валидация данных
      if (name.value.trim() === '') {
        error.value = 'Название тест-кейса обязательно.';
        return;
      }

      if (name.value.length > 64 || description.value.length > 255) {
        error.value = 'Название или описание тест-кейса превышает допустимую длину.';
        return;
      }

      // Валидация шагов
      for (const [index, step] of steps.value.entries()) {
        if (step.step.trim() === '' || step.resultStep.trim() === '') {
          error.value = `Шаг ${index + 1} должен содержать название и ожидаемый результат.`;
          return;
        }
      }

      loading.value = true;
      error.value = null;

      try {
        const testCaseData = {
          name: name.value.trim(),
          description: description.value.trim(),
          steps: steps.value.map((step) => ({
            step: step.step.trim(),
            resultStep: step.resultStep.trim(),
          })),
        };

        const newTestCase = await projectDataStore.createTestCase(props.projectId, testCaseData);

        if (newTestCase) {
          // Эмитируем событие для обновления списка тест-кейсов на странице
          emit('testcase-created', newTestCase);
          // Закрываем модальное окно
          emit('close');
          // Сброс формы
          resetForm();
        } else {
          error.value = 'Не удалось создать тест-кейс. Попробуйте ещё раз.';
        }
      } catch (err) {
        console.error('CreateTestCaseModal - submitForm error:', err);
        error.value = err.message || 'Произошла ошибка при создании тест-кейса.';
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      if (!loading.value) {
        emit('close');
        resetForm();
      }
    };

    const resetForm = () => {
      name.value = '';
      description.value = '';
      steps.value = [];
      error.value = null;
    };

    // Добавление нового шага
    const addStep = () => {
      steps.value.push({ step: '', resultStep: '' });
    };

    // Удаление шага
    const removeStep = (index) => {
      steps.value.splice(index, 1);
    };

    return {
      name,
      description,
      steps,
      loading,
      error,
      submitForm,
      closeModal,
      addStep,
      removeStep,
    };
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
  background-color: rgba(35, 0, 90, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: #fff;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 600px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

h2 {
  margin-bottom: 1.5rem;
  text-align: center;
  color: #23005a;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  color: #333;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 0.5rem;
}

.char-count {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: -0.25rem;
  margin-bottom: 1rem;
  display: block;
  text-align: right;
}

.steps-group {
  margin-bottom: 1.5rem;
}

.step-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.step-item input {
  flex: 1;
}

.remove-step {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}
.remove-step:hover {
  background-color: #c82333;
}

.add-step {
  background-color: #6c757d;
  color: #fff;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 0.5rem;
}
.add-step:hover {
  background-color: #5a6268;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.submit-button {
  background-color: #28a745; /* зелёный */
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}
.submit-button:hover {
  background-color: #218838;
}
.submit-button:disabled {
  background-color: #94d3a2;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}
.cancel-button:hover {
  background-color: #c82333;
}
.cancel-button:disabled {
  background-color: #e99a9f;
  cursor: not-allowed;
}
</style>
