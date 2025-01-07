import axios from 'axios';

const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:9090';

// Базовая конфигурация для запросов
const apiClient = axios.create({
  baseURL: API_URL,
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
    console.error('Error -> (api.js/getAllProjects):', error);
    throw error;
  }
};

// 2. Создание проекта
const createProject = async (data) => {
  try {
    const response = await apiClient.post('/project', data);
    return response.data;
  } catch (error) {
    console.error('Error -> (api.js/createProject):', error);
    throw error;
  }
};

// 3. Получение проекта по ID
const getProjectById = async (projectId) => {
  try {
    const response = await apiClient.get(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/getProjectById) Project with id ${projectId} not found.`, error);
    throw error;
  }
};

// 4. Удаление проекта по ID
const deleteProjectById = async (projectId) => {
  try {
    const response = await apiClient.delete(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`'Error -> (api.js/deleteProjectById) Failed to delete project with id ${projectId}.`, error);
    throw error;
  }
};

// 5. Обновление (редактирование) проекта по ID
const updateProjectById = async (projectId, editProjectData) => {
  try {
    const response = await apiClient.put(`/project/${projectId}`, editProjectData);
    return response.data;
  } catch (error) {
    console.error(`'Error -> (api.js/updateProjectById) Failed to edit project with id ${projectId}. Data = ${editProjectData}`, error);
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
    console.error('Error -> (api.js/getAllTestCases):', error);
    throw error;
  }
};

// 7. Получение тест-кейса по ID
const getTestCaseById = async (testCaseId) => {
  try {
    const response = await apiClient.get(`/testcase/${testCaseId}`);
    return response.data;
  } catch (error) {
    console.error(`'Error -> (api.js/getTestCaseById):' Test case with id ${testCaseId} not found.`, error);
    throw error;
  }
};

// 8. Создание тест-кейса в конкретном проекте 
const createTestCaseInProject = async (projectId, testCaseData) => {
  try {
    const response = await apiClient.post(`/project/${projectId}/testcase`, testCaseData);
    return response.data;
  } catch (error) {
    console.error(`'Error -> (api.js/createTestCaseInProject):' Failed to create test case in project with id ${projectId}. TestCaseData = ${testCaseData}`, error);
    throw error;
  }
};

// 9. Получение всех тест-кейсов проекта по projectId
const getAllTestCaseByProjectId = async (projectId) => {
  try {
    const response = await apiClient.get(`/project/${projectId}/testcase`);
    return response.data;
  } catch (error) {
    console.error(`'Error -> (api.js/getAllTestCaseByProjectId):' Failed to get test cases for project with id ${projectId}.`,
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
    console.error(`'Error -> (api.js/updateTestCaseById):' Failed to edit test case with id ${testCaseId} in project ${projectId}. EditTestCaseData = ${editTestCaseData}`, error);
    throw error;
  }
};

// 11. Удаление тест кейса
const deleteTestCaseById = async (testCaseId) => {
  try {
    const response = await apiClient.delete(`/testcase/${testCaseId}`);
    return response.data;
  } catch (error) {
    console.error(`'Error -> (api.js/deleteTestCaseById):' Failed to delete test case with id ${testCaseId}.`, error);
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
  deleteTestCaseById
};

// Экспорт по умолчанию — сам apiClient, если где-то нужен axios с этими настройками
export default apiClient;
