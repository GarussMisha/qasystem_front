<!-- File: src/views/TestCasePage.vue -->
<template>
  <div class="detail-container">
    <!-- Ярлык, чтобы сразу было понятно, что это страница тест-кейса -->
    <div class="page-indicator">Страница тест-кейса</div>

    <!-- Информация о тест-кейсе -->
    <div v-if="testCase" class="testcase-header">
      <div class="testcase-row">
        <div class="testcase-main">
          <span class="testcase-id">#{{ testCase.id }}</span>
          <span class="testcase-name">{{ testCase.testcaseName }}</span>
        </div>
        <div class="testcase-meta">
          <span class="testcase-project">
            Проект:
            <router-link
              v-if="project"
              :to="{ name: 'ProjectDetail', params: { projectId: project.id } }"
            >
              {{ project.projectName }}
            </router-link>
            <span v-else>—</span>
          </span>
          <span class="testcase-date">Создано: {{ formattedDate }}</span>
        </div>
      </div>

      <!-- Описание тест-кейса -->
      <div v-if="testCase.testcaseDescription" class="testcase-description">
        {{ testCase.testcaseDescription }}
      </div>

      <!-- Кнопки действий -->
      <div class="combined-controls">
        <div class="controls-group">
          <button
            class="btn-action btn-edit"
            @click="showEditTestCaseModal = true"
          >
            Редактировать
          </button>
          <button
            class="btn-action btn-delete"
            @click="showDeleteTestCaseModal = true"
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

    <!-- Если нет данных -->
    <div v-else class="loading">Загрузка тест-кейса…</div>

    <!-- Таблица шагов -->
    <div
      v-if="testCase && testCase.steps && testCase.steps.length"
      class="steps-table-container"
    >
      <table class="steps-table">
        <thead>
          <tr>
            <th class="col-number">№ Шага</th>
            <th class="col-action">Действие</th>
            <th class="col-result">Ожидаемый результат</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(step, idx) in testCase.steps"
            :key="idx"
            class="step-row"
          >
            <td class="col-number">#{{ idx + 1 }}</td>
            <td class="col-action">{{ step.step }}</td>
            <td class="col-result">{{ step.resultStep }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="testCase" class="empty-list">
      Шаги отсутствуют
    </div>

    <!-- Модалки -->
    <EditTestCaseModal
      v-if="showEditTestCaseModal"
      :project-id="projectId"
      :testcase="testCase"
      @close="showEditTestCaseModal = false"
      @testcase-updated="handleTestCaseUpdated"
    />
    
    <DeleteTestCaseModal
      v-if="showDeleteTestCaseModal"
      :testcase-id="testCaseId"
      :testcase-name="testCase.testcaseName"
      @close="showDeleteTestCaseModal = false"
      @confirmed="onTestCaseDeleted"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projectApi } from '@/api'
import testCaseApi from '@/api/testCase.api.js'
import EditTestCaseModal from '@/components/modal/testCase/EditTestCaseModal.vue'
import DeleteTestCaseModal from '@/components/modal/testCase/DeleteTestCaseModal.vue'
import { currentPathTitle } from '@/store/pathTitle'

const route = useRoute()
const router = useRouter()

const projectId = parseInt(route.params.projectId)
const testCaseId = parseInt(route.params.testCaseId)

const project = ref(null)
const testCase = ref(null)
const showEditTestCaseModal = ref(false)
const showDeleteTestCaseModal = ref(false)

async function loadProject() {
  try {
    project.value = await projectApi.getById(projectId)
  } catch (e) {
    console.error('Ошибка при загрузке проекта:', e)
  }
}

async function loadTestCase() {
  try {
    testCase.value = await testCaseApi.getById(testCaseId)
    currentPathTitle.value = testCase.value.testcaseName
  } catch (e) {
    console.error('Ошибка при загрузке тест-кейса:', e)
  }
}

function goBack() {
  router.push({ name: 'ProjectDetail', params: { projectId } })
}

async function handleTestCaseUpdated(updated) {
  testCase.value = updated
  showEditTestCaseModal.value = false
  await loadTestCase()
}

function onTestCaseDeleted() {
  showDeleteTestCaseModal.value = false
  router.push({ name: 'ProjectDetail', params: { projectId } })
}

const formattedDate = computed(() => {
  if (!testCase.value?.dateOfCreated) return ''
  return new Date(testCase.value.dateOfCreated).toLocaleString('ru-RU', {
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit'
  })
})

onMounted(async () => {
  await loadProject()
  await loadTestCase()
})
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

.testcase-header {
  background: #f4f4f4;
  border-radius: 12px;
  padding: 20px 30px;
  margin-bottom: 20px;
}

.testcase-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.testcase-main {
  display: flex;
  gap: 12px;
  align-items: baseline;
}

.testcase-id {
  font-weight: bold;
  font-size: 1.5rem;
  color: #585858;
}

.testcase-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #000;
}

.testcase-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 0.9rem;
  background: #ebebeb;
  border-radius: 12px;
  padding: 6px;
  color: #666;
}

.testcase-project a {
  color: #007bff;
  text-decoration: none;
}

.testcase-project a:hover {
  text-decoration: underline;
}

.testcase-description {
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
  padding: 0 10px;
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
}

.btn-back:hover {
  background-color: #0056b3;
}

.no-padding {
  margin: 0 !important;
  padding: 0 !important;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.steps-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 16px;
}

.steps-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.steps-table th,
.steps-table td {
  padding: 12px 8px;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.steps-table th {
  background-color: #e0e0e0;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.steps-table th:not(:last-child) {
  border-right: 2px solid #ccc;
}

.step-row:hover {
  background-color: #f0f0f0;
}

.col-number {
  width: 80px;
  text-align: center;
}

.col-action {
  flex: 2;
}

.col-result {
  flex: 3;
}

.empty-list {
  padding: 20px;
  text-align: center;
  color: #999;
}

.loading {
  font-size: 16px;
  color: #999;
}
</style>
