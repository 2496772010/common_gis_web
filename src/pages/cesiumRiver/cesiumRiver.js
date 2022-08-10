import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './cesiumRiverApp.vue'

const app = createApp(App)
app.use(ElementPlus)
app.mount('#cesiumRiverApp')
