<!-- File: src/components/modal/checkList/CreateCheckListModal.vue -->
<template>
  <div class="modal-overlay" @mousedown.self="closeModal">
    <div class="modal-content" @click.stop>
      <header class="modal-header">
        <h2>Создать чек-лист</h2>
        <button class="close-btn" @click="closeModal">&times;</button>
      </header>

      <form @submit.prevent="submitForm" class="modal-form">
        <!-- Название чек-листа -->
        <div class="form-group">
          <label for="checkListName">Название чек-листа</label>
          <input
            id="checkListName"
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
          <label for="checkListDescription">Описание</label>
          <textarea
            id="checkListDescription"
            v-model="description"
            maxlength="255"
            placeholder="Кратко опишите чек-лист"
          ></textarea>
          <small class="char-count">{{ description.length }}/255</small>
        </div>

        <!-- Блок добавления пунктов чек-листа -->
        <section class="items-section wide">
          <label>Элементы чек-листа</label>
          <div class="item-input-wrapper">
            <input
              v-model="itemQuery"
              type="text"
              placeholder="Напишите название тест-кейса или свой пункт"
              @focus="openDropdown"
              @input="filterTestCases"
              @keydown.enter.prevent="addItem"
            />
            <button
              type="button"
              class="toggle-btn"
              @click="toggleDropdown"
            >
              <span :class="showDropdown ? 'caret-up' : 'caret-down'"></span>
            </button>

            <!-- Выпадающий список найденных тест-кейсов -->
            <ul v-if="showDropdown" class="dropdown-list">
              <li
                v-for="tc in filteredTestCases"
                :key="tc.id"
                class="dropdown-item"
                @click="selectExistingTestCase(tc)"
              >
                #{{ tc.id }} — {{ tc.testcaseName }}
              </li>
              <li
                v-if="filteredTestCases.length === 0"
                class="dropdown-item no-match"
              >
                Нет совпадений, нажмите Enter чтобы добавить свой пункт
              </li>
            </ul>
          </div>
        </section>

        <!-- Список уже добавленных элементов -->
        <div class="preview-section" v-if="items.length">
          <h3>Добавленные элементы</h3>
          <ul class="preview-list">
            <li
              v-for="(itm, idx) in items"
              :key="idx"
              class="preview-item"
              draggable="true"
              @dragstart="onDragStart(idx)"
              @dragover.prevent
              @drop="onDrop(idx)"
              :class="{ dragging: dragIndex === idx }"
            >
              <div class="item-info">
                <span class="item-index">{{ idx + 1 }}.</span>
                <span v-if="itm.testCaseId">
                  <strong>#{{ itm.testCaseId }}</strong> — {{ itm.item }}
                </span>
                <span v-else>{{ itm.item }}</span>
              </div>
              <button
                type="button"
                class="remove-btn"
                @click="removeItem(idx)"
              >&times;</button>
            </li>
          </ul>
        </div>

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
            {{ loading ? 'Создание...' : 'Создать' }}
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
  name: "CreateCheckListModal",
  props: {
    projectId: {
      type: Number,
      required: true
    }
  },
  emits: ["close", "checklist-created"],
  setup(props, { emit }) {
    const name = ref("");
    const description = ref("");
    const loading = ref(false);
    const error = ref(null);

    const items = reactive([]);
    const itemQuery = ref("");
    const testCases = ref([]);
    const filteredTestCases = ref([]);
    const showDropdown = ref(false);

    const dragIndex = ref(null);

    async function loadTestCases() {
      try {
        testCases.value = await testCaseApi.getAllByProjectId(
          props.projectId
        );
      } catch (e) {
        console.error("Ошибка загрузки тест-кейсов:", e);
      }
    }
    onMounted(loadTestCases);

    function openDropdown() {
      filteredTestCases.value = testCases.value.slice();
      showDropdown.value = true;
    }
    function toggleDropdown() {
      if (showDropdown.value) {
        showDropdown.value = false;
      } else {
        filteredTestCases.value = testCases.value.slice();
        showDropdown.value = true;
      }
    }

    function filterTestCases() {
      const q = itemQuery.value.trim().toLowerCase();
      if (!q) {
        filteredTestCases.value = testCases.value.slice();
        showDropdown.value = true;
        return;
      }
      filteredTestCases.value = testCases.value.filter((tc) => {
        const nameStr = (tc.testcaseName || "").toLowerCase();
        const idStr = String(tc.id);
        return nameStr.includes(q) || idStr.includes(q);
      });
      showDropdown.value = true;
    }

    function selectExistingTestCase(tc) {
      items.push({
        item: tc.testcaseName,
        testCaseId: tc.id,
        number: items.length + 1
      });
      itemQuery.value = "";
      filteredTestCases.value = [];
      showDropdown.value = false;
    }

    function addItem() {
      const txt = itemQuery.value.trim();
      if (!txt) {
        return;
      }
      items.push({
        item: txt,
        testCaseId: null,
        number: items.length + 1
      });
      itemQuery.value = "";
      filteredTestCases.value = [];
      showDropdown.value = false;
    }

    function removeItem(index) {
      items.splice(index, 1);
      items.forEach((it, idx) => {
        it.number = idx + 1;
      });
    }

    const canSubmit = computed(() => {
      return name.value.trim() !== "";
    });

    async function submitForm() {
      error.value = null;
      if (!name.value.trim()) {
        error.value = "Введите название чек-листа";
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
          error.value = "Все пункты должны иметь название.";
          return;
        }
      }

      loading.value = true;
      const payload = {
        checkListName: name.value.trim(),
        checkListDescription: description.value.trim() || null,
        project: Number(props.projectId),
        items: items.map((it) => ({
          number: it.number,
          testCaseId: it.testCaseId,
          item: it.item.trim()
        }))
      };

      try {
        const created = await checkListApi.create(props.projectId, payload);
        emit("checklist-created", created);
        closeModal();
      } catch (e) {
        console.error("Ошибка создания чек-листа:", e);
        error.value = e.message || "Не удалось создать чек-лист";
      } finally {
        loading.value = false;
      }
    }

    function closeModal() {
      if (loading.value) return;
      name.value = "";
      description.value = "";
      itemQuery.value = "";
      filteredTestCases.value = [];
      showDropdown.value = false;
      items.splice(0, items.length);
      error.value = null;
      emit("close");
    }

    const onDragStart = (idx) => {
      dragIndex.value = idx;
    };
    const onDragEnd = () => {
      dragIndex.value = null;
    };
    const onDrop = (idx) => {
      if (dragIndex.value === null || dragIndex.value === idx) return;
      const moved = items.splice(dragIndex.value, 1)[0];
      const insertPos = dragIndex.value < idx ? idx : idx;
      items.splice(insertPos, 0, moved);
      items.forEach((it, i) => (it.number = i + 1));
      dragIndex.value = null;
    };

    return {
      name,
      description,
      items,
      itemQuery,
      filteredTestCases,
      showDropdown,
      loading,
      error,
      canSubmit,
      openDropdown,
      toggleDropdown,
      filterTestCases,
      selectExistingTestCase,
      addItem,
      removeItem,
      submitForm,
      closeModal,
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

.items-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.items-section label {
  font-weight: 500;
  margin-bottom: 4px;
}

.item-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.item-input-wrapper input {
  flex: 1;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  margin-left: 4px;
  cursor: pointer;
  color: #555;
}

.caret-down::before {
  content: "▼";
}

.caret-up::before {
  content: "▲";
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ccc;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.no-match {
  padding: 8px 12px;
  font-style: italic;
  color: #777;
}

.preview-section {
  margin-top: 16px;
}

.preview-section h3 {
  margin: 0 0 8px;
  font-size: 1rem;
  color: #333;
}

.preview-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.preview-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 8px 10px;
  margin-bottom: 6px;
  cursor: grab;
}

.preview-item.dragging {
  opacity: 0.6;
  background: #e0e0ff;
}

.item-info {
  display: flex;
  gap: 6px;
  align-items: center;
}

.item-index {
  font-weight: bold;
  color: #444;
  width: 24px;
  text-align: right;
}

.remove-btn {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  color: #c62828;
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
