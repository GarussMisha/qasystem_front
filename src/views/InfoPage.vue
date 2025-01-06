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
  .info-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f0f0f0;
    color: #333;
    font-family: Arial, sans-serif;
  }
  
  .info {
    text-align: center;
    margin-bottom: 20px;
    padding: 20px;
    background-color: #6200ea;
    color: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .info h1 {
    font-size: 2rem;
    font-weight: bold;
    margin: 0;
  }
  
  .info p {
    font-size: 1.2rem;
    margin-top: 10px;
  }
  
  .guide {
    width: 100%;
    max-width: 800px;
    background-color: #fff;
    color: #333;
    border-radius: 10px;
    padding: 20px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .guide h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 10px;
  }
  
  .guide ul {
    list-style-type: none;
    padding: 0;
  }
  
  .guide li {
    margin-bottom: 15px;
    font-size: 1rem;
    line-height: 1.5;
  }
  
  .guide li strong {
    font-weight: bold;
    color: #6200ea;
  }
  </style>
  