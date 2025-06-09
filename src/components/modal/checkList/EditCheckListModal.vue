<!-- File: src/components/modal/checkList/EditCheckListModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Редактировать чек-лист</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>

      <form @submit.prevent="submitForm" class="modal-form">
        <!-- Название чек-листа -->
        <div class="form-group">
          <label for="editCheckListName">Название чек-листа</label>
          <input
            id="editCheckListName"
            v-model="name"
            type="text"
            maxlength="64"
            required
            placeholder="Введите название"
          />
          <small class="char-count">{{ name.length }}/64</small>
        </div>

        <!-- Описание (необязательно) -->
        <div class="form-group">
          <label for="editCheckListDescription">Описание</label>
          <textarea
            id="editCheckListDescription"
            v-model="description"
            maxlength="255"
            placeholder="Кратко опишите чек-лист"
          ></textarea>
          <small class="char-count">{{ description.length }}/255</small>
        </div>

        <!-- Блок редактирования пунктов чек-листа -->
        <section class="items-section wide">
          <h3>Элементы чек-листа (необязательно)</h3>
          <ul class="edit-preview-list" v-if="items.length">
            <li
              v-for="(itm, idx) in items"
              :key="itm.id ?? idx"
              class="preview-item"
              draggable="true"
              @dragstart="onDragStart(idx)"
              @dragover.prevent
              @drop="onDrop(idx)"
              :class="{ dragging: dragIndex === idx }"
            >
              <div class="item-info">
                <span class="item-index">{{ idx + 1 }}.</span>
                <input
                  v-model="itm.item"
                  type="text"
                  placeholder="Название пункта"
                  required
                />
                <select
                  v-model="itm.testCaseId"
                  class="select-ref"
                  @change="onTestCaseChange(idx)"
                >
                  <option :value="null">— Нет связанного ТК —</option>
                  <option
                    v-for="tc in testCases"
                    :key="tc.id"
                    :value="tc.id"
                  >
                    #{{ tc.id }} — {{ tc.testcaseName }}
                  </option>
                </select>
              </div>
              <button
                type="button"
                class="remove-btn"
                @click="removeItem(idx)"
                :disabled="loading"
              >&times;</button>
            </li>
          </ul>
          <p v-else class="no-items">Пунктов нет. Добавьте ниже или сохраните без них.</p>
          <button
            type="button"
            class="add-step"
            @click="addItem"
            :disabled="loading"
          >+ Добавить пункт</button>
        </section>

        <!-- Ошибка валидации -->
        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Кнопки действий -->
        <footer class="modal-footer">
          <button
            type="button"
            class="btn secondary"
            @click="closeModal"
            :disabled="loading"
          >
            Отмена
          </button>
          <button
            type="submit"
            class="btn primary"
            :disabled="loading || !canSubmit"
          >
            {{ loading ? 'Сохранение...' : 'Сохранить' }}
          </button>
        </footer>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed, onMounted } from "vue";
import testCaseApi from "@/api/testCase.api.js";
import checkListApi from "@/api/checkList.api.js";

export default {
  name: "EditCheckListModal",
  props: {
    projectId: {
      type: Number,
      required: true
    },
    checklist: {
      type: Object,
      required: true
    }
  },
  emits: ["close", "checklist-updated"],
  setup(props, { emit }) {
    const name = ref(props.checklist.checkListName || "");
    const description = ref(props.checklist.checkListDescription || "");
    const loading = ref(false);
    const error = ref(null);

    const items = reactive(
      props.checklist.items
        ? props.checklist.items.map((it) => ({
            id: it.id,
            item: it.item,
            testCaseId: it.testCaseId,
            number: it.number
          }))
        : []
    );

    const testCases = ref([]);

    async function loadTestCases() {
      try {
        testCases.value = await testCaseApi.getAllByProjectId(props.projectId);
      } catch (e) {
        console.error("Ошибка загрузки тест-кейсов:", e);
      }
    }
    onMounted(loadTestCases);

    const dragIndex = ref(null);
    const onDragStart = (idx) => {
      dragIndex.value = idx;
    };
    const onDrop = (idx) => {
      if (dragIndex.value === null || dragIndex.value === idx) return;
      const moved = items.splice(dragIndex.value, 1)[0];
      const insertPos = dragIndex.value < idx ? idx : idx;
      items.splice(insertPos, 0, moved);
      items.forEach((it, i) => (it.number = i + 1));
      dragIndex.value = null;
    };

    const addItem = () => {
      items.push({
        id: null,
        item: "",
        testCaseId: null,
        number: items.length + 1
      });
    };

    const removeItem = (idx) => {
      items.splice(idx, 1);
      items.forEach((it, i) => (it.number = i + 1));
    };

    const onTestCaseChange = (idx) => {
      const chosenId = items[idx].testCaseId;
      if (chosenId !== null) {
        const found = testCases.value.find((tc) => tc.id === chosenId);
        if (found && !items[idx].item.trim()) {
          items[idx].item = found.testcaseName;
        }
      }
    };

    const canSubmit = computed(() => {
      return name.value.trim().length > 0;
    });

    const submitForm = async () => {
      error.value = null;
      if (!canSubmit.value) {
        error.value = "Введите название чек-листа.";
        return;
      }
      if (name.value.length > 64) {
        error.value = "Название не должно превышать 64 символа";
        return;
      }
      if (description.value.length > 255) {
        error.value = "Описание не должно превышать 255 символов";
        return;
      }
      for (const it of items) {
        if (!it.item.trim()) {
          error.value = "У всех пунктов должно быть название.";
          return;
        }
      }
      loading.value = true;
      const payload = {
        checkListName: name.value.trim(),
        checkListDescription: description.value.trim() || null,
        project: Number(props.projectId),
        items: items.map((it) => ({
          id: it.id,
          number: it.number,
          testCaseId: it.testCaseId,
          item: it.item.trim()
        }))
      };
      try {
        const updated = await checkListApi.changeByIdInProjectId(
          props.projectId,
          props.checklist.id,
          payload
        );
        emit("checklist-updated", updated);
        closeModal();
      } catch (e) {
        console.error("Ошибка при сохранении чек-листа:", e);
        error.value = e.message || "Не удалось сохранить изменения";
      } finally {
        loading.value = false;
      }
    };

    function closeModal() {
      if (loading.value) return;
      emit("close");
    }

    return {
      name,
      description,
      items,
      testCases,
      loading,
      error,
      canSubmit,
      onDragStart,
      onDrop,
      addItem,
      removeItem,
      submitForm,
      closeModal,
      dragIndex,
      onTestCaseChange
    };
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

.modal-content {
  background: #fff;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
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

.char-count {
  align-self: flex-end;
  font-size: 0.75rem;
  color: #888;
  margin-top: 4px;
}

.items-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.edit-preview-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background: #fafafa;
  cursor: grab;
  margin-bottom: 6px;
}

.preview-item.dragging {
  opacity: 0.6;
  background: #e0e0ff;
}

.item-info {
  display: flex;
  gap: 6px;
  align-items: center;
  flex: 1;
}

.item-index {
  width: 24px;
  text-align: right;
  font-weight: bold;
  color: #666;
}

.item-info input {
  flex: 2;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.select-ref {
  flex: 1;
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.remove-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #d9534f;
  cursor: pointer;
}

.add-step {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-weight: 500;
  align-self: flex-start;
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
  background-color: #007bff;
  color: #fff;
}

.secondary {
  background-color: #f0f0f0;
  color: #333;
}

.primary:disabled,
.secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
