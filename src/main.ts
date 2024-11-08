import './assets/main.scss'
import './index.css'
import './assets/css/app.scss'
// import './assets/css/app.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import globalComponents from './global-components/index'
import { createVfm } from 'vue-final-modal'





const app = createApp(App)
const vfm = createVfm()


app.use(router)
app.use(createPinia())

app.use(vfm)
globalComponents(app)

app.mount('#app')
