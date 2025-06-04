<!-- File: src/components/modal/testCase/EditTestCaseModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Редактировать тест-кейс</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>
      <form @submit.prevent="submitForm" class="modal-form">
        <div class="form-group">
          <label for="testcaseName">Название тест-кейса</label>
          <input
            id="testcaseName"
            v-model="name"
            type="text"
            maxlength="64"
            required
            placeholder="Введите название"
          />
          <small class="char-count">{{ name.length }}/64</small>
        </div>

        <div class="form-group">
          <label for="testcaseDescription">Описание</label>
          <textarea
            id="testcaseDescription"
            v-model="description"
            maxlength="255"
            placeholder="Опишите тест-кейс"
          ></textarea>
          <small class="char-count">{{ description.length }}/255</small>
        </div>

        <section class="steps-section">
          <div class="steps-header">
            <span>Шаги</span>
            <button type="button" class="add-step" @click="addStep" :disabled="loading">
              + Добавить
            </button>
          </div>
          <!-- Шаги: drag-and-drop -->
          <div
            v-for="(step, idx) in steps"
            :key="idx"
            class="step-wrapper"
            @dragover.prevent
            @drop="onDrop(idx)"
          >
            <div
              class="step-item"
              :class="{ dragging: dragIndex === idx }"
              draggable="true"
              @dragstart="onDragStart(idx)"
              @dragend="onDragEnd"
            >
              <span class="step-number">{{ idx + 1 }}.</span>
              <input
                v-model="step.step"
                type="text"
                placeholder="Действие"
                required
              />
              <input
                v-model="step.resultStep"
                type="text"
                placeholder="Ожидаемый результат"
                required
              />
              <button
                type="button"
                class="remove-step"
                @click="removeStep(idx)"
                :disabled="loading"
              >&times;</button>
            </div>
          </div>
        </section>

        <p v-if="error" class="error-message">{{ error }}</p>

        <footer class="modal-footer">
          <button
            type="button"
            class="btn secondary"
            @click="closeModal"
            :disabled="loading"
          >Отмена</button>
          <button
            type="submit"
            class="btn primary"
            :disabled="loading"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import testCaseApi from '@/api/testCase.api';

export default {
  name: 'EditTestCaseModal',
  props: {
    projectId: { type: Number, required: true },
    testcase: { type: Object, required: true }
  },
  emits: ['close', 'testcase-updated'],
  setup(props, { emit }) {
    const name = ref(props.testcase.testcaseName || '');
    const description = ref(props.testcase.testcaseDescription || '');
    const steps = ref(
      props.testcase.steps
        ? JSON.parse(JSON.stringify(props.testcase.steps))
        : []
    );
    const loading = ref(false);
    const error = ref(null);
    const dragIndex = ref(null);

    const onDragStart = idx => {
      dragIndex.value = idx;
    };
    const onDragEnd = () => {
      dragIndex.value = null;
    };
    const onDrop = idx => {
      if (dragIndex.value === null || dragIndex.value === idx) return;
      const moved = steps.value.splice(dragIndex.value, 1)[0];
      const insertPos = dragIndex.value < idx ? idx : idx;
      steps.value.splice(insertPos, 0, moved);
      dragIndex.value = null;
    };

    const submitForm = async () => {
      if (!name.value.trim()) {
        error.value = 'Введите название';
        return;
      }
      if (name.value.length > 64 || description.value.length > 255) {
        error.value = 'Превышена длина';
        return;
      }
      for (let i = 0; i < steps.value.length; i++) {
        const s = steps.value[i];
        if (!s.step.trim() || !s.resultStep.trim()) {
          error.value = `Шаг ${i + 1} должен быть заполнен`;
          return;
        }
      }

      const payload = {
        testcaseName: name.value.trim(),
        testcaseDescription: description.value.trim() || null,
        steps: steps.value.map((s, i) => ({
          step: s.step.trim(),
          resultStep: s.resultStep.trim(),
          number: i + 1
        }))
      };

      loading.value = true;
      error.value = null;

      try {
        const updated = await testCaseApi.changeByIdInProjectId(
          props.projectId,
          props.testcase.id,
          payload
        );
        emit('testcase-updated', updated);
        emit('close');
      } catch (e) {
        error.value = e.message || 'Ошибка при сохранении';
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      if (!loading.value) emit('close');
    };

    const addStep = () => {
      steps.value.push({ step: '', resultStep: '' });
    };
    const removeStep = i => {
      steps.value.splice(i, 1);
    };

    return {
      name,
      description,
      steps,
      loading,
      error,
      submitForm,
      closeModal,
      addStep,
      removeStep,
      onDragStart,
      onDragEnd,
      onDrop,
      dragIndex
    };
  }
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
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
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
  cursor: pointer;
  color: #888;
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

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  align-self: flex-end;
  font-size: 0.75rem;
  color: #888;
  margin-top: 4px;
}

.steps-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.steps-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.add-step {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-weight: 500;
}

.step-wrapper {
  position: relative;
}

.step-wrapper + .step-wrapper {
  margin-top: 8px;
}

.step-item {
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fafafa;
  cursor: grab;
}

.step-item.dragging {
  opacity: 0.6;
  background: #e0e0ff;
}

.step-number {
  width: 24px;
  text-align: right;
  color: #666;
}

.step-item input {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 0.9rem;
}

.remove-step {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #d9534f;
  cursor: pointer;
}

.error-message {
  color: #d9534f;
  font-size: 0.875rem;
  text-align: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 8px 24px;
  border-top: 1px solid #eee;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
}

.primary {
  background: #007bff;
  color: #fff;
}

.secondary {
  background: #f0f0f0;
  color: #333;
}

.primary:disabled,
.secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
