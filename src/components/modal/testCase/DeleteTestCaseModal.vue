<!-- DeleteTestCaseModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Удалить тест-кейс</h2>
      <p class="warning-text">
        Вы действительно хотите удалить тест-кейс "<strong>{{ testCaseName }}</strong>"?
        <br />
        Это действие нельзя будет отменить.
      </p>

      <!-- Поле ввода для подтверждения названия тест-кейса -->
      <div class="confirmation-group">
        <label for="confirmName">Введите название тест-кейса для подтверждения:</label>
        <input
          id="confirmName"
          v-model="confirmName"
          type="text"
          maxlength="64"
          required
          placeholder="Введите название тест-кейса"
          ref="confirmInput"
        />
        <span class="char-count">{{ confirmName.length }}/64</span>
      </div>

      <!-- Ошибка, если названия не совпадают -->
      <div v-if="validationError" class="error-message">
        {{ validationError }}
      </div>

      <!-- Ошибка, если возникает другая проблема -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <!-- Кнопки -->
      <div class="button-group">
        <button
          @click="deleteTestCase"
          class="btn-confirm"
          :disabled="!isConfirmNameValid || loading"
        >
          {{ loading ? 'Удаление...' : 'Удалить' }}
        </button>
        <button
          @click="closeModal"
          class="btn-cancel"
          :disabled="loading"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

export default {
  name: 'DeleteTestCaseModal',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    testCaseId: {
      type: Number,
      required: true,
    },
    testCaseName: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const projectDataStore = useProjectDataStore();
    const loading = ref(false);
    const error = ref(null);
    const confirmName = ref(''); // Для хранения ввода пользователя
    const validationError = ref(null); // Для отображения ошибки валидации

    // Вычисляемое свойство для проверки соответствия названий
    const isConfirmNameValid = computed(() => {
      return confirmName.value.trim() === props.testCaseName;
    });

    // Следим за изменением confirmName и обновляем validationError
    watch(confirmName, (newVal) => {
      if (newVal === '') {
        validationError.value = null;
      } else if (!isConfirmNameValid.value) {
        validationError.value = 'Введённое название не совпадает с названием тест-кейса.';
      } else {
        validationError.value = null;
      }
    });

    // Фокусировка на поле ввода при монтировании
    const confirmInput = ref(null);
    onMounted(() => {
      if (confirmInput.value) {
        confirmInput.value.focus();
      }
    });

    const deleteTestCase = async () => {
      if (!isConfirmNameValid.value) {
        validationError.value = 'Введённое название не совпадает с названием тест-кейса.';
        return;
      }

      error.value = null;
      loading.value = true;
      try {
        const success = await projectDataStore.deleteTestCase(props.projectId, props.testCaseId);
        if (success) {
          emit('deleted');
          emit('close');
        } else {
          throw new Error('Не удалось удалить тест-кейс. Попробуйте ещё раз.');
        }
      } catch (err) {
        error.value = err.message || 'Произошла ошибка при удалении тест-кейса.';
        console.error('DeleteTestCaseModal - deleteTestCase error:', err);
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
      loading,
      error,
      confirmName,
      validationError,
      isConfirmNameValid,
      deleteTestCase,
      closeModal,
      confirmInput, // Для фокусировки
    };
  },
};
</script>

<style scoped>
/* Стили модального окна */
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
  padding: 1.5rem 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  
  /* Предотвращение выделения текста */
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none;    /* Firefox */
  -ms-user-select: none;     /* IE10+/Edge */
  user-select: none;         /* Стандартное свойство */
}

/* Разрешить выделение текста внутри полей ввода и кнопок */
.confirmation-group input,
.confirmation-group input::placeholder,
button {
  -webkit-user-select: text; /* Safari */
  -moz-user-select: text;    /* Firefox */
  -ms-user-select: text;     /* IE10+/Edge */
  user-select: text;         /* Стандартное свойство */
}

h2 {
  margin-bottom: 1rem;
  text-align: center;
  color: #dc3545; /* Красный цвет для акцента на удалении */
}

.warning-text {
  margin-bottom: 1.5rem;
  color: #333;
  text-align: center;
}

.confirmation-group {
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
}

.confirmation-group label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.confirmation-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
}

.char-count {
  align-self: flex-end;
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.25rem;
}

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
}

.button-group {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.btn-confirm {
  background-color: #dc3545; /* Красный */
  color: #fff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}
.btn-confirm:hover {
  background-color: #c82333;
}
.btn-confirm:disabled {
  background-color: #e99a9f;
  cursor: not-allowed;
}

.btn-cancel {
  background-color: #6c757d; /* Серый */
  color: #fff;
  border: none;
  padding: 0.6rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}
.btn-cancel:hover {
  background-color: #5a6268;
}
.btn-cancel:disabled {
  background-color: #a6a6a6;
  cursor: not-allowed;
}
</style>
