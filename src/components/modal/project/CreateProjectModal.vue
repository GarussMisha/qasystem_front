<!-- File: src/components/modal/project/CreateProjectModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Заголовок с кнопкой закрытия -->
      <header class="modal-header">
        <h2>Создать проект</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>

      <!-- Форма создания проекта -->
      <form @submit.prevent="submitForm" class="modal-form">
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
          <small class="char-count">{{ name.length }}/64</small>
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
            @input="onTextareaInput"
            :style="{ height: textareaHeight + 'px' }"
          ></textarea>
          <small class="char-count">{{ description.length }}/255</small>
        </div>

        <!-- Отображение ошибки -->
        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Кнопки действий (футер) -->
        <footer class="modal-footer">
          <button type="button" class="btn secondary" @click="closeModal" :disabled="loading">
            Отмена
          </button>
          <button type="submit" class="btn primary" :disabled="loading">
            {{ loading ? 'Создание...' : 'Создать' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { projectApi } from '@/api/index';

export default {
  name: "CreateProjectModal",
  emits: ["close", "project-created"],
  setup(props, { emit }) {
    const name = ref("");
    const description = ref("");
    const loading = ref(false);
    const error = ref(null);
    const textareaHeight = ref(80);

    const submitForm = async () => {
      if (name.value.length > 64 || description.value.length > 255) {
        error.value = "Название не более 64 символов, описание не более 255.";
        return;
      }

      loading.value = true;
      error.value = null;

      try {
        const newProject = await projectApi.create({
          projectName: name.value.trim(),
          projectDescription: description.value.trim(),
        });

        if (newProject) {
          name.value = "";
          description.value = "";
          textareaHeight.value = 80;
          emit("close");
          emit("project-created", newProject);
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
        name.value = "";
        description.value = "";
        textareaHeight.value = 80;
        error.value = null;
        emit("close");
      }
    };

    const onTextareaInput = (event) => {
      textareaHeight.value = Math.max(80, event.target.scrollHeight);
    };

    return {
      name,
      description,
      loading,
      error,
      textareaHeight,
      submitForm,
      closeModal,
      onTextareaInput,
    };
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
}

.close-btn:hover {
  color: #333;
}

.modal-form {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 4px;
  color: #444;
}

.form-group input,
.form-group textarea {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  font-size: 0.75rem;
  color: #888;
  margin-top: 4px;
  align-self: flex-end;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  font-size: 0.95rem;
  border-radius: 4px;
  cursor: pointer;
  border: none;
  min-width: 100px;
  box-sizing: border-box;
}

.primary {
  background-color: #28a745;
  color: #fff;
  font-weight: 500;
}

.primary:hover {
  background-color: #218838;
}

.primary:disabled {
  background-color: #94d3a2;
  cursor: not-allowed;
}

.secondary {
  background-color: #dc3545;
  color: #fff;
  font-weight: 500;
}

.secondary:hover {
  background-color: #c82333;
}

.secondary:disabled {
  background-color: #e99a9f;
  cursor: not-allowed;
}

/* Адаптивные правки */
@media (max-width: 600px) {
  .modal-content {
    width: 95%;
  }
  .modal-form {
    padding: 16px;
  }
  .modal-header,
  .modal-footer {
    padding: 12px 16px;
  }
  .btn {
    flex: 1;
  }
}
</style>
