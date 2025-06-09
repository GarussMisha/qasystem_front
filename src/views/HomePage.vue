<template>
  <div class="home-page">
    <div class="home-container">
      <!-- Левая колонка: общая информация о проектах -->
      <section class="projects-overview">
        <h2>Мои проекты</h2>
        <p>Всего проектов: <strong>{{ projects.length }}</strong></p>
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Название</th>
              <th>Дата создания</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="project in projects"
              :key="project.id"
              @click="goToProject(project.id)"
              class="table-row"
            >
              <td>#{{ project.id }}</td>
              <td>{{ project.projectName }}</td>
              <td>{{ formatDate(project.dateOfCreated) }}</td>
            </tr>
            <tr v-if="projects.length === 0">
              <td colspan="3" class="empty">Проекты не найдены</td>
            </tr>
          </tbody>
        </table>
      </section>

      <!-- Правая колонка: последние обновления -->
      <section class="recent-updates">
        <div class="update-block">
          <h2>Последние тест-кейсы</h2>
          <table class="table compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Проект</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tc in recentTestCases"
                :key="tc.id"
                @click="goToTestCase(tc.project, tc.id)"
                class="table-row"
              >
                <td>#{{ tc.id }}</td>
                <td>{{ tc.testcaseName }}</td>
                <td>#{{ tc.project }}</td>
                <td>{{ formatDate(tc.dateOfCreated) }}</td>
              </tr>
              <tr v-if="recentTestCases.length === 0">
                <td colspan="4" class="empty">Тест-кейсы не найдены</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="update-block">
          <h2>Последние чек-листы</h2>
          <table class="table compact">
            <thead>
              <tr>
                <th>ID</th>
                <th>Название</th>
                <th>Проект</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="cl in recentCheckLists"
                :key="cl.id"
                @click="goToCheckList(cl.project, cl.id)"
                class="table-row"
              >
                <td>#{{ cl.id }}</td>
                <td>{{ cl.checkListName }}</td>
                <td>#{{ cl.project }}</td>
                <td>{{ formatDate(cl.dateOfCreated) }}</td>
              </tr>
              <tr v-if="recentCheckLists.length === 0">
                <td colspan="4" class="empty">Чек-листы не найдены</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import projectApi from "@/api/project.api.js";
import testCaseApi from "@/api/testCase.api.js";
import checkListApi from "@/api/checkList.api.js";

export default {
  name: "HomePage",
  setup() {
    const router = useRouter();

    const projects = ref([]);
    const testCases = ref([]);
    const checkLists = ref([]);

    async function loadAllData() {
      try {
        projects.value = await projectApi.getAll();
      } catch (e) {
        console.error("Ошибка при загрузке проектов:", e);
      }
      try {
        testCases.value = await testCaseApi.getAll();
      } catch (e) {
        console.error("Ошибка при загрузке тест-кейсов:", e);
      }
      try {
        checkLists.value = await checkListApi.getAll();
      } catch (e) {
        console.error("Ошибка при загрузке чек-листов:", e);
      }
    }

    onMounted(loadAllData);

    const recentTestCases = computed(() => {
      return [...testCases.value]
        .sort(
          (a, b) =>
            new Date(b.dateOfCreated).getTime() - new Date(a.dateOfCreated).getTime()
        )
        .slice(0, 5);
    });

    const recentCheckLists = computed(() => {
      return [...checkLists.value]
        .sort(
          (a, b) =>
            new Date(b.dateOfCreated).getTime() - new Date(a.dateOfCreated).getTime()
        )
        .slice(0, 5);
    });

    function formatDate(dateStr) {
      if (!dateStr) return "—";
      return new Date(dateStr).toLocaleString("ru-RU", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    const goToProject = (projectId) => {
      router.push({ name: "ProjectDetail", params: { projectId } });
    };
    const goToTestCase = (projectId, testCaseId) => {
      router.push({ name: "TestCasePage", params: { projectId, testCaseId } });
    };
    const goToCheckList = (projectId, checkListId) => {
      router.push({ name: "CheckListPage", params: { projectId, checkListId } });
    };

    return {
      projects,
      recentTestCases,
      recentCheckLists,
      formatDate,
      goToProject,
      goToTestCase,
      goToCheckList,
    };
  },
};
</script>

<style scoped>
.home-page {
  padding: 20px;
  background: #fafafa;
  min-height: 100vh;
  box-sizing: border-box;
}

.home-container {
  display: flex;
  gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
  box-sizing: border-box;
}

.projects-overview {
  flex: 0 0 40%;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.projects-overview h2 {
  margin-bottom: 12px;
  font-size: 1.25rem;
  color: #333;
}
.projects-overview p {
  margin-bottom: 16px;
  color: #555;
}

.recent-updates {
  flex: 0 0 60%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.update-block {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.update-block h2 {
  margin-bottom: 12px;
  font-size: 1.25rem;
  color: #333;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
}
.table th,
.table td {
  padding: 8px 12px;
  border: 1px solid #ddd;
  vertical-align: middle;
}
.table th {
  background: #f0f0f0;
  font-weight: 600;
  color: #333;
}
.table-row {
  cursor: pointer;
}
.table-row:hover {
  background: #f5f5f5;
}

.compact th,
.compact td {
  padding: 6px 8px;
  font-size: 0.9rem;
}
.compact th {
  background: #f7f7f7;
}

.empty {
  text-align: center;
  color: #888;
}

@media (max-width: 1000px) {
  .home-container {
    flex-direction: column;
  }
  .projects-overview,
  .recent-updates {
    flex: 1 1 auto;
  }
}
</style>
