<template>
  <div class="check-stores">
    <h1>Проверка хранилищ</h1>

    <!-- ========= Проекты ========= -->
    <section class="projects-section">
      <h2>Projects</h2>
      
      <!-- Кнопки загрузки/очистки -->
      <div>
        <button @click="loadAllProjects">Загрузить все проекты</button>
        <button @click="clearProjectsData">Очистить проекты в store</button>
      </div>

      <!-- Состояние ProjectsStore -->
      <div v-if="projectStore.loading">Загрузка проектов...</div>
      <div v-else-if="projectStore.error" class="error">{{ projectStore.error }}</div>
      <div v-else>
        <p>Список проектов ({{ projectStore.projectCount }})</p>
        <ul>
          <li v-for="p in projectStore.allProjects" :key="p.id">
            <strong>ID:</strong> {{ p.id }}
            <br/>
            <strong>Name:</strong> {{ p.projectName }}
            <br/>

            <!-- Если редактируем - показываем поле ввода для description -->
            <div v-if="isProjectEditing(p.id)">
              <strong>New Description:</strong>
              <input
                v-model="editingProjects[p.id].newDescription"
                placeholder="Введите новое описание"
              />
              <br />
              <button @click="saveProjectDescription(p.id)">Сохранить</button>
              <button @click="cancelProjectEditing(p.id)">Отменить</button>
            </div>

            <!-- Если НЕ редактируем - просто отображаем текущее описание + кнопку "Обновить" -->
            <div v-else>
              <strong>Description:</strong> {{ p.projectDescription }}
              <br />
              <button @click="startProjectEditing(p.id, p.projectDescription)">Обновить</button>
            </div>

            <!-- Кнопка удаления проекта -->
            <button @click="deleteProject(p.id)">Удалить</button>
            <hr />
          </li>
        </ul>
      </div>
      
      <!-- Создание нового проекта -->
      <div class="create-project-form">
        <h3>Создать новый проект</h3>
        <label>
          Название проекта:
          <input v-model="newProject.projectName" placeholder="Project name" />
        </label>
        <label>
          Описание проекта:
          <input v-model="newProject.projectDescription" placeholder="Project description" />
        </label>
        <button @click="createNewProject">Создать</button>
      </div>
    </section>

    <hr />

    <!-- ========= Тестовые данные: Тест-кейсы ========= -->
    <section class="testcases-section">
      <h2>Test Cases</h2>

      <!-- Выбор проекта из списка для загрузки тест-кейсов -->
      <div>
        <label>Выберите проект:</label>
        <select v-model="selectedProjectId">
          <option disabled value=""> -- Проект не выбран -- </option>
          <option
            v-for="p in projectStore.allProjects"
            :key="p.id"
            :value="p.id"
          >
            Project #{{ p.id }} — {{ p.projectName }}
          </option>
        </select>

        <button 
          :disabled="!selectedProjectId" 
          @click="loadTestCasesByProject(selectedProjectId)"
        >
          Загрузить тест-кейсы выбранного проекта
        </button>

        <button @click="clearTestCasesData">Очистить тест-кейсы в store</button>
      </div>

      <div v-if="dataStore.loading">Загрузка тест-кейсов...</div>
      <div v-else-if="dataStore.error" class="error">{{ dataStore.error }}</div>

      <!-- Список тест-кейсов выбранного проекта -->
      <div v-if="selectedProjectId">
        <h3>Тест-кейсы Project #{{ selectedProjectId }} 
            ({{ dataStore.testCasesForProject(selectedProjectId).length }})</h3>
        <ul>
          <li 
            v-for="tc in dataStore.testCasesForProject(selectedProjectId)" 
            :key="tc.id"
          >
            ID: {{ tc.id }}
            <br/>
            Name: {{ tc.testcaseName || 'No name' }}
            <br/>
            <!-- Если редактируем тест-кейс - показываем инпут для нового описания -->
            <div v-if="isTestCaseEditing(tc.id)">
              <strong>New Description:</strong>
              <input
                v-model="editingTestCases[tc.id].newDescription"
                placeholder="Введите новое описание"
              />
              <br />
              <button @click="saveTestCaseDescription(selectedProjectId, tc.id)">Сохранить</button>
              <button @click="cancelTestCaseEditing(tc.id)">Отменить</button>
            </div>

            <!-- Иначе - текущее описание + кнопка "Обновить" -->
            <div v-else>
              <strong>Description:</strong> {{ tc.testcaseDescription }}
              <br />
              <button @click="startTestCaseEditing(tc.id, tc.testcaseDescription)">
                Обновить
              </button>
            </div>

            <!-- Кнопка удаления (если реализовано) -->
            <button @click="deleteTestCase(selectedProjectId, tc.id)">Удалить</button>
            <hr />
          </li>
        </ul>
      </div>

      <!-- Общий список всех тест-кейсов -->
      <div class="all-testcases">
        <h3>Все тест-кейсы ({{ dataStore.allTestCases.length }})</h3>
        <ul>
          <li 
            v-for="tc in dataStore.allTestCases" 
            :key="tc.id"
          >
            ID: {{ tc.id }} | Name: {{ tc.testcaseName }} | 
            Description: {{ tc.testcaseDescription }} | Project: {{ tc.project }}
          </li>
        </ul>
      </div>

      <!-- Загрузка конкретного тест-кейса по ID -->
      <div class="fetch-testcase">
        <h4>Загрузить один тест-кейс по ID</h4>
        <input type="number" v-model.number="testCaseId" placeholder="Введите ID тест-кейса" />
        <button @click="fetchTestCaseById(testCaseId)">Загрузить</button>
      </div>

      <!-- Создание тест-кейса -->
      <div v-if="selectedProjectId" class="create-testcase-form">
        <h3>Создать тест-кейс в проекте #{{ selectedProjectId }}</h3>
        <label>
          Название кейса:
          <input v-model="newTestCase.testcaseName" placeholder="Test case name" />
        </label>
        <label>
          Описание кейса:
          <input v-model="newTestCase.testcaseDescription" placeholder="Description" />
        </label>
        <button @click="createTestCase(selectedProjectId)">Создать</button>
      </div>
    </section>
  </div>
</template>

<script>
import { ref } from 'vue';

// Подключаем Pinia-хранилища
import { useProjectStore } from '@/stores/ProjectStore';
import { useProjectDataStore } from '@/stores/ProjectDataStore'; 
// Названия у вас могут отличаться

export default {
  name: 'CheckStores',

  setup() {
    // ====== STORES ======
    const projectStore = useProjectStore();
    const dataStore = useProjectDataStore();

    // ====== STATE (Refs) ======
    const selectedProjectId = ref('');

    // Поля для создания нового проекта
    const newProject = ref({
      projectName: '',
      projectDescription: '',
    });

    // Поля для создания нового тест-кейса
    const newTestCase = ref({
      testcaseName: '',
      testcaseDescription: '',
    });

    const testCaseId = ref(null); // ID для загрузки одного тест-кейса

    // ====== Локальное состояние для "режима редактирования" ======
    // 1) Для проектов (храним { [projectId]: { isEditing: bool, newDescription: '' } })
    const editingProjects = ref({});
    // 2) Для тест-кейсов (аналогично, { [testCaseId]: { isEditing: bool, newDescription: '' } })
    const editingTestCases = ref({});

    // Методы проверки, редактируется ли объект
    const isProjectEditing = (projectId) =>
      editingProjects.value[projectId]?.isEditing === true;

    const isTestCaseEditing = (testCaseId) =>
      editingTestCases.value[testCaseId]?.isEditing === true;

    // ====== Projects actions ======

    const loadAllProjects = async () => {
      await projectStore.loadAllProjects();
    };

    const createNewProject = async () => {
      await projectStore.createNewProject({
        projectName: newProject.value.projectName,
        projectDescription: newProject.value.projectDescription,
      });
      // Сброс формы
      newProject.value.projectName = '';
      newProject.value.projectDescription = '';
    };

    /** Кнопка "Обновить" — переходим в режим редактирования для конкретного проекта */
    const startProjectEditing = (projectId, currentDescription) => {
      editingProjects.value[projectId] = {
        isEditing: true,
        newDescription: currentDescription || '',
      };
    };

    /** Кнопка "Сохранить" — вызываем updateProject, передаём новое описание */
    const saveProjectDescription = async (projectId) => {
      const newDesc = editingProjects.value[projectId].newDescription;
      await projectStore.updateProject(projectId, {
        // Название менять не хотим, поэтому можем передать пустой объект, 
        // либо { projectDescription: newDesc } – зависит от того, как бэкенд устроен
        projectDescription: newDesc,
      });
      // Выходим из режима редактирования
      editingProjects.value[projectId] = { isEditing: false, newDescription: '' };
    };

    /** Кнопка "Отменить" — выходим из режима редактирования */
    const cancelProjectEditing = (projectId) => {
      editingProjects.value[projectId] = { isEditing: false, newDescription: '' };
    };

    /** Удалить проект */
    const deleteProject = async (projectId) => {
      await projectStore.deleteProject(projectId);
      if (selectedProjectId.value === projectId) {
        selectedProjectId.value = '';
      }
    };

    /** Очистить весь state проектов */
    const clearProjectsData = () => {
      projectStore.$reset();
      // Или вручную: 
      // projectStore.projects = {};
      // projectStore.error = null;
      // projectStore.loading = false;
    };

    // ====== Test Case actions ======

    /** Загрузить тест-кейсы для выбранного проекта */
    const loadTestCasesByProject = async (projectId) => {
      if (!projectId) return;
      await dataStore.loadTestCasesByProjectId(projectId);
    };

    /** Загрузить конкретный тест-кейс по ID */
    const fetchTestCaseById = async (id) => {
      if (!id) return;
      await dataStore.fetchTestCaseById(id);
    };

    /** Создать тест-кейс (название и описание) */
    const createTestCase = async (projectId) => {
      await dataStore.createTestCase(projectId, {
        testcaseName: newTestCase.value.testcaseName,
        testcaseDescription: newTestCase.value.testcaseDescription,
        steps: [],
      });
      // Сброс формы
      newTestCase.value.testcaseName = '';
      newTestCase.value.testcaseDescription = '';
    };

    /** Переходим в режим редактирования тест-кейса */
    const startTestCaseEditing = (testCaseId, currentDesc) => {
      editingTestCases.value[testCaseId] = {
        isEditing: true,
        newDescription: currentDesc || '',
      };
    };

    /** Сохраняем новую информацию о тест-кейсе */
    const saveTestCaseDescription = async (projectId, testCaseId) => {
      const newDesc = editingTestCases.value[testCaseId].newDescription;
      await dataStore.updateTestCase(projectId, testCaseId, {
        // testcaseName не меняем, передаём только новое описание
        testcaseDescription: newDesc,
      });
      editingTestCases.value[testCaseId] = { isEditing: false, newDescription: '' };
    };

    /** Отменяем редактирование тест-кейса */
    const cancelTestCaseEditing = (testCaseId) => {
      editingTestCases.value[testCaseId] = { isEditing: false, newDescription: '' };
    };

    /** Удалить тест-кейс (если реализовано) */
    const deleteTestCase = async (projectId, testCaseId) => {
      alert('Вызвать store для удаления, если есть метод deleteTestCase(projectId, testCaseId)');
      console.log(`CheckStores - Дописать удаление тест-кейсов. Попытка удалить projectId = ${projectId}, testCaseId = ${testCaseId}`)
      // await dataStore.deleteTestCase(projectId, testCaseId);
    };

    /** Очистить весь state тест-кейсов */
    const clearTestCasesData = () => {
      dataStore.$reset();
    };

    return {
      // Stores
      projectStore,
      dataStore,

      // State
      selectedProjectId,
      newProject,
      newTestCase,
      testCaseId,

      // Editing info
      editingProjects,
      editingTestCases,

      // Computed / methods for editing states
      isProjectEditing,
      startProjectEditing,
      saveProjectDescription,
      cancelProjectEditing,

      isTestCaseEditing,
      startTestCaseEditing,
      saveTestCaseDescription,
      cancelTestCaseEditing,

      // Project store methods
      loadAllProjects,
      createNewProject,
      deleteProject,
      clearProjectsData,

      // Test-case store methods
      loadTestCasesByProject,
      fetchTestCaseById,
      createTestCase,
      deleteTestCase,
      clearTestCasesData,
    };
  },
};
</script>

<style scoped>
.check-stores {
  padding: 16px;
}

.error {
  color: red;
  font-weight: bold;
  margin: 8px 0;
}

.projects-section,
.testcases-section {
  margin-bottom: 24px;
}

.create-project-form,
.create-testcase-form {
  margin-top: 16px;
}

.create-project-form label,
.create-testcase-form label {
  display: block;
  margin: 8px 0;
}

hr {
  margin: 24px 0;
}
</style>
