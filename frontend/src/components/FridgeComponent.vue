<template>
  <v-app>
    <div id="container-categories">
      <div id="searchbar">
      </div>
      <div id="category-recipe">
        <v-card id="categories" class="card">
          <v-toolbar color="teal">
            <v-toolbar-title>Your Fridge</v-toolbar-title>
          </v-toolbar>
          <div id="error-fridge">
            <p v-if="betaUser">You are not authorized add items to the fridge :(</p>
          </div>
          <div id="topBar">

            <v-dialog v-model="dialog" persistent width="400">
              <template v-slot:activator="{ props }">
                <div id="addNewItemButton" >
                  <v-btn color="" v-bind="props" :disabled="betaUser">
                    Add new item
                  </v-btn>
                </div>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Add new item to fridge</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-autocomplete
                        type="text"
                        placeholder="Select food"
                        clearable :items="items"
                        v-model="newItemName"
                        :rules="[ checkName ]">
                      </v-autocomplete>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="Amount*" v-model="newItemAmount" :rules="[ checkAmount ]"></v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                            :items="['G', 'KG', 'DL', 'L', 'UNIT']"
                            label="Measurement type*"
                            v-model="newItemMeasurement"
                            :rules="[ checkMeasurement ]"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                  <div><small v-if="error" class="error-message">*all required fields are not filled</small></div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="dialog = false">
                    Close
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="addToFridge">
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            
          </div>
          <div>
            <v-text-field
              v-model="search"
              append-inner-icon="mdi-magnify"
              label="Search"
              single-line
              hide-details
            ></v-text-field>
            <v-data-table
              v-model:expanded="expanded"
              :group-by="groupBy"
              :headers="headers"
              :items="fridgeItems"
              :sort-by="sortBy"
              :search="search"
              :expanded.sync="expanded"
              class="elevation-1"
              item-key="name"
              items-per-page="-1"
              show-expand
              hide-default-footer
            >
            <template v-slot:expanded-row="{ item }">
              <td>
                <p v-for="food in item.raw.foods">
                  <v-icon size="small" class="me-2" @click="editDate(item.raw.id, food)">
                    mdi-calendar
                  </v-icon>
                  <v-icon size="small" @click="deleteItem(item.raw.id, food)">
                    mdi-delete
                  </v-icon>
                </p>
              </td>
              <td>
                <p v-for="food in item.raw.foods">{{ food.name }}</p>
              </td>
              <td>
                <p v-for="food in item.raw.foods">{{ food.amount }}</p>
              </td>
              <td>
                <p v-for="food in item.raw.foods">{{ food.measurement }}</p>
              </td>
              <td>
                <p v-for="food in item.raw.foods">{{ food.date }}</p>
              </td>
            </template>
              <template v-slot:bottom>
                <v-spacer></v-spacer>
              </template>
            </v-data-table>

            <v-dialog v-model="picker" persistent width="300">
              <v-card>
                <v-card-title class="text-h5"> Add expiration date </v-card-title>
                <v-card-subtitle> Click the date to edit</v-card-subtitle>
                <div id="datepicker">
                  <datepicker
                    v-model="selectedDate"
                    lang="en"
                    starting-view="day"
                    placeholder="expiration date"
                    format="YYYY-MM-dd"
                    type="date"
                    :lower-limit="new Date(Date.now() + (3600 * 1000 * 24))"
                  ></datepicker>
                </div>
                <v-card-actions>
                  <v-btn color="green-darken-1" variant="text" @click="(picker = false)">
                    Cancel
                  </v-btn>
                  <v-btn color="green-darken-1" variant="text" @click="updateFridgeItem">
                    Add
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="deleteDialog" persistent width="400">
              <v-card>
                <v-card-title>
                  <span class="text-h5">Remove item</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12">
                        <v-text-field type="text" :readOnly="true">{{this.editedFoodItem.name}}</v-text-field>
                      </v-col>
                      <v-col cols="12">
                        <div>
                          <v-radio-group inline v-model="waste">
                            <v-radio id="throw-radiobutton" label="Throw" value="true"></v-radio>
                            <v-radio id="eat-radiobutton" label="Eaten" value="false"></v-radio>
                          </v-radio-group>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field label="Amount*" :rules="[ checkAmount ]" v-model="amount"></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                  <small>*indicates required field</small>
                  <div>
                    <small v-if="error" class="error-message">*all required fields are not filled</small>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue-darken-1" variant="text" @click="deleteDialog = false">
                    Close
                  </v-btn>
                  <v-btn color="blue-darken-1" variant="text" @click="removeItem">
                    Remove
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>

            <v-dialog v-model="shoppingList" persistent width="auto">
              <v-card>
                <v-card-title class="text-h5">
                  Add to shopping list
                </v-card-title>
                <v-card-text>{{ message }}</v-card-text>
                <v-card-text>Do you want to add {{ editedFoodItem.name }} to your shopping list?</v-card-text>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="green-darken-1" variant="text" @click="shoppingList = false">
                    No
                  </v-btn>
                  <v-btn color="green-darken-1" variant="text" @click="addToShoppingList">
                    Yes
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>

        </v-card>

        <div id="generate">
          <v-card id="recipe" class="card">
            <v-toolbar color="teal">
              <v-toolbar-title>Recipe generator</v-toolbar-title>
              <v-btn id="generateButton" variant="tonal" @click="generateRecipe" icon="mdi-silverware"></v-btn>
            </v-toolbar>
            <v-card-text class="text-pre-wrap">{{ recipe }}</v-card-text>
          </v-card>
        </div>
      </div>
    </div>
  </v-app>
</template>

<script>
import fridgeService from "@/services/fridgeService";
import recipeService from "@/services/recipeService.js";
import Datepicker from 'vue3-datepicker';
import { ref } from 'vue'
import shoppingListService from "@/services/shoppingListService";
import router from "@/router"

export default {
  components: {Datepicker},
  data() {
    return {
      dialog: false,
      picker: false,
      deleteDialog: false,
      shoppingList: false,
      newItemName: null,
      newItemAmount: null,
      newItemMeasurement: null,
      recipe: "This is your AI powered dinner generator.\nTo create a recipe using ingredients in your fridge, press the knife and fork icon in the toolbar.",
      show: false,
      editedFoodId: null,
      editedFoodItem: null,
      waste: "true",
      amount: null,
      message: null,
      items: [],
      myItems: [],
      fridgeItems: [],
      categories: null,
      nameCheck: false,
      amountCheck: false,
      measurementCheck: false,
      error: false,
      betaUser: null,
      search: '',
      expanded: [],
      singleExpanded: false,
      sortBy: [{ key: 'name' }],
      groupBy: [{ key: 'category' }],
      headers: [
        {
          title: 'Food items',
          align: 'start',
          value: 'name',
          groupable: false,
      },
      {title: 'Amount', value: 'amount'},
      {title: 'Measurement', value: 'measurement'},
      {title: 'Date', value: 'date'},
    ],
    }
  },
  methods: {
    async addToFridge(){
      if(this.nameCheck && this.amountCheck && this.measurementCheck) {
        this.error = false
        this.myItems = [];
        const item = {
          "itemName": this.newItemName,
          "refrigeratorId": localStorage.getItem("fridgeId"),
          "amount": this.newItemAmount,
          "measurementType": this.newItemMeasurement
        }
        await fridgeService.addNewItemToFridge(item)
        this.dialog = false
        await this.getAllFridgeItems()
      } else {
        this.error = true
      }

    },
    async getAllCategories(){
      this.categories = await fridgeService.getAllCategories()
    },
    async setUserLevel(){
      this.betaUser = localStorage.getItem("userType") === "false";
    },
    async handleUpdate() {
      await this.getAllFridgeItems(localStorage.getItem("email"))
    },
    async getAllFridgeItems(){
      try {
        this.myItems = []
        this.fridgeItems = []
        const list = await fridgeService.getAllItemsInFridge(localStorage.getItem("email"))
        for(let i = 0; i < list.length; i++){
          this.myItems.push(list[i].item.name + " (" + list[i].amount + ")")
          let fridgeSubItems = []
          let amount = 0
          for(let j = 0; j < list[i].itemsInRefrigerator.length; j++){
            fridgeSubItems.push({
              'id': list[i].itemsInRefrigerator[j].itemExpirationDateId,
              'name': list[i].item.name,
              'amount': list[i].itemsInRefrigerator[j].amount,
              'measurement': list[i].measurementType,
              'date': ((list[i].itemsInRefrigerator[j].date != null) ? list[i].itemsInRefrigerator[j].date : '-')
            })
            amount += list[i].itemsInRefrigerator[j].amount
          }

          this.fridgeItems.push({
            'id': list[i].itemRefrigeratorId,
            'name': list[i].item.name,
            'amount': amount,
            'measurement': list[i].measurementType,
            'date': '',
            'foods': fridgeSubItems,
            'category': this.getCategoryById(list[i].item.categoryId)
          })
        }
      } catch(err) {
        console.log(err)
      }
    },
    async updateFridgeItem(){
      this.selectedDate.setDate(this.selectedDate.getDate() + 1)
      this.fridgeItems = this.fridgeItems.map(obj => {
        if (obj.id == this.editedFoodId) {
          (obj.date == this.editedFoodItem.date) ? obj.date = new Date(this.selectedDate).toISOString().slice(0,10) : obj.date
          obj.foods.map(m => {
            if (m.id == this.editedFoodItem.id) {
              m.date = new Date(this.selectedDate).toISOString().slice(0,10)
            }
            return m
          })
        }
        return obj
      })
      this.picker = false
      let item = {
        'itemExpirationDateId': this.editedFoodItem.id,
        'amount': this.editedFoodItem.amount,
        'measurementType': this.editedFoodItem.measurement,
        'date': new Date(this.selectedDate).toISOString().slice(0,10)
      }
      await fridgeService.updateItemInFridge(item)
    },
    async removeItem() {
      if (this.amountCheck) {
        this.error = false
        const removeItem = {
        "itemExpirationDateId": this.editedFoodItem.id,
        "amount": this.amount,
        "garbage": (this.waste === 'true')
        }
        this.message = await fridgeService.deleteItem(removeItem)
        await this.getAllFridgeItems()
        this.$emit('update-fridge')
        this.deleteDialog = false
        this.shoppingList = true
      } else {
        this.error = true
      }

    },
    async getAllItems(){
      try {
        const list = await fridgeService.getAllItems()
        for(let i = 0; i < list.length; i++){
          this.items.push(list[i].name)
        }
      } catch(err) {
        console.log(err)
      }
    },
    async addToShoppingList(){
      const itemToAdd = {
        "itemName": this.editedFoodItem.name,
        "shoppingListId": localStorage.getItem("shoppingListId"),
        "subUserId": localStorage.getItem("subUserId"),
        "amount": this.amount,
        "measurementType": this.editedFoodItem.measurement
      }
      await shoppingListService.addShoppingListItems(itemToAdd)
      this.shoppingList = false
    },
    checkName(value){
      if (value?.length > 0) {
        this.nameCheck = true;
        return true
      } else {
        this.nameCheck = false;
        return 'Name cannot be empty.'
      }
    },
    checkMeasurement(value){
      if (value?.length > 0) {
        this.measurementCheck = true;
        return true
      } else {
        this.measurementCheck = false;
        return 'Measurement cannot me empty.'
      }
    },
    async generateRecipe(){
      this.recipe = "Generating recipe..."
      let recipe = await recipeService.getRecipe(localStorage.getItem("fridgeId"))
      if(recipe === 500) {
        recipe = "There was an error creating your recipe. Please try again later"
      }
      this.recipe = recipe
    },
    getCategoryById(id) {
      const i = this.categories.findIndex(function(Ids) {
        return Ids.categoryId == id
      })
      return this.categories[i].description
    },
    editDate(itemId, food){
      this.editedFoodId = itemId
      this.editedFoodItem = food
      this.picker = true
    },
    deleteItem(itemId, food){
      this.editedFoodId = itemId
      this.editedFoodItem = food
      this.amount = food.amount
      this.deleteDialog = true
    },
    checkAmount(value){
      if (value > 0) {
        this.amountCheck = true;
        return true
      } else {
        this.amountCheck = false;
        return 'Amount cannot be below 0.'
      }
    },
  },
  created(){
      this.getAllCategories()
      this.getAllItems()
      this.getAllFridgeItems()
      this.setUserLevel()

  },
  mounted(){
    if (localStorage.getItem("token") === null){
      router.push("/")
    }
  },
  setup() {
    const selectedDate = ref(new Date(Date.now() + (3600 * 1000 * 24)));
    return {
      selectedDate
    }
  }
}


</script>

<style>
#container-categories {
  display: flex;
  padding-top: 50px;
  flex-wrap: wrap;
}
#categories {
  display: inline-block;
  flex-wrap: wrap;
  text-align: center;
  justify-content: center;
}
#category-recipe {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
#searchbar {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
#topBar {
  display: flex;
  flex-direction: row;
  justify-content: center;
}
#addNewItemButton{
  margin: 10px;
  margin-top: 20px;
}
#error-fridge {
  margin: 10px;
}
.card {
  max-width: 700px;
  width: 700px;
  flex-shrink: 1;
  margin: 20px;
}
#datepicker {
  display: inline-block;
  text-align: center;
  align-items: center;
  width: 100%;
  height: 275px;
}
datepicker {
  border: black;
  box-shadow: 0 4px 10px 0 rgba(128, 144, 160, 0.1), 0 0 1px 0 rgba(128, 144, 160, 0.81);
}

</style>
