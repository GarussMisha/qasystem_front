import axios from 'axios';

//Базовая конфигурация для запросов
const apiClient = axios.create({
    baseURL: 'http://localhost:9090',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Функции взаиможействия с backend
// 1. Получение всех проектов 
export const getAllProjects = async (params) => {
    try {
        const response = await apiClient.get('/project', {params});
        return response.data;
    } catch (error) {
        console.error('Error getAllProjects: ', error);
        throw error;
    }
};

// 2. Создание проекта
export const createProject = async (data) => {
    try {
        const response = await apiClient.post('/project', data);
        return response.data;
    } catch (error) {
        console.error('Error createProject: ', error);
        throw error;
    }
};

// 3. Получение проекта по id
export const getProjectById = async (id) => {
    try {
      const response = await apiClient.get(`/project/${id}`); 
      return response.data;
    } catch (error) {
      console.error(`Error getProjectById not find id - ${id}: `, error);
      throw error;
    }
};

// 4. Удаление прокета по id
export const deleteProjectById = async (id) => {
    try {
      const response = await apiClient.delete(`/project/${id}`);
      return response.data; 
    } catch (error) {
      console.error(`Error deleteProjectById deleting project with id - ${id}: `, error);
      throw error;
    }
};

// 5. Получение всех тест кейсов
export const getAllTestCases = async () => {
    try {
      const response = await apiClient.get('/testcase');
      return response.data;
    } catch (error) {
      console.error('Error getAllTestCases fetching test cases: ', error);
      throw error;
    }
};

// 6. Получение тест кейса по id
export const getTestCaseById = async (id) => {
    try {
      const response = await apiClient.get(`/testcase/${id}`); 
      return response.data;
    } catch (error) {
      console.error(`Error getTestCaseById not find id - ${id}: `, error);
      throw error;
    }
};

// 7. Создание тест кейса в проекте
export const createTestCaseInProject = async (projectId, testCaseData) => {
    try {
        const response = await apiClient.post(`/project/${projectId}`, testCaseData);
        return response.data;
    } catch (error) {
        console.error(`Error createTestCaseInProject - ${projectId}: `, error);
        throw error;
    }
};

export default apiClient;
