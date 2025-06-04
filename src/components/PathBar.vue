<!-- File: src/components/PathBar.vue -->
<template>
  <header class="path-bar" v-if="showPathBar">
    <nav class="breadcrumb">
      <span
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="crumb"
      >
        <router-link
          v-if="crumb.to"
          :to="crumb.to"
          class="crumb-link"
        >
          {{ crumb.text }}
        </router-link>
        <span v-else class="crumb-text">{{ crumb.text }}</span>

        <!-- Разделитель, если не последний элемент -->
        <span v-if="index < breadcrumbs.length - 1" class="crumb-sep">/</span>
      </span>
    </nav>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { currentPathTitle } from '@/store/pathTitle'

const pathMap = {
  '/': 'Главная',
  '/info': 'Инфо',
  '/projects': 'Проекты',
  '/debug': 'Дебаг',
  '/profile': 'Профиль'
}

const route = useRoute()

const breadcrumbs = computed(() => {
  const crumbs = []
  const { params, path, name, meta } = route

  if (path in pathMap && !params.projectId && !params.testCaseId && !params.checkListId) {
    crumbs.push({ text: pathMap[path], to: { path } })
    return crumbs
  }

  if (path === '/projects') {
    crumbs.push({ text: pathMap['/projects'], to: { name: 'ProjectList' } })
    return crumbs
  }

  if (name === 'ProjectDetail') {
    const projectName = currentPathTitle.value || `Проект #${params.projectId}`
    crumbs.push({ text: 'Проекты', to: { name: 'ProjectList' } })
    crumbs.push({
      text: projectName,
      to: { name: 'ProjectDetail', params: { projectId: params.projectId } }
    })
    return crumbs
  }

  if (params.projectId && params.testCaseId && path.includes('/testcases/')) {
    const projectName = meta.projectName || `Проект #${params.projectId}`

    crumbs.push({ text: 'Проекты', to: { name: 'ProjectList' } })
    crumbs.push({
      text: projectName,
      to: { name: 'ProjectDetail', params: { projectId: params.projectId } }
    })
    crumbs.push({
      text: 'Тест-кейсы',
      to: {
        name: 'ProjectDetail',
        params: { projectId: params.projectId },
        query: { tab: 'testcases' }
      }
    })
    crumbs.push({
      text: currentPathTitle.value || `ТК #${params.testCaseId}`,
      to: null
    })
    return crumbs
  }

  if (params.projectId && params.checkListId && path.includes('/checklists/')) {
    const projectName = meta.projectName || `Проект #${params.projectId}`

    crumbs.push({ text: 'Проекты', to: { name: 'ProjectList' } })
    crumbs.push({
      text: projectName,
      to: { name: 'ProjectDetail', params: { projectId: params.projectId } }
    })
    crumbs.push({
      text: 'Чек-листы',
      to: {
        name: 'ProjectDetail',
        params: { projectId: params.projectId },
        query: { tab: 'checklists' }
      }
    })
    crumbs.push({
      text: currentPathTitle.value || `ЧЛ #${params.checkListId}`,
      to: null
    })
    return crumbs
  }

  if (currentPathTitle.value) {
    crumbs.push({ text: currentPathTitle.value, to: null })
  } else {
    crumbs.push({ text: 'Неизвестная страница', to: null })
  }
  return crumbs
})

const showPathBar = computed(() => true)
</script>

<style scoped>
.path-bar {
  background-color: #f5f5f5;
  padding: 10px 15px;
  border-bottom: 1px solid #e0e0e0;
}

.breadcrumb {
  display: flex;
  gap: 4px;
  font-size: 14px;
  color: #333;
  font-family: Arial, sans-serif;
}

.crumb {
  display: flex;
  align-items: center;
}

.crumb-link {
  color: #007bff;
  text-decoration: none;
}
.crumb-link:hover {
  text-decoration: underline;
}

.crumb-text {
  color: #333;
}

.crumb-sep {
  margin: 0 4px;
  color: #666;
}
</style>
