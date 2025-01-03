import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Импортируем Pinia
import App from './App.vue';
import router from './router'; // Импортируем маршрутизатор route

const app = createApp(App)
const pinia = createPinia()

app.use(pinia) // Подключаем Pinia
app.use(router) // Подключаем маршрутизатор
app.mount('#app')
