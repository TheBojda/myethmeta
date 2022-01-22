import Vue from 'vue';

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import App from './App.vue';

new Vue({ render: createElement => createElement(App) }).$mount('#app');