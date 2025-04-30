import apiClient from "./axios";

/* --------------------------------------------------------------------------
                        Методы для работы с ТЕСТ-КЕЙСАМИ
   -------------------------------------------------------------------------- */
export default {
    /**
     * 1. Получение всех тест-кейсов (глобально, не только в рамках проекта)
     * GET http://localhost:9090/testcase
     * Принимает:
     * 
     * Возвращает:[
     *     {
     *         "id": 67,
     *         "testcaseName": "Первый тесткейс",
     *         "testcaseDescription": "Описание первого тесткейса",
     *         "project": 58,
     *         "steps": [
     *             {
     *                 "id": 9,
     *                 "number": null,
     *                 "step": "Первый шаг изменен",
     *                 "resultStep": "Первый результат шага изменен"
     *             },
     *             {
     *                 "id": 10,
     *                 "number": null,
     *                 "step": "Первый шаг изменен",
     *                 "resultStep": "Первый результат шага изменен"
     *             }
     *         ],
     *         "dateOfCreated": "2025-01-08T17:16:39.240857"
     *     }
     * ]
     */
    async getAll(){
        try{
            const response = await apiClient.get('/testcase');
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> testCase.api.getAll(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 2. Получение тест-кейса по testCaseId
     * GET http://localhost:9090/testcase/{testcaseId}
     * Принимает:
     * ---------
     * Возвращает:
     * {
     *     "id": 66,
     *     "testcaseName": "Первый тесткейс",
     *     "testcaseDescription": "Описание первого тесткейса",
     *     "project": 58,
     *     "steps": [
     *         {
     *             "id": 4,
     *             "number": null,
     *             "step": "Первый шаг изменен",
     *             "resultStep": "Первый результат шага изменен"
     *         },
     *         {
     *             "id": 5,
     *             "number": null,
     *             "step": "Первый шаг изменен",
     *             "resultStep": "Первый результат шага изменен"
     *         }
     *     ],
     *     "dateOfCreated": "2025-01-08T17:07:24.28579"
     * }
     */
    async getById(testCaseId){
        try{
            const response = await apiClient.get(`/testcase/${testCaseId}`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> testCase.api.getById(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 3. Получение всех тест-кейсов проекта по projectId
     * GET http://localhost:9090/project/{projectId}/testcase
     * Принимает:
     * ---------
     * Возвращает:
     * [
     *     {
     *         "id": 66,
     *         "testcaseName": "Первый тесткейс",
     *         "testcaseDescription": "Описание первого тесткейса",
     *         "project": 58,
     *         "steps": [
     *             {
     *                 "id": 4,
     *                 "number": null,
     *                 "step": "Первый шаг изменен",
     *                 "resultStep": "Первый результат шага изменен"
     *             },
     *             {
     *                 "id": 5,
     *                 "number": null,
     *                 "step": "Первый шаг изменен",
     *                 "resultStep": "Первый результат шага изменен"
     *             }
     *         ],
     *         "dateOfCreated": "2025-01-08T17:07:24.28579"
     *     }
     * ]
     */
    async getAllByProjectId(projectId){
        try{
            const response = await apiClient.get(`/project/${projectId}/testcase`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> testCase.api.getById(): ${error.message}, projectId = ${projectId}.`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 4. Создание тест-кейса в конкретном проекте 
     * POST http://localhost:9090/project/{projectId}/testcase
     * Принимает:
     * {
     *     "testcaseName" : "Первый тесткейс",
     *     "testcaseDescription" : "Описание первого тесткейса",
     *     "steps" : [
     *         {
     *         "step" : "Первый шаг изменен",
     *         "resultStep" : "Первый результат шага изменен"
     *         },
     *         {
     *         "step" : "Первый шаг изменен",
     *         "resultStep" : "Первый результат шага изменен"
     *         }
     *     ]
     * }
     * Возвращает:
     * {
     *     "id": 66,
     *     "testcaseName": "Первый тесткейс",
     *     "testcaseDescription": "Описание первого тесткейса",
     *     "project": 58,
     *     "steps": [
     *         {
     *             "id": 4,
     *             "number": null,
     *             "step": "Первый шаг изменен",
     *             "resultStep": "Первый результат шага изменен"
     *         },
     *         {
     *             "id": 5,
     *             "number": null,
     *             "step": "Первый шаг изменен",
     *             "resultStep": "Первый результат шага изменен"
     *         }
     *     ],
     *     "dateOfCreated": "2025-01-08T17:07:24.2857899"
     * }  
     */
    async create(projectId, testCaseData){
        try{
            const response = await apiClient.post(`/project/${projectId}/testcase`, testCaseData);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> testCase.api.create(): ${error.message}, projectId = ${projectId}, TestCaseData = ${JSON.stringify(testCaseData)}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 5. Обновление (редактирование) тест-кейса по ID в рамках проекта
     * PUT http://localhost:9090/project/{projectId}/testcase/{testcaseId}
     * Принимает:
     * {
     *     "testcaseName" : "Первый тесткейс изменен",
     *     "steps" : [
     *         {
     *             "number" : 1,
     *             "step" : "Первый шаг изменен",
     *             "resultStep" : "Первый результат шага изменен"
     *         },
     *         {
     *             "number" : 2,
     *             "step" : "Второй шаг изменен",
     *             "resultStep" : "Второй результат шага изменен"
     *         },
     *         {
     *             "number" : 3,
     *             "step" : "Третий шаг добавлен",
     *             "resultStep" : "Третий результат шага добавлен"
     *         }
     *     ]
     *     
     * }
     * Возвращает:
     * {
     *     "id": 66,
     *     "testcaseName": "Первый тесткейс изменен",
     *     "testcaseDescription": null,
     *     "project": 58,
     *     "steps": [
     *         {
     *             "id": 6,
     *             "number": 1,
     *             "step": "Первый шаг изменен",
     *             "resultStep": "Первый результат шага изменен"
     *         },
     *         {
     *             "id": 7,
     *             "number": 2,
     *             "step": "Второй шаг изменен",
     *             "resultStep": "Второй результат шага изменен"
     *         },
     *         {
     *             "id": 8,
     *             "number": 3,
     *             "step": "Третий шаг добавлен",
     *             "resultStep": "Третий результат шага добавлен"
     *         }
     *     ],
     *     "dateOfCreated": "2025-01-08T17:07:24.28579"
     * }
     * Дополнительная информация:
     * Если не передать какой либо из параметров к примеру testcaseDescription. То Backend заменяет его на Null
     */
    async changeByIdInProjectId(projectId, testCaseId, editTestCaseData){
        try{
            const response = await apiClient.put(`/project/${projectId}/testcase/${testCaseId}`, editTestCaseData);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> testCase.api.changeByIdInProjectId(): ${error.message}, projectId = ${projectId}, testCaseId = ${testCaseId}, TestCaseData = ${JSON.stringify(editTestCaseData)}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 6. Удаление тест кейса
     * DELETE http://localhost:9090/testcase/{testcaseId}
     * Принимает:
     * 
     * Возвращает:
     * 
     * 
     *     "id": 66,
     *     "testcaseName": "Первый тесткейс изменен",
     *     "testcaseDescription": null,
     *     "project": 58,
     *     "steps": [
     *         {
     *             "id": 6,
     *             "number": 1,
     *             "step": "Первый шаг изменен",
     *             "resultStep": "Первый результат шага изменен"
     *         },
     *         {
     *             "id": 7,
     *             "number": 2,
     *             "step": "Второй шаг изменен",
     *             "resultStep": "Второй результат шага изменен"
     *         },
     *         {
     *             "id": 8,
     *             "number": 3,
     *             "step": "Третий шаг добавлен",
     *             "resultStep": "Третий результат шага добавлен"
     *        }
     * 
     *     ],
     *     "dateOfCreated": "2025-01-08T17:07:24.28579"
     * }
     */
    async deleteById(testCaseId){
        try{
            const response = await apiClient.delete(`/testcase/${testCaseId}`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> testCase.api.deleteById(): ${error.message}, testCaseId = ${testCaseId}`);
            console.error(customError);
            throw customError;
        }
    }
}
