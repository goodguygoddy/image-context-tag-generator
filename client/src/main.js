import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

import { createWebHistory, createRouter } from 'vue-router';
import SearchImageView from '@/view/SearchImageView.vue';
import UploadImageView from '@/view/UploadImageView.vue';

const app = createApp(App);

axios.defaults.baseURL = 'http://localhost:3000';

app.use(Vue3Toastify, {
    autoClose: 1000,
    hideProgressBar: true,
    position: 'bottom-right',
});

const routes = [
    { path: '/', component: SearchImageView },
    { path: '/upload', component: UploadImageView },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

app.use(router);

app.mount('#app');
