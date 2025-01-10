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
   1. Методы для работы с ПРОЕКТАМИ
   -------------------------------------------------------------------------- */

// 1.1. Получение всех проектов
/* GET http://localhost:9090/project
Пример возвращаемых данных
{
        "id": 56,
        "projectName": "Телефон",
        "projectDescription": "Тестирование функций телефона",
        "testCases": [
            64,
            65
        ],
        "dateOfCreated": "2025-01-08T16:17:29.264106"
    },
*/
const getAllProjects = async () => {
  try {
    const response = await apiClient.get('/project');
    return response.data;
  } catch (error) {
    console.error('Error -> (api.js/getAllProjects):', error);
    throw error;
  }
};

// 1.2. Создание проекта
/* POST http://localhost:9090/project
Принимает:
{
    "projectName" : "Первый проект",
    "projectDescription" : "Описание первого проекта"
}
Возвращает:
{
    "id": 58,
    "projectName": "Первый проект",
    "projectDescription": "Описание первого проекта",
    "testCases": [],
    "dateOfCreated": "2025-01-08T17:02:56.8946154"
}
*/
const createProject = async (data) => {
  try {
    const response = await apiClient.post('/project', data);
    return response.data;
  } catch (error) {
    console.error('Error -> (api.js/createProject):', error);
    throw error;
  }
};

// 1.3. Получение проекта по projectId
/* GET http://localhost:9090/project/{projectId}
Принимает:

Возвращает:
{
    "id": 58,
    "projectName": "Первый проект",
    "projectDescription": "Описание первого проекта",
    "testCases": [],
    "dateOfCreated": "2025-01-08T17:02:56.894615"
}
*/
const getProjectById = async (projectId) => {
  try {
    const response = await apiClient.get(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/getProjectById): Project with id ${projectId} not found.`, error);
    throw error;
  }
};

// 1.4. Удаление проекта по ID
/* DELETE http://localhost:9090/project/{projectId}
Принимает:

Возвращает:
{
    "id": 56,
    "projectName": "Телефон",
    "projectDescription": "Тестирование функций телефона",
    "testCases": [
        64,
        65
    ],
    "dateOfCreated": "2025-01-08T16:17:29.264106"
}
*/
const deleteProjectById = async (projectId) => {
  try {
    const response = await apiClient.delete(`/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/deleteProjectById): Failed to delete project with id ${projectId}.`, error);
    throw error;
  }
};

// 1.5. Обновление (редактирование) проекта по projectId
/* PUT http://localhost:9090/project/{projectId}
Принимает:
{
    "projectName" : "Первый проект отредактирован",
    "projectDescription" : "Описание первого проекта отредактировано"
}
Возвращает:
{
    "id": 58,
    "projectName": "Первый проект отредактирован",
    "projectDescription": "Описание первого проекта отредактировано",
    "testCases": [],
    "dateOfCreated": "2025-01-08T17:02:56.894615"
}
Дополнительная информация:
Если не передать какой либо из параметров к примеру projectDescription. То Backend заменяет его на Null
*/
const updateProjectById = async (projectId, editProjectData) => {
  try {
    const response = await apiClient.put(`/project/${projectId}`, editProjectData);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/updateProjectById): Failed to edit project with id ${projectId}. Data = ${JSON.stringify(editProjectData)}`, error);
    throw error;
  }
};

/* --------------------------------------------------------------------------
   2. Методы для работы с ТЕСТ-КЕЙСАМИ
   -------------------------------------------------------------------------- */

// 2.1. Получение всех тест-кейсов (глобально, не только в рамках проекта)
/* GET http://localhost:9090/testcase
Принимает:

Возвращает:
[
    {
        "id": 67,
        "testcaseName": "Первый тесткейс",
        "testcaseDescription": "Описание первого тесткейса",
        "project": 58,
        "steps": [
            {
                "id": 9,
                "number": null,
                "step": "Первый шаг изменен",
                "resultStep": "Первый результат шага изменен"
            },
            {
                "id": 10,
                "number": null,
                "step": "Первый шаг изменен",
                "resultStep": "Первый результат шага изменен"
            }
        ],
        "dateOfCreated": "2025-01-08T17:16:39.240857"
    }
]
*/
const getAllTestCases = async () => {
  try {
    const response = await apiClient.get('/testcase');
    return response.data;
  } catch (error) {
    console.error('Error -> (api.js/getAllTestCases):', error);
    throw error;
  }
};

// 2.2. Получение тест-кейса по testCaseId
/* GET http://localhost:9090/testcase/{testcaseId}
Принимает:

Возвращает:
{
    "id": 66,
    "testcaseName": "Первый тесткейс",
    "testcaseDescription": "Описание первого тесткейса",
    "project": 58,
    "steps": [
        {
            "id": 4,
            "number": null,
            "step": "Первый шаг изменен",
            "resultStep": "Первый результат шага изменен"
        },
        {
            "id": 5,
            "number": null,
            "step": "Первый шаг изменен",
            "resultStep": "Первый результат шага изменен"
        }
    ],
    "dateOfCreated": "2025-01-08T17:07:24.28579"
}
*/
const getTestCaseById = async (testCaseId) => {
  try {
    const response = await apiClient.get(`/testcase/${testCaseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/getTestCaseById): Test case with id ${testCaseId} not found.`, error);
    throw error;
  }
};

// 2.3. Создание тест-кейса в конкретном проекте 
/* POST http://localhost:9090/project/{projectId}/testcase
Принимает:
{
    "testcaseName" : "Первый тесткейс",
    "testcaseDescription" : "Описание первого тесткейса",
    "steps" : [
        {
        "step" : "Первый шаг изменен",
        "resultStep" : "Первый результат шага изменен"
        },
        {
        "step" : "Первый шаг изменен",
        "resultStep" : "Первый результат шага изменен"
        }
    ]
}
Возвращает:
{
    "id": 66,
    "testcaseName": "Первый тесткейс",
    "testcaseDescription": "Описание первого тесткейса",
    "project": 58,
    "steps": [
        {
            "id": 4,
            "number": null,
            "step": "Первый шаг изменен",
            "resultStep": "Первый результат шага изменен"
        },
        {
            "id": 5,
            "number": null,
            "step": "Первый шаг изменен",
            "resultStep": "Первый результат шага изменен"
        }
    ],
    "dateOfCreated": "2025-01-08T17:07:24.2857899"
}
*/
const createTestCaseInProject = async (projectId, testCaseData) => {
  try {
    const response = await apiClient.post(`/project/${projectId}/testcase`, testCaseData);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/createTestCaseInProject): Failed to create test case in project with id ${projectId}. TestCaseData = ${JSON.stringify(testCaseData)}`, error);
    throw error;
  }
};

// 2.4. Получение всех тест-кейсов проекта по projectId
/* GET http://localhost:9090/project/{projectId}/testcase
Принимает:

Возвращает:
[
    {
        "id": 66,
        "testcaseName": "Первый тесткейс",
        "testcaseDescription": "Описание первого тесткейса",
        "project": 58,
        "steps": [
            {
                "id": 4,
                "number": null,
                "step": "Первый шаг изменен",
                "resultStep": "Первый результат шага изменен"
            },
            {
                "id": 5,
                "number": null,
                "step": "Первый шаг изменен",
                "resultStep": "Первый результат шага изменен"
            }
        ],
        "dateOfCreated": "2025-01-08T17:07:24.28579"
    }
]
*/
const getAllTestCaseByProjectId = async (projectId) => {
  try {
    const response = await apiClient.get(`/project/${projectId}/testcase`);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/getAllTestCaseByProjectId): Failed to get test cases for project with id ${projectId}.`, error);
    throw error;
  }
};

// 2.5. Обновление (редактирование) тест-кейса по ID в рамках проекта
/* PUT http://localhost:9090/project/{projectId}/testcase/{testcaseId}
Принимает:
{
    "testcaseName" : "Первый тесткейс изменен",
    "steps" : [
        {
            "number" : 1,
            "step" : "Первый шаг изменен",
            "resultStep" : "Первый результат шага изменен"
        },
        {
            "number" : 2,
            "step" : "Второй шаг изменен",
            "resultStep" : "Второй результат шага изменен"
        },
        {
            "number" : 3,
            "step" : "Третий шаг добавлен",
            "resultStep" : "Третий результат шага добавлен"
        }
    ]
    
}
Возвращает:
{
    "id": 66,
    "testcaseName": "Первый тесткейс изменен",
    "testcaseDescription": null,
    "project": 58,
    "steps": [
        {
            "id": 6,
            "number": 1,
            "step": "Первый шаг изменен",
            "resultStep": "Первый результат шага изменен"
        },
        {
            "id": 7,
            "number": 2,
            "step": "Второй шаг изменен",
            "resultStep": "Второй результат шага изменен"
        },
        {
            "id": 8,
            "number": 3,
            "step": "Третий шаг добавлен",
            "resultStep": "Третий результат шага добавлен"
        }
    ],
    "dateOfCreated": "2025-01-08T17:07:24.28579"
}
Дополнительная информация:
Если не передать какой либо из параметров к примеру testcaseDescription. То Backend заменяет его на Null
*/
const updateTestCaseById = async (projectId, testCaseId, editTestCaseData) => {
  try {
    const response = await apiClient.put(`/project/${projectId}/testcase/${testCaseId}`, editTestCaseData);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/updateTestCaseById): Failed to edit test case with id ${testCaseId} in project ${projectId}. EditTestCaseData = ${JSON.stringify(editTestCaseData)}`, error);
    throw error;
  }
};

// 2.6. Удаление тест кейса
/* DELETE http://localhost:9090/testcase/{testcaseId}
Принимает:

Возвращает:
{
    "id": 66,
    "testcaseName": "Первый тесткейс изменен",
    "testcaseDescription": null,
    "project": 58,
    "steps": [
        {
            "id": 6,
            "number": 1,
            "step": "Первый шаг изменен",
            "resultStep": "Первый результат шага изменен"
        },
        {
            "id": 7,
            "number": 2,
            "step": "Второй шаг изменен",
            "resultStep": "Второй результат шага изменен"
        },
        {
            "id": 8,
            "number": 3,
            "step": "Третий шаг добавлен",
            "resultStep": "Третий результат шага добавлен"
        }
    ],
    "dateOfCreated": "2025-01-08T17:07:24.28579"
}
*/
const deleteTestCaseById = async (testCaseId) => {
  try {
    const response = await apiClient.delete(`/testcase/${testCaseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error -> (api.js/deleteTestCaseById): Failed to delete test case with id ${testCaseId}.`, error);
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

export default apiClient;
