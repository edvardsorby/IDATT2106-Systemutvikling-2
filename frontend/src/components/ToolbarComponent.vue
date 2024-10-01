<template>
  <nav>
    <v-toolbar flat app>
      <v-toolbar-title class="text-uppercase grey--text">
        <div id="logo-name-toolbar">
          <div>
            <img src="../assets/logo.png" id="logo-image">
          </div>
          <div @click="route" id="toolbar-name">
            <span class="font-weight-light">Smart</span>
            <span>Mat</span>
          </div>
        </div>
      </v-toolbar-title>
      <div v-if="!mobile">
        <v-tabs v-model="tab" hide-slider="true">
          <v-tab flat color="grey" to="/fridge">Fridge<v-icon icon="mdi-fridge"></v-icon></v-tab>
          <v-tab flat color="grey" to="/list">Shopping list<v-icon icon="mdi-format-list-checkbox"></v-icon></v-tab>
          <v-tab flat color="grey" to="/recipe">Menus<v-icon icon="mdi-silverware"></v-icon></v-tab>
          <v-tab flat color="grey" to="/settings">Settings<v-icon icon="mdi-cog"></v-icon></v-tab>
          <v-tab flat color="grey" to="/stats">Stats<v-icon icon="mdi-chart-bar"></v-icon></v-tab>
          <v-tab flat color="grey" to="/user">Users<v-icon icon="mdi-account-group"></v-icon></v-tab>
          <v-tab flat color="grey" to="/" @click="clear">Sign out<v-icon icon="mdi-exit-to-app"></v-icon></v-tab>
        </v-tabs>
      </div>
      <div v-if="mobile">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon="mdi-menu" v-bind="props"></v-btn>
          </template>
          <v-list>
            <v-tabs v-model="tab" direction="vertical" color="primary">
              <v-tab flat to="/fridge">Fridge<v-icon icon="mdi-fridge"></v-icon></v-tab>
              <v-tab flat to="/list">Shopping list<v-icon icon="mdi-format-list-checkbox"></v-icon></v-tab>
              <v-tab flat to="/recipe">Menus<v-icon icon="mdi-silverware"></v-icon></v-tab>
              <v-tab flat to="/settings">Settings<v-icon icon="mdi-cog"></v-icon></v-tab>
              <v-tab flat to="/stats">Stats<v-icon icon="mdi-chart-bar"></v-icon></v-tab>
              <v-tab flat to="/user">Users<v-icon icon="mdi-account-group"></v-icon></v-tab>
              <v-tab to="/" @click="clear">Sign out<v-icon icon="mdi-exit-to-app"></v-icon></v-tab>
            </v-tabs>
          </v-list>
        </v-menu>
      </div>
      <v-btn prepend-icon="mdi-theme-light-dark" @click="toggleTheme"></v-btn>
    </v-toolbar>
  </nav>
</template>

<script>
import router from "@/router"
import { useTheme, useDisplay } from 'vuetify'

export default {
  methods: {
    route(){
      router.push("/fridge")
    },
    clear(){
      localStorage.clear()
    }
  },
  setup() {
    const theme = useTheme()
    const { mobile } = useDisplay()

    return {
      theme,
      toggleTheme: () => theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark',
      mobile
    }
  }
}
</script>

<style>
#logo-image{
  width: 50px;
  height: 50px;
  margin-top: 8px;
  margin-right: 8px;
}
#logo-name-toolbar{
  display: flex;
  flex-direction: row;
}
#toolbar-name{
  display: flex;
  align-items: center;
  cursor: pointer;
}
</style>
