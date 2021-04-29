import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import './assets/tailwind.css';
import Maska from 'maska';
import mitt from 'mitt';
import contenteditable from 'vue-contenteditable'
import '@/helpers/file';

const emitter = mitt();

const app = createApp(App);
app.config.globalProperties.emitter = emitter;
app
    .use(store)
    .use(router)
    .use(Maska)
    .use(contenteditable)
    .mount('#app');
