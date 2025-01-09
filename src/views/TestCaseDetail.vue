<!-- TestCaseDetail.vue -->
<template>
  <div>
    <!-- Состояние загрузки -->
    <div v-if="loading" class="loading-container">
      <p>Загрузка тест-кейса...</p>
    </div>

    <!-- Состояние ошибки -->
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button class="btn btn-back" @click="goBack">Назад</button>
    </div>

    <!-- Основной контент -->
    <div v-else-if="testCase" class="page-container">
      <!-- Заголовок с информацией о тест-кейсе -->
      <div class="page-header">
        <h1 class="page-title">
          {{ testCase.testcaseName }}
          <span class="page-id">(#{{ testCase.id }})</span>
        </h1>
        <p class="page-description">{{ testCase.testcaseDescription || 'Нет описания' }}</p>

        <!-- Дата создания тест-кейса -->
        <p class="page-created"> 
          <span v-if="testCase.dateOfCreated">
            {{ formatDate(testCase.dateOfCreated) }}
          </span>
          <span v-else>Неизвестно</span>
        </p>

        <div class="page-actions">
          <!-- Блок кнопок (Редактировать/Удалить) -->
          <button class="btn btn-edit" @click="showEditModal = true">Редактировать тест-кейс</button>
          <button class="btn btn-delete" @click="showDeleteModal = true">Удалить тест-кейс</button>
        </div>
      </div>

      <!-- Блок действий (справа) -->
      <div class="top-actions">
        <!-- Кнопка создания шага -->
        <button class="btn btn-create" @click="showCreateStepModal = true">
          Создать шаг
        </button>
      </div>

      <!-- Контейнер для списка шагов -->
      <div class="list-container">
        <h2>Шаги:</h2>
        <ul class="list">
          <li v-for="(step, index) in testCase.steps" :key="step.id || index" class="list-item">
            <h3 class="item-title">Шаг {{ index + 1 }}:</h3>
            <p class="item-desc"><strong>Действие:</strong> {{ step.step }}</p>
            <p class="item-desc"><strong>Ожидаемый результат:</strong> {{ step.resultStep }}</p>
            <!-- Кнопки для редактирования и удаления шага -->
            <div class="step-actions">
              <button class="btn btn-step-edit" @click="editStep(index)">Редактировать шаг</button>
              <button class="btn btn-step-delete" @click="deleteStep(index)">Удалить шаг</button>
            </div>
          </li>
        </ul>
      </div>
      <!-- Кнопка назад -->
      <div class="bottom-actions">
          <button class="btn btn-back" @click="goBack">Назад</button>
      </div>
    </div>

    <!-- Отображение, если тест-кейс не найден -->
    <div v-else class="not-found-container">
      <p>Тест-кейс не найден.</p>
      <button class="btn btn-back" @click="goBack">Назад</button>
    </div>

    <!-- Модальные окна -->
    <DeleteTestCaseModal
      v-if="showDeleteModal"
      :projectId="projectId"
      :testCaseId="testCase.id"
      :testCaseName="testCase.testcaseName"
      @close="showDeleteModal = false"
      @deleted="handleTestCaseDeleted"
    />

    <EditTestCaseModal
      v-if="showEditModal"
      :testCase="testCase"
      @close="showEditModal = false"
      @edited="handleTestCaseEdited"
    />

    <CreateStepModal
      v-if="showCreateStepModal"
      :testCaseId="testCase.id"
      @close="showCreateStepModal = false"
      @step-created="handleStepCreated"
    />

    <EditStepModal
      v-if="showEditStepModal"
      :testCaseId="testCase.id"
      :step="currentStep"
      :stepIndex="currentStepIndex"
      @close="showEditStepModal = false"
      @step-edited="handleStepEdited"
    />

    <DeleteStepModal
      v-if="showDeleteStepModal"
      :testCaseId="testCase.id"
      :stepIndex="currentStepIndex"
      @close="showDeleteStepModal = false"
      @step-deleted="handleStepDeleted"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useProjectDataStore } from '@/stores/ProjectDataStore';

import DeleteTestCaseModal from '@/components/modal/testCase/DeleteTestCaseModal.vue';
import EditTestCaseModal from '@/components/modal/testCase/EditTestCaseModal.vue';
import CreateStepModal from '@/components/modal/step/CreateStepModal.vue';
import EditStepModal from '@/components/modal/step/EditStepModal.vue';
import DeleteStepModal from '@/components/modal/step/DeleteStepModal.vue';

export default {
  name: 'TestCaseDetail',
  components: {
    DeleteTestCaseModal,
    EditTestCaseModal,
    CreateStepModal,
    EditStepModal,
    DeleteStepModal,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const projectDataStore = useProjectDataStore();

    const projectId = Number(route.params.projectId);
    const testCaseId = Number(route.params.testCaseId);

    const testCase = ref(null);
    const loading = ref(false);
    const error = ref(null);

    // Флаги для отображения модальных окон
    const showDeleteModal = ref(false);
    const showEditModal = ref(false);
    const showCreateStepModal = ref(false);
    const showEditStepModal = ref(false);
    const showDeleteStepModal = ref(false);

    // Данные для редактирования или удаления шага
    const currentStep = ref(null);
    const currentStepIndex = ref(null);

    // Метод для загрузки тест-кейса
    const loadTestCase = async () => {
      loading.value = true;
      error.value = null;
      try {
        const fetched = await projectDataStore.fetchTestCaseById(testCaseId);
        if (fetched) {
          testCase.value = fetched;
          console.log('Loaded TestCase:', testCase.value); // Для отладки
        } else {
          throw new Error('Тест-кейс не найден.');
        }
      } catch (err) {
        error.value = err.message || 'Ошибка при загрузке тест-кейса.';
        console.error('TestCaseDetail - loadTestCase error:', err);
      } finally {
        loading.value = false;
      }
    };

    // Метод для возврата на страницу проекта
    const goBack = () => {
      router.push(`/projects/${projectId}`);
    };

    // Обработчики событий для модальных окон
    const handleTestCaseDeleted = () => {
      // После успешного удаления тест-кейса перенаправляем на страницу проекта
      router.push(`/projects/${projectId}`);
    };

    const handleTestCaseEdited = (updatedTestCase) => {
      testCase.value = updatedTestCase;
      // Можно добавить уведомление о успешном редактировании
      // showToast('Тест-кейс успешно обновлён.');
    };

    const handleStepCreated = (newStep) => {
      const updatedSteps = [
        ...testCase.value.steps,
        {
          number: testCase.value.steps.length + 1,
          step: newStep.step,
          resultStep: newStep.resultStep,
        },
      ];
      const updatedTestCaseData = {
        testcaseName: testCase.value.testcaseName,
        testcaseDescription: testCase.value.testcaseDescription,
        steps: updatedSteps,
      };
      updateTestCase(updatedTestCaseData);
    };

    const editStep = (index) => {
      currentStepIndex.value = index;
      currentStep.value = { ...testCase.value.steps[index] };
      showEditStepModal.value = true;
    };

    const handleStepEdited = (updatedStep) => {
      const updatedSteps = [...testCase.value.steps];
      updatedSteps[currentStepIndex.value] = {
        ...updatedSteps[currentStepIndex.value],
        step: updatedStep.step,
        resultStep: updatedStep.resultStep,
      };
      const updatedTestCaseData = {
        testcaseName: testCase.value.testcaseName,
        testcaseDescription: testCase.value.testcaseDescription,
        steps: updatedSteps.map((s, idx) => ({
          number: idx + 1,
          step: s.step,
          resultStep: s.resultStep,
        })),
      };
      updateTestCase(updatedTestCaseData);
    };

    const deleteStep = (index) => {
      currentStepIndex.value = index;
      showDeleteStepModal.value = true;
    };

    const handleStepDeleted = () => {
      const updatedSteps = testCase.value.steps
        .filter((_, idx) => idx !== currentStepIndex.value)
        .map((s, idx) => ({
          number: idx + 1,
          step: s.step,
          resultStep: s.resultStep,
        }));
      const updatedTestCaseData = {
        testcaseName: testCase.value.testcaseName,
        testcaseDescription: testCase.value.testcaseDescription,
        steps: updatedSteps,
      };
      updateTestCase(updatedTestCaseData);
    };

    /**
     * Метод для обновления тест-кейса с учётом изменений
     * @param {Object} updatedTestCaseData - Объект с обновлёнными данными тест-кейса
     */
    const updateTestCase = async (updatedTestCaseData) => {
      loading.value = true;
      error.value = null;
      try {
        const updatedTestCase = await projectDataStore.updateTestCase(projectId, testCaseId, updatedTestCaseData);
        if (updatedTestCase) {
          testCase.value = updatedTestCase;
          console.log('Updated TestCase:', testCase.value); // Для отладки
          // Можно добавить уведомление о успешном обновлении
          // showToast('Тест-кейс успешно обновлён.');
        } else {
          throw new Error('Не удалось обновить тест-кейс. Попробуйте ещё раз.');
        }
      } catch (err) {
        error.value = err.message || 'Ошибка при обновлении тест-кейса.';
        console.error('TestCaseDetail - updateTestCase error:', err);
      } finally {
        loading.value = false;
      }
    };

    /**
     * Форматирование даты в удобочитаемый формат
     * @param {String} dateString - Строка даты в формате ISO
     * @returns {String} - Отформатированная дата
     */
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };

    onMounted(() => {
      loadTestCase();
    });

    return {
      projectId,
      testCase,
      loading,
      error,
      goBack,

      // Флаги модальных окон
      showDeleteModal,
      showEditModal,
      showCreateStepModal,
      showEditStepModal,
      showDeleteStepModal,

      // Данные для шага
      currentStep,
      currentStepIndex,

      // Методы
      handleTestCaseDeleted,
      handleTestCaseEdited,
      handleStepCreated,
      editStep,
      handleStepEdited,
      deleteStep,
      handleStepDeleted,
      formatDate, // Добавляем метод форматирования даты
    };
  },
};
</script>


