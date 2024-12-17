<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <h2>Удалить проект</h2>
      <div class="form-group">
        <label for="projectSelect">Выберите проект:</label>
        <select id="projectSelect" v-model="selectedProjectId" required>
          <option value="" disabled selected>Выберите проект</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.projectName }}
          </option>
        </select>
      </div>
      <p v-if="selectedProjectId">Вы уверены, что хотите удалить проект "{{ getProjectNameById(selectedProjectId) }}"?</p>
      <div class="button-group">
        <button type="button" @click="confirmDelete" class="delete-button" :disabled="!selectedProjectId">Удалить</button>
        <button type="button" @click="closeModal" class="cancel-button">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script>
import { useProjectStore } from '@/stores/projectStore'; // Импортируем хранилище проектов

export default {
  name: 'DeleteProjectModal',
  data() {
    return {
      selectedProjectId: '', // Инициализируем свойство
    };
  },
  computed: {
    projects() {
      const projectStore = useProjectStore();
      return projectStore.projects; // Получаем список проектов из хранилища
    },
  },
  methods: {
    getProjectNameById(projectId) {
      const projectStore = useProjectStore();
      const project = projectStore.projects.find(project => project.id === projectId);
      return project ? project.projectName : 'Неизвестный проект';
    },
    confirmDelete() {
      if (this.selectedProjectId) {
        console.log('Deleting project with ID:', this.selectedProjectId); // Логируем id проекта, который нужно удалить
        this.$emit('delete', this.selectedProjectId); // Отправляем id выбранного проекта в родительский компонент
      }
    },
    closeModal() {
      this.$emit('close'); // Закрываем модальное окно
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-sizing: border-box; /* Учитываем padding в общей ширине */
}

.modal-content h2 {
  margin-bottom: 20px;
  color: #333;
  text-align: center; /* Выравниваем заголовок по центру */
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #333;
}

.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box; /* Учитываем padding в общей ширине */
  color: #333;
}

.modal-content p {
  margin-bottom: 20px;
  color: #333;
  text-align: center; /* Выравниваем текст по центру */
}

.button-group {
  display: flex;
  justify-content: space-between; /* Равномерно распределяем кнопки */
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; /* Растягиваем кнопку на всю доступную ширину */
  margin-right: 10px; /* Добавляем отступ между кнопками */
}

.delete-button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.delete-button:hover:not(:disabled) {
  background-color: #c82333;
}

.cancel-button {
  background-color: #6c757d;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  flex: 1; /* Растягиваем кнопку на всю доступную ширину */
}

.cancel-button:hover {
  background-color: #5a6268;
}
</style>