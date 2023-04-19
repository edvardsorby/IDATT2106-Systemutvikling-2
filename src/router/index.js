import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SettingsView from '../views/SettingsView.vue'
import ShoppingListView from '../views/ShoppingListView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView
  },
  {
    path: '/list',
    name: 'shoppingList',
    component: ShoppingListView
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
