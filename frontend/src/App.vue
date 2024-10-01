<script>
import ToolbarComponent from "@/components/ToolbarComponent.vue"
export default {
  components: {ToolbarComponent}
}
</script>

<template>
  <div v-if="$route.name !== 'login' && $route.name !== 'chooseUser'">
    <ToolbarComponent/>
  </div>
  <div>
    <RouterView />
  </div>
</template>

<style>
.error-message{
  color: red;
}
</style>
