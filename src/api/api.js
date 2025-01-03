import axios from 'axios';

// Базовая конфигурация для запросов
const apiClient = axios.create({
    baseURL: 'http://localhost:9090', // Убираем прокси
    headers: {
      'Content-Type': 'application/json',
    },
  });

// Функции взаимодействия с backend

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

// 3. Получение проекта по id
const getProjectById = async (id) => {
  try {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getProjectById: Project with id ${id} not found.`, error);
    throw error;
  }
};

// 4. Удаление проекта по id
const deleteProjectById = async (id) => {
  try {
    const response = await apiClient.delete(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleteProjectById: Failed to delete project with id ${id}.`, error);
    throw error;
  }
};

// 5. Получение всех тест-кейсов
const getAllTestCases = async () => {
  try {
    const response = await apiClient.get('/testcase');
    return response.data;
  } catch (error) {
    console.error('Error getAllTestCases: Failed to fetch test cases.', error);
    throw error;
  }
};

// 6. Получение тест-кейса по id
const getTestCaseById = async (id) => {
  try {
    const response = await apiClient.get(`/testcase/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getTestCaseById: Test case with id ${id} not found.`, error);
    throw error;
  }
};

// 7. Создание тест-кейса в проекте
const createTestCaseInProject = async (projectId, testCaseData) => {
  console.log('Вхов в метод createTestCaseInProject')
  console.log(testCaseData)
  try {
    const response = await apiClient.post(`/project/${projectId}/testcase`, testCaseData);
    console.log('api - createTestCaseInProject - ' + response.data)
    return response.data;
  } catch (error) {
    console.error(`Error createTestCaseInProject: Failed to create test case in project with id ${projectId}.`, error);
    throw error;
  }
};

export {
  getAllProjects,
  createProject,
  getProjectById,
  deleteProjectById,
  getAllTestCases,
  getTestCaseById,
  createTestCaseInProject,
};

export default apiClient;