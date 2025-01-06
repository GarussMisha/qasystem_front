import { createRouter, createWebHistory } from "vue-router";

// Импортируем компанеты (/src/components/) для маршрутов 
import HomePage from '@/views/HomePage.vue';
import ProjectList from '@/views/ProjectList.vue';
import ProjectDetail from '@/views/ProjectDetail.vue';
import InfoPage from "./views/InfoPage.vue";
import ProfilePage from "./views/ProfilePage.vue";
import CheckStores from "./views/CheckStores.vue";

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
    {
        path: '/info',
        name: 'InfoPage',
        component: InfoPage,
    },
    {
        path: '/profile',
        name: 'ProfilePage',
        component: ProfilePage,
    },
    {
        path: '/checkstores',
        name: 'CheckStores',
        component: CheckStores,
    },
];

// Создаем экземпляр маршрутизатора
const router = createRouter ({
    history: createWebHistory(),
    routes,
});

export default router;