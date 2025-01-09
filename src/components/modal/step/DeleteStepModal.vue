<!-- DeleteStepModal.vue -->
<template>
    <div class="modal-overlay" @mousedown.self="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Удалить шаг</h2>
        <p>Вы уверены, что хотите удалить этот шаг?</p>
  
        <!-- Отображение ошибки -->
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
  
        <!-- Кнопки -->
        <div class="button-group">
          <button @click="deleteStep" class="btn-confirm" :disabled="loading">
            {{ loading ? 'Удаление...' : 'Удалить' }}
          </button>
          <button @click="closeModal" class="btn-cancel" :disabled="loading">
            Отмена
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useProjectDataStore } from '@/stores/ProjectDataStore';
  
  export default {
    name: 'DeleteStepModal',
    props: {
      testCaseId: {
        type: Number,
        required: true,
      },
      stepIndex: {
        type: Number,
        required: true,
      },
    },
    setup(props, { emit }) {
      const projectDataStore = useProjectDataStore();
      const loading = ref(false);
      const error = ref(null);
  
      const deleteStep = async () => {
        loading.value = true;
        error.value = null;
        try {
          // Эмитируем событие для удаления шага в компоненте
          emit('step-deleted');
          // Закрываем модальное окно
          emit('close');
        } catch (err) {
          error.value = err.message || 'Произошла ошибка при удалении шага.';
          console.error('DeleteStepModal - deleteStep error:', err);
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
        deleteStep,
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
    max-width: 500px;
    box-sizing: border-box;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  h2 {
    margin-bottom: 1rem;
    text-align: center;
    color: #dc3545;
  }
  
  p {
    margin-bottom: 1.5rem;
    text-align: center;
    color: #333;
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
    background-color: #dc3545; /* красный */
    color: #fff;
    border: none;
    padding: 0.5rem 1.5rem;
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
    background-color: #6c757d; /* серый */
    color: #fff;
    border: none;
    padding: 0.5rem 1.5rem;
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
  