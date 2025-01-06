<template>
    <header class="info-page">
      <div class="info">
        <h1>Добро пожаловать в QASystem</h1>
        <p>
          QASystem — это инновационная платформа для управления тестированием программного обеспечения. 
          Она упрощает процесс тестирования, повышает его эффективность и качество, 
          обеспечивая оптимальный контроль и координацию всех аспектов тестирования.
        </p>
      </div>
  
      <div class="guide">
        <h2>Как пользоваться порталом:</h2>
        <ul>
          <li>
            <strong>Создайте проект:</strong> Перейдите в раздел "Проекты", нажмите на кнопку "Создать проект", 
            заполните название и описание проекта, укажите дату начала и окончания (опционально).
          </li>
          <li>
            <strong>Добавьте тест-кейсы:</strong> Откройте созданный проект, нажмите "Создать тест-кейс" 
            и заполните информацию (название, описание, шаги и ожидаемый результат).
          </li>
          <li>
            <strong>Управляйте чек-листами:</strong> Добавляйте, редактируйте или удаляйте чек-листы для удобного планирования тестирования.
          </li>
          <li>
            <strong>Просматривайте статус тестирования:</strong> Отслеживайте статус тест-кейсов и результаты тестирования 
            в реальном времени.
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
  /* Общий стиль страницы */
  .info-page {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Arial', sans-serif;
    background-color: #f8f9fa;
    color: #333;
  }
  
  /* Блок с общей информацией */
  .info {
    display: flex;
    flex-direction: column;
    text-align: left; /* Выровнять текст по левому краю */
    margin-bottom: 20px;
    padding: 20px;
    background-color: #292961; /* Темно-синий фон */
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
    color: #d0d0ff; /* Светлый текст */
  }
  
  /* Блок с руководством */
  .guide {
    width: 100%;
    max-width: 800px;
    background-color: white;
    color: #333;
    border-radius: 8px;
    padding: 20px;
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
    color: #6200ea; /* Акцентный цвет */
    font-size: 20px;
    line-height: 1;
  }
  
  .guide li strong {
    font-weight: bold;
    color: #292961; /* Темно-синий акцент */
  }
  </style>