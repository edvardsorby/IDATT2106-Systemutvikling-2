import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SettingsView from '../views/SettingsView.vue'
import ShoppingListView from '../views/ShoppingListView.vue'
import FridgeView from '../views/FridgeView.vue'
import RecipeView from '../views/RecipeView.vue'
import ChooseUserView from '../views/ChooseUserView.vue'
import statsView from "@/views/StatsView.vue";

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
  {
    path: '/fridge',
    name: 'fridge',
    component: FridgeView
  },
  {
    path: '/recipe',
    name: 'recipe',
    component: RecipeView
  },
  {
    path: '/user',
    name: 'chooseUser',
    component: ChooseUserView
  },
  {
    path: '/stats',
    name: 'stats',
    component: statsView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
