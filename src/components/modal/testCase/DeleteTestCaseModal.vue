<!-- File: src/components/modal/testCase/DeleteTestCaseModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-dialog" @click.stop>
      <header class="modal-header">
        <h3>Удалить тест-кейс</h3>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>
      <div class="modal-body">
        <p>
          Для подтверждения удаления введите точное имя тест-кейса:
        </p>
        <strong>"{{ testcaseName }}"</strong>
        <input
          v-model="confirmName"
          type="text"
          placeholder="Введите точное название"
          class="confirm-input"
        />
      </div>
      <footer class="modal-footer">
        <button class="btn secondary" @click="closeModal">Отмена</button>
        <button
          class="btn danger"
          @click="confirmDelete"
          :disabled="loading || confirmName !== testcaseName"
        >
          {{ loading ? "Удаление..." : "Удалить" }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import testCaseApi from "@/api/testCase.api.js";

export default {
  name: "DeleteTestCaseModal",
  props: {
    testcaseId: {
      type: [Number, String],
      required: true
    },
    testcaseName: {
      type: String,
      required: true
    }
  },
  emits: ["close", "confirmed"],
  setup(props, { emit }) {
    const loading = ref(false);
    const confirmName = ref("");

    const confirmDelete = async () => {
      if (confirmName.value !== props.testcaseName) {
        return;
      }
      loading.value = true;
      try {
        await testCaseApi.deleteById(props.testcaseId);
        emit("confirmed");
      } catch (e) {
        console.error("Ошибка при удалении тест-кейса:", e);
        alert("Не удалось удалить тест-кейс.");
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      if (loading.value) return;
      emit("close");
    };

    return { loading, confirmName, confirmDelete, closeModal };
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-dialog {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
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

.modal-header h3 {
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

.modal-body {
  padding: 16px 24px;
  font-size: 1rem;
  color: #444;
}

.confirm-input {
  width: 90%;
  padding: 8px 12px;
  margin-top: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
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

.secondary {
  background-color: #f0f0f0;
  color: #333;
}

.danger {
  background-color: #dc3545;
  color: #fff;
}

.danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
