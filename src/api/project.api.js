import apiClient from "./axios";

/* --------------------------------------------------------------------------
                        Методы для работы с ПРОЕКТАМИ
   -------------------------------------------------------------------------- */
export default {
    /**
     * 1. Получение всех проектов.
     * GET http://localhost:9090/project
     * Пример возвращаемых данных
     * [
     *  {
     *      "id": 56,
     *      "projectName": "Телефон",
     *      "projectDescription": "Тестирование функций телефона",
     *      "projectStatus": "ACTIVE",
     *      "testCases": [64, 65],
     *      "dateOfCreated": "2025-01-08T16:17:29.264106"
     *  },
     * ]
     */
    async getAll(){
        try{
            const response = await apiClient.get('/project');
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> project.api.getAll(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 2. Получение проекта по projectId
     * GET http://localhost:9090/project/{projectId}
     * Принимает:
     * ---------
     *      * Возвращает:
     * {
     *     "id": 58,
     *     "projectName": "Первый проект",
     *     "projectDescription": "Описание первого проекта",
     *     "projectStatus": "ACTIVE",
     *     "testCases": [],
     *     "dateOfCreated": "2025-01-08T17:02:56.894615"
     * } 
     */
    async getById(projectId) {
        try{
            const response = await apiClient.get(`/project/${projectId}`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> project.api.getById(): ${error.message}. projectId = ${projectId}`);
            console.error(customError);
            throw customError
        }
    },
    /**
     * 3. Создание проекта
     * POST http://localhost:9090/project
     * Принимает:
     * {
     *  "projectName" : "Первый проект",
     *  "projectDescription" : "Описание первого проекта"
     * }
     * Возвращает:
     * {
     *     "id": 58,
     *     "projectName": "Первый проект",
     *     "projectDescription": "Описание первого проекта",
     *     "projectStatus": "ACTIVE",
     *     "testCases": [],
     *     "dateOfCreated": "2025-01-08T17:02:56.8946154"
     * }
     *  
     */
    async create(data){
        try{
            const response = await apiClient.post('/project', data);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> project.api.create(): ${error.message}`);
            console.error(customError);
            throw customError
        }
    },
    /**
     * 4. Удаление проекта по ID
     * DELETE http://localhost:9090/project/{projectId}
     * Принимает:
     * ---------
     * Возвращает:
     * {
     *     "id": 56,
     *     "projectName": "Телефон",
     *     "projectDescription": "Тестирование функций телефона",
     *     "projectStatus": "ACTIVE",
     *     "testCases": [64, 65],
     *     "dateOfCreated": "2025-01-08T16:17:29.264106"
     * }
     */
    async deleteById(projectId){
        try{
            const response = await apiClient.delete(`/project/${projectId}`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> project.api.deleteById(): ${error.message}. projectId = ${projectId}`);
            console.error(customError);
            throw customError
        }
    },
    /**
     * 5. Обновление (редактирование) проекта по projectId
     * PUT http://localhost:9090/project/{projectId}
     * Принимает:
     * {
     *     "projectName" : "Первый проект отредактирован",
     *     "projectDescription" : "Описание первого проекта отредактировано"
     * }
     * Возвращает:
     * {
     *     "id": 58,
     *     "projectName": "Первый проект отредактирован",
     *     "projectDescription": "Описание первого проекта отредактировано",
     *     "projectStatus": "ACTIVE",
     *     "testCases": [],
     *     "dateOfCreated": "2025-01-08T17:02:56.894615"
     * }
     * Дополнительная информация:
     * Если не передать какой либо из параметров к примеру projectDescription. То Backend заменяет его на Null
     */
    async changeById(projectId, editProjectData){
        try{
            const response = await apiClient.put(`/project/${projectId}`, editProjectData);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> project.api.changeById(): ${error.message}. projectId = ${projectId}, Data = ${JSON.stringify(editProjectData)}`);
            console.error(customError);
            throw customError
        }
    }
}
