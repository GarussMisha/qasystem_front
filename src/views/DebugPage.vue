<template>
  <div class="debug-page">
    <h1>Debug Page</h1>

    <!-- Меню фильтров перед экспортом -->
    <div class="export-controls">
      <label for="filterType">Какие проекты экспортировать:</label>
      <select id="filterType" v-model="filterType">
        <option value="all">Все</option>
        <option value="active">Активные</option>
        <option value="inactive">Неактивные</option>
        <option value="mine">Мои</option>
      </select>

      <label class="checkbox-label">
        <input type="checkbox" v-model="includeTestCases" />
        Включить тест-кейсы
      </label>

      <button class="btn-export" @click="exportProjects" :disabled="loading">
        {{ loading ? 'Загрузка...' : 'Выгрузить' }}
      </button>
    </div>

    <div v-if="error" class="error-message">
      Ошибка при выгрузке: {{ error }}
    </div>

    <div v-if="projectsPreview" class="preview-json">
      <h2>Превью выгрузки (до 5 проектов):</h2>
      <pre>{{ projectsPreview }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import projectApi from '@/api/project.api.js'
import testCaseApi from '@/api/testCase.api.js'

const filterType = ref('all')
// includeTestCases = true → будем добавлять в каждый проект свойство `testCases: [...]`
const includeTestCases = ref(false)

const projects = ref([])
const loading = ref(false)
const error = ref(null)

/**
 * projectsPreview — вёрстка первых 5 элементов массива `projects`,
 * сериализованных в JSON (с учётом уже загруженных тест-кейсов, если включено)
 */
const projectsPreview = computed(() => {
  if (!projects.value.length) return ''
  const slice = projects.value.slice(0, 5)
  const json = JSON.stringify(slice, null, 2)
  return slice.length < projects.value.length
    ? json + '\n…'
    : json
})

async function exportProjects() {
  loading.value = true
  error.value = null
  projects.value = []

  try {
    // 1) Сначала получаем полный список проектов
    const allProjects = await projectApi.getAll()

    // 2) Фильтруем локально в зависимости от `filterType.value`
    let filtered = []
    if (filterType.value === 'all') {
      filtered = allProjects
    } else if (filterType.value === 'active') {
      filtered = allProjects.filter(p => p.projectStatus === 'ACTIVE')
    } else if (filterType.value === 'inactive') {
      filtered = allProjects.filter(p => p.projectStatus !== 'ACTIVE')
    } else if (filterType.value === 'mine') {
      // У нас пока нет понятия «текущий пользователь»,
      // так что для теста просто возвращаем всё (или можно фильтровать по некой фиктивной authorId)
      filtered = allProjects
    }

    // 3) Если нужно включить тест-кейсы — для каждого проекта дополним `project.testCases`
    if (includeTestCases.value) {
      // собираем промисы для всех проектов
      const withTCs = await Promise.all(
        filtered.map(async p => {
          try {
            const tcs = await testCaseApi.getAllByProjectId(p.id)
            return { ...p, testCases: tcs }
          } catch {
            // если упадёт загрузка тест-кейсов, всё равно возвращаем проект без тест-кейсов
            return { ...p, testCases: [] }
          }
        })
      )
      projects.value = withTCs
    } else {
      // Просто сохраняем отфильтрованный список
      projects.value = filtered
    }

    // 4) Сериализуем в JSON и инициируем скачивание
    const jsonString = JSON.stringify(projects.value, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.download = 'projects_export.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  } catch (e) {
    console.error('Ошибка при экспортe проектов:', e)
    error.value = e.message || 'Не удалось получить проекты'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.debug-page {
  max-width: 800px;
  margin: 20px auto;
  padding: 16px;
  background-color: #f5f5fa;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
  font-family: Arial, sans-serif;
}

h1 {
  margin-bottom: 16px;
  font-size: 24px;
  color: #333;
}

/* Блок фильтров и кнопка выгрузки */
.export-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
  margin-bottom: 20px;
}

.export-controls label {
  font-size: 14px;
  color: #333;
}

.export-controls select {
  padding: 6px 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 14px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
}

.btn-export {
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.btn-export:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-export:hover:not(:disabled) {
  background-color: #0056b3;
}

.error-message {
  margin-top: 12px;
  color: #d9534f;
  font-size: 14px;
}

/* Блок превью JSON */
.preview-json {
  background-color: #ffffff;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 12px;
  max-height: 300px;
  overflow-y: auto;
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
