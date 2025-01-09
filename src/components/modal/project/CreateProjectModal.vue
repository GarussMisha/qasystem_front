<!-- CreateProjectModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Создать проект</h2>
      <form @submit.prevent="submitForm">
        <!-- Название проекта -->
        <div class="form-group">
          <label for="projectName">Название проекта:</label>
          <input
            id="projectName"
            v-model="name"
            type="text"
            maxlength="64"
            required
            placeholder="Введите название проекта"
          />
          <span class="char-count">{{ name.length }}/64</span>
        </div>

        <!-- Описание проекта -->
        <div class="form-group">
          <label for="projectDescription">Описание проекта:</label>
          <textarea
            id="projectDescription"
            v-model="description"
            maxlength="255"
            required
            placeholder="Введите описание проекта"
            :style="{ height: textareaHeight + 'px' }"
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
import { useProjectStore } from '@/stores/ProjectStore';

export default {
  name: "CreateProjectModal",
  setup(props, { emit }) {
    const projectStore = useProjectStore();

    const name = ref("");
    const description = ref("");
    const loading = ref(false);
    const error = ref(null);
    const textareaHeight = ref(100);

    const submitForm = async () => {
      //  валидация на уровне данных
      if (name.value.length > 64 || description.value.length > 255) {
        error.value = "Название или описание проекта не могут превышать 64 и 255 символов соответственно.";
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const newProject = await projectStore.createNewProject({
          name: name.value,
          description: description.value,
        });

        if (newProject) {
          name.value = "";
          description.value = "";
          textareaHeight.value = 100;
          emit("close");
        } else {
          error.value = "Не удалось создать проект. Попробуйте ещё раз.";
        }
      } catch (err) {
        error.value = err.message || "Произошла ошибка при создании проекта.";
        console.error("CreateProjectModal - submitForm error:", err);
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      if (!loading.value) {
        emit("close");
        name.value = "";
        description.value = "";
        textareaHeight.value = 100;
        error.value = null;
      }
    };

    const onTextareaInput = (event) => {
      textareaHeight.value = event.target.scrollHeight;
    };

    return {
      name,
      description,
      submitForm,
      closeModal,
      loading,
      error,
      textareaHeight,
      onTextareaInput,
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
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  position: relative;
  display: flex;
  flex-direction: column;
}

.modal-content h2 {
  margin-bottom: 1.5rem;
  color: #23005a;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
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
  max-width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
  color: #333;
  font-size: 1rem;
  resize: vertical;
  overflow: hidden;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #23005a;
  outline: none;
}

.char-count {
  font-size: 0.85rem;
  color: #6c757d;
  margin-top: 0.25rem;
  display: block;
  text-align: right;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.submit-button {
  background-color: #28a745;
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

.error-message {
  color: #dc3545;
  margin-bottom: 1rem;
  text-align: center;
  font-weight: 500;
}

.form-group textarea {
  max-width: 100%;
  box-sizing: border-box;
}

@media (max-width: 600px) {
  .modal-content {
    padding: 1.5rem;
  }

  .button-group {
    flex-direction: column;
    align-items: stretch;
  }

  .submit-button,
  .cancel-button {
    width: 100%;
  }
}
</style>
