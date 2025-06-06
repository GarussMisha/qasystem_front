<!-- File: src/components/modal/project/EditProjectModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <!-- Заголовок с кнопкой закрытия -->
      <header class="modal-header">
        <h2>Редактировать проект</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>

      <!-- Форма редактирования проекта -->
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
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
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
  name: "EditProjectModal",
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "project-updated"],
  setup(props, { emit }) {
    const name = ref(props.project.projectName);
    const description = ref(props.project.projectDescription);
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
        const updatedProject = await projectApi.changeById(props.project.id, {
          projectName: name.value.trim(),
          projectDescription: description.value.trim()
        });

        if (updatedProject) {
          emit("close");
          emit("project-updated", updatedProject);
        } else {
          error.value = "Не удалось обновить проект. Попробуйте ещё раз.";
        }
      } catch (err) {
        error.value = err.message || "Произошла ошибка при обновлении проекта.";
        console.error("EditProjectModal - submitForm error:", err);
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      if (!loading.value) {
        name.value = props.project.projectName;
        description.value = props.project.projectDescription;
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
      onTextareaInput
    };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  animation: modal-appear 0.3s ease-out;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.modal-header h2 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #777;
  transition: color 0.2s;
}
.close-btn:hover {
  color: #333;
}

.modal-form {
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
  max-width: 100%;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.char-count {
  display: block;
  text-align: right;
  color: #777;
  font-size: 0.85rem;
  margin-top: 4px;
}

.error-message {
  color: #dc3545;
  margin: 0 0 15px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 0 0;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.secondary {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn.secondary:hover {
  background-color: #e9e9e9;
}

.btn.primary {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
}

.btn.primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
