<!-- EditStepModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Редактировать шаг</h2>
      <form @submit.prevent="submitForm">
        <!-- Действие шага -->
        <div class="form-group">
          <label for="stepAction">Действие:</label>
          <input
            id="stepAction"
            v-model="stepAction"
            type="text"
            maxlength="128"
            required
            placeholder="Введите действие"
          />
          <span class="char-count">{{ stepAction.length }}/128</span>
        </div>

        <!-- Ожидаемый результат -->
        <div class="form-group">
          <label for="stepResult">Ожидаемый результат:</label>
          <input
            id="stepResult"
            v-model="stepResult"
            type="text"
            maxlength="256"
            required
            placeholder="Введите ожидаемый результат"
          />
          <span class="char-count">{{ stepResult.length }}/256</span>
        </div>

        <!-- Отображение ошибки -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <!-- Кнопки -->
        <div class="button-group">
          <button type="submit" class="submit-button" :disabled="loading">
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
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
//import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'EditStepModal',
  props: {
    testCaseId: {
      type: Number,
      required: true,
    },
    step: {
      type: Object,
      required: true,
    },
    stepIndex: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    //const projectDataStore = useProjectDataStore();

    const stepAction = ref(props.step.step);
    const stepResult = ref(props.step.resultStep);

    const loading = ref(false);
    const error = ref(null);

    const submitForm = async () => {
      if (stepAction.value.trim() === '' || stepResult.value.trim() === '') {
        error.value = 'Действие и ожидаемый результат обязательны.';
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const updatedStep = {
          step: stepAction.value.trim(),
          resultStep: stepResult.value.trim(),
        };

        emit('step-edited', updatedStep);
        emit('close');
      } catch (err) {
        error.value = err.message || 'Произошла ошибка при обновлении шага.';
        console.error('EditStepModal - submitForm error:', err);
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      if (!loading.value) {
        emit('close');
      }
    };

    return {
      stepAction,
      stepResult,
      loading,
      error,
      submitForm,
      closeModal,
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
  color: #17a2b8;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  color: #333;
  font-size: 1rem;
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
  background-color: #17a2b8;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #138496;
}

.submit-button:disabled {
  background-color: #a3d7e8;
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
