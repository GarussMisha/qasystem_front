import { createRouter, createWebHistory } from "vue-router";

// Импортируем компанеты (/src/components/) для маршрутов 
import HomePage from '@/views/HomePage.vue';
import ProjectList from '@/views/ProjectList.vue';
import ProjectDetail from '@/views/ProjectDetail.vue';

// Определяем паршруты
const routes = [
    {
        path: '/',
        name: 'Home',
        component: HomePage,
    },
    {
        path: '/projects',
        name: 'ProjectList',
        component: ProjectList,
    },
    {
        path: '/projects/:id',
        name: 'ProjectDetail',
        component: ProjectDetail,
    },
];

// Создаем экземпляр маршрутизатора
const router = createRouter ({
    history: createWebHistory(),
    routes,
});

export default router;