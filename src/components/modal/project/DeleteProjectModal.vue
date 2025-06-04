<!-- File: src/components/modal/project/DeleteProjectModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Подтверждение удаления</h3>
        <button class="modal-close" @click="close">&times;</button>
      </div>
      
      <div class="modal-body">
        <p>Вы собираетесь удалить проект: <strong>{{ projectName }}</strong></p>
        <p>Это действие невозможно отменить. Все связанные тест-кейсы и чек-листы будут удалены.</p>
        
        <div class="confirmation-input">
          <label for="projectNameInput">
            Введите название проекта для подтверждения:
          </label>
          <input
            id="projectNameInput"
            v-model="inputProjectName"
            type="text"
            class="form-control"
            :placeholder="projectName"
          />
        </div>
      </div>
      
      <div class="modal-footer">
        <button 
          class="btn-cancel" 
          @click="close"
        >
          Отмена
        </button>
        <button 
          class="btn-confirm"
          :disabled="!isConfirmed"
          @click="confirm"
        >
          Удалить проект
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';

export default {
  name: "DeleteProjectModal",
  props: {
    projectName: {
      type: String,
      required: true
    }
  },
  emits: ["close", "confirm"],
  setup(props, { emit }) {
    const inputProjectName = ref('');

    const isConfirmed = computed(() => {
      return inputProjectName.value.trim() === props.projectName;
    });

    function close() {
      emit('close');
    }

    function confirm() {
      if (isConfirmed.value) {
        emit('confirm');
      }
    }

    return {
      inputProjectName,
      isConfirmed,
      close,
      confirm
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
  width: 500px;
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

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.4rem;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #777;
  transition: color 0.2s;
}

.modal-close:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.modal-body p {
  margin: 0 0 15px;
  line-height: 1.5;
  color: #555;
}

.confirmation-input {
  margin-top: 20px;
  width: 100%;
  max-width: 400px;
  margin-top: 20px;
}

.confirmation-input label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #8c0b0b;
}

.form-control {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.form-control:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px;
  border-top: 1px solid #eee;
  gap: 10px;
}

.btn-cancel, .btn-confirm {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel {
  background-color: #f5f5f5;
  color: #333;
  border: 1px solid #ddd;
}

.btn-cancel:hover {
  background-color: #e9e9e9;
}

.btn-confirm {
  background-color: #dc3545;
  color: white;
  border: 1px solid #dc3545;
}

.btn-confirm:disabled {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  cursor: not-allowed;
  opacity: 0.7;
}

.btn-confirm:not(:disabled):hover {
  background-color: #c82333;
  border-color: #bd2130;
}
</style>
