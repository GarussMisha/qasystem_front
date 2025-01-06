import axios from 'axios';

// Базовая конфигурация для запросов
const apiClient = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json',
  },
});

/* --------------------------------------------------------------------------
   Методы для работы с ПРОЕКТАМИ
   -------------------------------------------------------------------------- */

// 1. Получение всех проектов
const getAllProjects = async () => {
  try {
    const response = await apiClient.get('/project');
    return response.data;
  } catch (error) {
    console.error('Error getAllProjects:', error);
    throw error;
  }
};

// 2. Создание проекта
const createProject = async (data) => {
  try {
    const response = await apiClient.post('/project', data);
    return response.data;
  } catch (error) {
    console.error('Error createProject:', error);
    throw error;
  }
};

// 3. Получение проекта по ID
const getProjectById = async (id) => {
  try {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getProjectById: Project with id ${id} not found.`, error);
    throw error;
  }
};

// 4. Удаление проекта по ID
const deleteProjectById = async (id) => {
  try {
    const response = await apiClient.delete(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleteProjectById: Failed to delete project with id ${id}.`, error);
    throw error;
  }
};

// 5. Обновление (редактирование) проекта по ID
const updateProjectById = async (id, editProjectData) => {
  try {
    const response = await apiClient.put(`/project/${id}`, editProjectData);
    return response.data;
  } catch (error) {
    console.error(`Error updateProjectById: Failed to edit project with id ${id}.`, error);
    throw error;
  }
};

/* --------------------------------------------------------------------------
   Методы для работы с ТЕСТ-КЕЙСАМИ
   -------------------------------------------------------------------------- */

// 6. Получение всех тест-кейсов (глобально, не только в рамках проекта)
const getAllTestCases = async () => {
  try {
    const response = await apiClient.get('/testcase');
    return response.data;
  } catch (error) {
    console.error('Error getAllTestCases: Failed to fetch test cases.', error);
    throw error;
  }
};

// 7. Получение тест-кейса по ID
const getTestCaseById = async (id) => {
  try {
    const response = await apiClient.get(`/testcase/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getTestCaseById: Test case with id ${id} not found.`, error);
    throw error;
  }
};

// 8. Создание тест-кейса в конкретном проекте 
const createTestCaseInProject = async (projectId, testCaseData) => {
  console.log('Вход в метод createTestCaseInProject, testCaseData:', testCaseData);
  try {
    const response = await apiClient.post(`/project/${projectId}/testcase`, testCaseData);
    console.log('api - createTestCaseInProject response:', response.data);
    return response.data;
  } catch (error) {
    console.error(`Error createTestCaseInProject: Failed to create test case in project with id ${projectId}.`, error);
    throw error;
  }
};

// 9. Получение всех тест-кейсов проекта по projectId
const getAllTestCaseByProjectId = async (projectId) => {
  try {
    const response = await apiClient.get(`/project/${projectId}/testcase`);
    return response.data;
  } catch (error) {
    console.error(
      `Error getAllTestCaseByProjectId: Failed to get test cases for project with id ${projectId}.`,
      error
    );
    throw error;
  }
};

// 10. Обновление (редактирование) тест-кейса по ID в рамках проекта
const updateTestCaseById = async (projectId, testCaseId, editTestCaseData) => {
  try {
    const response = await apiClient.put(`/project/${projectId}/testcase/${testCaseId}`, editTestCaseData);
    return response.data;
  } catch (error) {
    console.error(
      `Error updateTestCaseById: Failed to edit test case with id ${testCaseId} in project ${projectId}.`,
      error
    );
    throw error;
  }
};

export {
  // Проекты
  getAllProjects,
  createProject,
  getProjectById,
  deleteProjectById,
  updateProjectById,

  // Тест-кейсы
  getAllTestCases,
  getTestCaseById,
  createTestCaseInProject,
  getAllTestCaseByProjectId,
  updateTestCaseById,
};

// Экспорт по умолчанию — сам apiClient, если где-то нужен axios с этими настройками
export default apiClient;
