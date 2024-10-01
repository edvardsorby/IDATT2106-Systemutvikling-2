import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import { VDataTable } from 'vuetify/labs/VDataTable'
import * as directives from 'vuetify/directives'
import "@mdi/font/css/materialdesignicons.css";

const vuetify = createVuetify({
  components: { ...components, VDataTable},
  directives,
  theme: {
    defaultTheme: 'light'
  }
})

createApp(App).use(vuetify).use(store).use(router).mount('#app')
