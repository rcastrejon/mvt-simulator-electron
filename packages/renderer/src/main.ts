import './styles/main.scss'
import 'bootstrap'
import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

createApp(App).mount('#app').$nextTick(window.removeLoading)
