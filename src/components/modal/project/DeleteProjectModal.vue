<!-- DeleteProjectModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Удалить проект</h2>
      <p class="warning-text">
        Вы действительно хотите удалить проект <br />
        "<strong>{{ projectName }}</strong>"?<br />
        Это действие нельзя будет отменить.
      </p>

      <!-- Поле ввода для подтверждения названия проекта -->
      <div class="confirmation-group">
        <label for="confirmName">Введите название проекта для подтверждения:</label>
        <input
          id="confirmName"
          v-model="confirmName"
          type="text"
          maxlength="64"
          required
          placeholder="Введите название проекта"
        />
      </div>

      <!-- Ошибка, если названия не совпадают -->
      <div v-if="validationError" class="error-message">
        {{ validationError }}
      </div>

      <!-- Ошибка, если возникает другая проблема -->
      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <div class="button-group">
        <button
          @click="confirmDelete"
          class="submit-button"
          :disabled="!isConfirmNameValid || loading"
        >
          {{ loading ? 'Удаление...' : 'Удалить' }}
        </button>
        <button
          @click="closeModal"
          class="cancel-button"
          :disabled="loading"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { useProjectStore } from '@/stores/ProjectStore';

export default {
  name: 'DeleteProjectModal',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    projectName: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const projectStore = useProjectStore();

    const loading = ref(false);
    const error = ref(null);
    const confirmName = ref('');
    const validationError = ref(null);

    const isConfirmNameValid = computed(() => {
      return confirmName.value.trim() === props.projectName;
    });

    watch(confirmName, (newVal) => {
      if (newVal === '') {
        validationError.value = null;
      } else if (!isConfirmNameValid.value) {
        validationError.value = 'Введённое название не совпадает с названием проекта.';
      } else {
        validationError.value = null;
      }
    });

    const confirmDelete = async () => {
      if (!isConfirmNameValid.value) {
        validationError.value = 'Введённое название не совпадает с названием проекта.';
        return;
      }

      error.value = null;
      loading.value = true;
      try {
        const result = await projectStore.deleteProject(props.projectId);
        if (result) {
          emit('deleted');
          emit('close');
        } else {
          error.value = 'Не удалось удалить проект. Попробуйте ещё раз.';
        }
      } catch (err) {
        console.error('DeleteProjectModal - confirmDelete error:', err);
        error.value = err.message || 'Произошла ошибка при удалении проекта.';
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
      confirmDelete,
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
  padding: 1.5rem 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  -webkit-user-select: none; 
  -moz-user-select: none;    
  -ms-user-select: none;     
  user-select: none;
}

.confirmation-group input,
.confirmation-group input::placeholder,
button {
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
  user-select: text;
}

h2 {
  margin-bottom: 1rem;
  text-align: center;
  color: #dc3545;
}

.warning-text {
  margin-bottom: 1rem;
  color: #333;
  text-align: center;
}

.confirmation-group {
  margin-bottom: 1rem;
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
  justify-content: flex-end;
  gap: 1rem;
}

.submit-button {
  background-color: #dc3545;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #c82333;
}

.submit-button:disabled {
  background-color: #f19696;
  cursor: not-allowed;
}

.cancel-button {
  background-color: #6c757d;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.cancel-button:hover {
  background-color: #5a6268;
}

.cancel-button:disabled {
  background-color: #bbb;
  cursor: not-allowed;
}
</style>
