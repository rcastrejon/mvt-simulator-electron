import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

createApp(App).mount('#app').$nextTick(window.removeLoading)
