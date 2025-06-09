<!-- File: src/views/ProjectDetail.vue -->
<template>
  <div class="detail-container">
    <!-- Ярлык, чтобы сразу было понятно, что это страница проекта -->
    <div class="page-indicator">Страница проекта</div>

    <!-- Основная информация о проекте -->
    <div v-if="project" class="project-header">
      <div class="project-row">
        <div class="project-main">
          <span class="project-id">#{{ project.id }}</span>
          <span class="project-name">{{ project.projectName }}</span>
        </div>
        <div class="project-meta">
          <span class="project-date">Дата создания: {{ formattedDate }}</span>
          <span class="project-status">Статус: {{ project.projectStatus }}</span>
        </div>
      </div>
      <div v-if="project.projectDescription" class="project-description">
        {{ project.projectDescription }}
      </div>

      <!-- Объединённая группа элементов управления -->
      <div class="combined-controls">
        <div v-if="activeTab === 'testcases'" class="controls-group">
          <input
            v-model="searchTestQuery"
            type="text"
            class="control-input"
            placeholder="Поиск тест-кейса"
          />
          <select v-model="selectedTestFilter" class="control-select">
            <option value="">Все тест-кейсы</option>
            <option value="hasSteps">С шагами</option>
            <option value="noSteps">Без шагов</option>
          </select>
          <button class="btn-create" @click="showCreateTestCaseModal = true">
            Создать тест-кейс
          </button>
          <button class="btn-action btn-edit" @click="showEditProjectModal = true">
            Редактировать
          </button>
          <button class="btn-action btn-delete" @click="deleteProject">
            Удалить проект
          </button>
          <button class="btn-action btn-back" @click="goBack">
            Назад
          </button>
        </div>
        <div v-else-if="activeTab === 'checklists'" class="controls-group">
          <input
            v-model="searchCheckQuery"
            type="text"
            class="control-input"
            placeholder="Поиск чек-листа"
          />
          <select v-model="selectedCheckFilter" class="control-select">
            <option value="">Все чек-листы</option>
            <option value="hasItems">С пунктами</option>
            <option value="noItems">Без пунктов</option>
          </select>
          <button class="btn-create" @click="showCreateCheckListModal = true">
            Создать чек-лист
          </button>
          <button class="btn-action btn-edit" @click="showEditProjectModal = true">
            Редактировать
          </button>
          <button class="btn-action btn-delete" @click="deleteProject">
            Удалить проект
          </button>
          <button class="btn-action btn-back" @click="goBack">
            Назад
          </button>
        </div>
      </div>

      <!-- Информация о количестве элементов -->
      <div class="item-counts-display">
        <div v-if="activeTab === 'testcases'">
          Всего тест-кейсов: {{ testCases.length }}
        </div>
        <div v-else-if="activeTab === 'checklists'">
          Всего чек-листов: {{ checkLists.length }}
        </div>
      </div>
    </div>

    <!-- Вкладки -->
    <ul class="tabs">
      <li
        :class="{ active: activeTab === 'testcases' }"
        @click="activeTab = 'testcases'"
      >
        Тест-кейсы
      </li>
      <li
        :class="{ active: activeTab === 'checklists' }"
        @click="activeTab = 'checklists'"
      >
        Чек-листы
      </li>
    </ul>

    <!-- Содержимое вкладок -->
    <div class="content-area">
      <!-- Таблица тест-кейсов -->
      <div v-if="activeTab === 'testcases'">
        <table v-if="filteredTestCases.length" class="item-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Дата создания</th>
              <th>Автор</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="tc in filteredTestCases"
              :key="tc.id"
              class="table-row"
              @click="goToTestCase(tc.id)"
            >
              <td class="cell-id">#{{ tc.id }}</td>
              <td class="cell-name">{{ tc.testcaseName }}</td>
              <td class="cell-desc">{{ tc.testcaseDescription }}</td>
              <td class="cell-date">{{ formatDate(tc.dateOfCreated) }}</td>
              <td class="cell-author">{{ tc.author || '—' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Тест-кейсы не найдены.</p>
      </div>

      <!-- Таблица чек-листов -->
      <div v-else-if="activeTab === 'checklists'">
        <table v-if="filteredCheckLists.length" class="item-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Описание</th>
              <th>Дата создания</th>
              <th>Автор</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="cl in filteredCheckLists"
              :key="cl.id"
              class="table-row"
              @click="goToCheckList(cl.id)"
            >
              <td class="cell-id">#{{ cl.id }}</td>
              <td class="cell-name">{{ cl.checkListName }}</td>
              <td class="cell-desc">{{ cl.checkListDescription }}</td>
              <td class="cell-date">{{ formatDate(cl.dateOfCreated) }}</td>
              <td class="cell-author">{{ cl.author || '—' }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Чек-листы не найдены.</p>
      </div>
    </div>

    <!-- Модалки создания -->
    <CreateTestCaseModal
      v-if="showCreateTestCaseModal"
      :project-id="project?.id"
      @close="showCreateTestCaseModal = false"
      @testcase-created="handleTestCaseCreated"
    />

    <CreateCheckListModal
      v-if="showCreateCheckListModal"
      :project-id="project?.id"
      @close="showCreateCheckListModal = false"
      @checklist-created="handleCheckListCreated"
    />

    <DeleteProjectModal
      v-if="showDeleteProjectModal"
      :project-name="project?.projectName || ''"
      @close="showDeleteProjectModal = false"
      @confirm="confirmDeleteProject"
    />
    
    <!-- Модальное окно редактирования -->
    <EditProjectModal
      v-if="showEditProjectModal"
      :project="project"
      @close="showEditProjectModal = false"
      @project-updated="handleProjectUpdated"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { projectApi } from '@/api';
import testCaseApi from '@/api/testCase.api.js';
import checkListApi from '@/api/checkList.api.js';
import { currentPathTitle } from '@/store/pathTitle';

import CreateTestCaseModal from '@/components/modal/testCase/CreateTestCaseModal.vue';
import CreateCheckListModal from '@/components/modal/checkList/CreateCheckListModal.vue';
import DeleteProjectModal from '@/components/modal/project/DeleteProjectModal.vue';
import EditProjectModal from '@/components/modal/project/EditProjectModal.vue';

const route = useRoute();
const router = useRouter();
const projectId = route.params.projectId;

const project = ref(null);
const testCases = ref([]);
const checkLists = ref([]);
const activeTab = ref('testcases');

const searchTestQuery = ref('');
const selectedTestFilter = ref('');
const searchCheckQuery = ref('');
const selectedCheckFilter = ref('');

const showCreateTestCaseModal = ref(false);
const showCreateCheckListModal = ref(false);
const showDeleteProjectModal = ref(false);
const showEditProjectModal = ref(false);

const formatDate = dateStr => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('ru-RU', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

async function loadProject() {
  project.value = await projectApi.getById(projectId);
  currentPathTitle.value = project.value.projectName;
}

async function loadLists() {
  testCases.value = await testCaseApi.getAllByProjectId(projectId);
  checkLists.value = await checkListApi.getAllByProjectId(projectId);
}

function handleTestCaseCreated() {
  showCreateTestCaseModal.value = false;
  loadLists();
}

function handleCheckListCreated() {
  showCreateCheckListModal.value = false;
  loadLists();
}

function goBack() {
  router.push({ name: 'ProjectList' });
}

function deleteProject() {
  showDeleteProjectModal.value = true;
}

async function confirmDeleteProject() {
  try {
    await projectApi.deleteById(projectId);
    router.push({ name: 'ProjectList' });
  } catch (e) {
    console.error('Ошибка при удалении проекта:', e);
    alert('Не удалось удалить проект. Попробуйте ещё раз.');
  } finally {
    showDeleteProjectModal.value = false;
  }
}

function handleProjectUpdated(updatedProject) {
  project.value = updatedProject;
  showEditProjectModal.value = false;
  currentPathTitle.value = updatedProject.projectName;
}

const goToTestCase = (testCaseId) => {
  router.push({ name: 'TestCasePage', params: { projectId, testCaseId } });
};
const goToCheckList = (checkListId) => {
  router.push({ name: 'CheckListPage', params: { projectId, checkListId } });
};

const formattedDate = computed(() => {
  if (!project.value?.dateOfCreated) return '';
  return new Date(project.value.dateOfCreated).toLocaleString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  });
});

const filteredTestCases = computed(() => {
  let list = testCases.value.slice();
  if (selectedTestFilter.value === 'hasSteps') {
    list = list.filter(tc => Array.isArray(tc.steps) && tc.steps.length > 0);
  } else if (selectedTestFilter.value === 'noSteps') {
    list = list.filter(tc => !tc.steps || tc.steps.length === 0);
  }
  const q = searchTestQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(tc => {
      const name = (tc.testcaseName || '').toLowerCase();
      return name.includes(q) || String(tc.id).includes(q);
    });
  }
  return list;
});

const filteredCheckLists = computed(() => {
  let list = checkLists.value.slice();
  if (selectedCheckFilter.value === 'hasItems') {
    list = list.filter(cl => Array.isArray(cl.items) && cl.items.length > 0);
  } else if (selectedCheckFilter.value === 'noItems') {
    list = list.filter(cl => !cl.items || cl.items.length === 0);
  }
  const q = searchCheckQuery.value.trim().toLowerCase();
  if (q) {
    list = list.filter(cl => {
      const name = (cl.checkListName || '').toLowerCase();
      return name.includes(q) || String(cl.id).includes(q);
    });
  }
  return list;
});

onMounted(async () => {
  await loadProject();
  await loadLists();
});

</script>
<style scoped>
button {
  margin: 0;
  line-height: 1;
}

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

.project-header {
  background: #f4f4f4;
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 20px;
}

.project-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.project-main {
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.project-id {
  font-weight: bold;
  font-size: 1.5rem;
  color: #585858;
}

.project-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
}

.project-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 0.9rem;
  background: #ebebeb;
  border-radius: 12px;
  padding: 6px;
  color: #666;
}

.project-description {
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

.control-input,
.control-select,
.btn-create,
.btn-action {
  height: 36px;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
}

.control-input {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  min-width: 20px;
}

.control-select {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

.btn-create,
.btn-action {
  font-size: 14px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.btn-create {
  background-color: #007bff;
  color: #fff;
}

.btn-create:hover {
  background-color: #0056b3;
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
}

.btn-back:hover {
  background-color: #0056b3;
}

.btn-edit {
  background-color: #28a745;
  color: #fff;
}

.btn-edit:hover {
  background-color: #218838;
}

.item-counts-display {
  margin-top: 12px;
  font-size: 0.9rem;
  color: #666;
  padding-bottom: 8px;
}

.tabs {
  display: flex;
  list-style: none;
  padding: 10px;
  margin-bottom: 10px;
  border-bottom: 2px solid #eaeaea;
}

.tabs li {
  margin-right: 20px;
  padding: 2px 0;
  cursor: pointer;
  color: #444;
}

.tabs li.active {
  font-weight: bold;
  border-bottom: 3px solid #0460d2;
  color: #0460d2;
}

.content-area {
  background: #f4f4f4;
  padding: 8px 10px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.item-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.item-table th,
.item-table td {
  padding: 12px 8px;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.item-table th {
  background-color: #f0f0f0;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.table-row:hover {
  background-color: #e2e2e2;
  cursor: pointer;
}

.cell-id {
  width: 60px;
}

.cell-name {
  width: 200px;
}

.cell-date {
  width: 160px;
}

.cell-placeholder {
  width: 80px;
  text-align: center;
}

.cell-author {
  width: 140px;
}

@media (max-width: 1000px) {
  .combined-controls {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .controls-group {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .btn-create,
  .btn-action {
    width: 100%;
  }
  .item-counts-display {
    text-align: center;
    margin-top: 16px;
  }
  .cell-placeholder,
  .cell-author {
    display: none;
  }
}
@media (max-width: 600px) {
  .project-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  .project-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .project-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  .tabs {
    justify-content: space-around;
  }
  .tabs li {
    margin-right: 0;
  }
  .item-table,
  .item-table thead {
    display: none;
  }
  .table-row {
    display: block;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
  }
  .table-row td {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border: none;
  }
  .table-row td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #555;
    margin-right: 8px;
  }
}
</style>
