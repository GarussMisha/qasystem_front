<!-- File: src/views/CheckListPage.vue -->
<template>
  <div class="detail-container">
    <!-- Ярлык, чтобы сразу было понятно, что это страница чек-листа -->
    <div class="page-indicator">Страница чек-листа</div>

    <!-- Информация о чек-листе -->
    <div v-if="checkList" class="checklist-header">
      <div class="checklist-row">
        <div class="checklist-main">
          <span class="checklist-id">#{{ checkList.id }}</span>
          <span class="checklist-name">{{ checkList.checkListName }}</span>
        </div>
        <div class="checklist-meta">
          <span class="checklist-project">
            Проект:
            <router-link
              :to="{ name: 'ProjectDetail', params: { projectId: checkList.project } }"
            >
              #{{ checkList.project }}
            </router-link>
          </span>
          <span class="checklist-date">
            Создано: {{ formattedDate }}
          </span>
        </div>
      </div>

      <div v-if="checkList.checkListDescription" class="checklist-description">
        {{ checkList.checkListDescription }}
      </div>

      <!-- Кнопки действий -->
      <div class="combined-controls">
        <div class="controls-group">
          <button
            class="btn-action btn-edit"
            @click="showEditCheckListModal = true"
          >
            Редактировать
          </button>
          <button
            class="btn-action btn-delete"
            @click="showDeleteCheckListModal = true"
          >
            Удалить
          </button>
          <button
            class="btn-action btn-back"
            @click="goBack"
          >
            Назад
          </button>
        </div>
      </div>
    </div>
    <div v-else class="loading">Загрузка чек-листа…</div>

    <!-- Таблица элементов чек-листа -->
    <div
      v-if="checkList && checkList.items?.length"
      class="items-table-container"
    >
      <table class="items-table">
        <thead>
          <tr>
            <th class="col-number">№</th>
            <th class="col-item">Элемент</th>
            <th class="col-ref">Связанный ТК</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(itemObj, index) in orderedItems"
            :key="itemObj.id || index"
            class="item-row"
          >
            <td class="col-number">#{{ itemObj.number ?? index + 1 }}</td>
            <td class="col-item">{{ itemObj.item }}</td>
            <td class="col-ref">
              <span v-if="itemObj.testCaseId">
                <router-link
                  :to="{
                    name: 'TestCasePage',
                    params: { projectId, testCaseId: itemObj.testCaseId }
                  }"
                >
                  #{{ itemObj.testCaseId }} — {{ itemObj.item }}
                </router-link>
              </span>
              <span v-else>—</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="checkList" class="no-items">
      В этом чек-листе нет элементов.
    </div>

    <!-- Модалки -->
    <EditCheckListModal
      v-if="showEditCheckListModal"
      :project-id="projectId"
      :checklist="checkList"
      @close="showEditCheckListModal = false"
      @checklist-updated="handleUpdated"
    />
    
    <DeleteCheckListModal
      v-if="showDeleteCheckListModal"
      :checklist-id="checkListId"
      :checklist-name="checkList.checkListName"
      @close="showDeleteCheckListModal = false"
      @confirmed="confirmDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import checkListApi from "@/api/checkList.api.js";
import EditCheckListModal from "@/components/modal/checkList/EditCheckListModal.vue";
import DeleteCheckListModal from "@/components/modal/checkList/DeleteCheckListModal.vue";

const route = useRoute();
const router = useRouter();

const projectId = parseInt(route.params.projectId);
const checkListId = parseInt(route.params.checkListId);

const checkList = ref(null);
const showEditCheckListModal = ref(false);
const showDeleteCheckListModal = ref(false);

async function loadCheckList() {
  try {
    checkList.value = await checkListApi.getById(checkListId);
  } catch (err) {
    console.error("Ошибка при загрузке чек-листа:", err);
  }
}

onMounted(loadCheckList);

const formattedDate = computed(() => {
  if (!checkList.value?.dateOfCreated) return "";
  return new Date(checkList.value.dateOfCreated).toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
});

function goBack() {
  router.push({ name: "ProjectDetail", params: { projectId } });
}

function handleUpdated(updated) {
  checkList.value = updated;
  showEditCheckListModal.value = false;
}

function confirmDelete() {
  showDeleteCheckListModal.value = false;
  router.push({ name: "ProjectDetail", params: { projectId } });
}

const orderedItems = computed(() => {
  return checkList.value?.items
    ? [...checkList.value.items].sort((a, b) => (a.number || 0) - (b.number || 0))
    : [];
});
</script>

<style scoped>
.detail-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.page-indicator {
  font-size: 1rem;
  font-weight: 500;
  color: #444;
  background-color: #e0e0e0;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 12px;
  display: inline-block;
}

.checklist-header {
  background: #f4f4f4;
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 20px;
}

.checklist-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.checklist-main {
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.checklist-id {
  font-weight: bold;
  font-size: 1.5rem;
  color: #585858;
}

.checklist-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
}

.checklist-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 0.9rem;
  background: #ebebeb;
  border-radius: 12px;
  padding: 6px;
  color: #666;
}

.checklist-project a {
  color: #007bff;
  text-decoration: none;
}

.checklist-project a:hover {
  text-decoration: underline;
}

.checklist-description {
  margin-top: 12px;
  font-size: 1rem;
  color: #333;
  background: #ebebeb;
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
  white-space: pre-wrap;
}

.combined-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid #e0e0e0;
  gap: 8px;
}

.controls-group {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: nowrap;
}

.btn-action {
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  padding: 0 12px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;
}

.btn-edit {
  background-color: #28a745;
  color: #fff;
}

.btn-edit:hover {
  background-color: #218838;
}

.btn-delete {
  background-color: #dc3545;
  color: #fff;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-back {
  background-color: #007bff;
  color: #fff;
  margin: 0 !important;
  padding: 0 12px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn-back:hover {
  background-color: #0056b3;
}

.items-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 16px;
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.items-table th,
.items-table td {
  padding: 12px 8px;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.items-table th {
  background-color: #e0e0e0;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.items-table th:not(:last-child) {
  border-right: 2px solid #ccc;
}

.item-row:hover {
  background-color: #f0f0f0;
}

.col-number {
  width: 60px;
  text-align: center;
}

.col-item {
  flex: 2;
}

.col-ref {
  flex: 1;
  text-align: center;
}

.no-items {
  padding: 20px;
  text-align: center;
  color: #999;
}

.loading {
  font-size: 16px;
  color: #999;
}
</style>
