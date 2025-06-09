<template>
  <div class="info-page">
    <!-- Верхняя карточка с общим описанием -->
    <section class="info-card">
      <h1 class="info-title">Добро пожаловать в QASystem</h1>
      <p class="info-text">
        QASystem — это веб-приложение, предназначенное для организации и управления процессом тестирования
        программного обеспечения. Оно позволяет автоматизировать рутинные задачи, централизованно управлять
        тест-кейсами, чек-листами и проектами, а также интегрироваться с другими инструментами разработки.
      </p>
    </section>

    <!-- Карточка с руководством по функционалу -->
    <section class="guide-card">
      <h2 class="guide-title">Компоненты и функционал</h2>
      <ul class="guide-list">
        <li>
          <span class="bullet">•</span>
          <strong>Модуль ведения проектов:</strong>
          создание, редактирование и удаление проектов. Например, «Калькулятор» может быть отдельным проектом.
        </li>
        <li>
          <span class="bullet">•</span>
          <strong>Модуль тест-кейсов:</strong>
          управление тест-кейса и его шагами, включая создание, редактирование и удаление. Для модуля «Калькулятор»
          это может быть проверка операций сложения, вычитания и т. д.
        </li>
        <li>
          <span class="bullet">•</span>
          <strong>Управление чек-листами:</strong>
          добавление, редактирование и удаление чек-листов для удобного планирования процесса тестирования.
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
export default {
  name: 'InfoPage',
};
</script>

<style scoped>
/* Общий контейнер */
.info-page {
  max-width: 1024px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9fb;
  color: #333;
}

/* Карточка с описанием */
.info-card {
  background-color: #292961;
  color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.info-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 12px;
}

.info-text {
  font-size: 16px;
  line-height: 1.6;
  color: #d0d0ff;
  margin: 0;
}

/* Карточка с руководством */
.guide-card {
  background-color: #ffffff;
  color: #333333;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.guide-title {
  font-size: 20px;
  font-weight: bold;
  margin: 0 0 16px;
  color: #292961;
}

.guide-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.guide-list li {
  position: relative;
  padding-left: 24px;
  margin-bottom: 14px;
  font-size: 15px;
  line-height: 1.5;
}

.guide-list li .bullet {
  position: absolute;
  left: 0;
  top: 2px;
  color: #6200ea;
  font-size: 18px;
  line-height: 1;
}

.guide-list li strong {
  font-weight: bold;
  color: #292961;
}

/* Адаптив */
@media (max-width: 768px) {
  .info-card, .guide-card {
    padding: 16px;
  }
  .info-title {
    font-size: 20px;
  }
  .info-text, .guide-list li {
    font-size: 14px;
  }
  .guide-title {
    font-size: 18px;
  }
}
</style>
