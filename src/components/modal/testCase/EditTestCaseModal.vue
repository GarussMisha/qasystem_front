<!-- EditTestCaseModal.vue -->
<template>
    <div class="modal-overlay" @mousedown.self="closeModal">
      <div class="modal-content" @click.stop>
        <h2>Редактировать тест-кейс</h2>
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
  import { useProjectDataStore } from '@/stores/ProjectDataStore';
  
  export default {
    name: 'EditTestCaseModal',
    props: {
      testCase: {
        type: Object,
        required: true,
      },
    },
    setup(props, { emit }) {
      const projectDataStore = useProjectDataStore();
      const name = ref(props.testCase.testcaseName);
      const description = ref(props.testCase.testcaseDescription || '');
      const steps = ref(Array.isArray(props.testCase.steps) ? props.testCase.steps : []); // steps всегда массив
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
  
        loading.value = true;
        error.value = null;
  
        try {
          
          const updateData = {
            testcaseName: name.value.trim(),
            testcaseDescription: description.value.trim(),
            steps: steps.value, // Добавляем steps в updateData
          };
          const success = await projectDataStore.updateTestCase(
            props.testCase.project,
            props.testCase.id,
            updateData
          );
  
          if (success) {
            // Эмитируем событие для обновления данных на странице
            emit('edited', { ...props.testCase, ...updateData });
            // Закрываем модальное окно
            emit('close');
          } else {
            throw new Error('Не удалось обновить тест-кейс. Попробуйте ещё раз.');
          }
        } catch (err) {
          error.value = err.message || 'Произошла ошибка при обновлении тест-кейса.';
          console.error('EditTestCaseModal - submitForm error:', err);
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
        name,
        description,
        steps,
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
    color: #28a745;
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
  