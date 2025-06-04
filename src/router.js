// router.js
import { createRouter, createWebHistory } from "vue-router";
import ProjectList from '@/views/ProjectList.vue';
import ProjectDetail from '@/views/ProjectDetail.vue';
import TestCasePage from '@/views/TestCasePage.vue';
import CheckListPage from '@/views/CheckListPage.vue';
import HomePage from '@/views/HomePage.vue';
import InfoPage from "@/views/InfoPage.vue";
import ProfilePage from "@/views/ProfilePage.vue";
import DebugPage from "@/views/DebugPage.vue";

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
    path: '/projects/:projectId',
    name: 'ProjectDetail',
    component: ProjectDetail
  },
  {
    path: '/projects/:projectId/testcases/:testCaseId',
    name: 'TestCasePage',
    component: TestCasePage,
    props: true
  },
  {
    path: '/projects/:projectId/checklists/:checkListId',
    name: 'CheckListPage',
    component: CheckListPage,
    props: true
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
    path: '/debug',
    name: 'DebugPage',
    component: DebugPage,
  },
  //fallback route
  {
  path: '/:pathMatch(.*)*',
  redirect: '/'
}

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
