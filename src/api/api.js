import axios from 'axios';

// Базовая конфигурация для запросов
const apiClient = axios.create({
  baseURL: 'http://localhost:9090',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функции взаимодействия с backend

// 1. Получение всех проектов
export const getAllProjects = async (params) => {
  try {
    const response = await apiClient.get('/project', { params });
    return response.data;
  } catch (error) {
    console.error('Error getAllProjects:', error);
    throw error;
  }
};

// 2. Создание проекта
export const createProject = async (data) => {
  try {
    const response = await apiClient.post('/project', data);
    return response.data;
  } catch (error) {
    console.error('Error createProject:', error);
    throw error;
  }
};

// 3. Получение проекта по id
export const getProjectById = async (id) => {
  try {
    const response = await apiClient.get(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getProjectById: Project with id ${id} not found.`, error);
    throw error;
  }
};

// 4. Удаление проекта по id
export const deleteProjectById = async (id) => {
  try {
    const response = await apiClient.delete(`/project/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleteProjectById: Failed to delete project with id ${id}.`, error);
    throw error;
  }
};

// 5. Получение всех тест-кейсов
export const getAllTestCases = async () => {
  try {
    const response = await apiClient.get('/testcase');
    return response.data;
  } catch (error) {
    console.error('Error getAllTestCases: Failed to fetch test cases.', error);
    throw error;
  }
};

// 6. Получение тест-кейса по id
export const getTestCaseById = async (id) => {
  try {
    const response = await apiClient.get(`/testcase/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error getTestCaseById: Test case with id ${id} not found.`, error);
    throw error;
  }
};

// 7. Создание тест-кейса в проекте
export const createTestCaseInProject = async (projectId, testCaseData) => {
  try {
    const response = await apiClient.post(`/project/${projectId}/testcase`, testCaseData);
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