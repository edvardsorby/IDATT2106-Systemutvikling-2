<template>
  <div id="choose-user-container">
    <h1>Who's cooking?</h1>
    <div id="choose-users">
      <UserComponent
          class="choose-card"
          v-for="user in users"
          :key="user.id"
          :user="user"
          :name="user.name"
          :type="user.accessLevel"
          :id="user.subUserId"
          :pin="user.pinCode"/>
    </div>
  </div>
</template>

<script>
import UserComponent from "@/components/UserComponent.vue";
import settingsService from "@/services/settingsService";
import router from "@/router";
export default {
  components: {UserComponent},
  data() {
    return {
      users: null
    }
  },
  methods: {
    async getSubusers(){
      this.users = await settingsService.getAllSubusers(localStorage.getItem("email"))
    }
  },
  beforeMount(){
    this.getSubusers()
  },
  mounted(){
    if (localStorage.getItem("token") === null){
      router.push("/")
    }
  }
}
</script>

<style>
#choose-users{
  margin-top: 10px;
  margin-left: 150px;
  margin-right: 150px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  background-color: #009688;
}

.choose-card:hover {
  transform: scale(1.01);
  box-shadow: 0 3px 12px 0 rgba(0, 0, 0, 0.2);
}
#choose-user-container{
  display: inline-block;
  text-align: center;
  width: 100%;
  margin-top: 120px;
}
</style>
