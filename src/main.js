import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Импортируем маршрутизатор route
import { createPinia } from 'pinia'; // Импортируем Pinia

const app = createApp(App)

app.use(createPinia) // Подключаем Pinia
app.use(router) // Подключаем маршрутизатор
app.mount('#app')
