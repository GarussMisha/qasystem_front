<template>
  <div class="page-container">
    <!-- Блок с заголовком, фильтрами и сортировкой -->
    <div class="controls-section colored-bg full-width-block">
      <div class="controls-title">Доступные проекты</div>
      <div class="controls-row-bottom">
        <div class="projects-counter">
          Найдено проектов: {{ filteredProjects.length }}
        </div>

        <!-- Фильтр по статусу -->
        <div class="filter-dropdown">
          <select v-model="selectedFilter">
            <option value="">Все проекты</option>
            <option value="my">Мои проекты</option>
            <option value="active">Активные</option>
            <option value="completed">Завершенные</option>
          </select>
        </div>

        <!-- Сортировка -->
        <div class="sort-wrapper">
          <select v-model="sortKey" @change="onSortKeyChange">
            <option disabled value="">Сортировать по…</option>
            <option value="date">Дата создания</option>
            <option value="name">Имя</option>
            <option value="id">ID</option>
          </select>
          <button
            class="btn-sort-direction"
            v-if="sortKey"
            @click="toggleSortDirection"
            :title="sortAsc ? 'По возрастанию' : 'По убыванию'"
          >
            {{ sortAsc ? '▲' : '▼' }}
          </button>
        </div>

        <!-- Поиск -->
        <div class="search-area">
          <input v-model="searchQuery" type="text" placeholder="Поиск проекта" />
        </div>

        <!-- Кнопка создания -->
        <div class="btn-wrapper">
          <button class="btn btn-create-toggle" @click="toggleCreatePanel">
            Создать проект
          </button>
        </div>
      </div>
    </div>

    <!-- Таблица проектов -->
    <div class="projects-table-container">
      <table v-if="filteredProjects.length" class="projects-table">
        <thead>
          <tr>
            <th class="col-id">ID</th>
            <th class="col-name">Название проекта</th>
            <th class="col-status">Статус</th>
            <th class="col-tests">Тест-кейсов</th>
            <th class="col-checks">Чек-листов</th>
            <th class="col-desc">Краткое описание</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="project in filteredProjects"
            :key="project.id"
            class="projects-row"
            @click="goToProjectDetail(project.id)"
          >
            <td class="col-id">#{{ project.id }}</td>
            <td class="col-name">{{ project.projectName }}</td>
            <td class="col-status">{{ project.projectStatus }}</td>
            <td class="col-tests">{{ project.testCasesCount ?? 0 }}</td>
            <td class="col-checks">{{ project.checkListsCount ?? 0 }}</td>
            <td class="col-desc">
              {{ project.projectDescription.length > 32
                ? project.projectDescription.slice(0, 32) + '…'
                : project.projectDescription }}
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-list">
        Проекты не найдены
      </div>
    </div>

    <CreateProjectModal
      v-if="showModal"
      @close="showModal = false"
      @project-created="onProjectCreated"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { projectApi } from '@/api/index'
import testCaseApi from '@/api/testCase.api.js'
import checkListApi from '@/api/checkList.api.js'
import CreateProjectModal from '@/components/modal/project/CreateProjectModal.vue'

export default {
  name: 'ProjectList',
  components: {
    CreateProjectModal
  },
  setup() {
    const router = useRouter()
    const projects = ref([])
    const selectedFilter = ref('')
    const sortKey = ref('')
    const sortAsc = ref(true)
    const searchQuery = ref('')
    const showModal = ref(false)


    const loadProjects = async () => {
      try {
        const raw = await projectApi.getAll()
        const withCounts = await Promise.all(
          raw.map(async p => {
            // Параллельно запрашиваем
            const [ tcs, cls ] = await Promise.all([
              testCaseApi.getAllByProjectId(p.id),
              checkListApi.getAllByProjectId(p.id)
            ])
            return {
              ...p,
              testCasesCount: Array.isArray(tcs) ? tcs.length : 0,
              checkListsCount: Array.isArray(cls) ? cls.length : 0
            }
          })
        )

        projects.value = withCounts
      } catch (e) {
        console.error('Ошибка при загрузке проектов:', e)
      }
    }

    onMounted(async () => {
      await loadProjects()
    })

    const toggleCreatePanel = () => {
      showModal.value = true
    }

    const onProjectCreated = () => {
      loadProjects()
      showModal.value = false
    }

    const onSortKeyChange = () => {
      sortAsc.value = true
    }

    const toggleSortDirection = () => {
      sortAsc.value = !sortAsc.value
    }

    const filteredProjects = computed(() => {
      let list = projects.value.slice()

      if (selectedFilter.value === 'active') {
        list = list.filter(p => p.projectStatus === 'ACTIVE')
      } else if (selectedFilter.value === 'completed') {
        list = list.filter(p => p.projectStatus !== 'ACTIVE')
      }

      const q = searchQuery.value.trim().toLowerCase()
      if (q) {
        list = list.filter(
          p =>
            p.projectName.toLowerCase().includes(q) ||
            String(p.id).includes(q)
        )
      }

      if (sortKey.value === 'date') {
        list.sort((a, b) => {
          const da = new Date(a.dateOfCreated)
          const db = new Date(b.dateOfCreated)
          return sortAsc.value ? da - db : db - da
        })
      } else if (sortKey.value === 'name') {
        list.sort((a, b) => {
          const cmp = a.projectName.localeCompare(b.projectName, 'ru')
          return sortAsc.value ? cmp : -cmp
        })
      } else if (sortKey.value === 'id') {
        list.sort((a, b) => (sortAsc.value ? a.id - b.id : b.id - a.id))
      }

      return list
    })

    const goToProjectDetail = id =>
      router.push({ name: 'ProjectDetail', params: { projectId: id } })

    return {
      selectedFilter,
      sortKey,
      sortAsc,
      searchQuery,
      filteredProjects,
      toggleCreatePanel,
      goToProjectDetail,
      showModal,
      onProjectCreated,
      onSortKeyChange,
      toggleSortDirection
    }
  }
}
</script>

<style scoped>
.page-container {
  padding: 20px;
  background-color: #ffffff;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.colored-bg {
  background-color: #f0f0f0;
  border-radius: 6px;
  padding: 10px 20px 16px;
  margin-bottom: 20px;
  box-sizing: border-box;
}
.full-width-block {
  width: 100%;
}

.controls-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
}

.controls-row-bottom {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  flex-wrap: nowrap;
  overflow-x: auto;
}

/* Счётчик */
.projects-counter {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.filter-dropdown select,
.sort-wrapper select,
.search-area input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  height: 36px;
  box-sizing: border-box;
  background-color: #fff;
  color: #333;
  white-space: nowrap;
}

.sort-wrapper {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-sort-direction {
  padding: 0 8px;
  height: 36px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  box-sizing: border-box;
}
.btn-sort-direction:hover {
  background-color: #f0f0f0;
  border-color: #ccc;
}

.search-area {
  flex: 1;
  min-width: 150px;
}

.btn-create-toggle {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  font-size: 14px;
  height: 36px;
  box-sizing: border-box;
  white-space: nowrap;
}

.projects-table-container {
  width: 100%;
  overflow-x: auto;
  background-color: #fafafa;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin-top: 16px;
  overflow-x: auto;
  overflow-y: hidden;
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  background: #fff;
}

.projects-table th,
.projects-table td {
  padding: 12px 8px;
  border: 1px solid #ddd;
  vertical-align: middle;
}

.projects-table th:not(:last-child) {
  border-right: 2px solid #ccc;
}

.projects-table th {
  background-color: #e0e0e0;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.projects-row:hover {
  background-color: #f0f0f0;
  cursor: pointer;
}

.col-id {
  width: 60px;
  white-space: nowrap;
}

.col-name {
  width: 200px;
  white-space: nowrap;
}

.col-status {
  width: 120px;
  text-align: center;
  white-space: nowrap;
}

.col-tests {
  width: 100px;
  text-align: center;
}

.col-checks {
  width: 100px;
  text-align: center;
}

.empty-list {
  padding: 20px;
  text-align: center;
  color: #999;
}

@media (max-width: 1000px) {
  .controls-row-bottom {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .projects-counter,
  .filter-dropdown,
  .sort-wrapper,
  .search-area,
  .btn-wrapper {
    width: 100%;
  }
  .btn-create-toggle {
    width: 100%;
  }
  .col-status,
  .col-tests,
  .col-checks {
    display: none;
  }
}

@media (max-width: 600px) {
  .projects-table,
  .projects-table thead {
    display: none;
  }
  .projects-row {
    display: block;
    margin-bottom: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    padding: 10px;
  }
  .projects-row td {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    border: none;
  }
  .projects-row td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #555;
    margin-right: 8px;
  }
}
</style>
