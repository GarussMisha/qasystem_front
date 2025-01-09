import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Импортируем Pinia
import App from './App.vue';
import router from './router'; // Импортируем маршрутизатор route
import './assets/styles/shared.css'; // Подключение общего стиля

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // Подключаем Pinia
app.use(router) // Подключаем маршрутизатор
app.mount('#app')
