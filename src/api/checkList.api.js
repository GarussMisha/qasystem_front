import apiClient from "./axios";

/* --------------------------------------------------------------------------
                        Методы для работы с ЧЕК-ЛИСТАМИ
   -------------------------------------------------------------------------- */
export default {
    /**
     * 1. Получение всех Чек-листов
     * GET http://localhost:9090/checklist
     * Принимает:
     * 
     * Возвращает:
     * [
     * ]
     */
    async getAll(){
        try{
            const response = await apiClient.get('/checklist');
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> checkList.api.getAll(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 2. Получение Чек-листа по checkListId
     * GET http://localhost:9090/checklist/{checkListId}
     */
    async getById(checkListId){
        try{
            const response = await apiClient.get(`/checklist/${checkListId}`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> checkList.api.getById(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 3. Получение всех Чек-листов проекта по projectId
     * GET http://localhost:9090/project/{projectId}/checklist
     */
    async getAllByProjectId(projectId){
        try{
            const response = await apiClient.get(`/project/${projectId}/checklist`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> checkList.api.getAllByProjectId(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 4. Создать Чек-лист в конкретном проекте 
     * POST http://localhost:9090/project/{projectId}/checklist
     * 
     * Принимает:
     * {
            "checkListName" : "Первый чек-лист",
            "checkListDescription" : "Описание первого листа",
            "items" : [
                {
                    "item" : "Проверка сложения",
                    "testCaseId" : 1

                },
                {
                    "item" : "Проверка вычитания"
                }
            ]
            
        }
     * Возвращает:
     * {
            "id": 1,
            "checkListName": "Первый чек-лист",
            "checkListDescription": "Описание первого листа",
            "project": 2,
            "dateOfCreated": "2025-05-28T11:26:23.310037",
            "items": [
                {
                    "id": 1,
                    "number": 1,
                    "testCaseId": 1,
                    "item": "Проверка сложения"
                },
                {
                    "id": 2,
                    "number": 2,
                    "testCaseId": null,
                    "item": "Проверка вычитания"
                }
            ]
        }
     *
     */
    async create(projectId, checkListData){
        try{
            const response = await apiClient.post(`/project/${projectId}/checklist`, checkListData);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> checkList.api.create(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 5. Обновление (редактирование) тест-кейса по ID в рамках проекта
     * PUT http://localhost:9090/project/{projectId}/checklist/{checklistId}
     */
    async changeByIdInProjectId(projectId, checkListId, editCheckListData){
        try{
            const response = await apiClient.put(`/project/${projectId}/checklist/${checkListId}`, editCheckListData);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> checkList.api.changeByIdInProjectId(): ${error.message}`);
            console.error(customError);
            throw customError;
        }
    },
    /**
     * 6. Удаление Чек-листа
     * DELETE http://localhost:9090/checklist/{checklistId}
     */
    async deleteById(checklistId){
        try{
            const response = await apiClient.delete(`/checklist/${checklistId}`);
            console.log(response.data);
            return response.data;
        } catch (error){
            const customError = new Error(`Error -> checkList.api.deleteById(): ${error.message}, testCaseId = ${checklistId}`);
            console.error(customError);
            throw customError;
        }
    }
}
