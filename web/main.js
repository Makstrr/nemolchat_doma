import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import './assets/main.css'

const app = createApp(App)

app.use(router)
app.use(Toast, {
  position: POSITION.TOP_RIGHT,
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  transition: "Vue-Toastification__fade",
})

app.mount('#app')


// Анимации
import { MotionPlugin } from '@vueuse/motion'
app.use(MotionPlugin)




