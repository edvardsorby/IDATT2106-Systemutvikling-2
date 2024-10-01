<template>
  <v-app>
    <div>
      <v-card
        id="menu"
        class="mx-auto"
        max-width="800"
        :loading="loading"
      >
        <template v-slot:loader="{ isActive }">
          <v-progress-linear
            :active="isActive"
            color="deep-purple"
            height="4"
            indeterminate
          ></v-progress-linear>
        </template>
        <v-card-title>Weekly menu</v-card-title>
        <v-card-subtitle>Choose the number of people you want to have a menu for and click generate</v-card-subtitle>
        <v-slider
        v-model="numPeople"
        min="1"
        max="8"
        :step="1"
        show-ticks="always"
        :ticks="tickLabels"
        :disabled="betaUser"
      >
        <template v-slot:append>
          <v-btn :disabled="betaUser" @click="generateRecipes(email, numPeople)">Generate recipes</v-btn>
        </template>
      </v-slider>
      <v-dialog
        :model-value="loadingCard"
        class="align-center justify-center"
        persistent
        width="auto"
      >
        <v-card>
          <v-card-title class="text-h5">
            Please wait
          </v-card-title>
          <v-card-text>The Ai is generating a weekly menu for {{numPeople}} people, please wait while it does so, it might take a minute. <br/> Leaving the page will stop the process.
This dialog will close when the process is done</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="red" @click="loadingCard = false">
              Close
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      </v-card>
      <div id="user-level-recipe">
        <p v-if="betaUser" class="error-message">You are not authorized to create a menu</p>
      </div>
      <div class="card-container">
        <v-card v-for="(card, index) in cards.slice(0, numCards)" :key="index" class="card">
          <v-toolbar color="teal">
            <v-toolbar-title class="font-weight-bold">{{ card.title }}</v-toolbar-title>
          </v-toolbar>
          <v-card-subtitle class="text-pre-wrap">{{ card.subtitle }}</v-card-subtitle>
          <v-card-text class="text-pre-wrap">{{ card.content }}</v-card-text>
        </v-card>
      </div>
    </div>
  </v-app>
</template>

<script>
import recipeService from "@/services/recipeService.js";
import router from "@/router";

export default {
  data() {
    return {
      cards: [],
      numCards: 7,
      tickLabels: {
        1: 1,
        2: 2,
        3: 3,
        4: 4,
        5: 5,
        6: 6,
        7: 7,
        8: 8,
      },
      numPeople: 4,
      betaUser: null,
      loading: false,
      loadingCard: false,
      email: localStorage.getItem("email"),
    };
  },
  methods: {
    async generateRecipes(email, numPeople) {
      this.loading = true
      this.loadingCard = true
      const menuString = await recipeService.generateWeeklyMenus(email, numPeople)
      this.getMenuCards(menuString)
    },
    async getRecipes(email) {
      const menuString = await recipeService.getWeeklyMenu(email)
      this.getMenuCards(menuString)
    },
    getMenuCards(menuString) {
      try {
        const menuArray = menuString.split('\n\n')
        const menuCards = []

        for (let i = 0; i < this.numCards; i++) {
          const res = menuArray[2*i]+ '\n\n' + menuArray[2*i+1]
          const dayString = res.split(/\n(.*)/s).join('\n\n').split('\n\n')
          const title = dayString.shift()
          const subtitle = dayString.shift()
          const content = dayString.shift()
          menuCards.push({ title, subtitle, content })
        }
        this.loading = false
        this.loadingCard = false
        this.cards = menuCards
      } catch (err) {
        console.log(err)
      }

    },
    async setUserLevel(){
      this.betaUser = localStorage.getItem("userType") === "false";
    }
  },
  created() {
    const email = this.email
    this.getRecipes(email)
    this.setUserLevel()
    },
  mounted(){
    if (localStorage.getItem("token") === null){
      router.push("/")
    }
  }
};
</script>

<style scoped>
.card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

}

.card {
  width: 600px;
  margin: 20px;
}

#menu {
  margin: 20px
}
#user-level-recipe {
  text-align: center;
}
</style>
