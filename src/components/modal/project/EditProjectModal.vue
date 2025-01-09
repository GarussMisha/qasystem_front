<!-- EditProjectModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Редактировать проект</h2>
      <form @submit.prevent="submitForm">
        <!-- Название проекта -->
        <div class="form-group">
          <label for="projectName">Название проекта:</label>
          <input
            id="projectName"
            v-model="editedName"
            type="text"
            maxlength="64"
            required
            placeholder="Введите новое название проекта"
          />
          <span class="char-count">{{ editedName.length }}/64</span>
        </div>

        <!-- Описание проекта -->
        <div class="form-group">
          <label for="projectDescription">Описание проекта:</label>
          <textarea
            id="projectDescription"
            v-model="editedDescription"
            maxlength="255"
            required
            placeholder="Введите новое описание проекта"
          ></textarea>
          <span class="char-count">{{ editedDescription.length }}/255</span>
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
import { useProjectStore } from '@/stores/ProjectStore';

export default {
  name: 'EditProjectModal',
  props: {
    projectId: {
      type: Number,
      required: true,
    },
    currentName: {
      type: String,
      default: '',
    },
    currentDescription: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const projectStore = useProjectStore();

    const editedName = ref(props.currentName);
    const editedDescription = ref(props.currentDescription);
    const loading = ref(false);
    const error = ref(null);

    const submitForm = async () => {
      if (editedName.value.length > 64 || editedDescription.value.length > 255) {
        error.value = 'Название или описание проекта превышает максимально допустимую длину.';
        return;
      }
      loading.value = true;
      error.value = null;

      try {
        const updatedProject = await projectStore.updateProject(props.projectId, {
          projectName: editedName.value,
          projectDescription: editedDescription.value,
        });
        if (updatedProject) {
          emit('edited', updatedProject);
          emit('close');
        } else {
          error.value = 'Не удалось сохранить изменения. Попробуйте ещё раз.';
        }
      } catch (err) {
        error.value = err.message || 'Произошла ошибка при редактировании проекта.';
        console.error('EditProjectModal - submitForm error:', err);
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
      editedName,
      editedDescription,
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
  padding: 1.5rem 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-sizing: border-box;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

h2 {
  margin-bottom: 1rem;
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
  background-color: #6f42c1; 
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #5a32a3; 
}

.submit-button:disabled {
  background-color: #9a7dbf;
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
