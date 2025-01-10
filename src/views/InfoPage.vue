<template>
  <header class="info-page">
    <div class="info">
      <h1>Добро пожаловать в QASystem</h1>
      <p>
        QASystem — это веб-приложение, предназначенное для организации и управления процессом тестирования программного обеспечения.
        Оно позволяет автоматизировать рутинные задачи, централизованно управлять тест-кейсами, чек-листами и проектами, а также интегрироваться с другими инструментами разработки.
      </p>
    </div>

    <div class="guide">
      <h2>Компоненты и функционал:</h2>
      <ul>
        <li>
          <strong>Модуль ведения проектов:</strong> создание, редактирование и удаление проектов. Для примера Калькулятор может быть проектом. 
        </li>
        <li>
          <strong>Модуль тест-кейсов:</strong> управление тест-кейсами и его шагами, включая создание, редактирование и удаление. Для Калькулятора это может быть проверка сложения и другого функционала.
        </li>
        <li>
          <strong>Управляйте чек-листами:</strong> Добавляйте, редактируйте или удаляйте чек-листы для удобного планирования тестирования.
        </li>
      </ul>
    </div>
  </header>
</template>

<script>
export default {
  name: 'InfoPage',
};
</script>

<style scoped>
.info-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #ffffff;
  color: #333;
}

.info {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 20px;
  padding: 20px;
  background-color: #292961;
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.info h1 {
  font-size: 24px;
  font-weight: bold;
  margin: 0;
}

.info p {
  font-size: 16px;
  margin-top: 10px;
  color: #d0d0ff;
}

.guide {
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-bottom: 20px;
  padding: 20px;
  background-color: white;
  color: #333;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.guide h2 {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #292961;
}

.guide ul {
  list-style-type: none;
  padding: 0;
}

.guide li {
  margin-bottom: 15px;
  font-size: 14px;
  line-height: 1.5;
  position: relative;
  padding-left: 20px;
}

.guide li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: #6200ea;
  font-size: 20px;
  line-height: 1;
}

.guide li strong {
  font-weight: bold;
  color: #292961;
}
</style>