import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ToastPlugin from 'vue-toast-notification'
import { onAuthStateChanged } from "firebase/auth";
import App from './App.vue'
import router from './router'
import { AUTH } from "@/utils/firebase.js";
// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
})

let  app;

onAuthStateChanged(AUTH,() => {
    if(!app){
        const app = createApp(App)
        app.use(createPinia())
        app.use(router)
        app.use(vuetify)
        app.use(ToastPlugin)

        app.mount('#app')
    }
})
