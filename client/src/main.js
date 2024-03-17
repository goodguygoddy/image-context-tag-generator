import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import axios from 'axios';
import Vue3Toastify from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

// const axiosInstance = axios.create({
//     baseURL: 'http://localhost:3000'
// })

const app = createApp(App);

axios.defaults.baseURL = 'http://localhost:3000'

app.use(Vue3Toastify, {
    autoClose: 1000,
    hideProgressBar: true,
    position: 'bottom-right',
});

app.mount('#app')
