<template>
  <v-container id="container">
      <v-row justify="space-around">
          <v-card class="mx-auto" width="800">
              <v-toolbar color="teal">
                  <v-toolbar-title id="shoppinglist-title" class="font-weight-bold">Shopping list</v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-dialog v-model="showDialogWindow" max-width="600px">
                    <template v-slot:activator="{ props }">
                      <v-btn
                          id="new-item-button"
                        color=""
                        dark
                        class="mb-2"
                        v-bind="props"
                        icon
                      ><v-icon>mdi-cart-arrow-down</v-icon>
                        <v-tooltip id="add-item-shoppinglist-tooltip" activator="parent" location="start">Add an item to shoppinglist</v-tooltip>
                      </v-btn>
                    </template>
                    <v-card>
                      <v-card-title>
                        <span class="text-h5">{{ formTitle }}</span>
                      </v-card-title>
                      <v-form v-model="showAddItemForm" @submit.prevent="addItem">
                        <v-card-text>
                          <v-container>
                            <v-row>
                              <v-col cols="12" sm="6" md="4">
                                <v-autocomplete
                                  id="add-to-cart"
                                  type="text"
                                  label="Food Name"
                                  :disabled="disableNameEdit"
                                  :items="allItems"
                                  v-model="editedItem.itemName"
                                  :rules="[required]"
                              />
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-text-field v-model.number="editedItem.amount" label="Amount" :rules="[isInt, isPositive, required]"></v-text-field>
                              </v-col>
                              <v-col cols="12" sm="6" md="4">
                                <v-select
                                  v-model="editedItem.measurementType"
                                  :items="measurementTypes"
                                  label="Measurement"
                                  :rules="[required]"
                                ></v-select>
                              </v-col>
                            </v-row>
                          </v-container>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn color="blue-darken-1" variant="text" @click="close">Cancel</v-btn>
                          <v-btn color="blue-darken-1" variant="text" type="submit">Save</v-btn>
                        </v-card-actions>
                      </v-form>
                    </v-card>
                  </v-dialog>
                  <v-btn icon @click="addRecommendedItems">
                      <v-icon>mdi-auto-fix</v-icon>
                      <v-tooltip id="add-recommended-shoppinglist-tooltip" activator="parent" location="start">Add recommended items to shopping list</v-tooltip>
                  </v-btn>
                  <v-btn icon @click="buy">
                      <v-icon>mdi-fridge</v-icon>
                      <v-tooltip id="buy-shoppinglist-tooltip" activator="parent" location="start">Add selected items to fridge</v-tooltip>
                  </v-btn>
              </v-toolbar>
              <div id="lists" >
                  <v-data-table
                    v-model="buyItems"
                    :headers="headers"
                    :items="shoppingList"
                    show-select
                    class="elevation-1"
                    items-per-page="-1"
                  >
                    <template v-slot:item.subUser="{ item }">
                      <v-icon v-if="item.raw.subUser !== 'true'" icon="mdi-checkbox-blank-outline" color="red"></v-icon>
                      <v-icon v-if="item.raw.subUser !== 'false'" icon="mdi-checkbox-marked" color="teal"></v-icon>
                    </template>
                    <template v-slot:item.actions="{ item }">
                      <v-icon size="small" class="me-2" @click="editItem(item.raw)">mdi-pencil
                      </v-icon>
                      <v-icon size="small" @click="removeList(item.raw)">mdi-delete</v-icon>
                    </template>
                  </v-data-table>
              </div>
              <div id="input">
              </div>
          </v-card>
      </v-row>
  </v-container>
  <v-snackbar v-model="showSnackbar" color="teal" :timeout="3000">{{ snackbarText }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="showSnackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
  import shoppingListService from "@/services/shoppingListService";
  import fridgeService from "@/services/fridgeService";
  import router from "@/router";
  export default {
    data() {
      return {
        selectedItem: "",
        measurementTypes: ["KG", "G", "L", "DL", "UNIT"],
        allItems:[],
        buyItems: [],
        shoppingList: [],

        snackbarText: '',
        showSnackbar: false,

        childUser: false,
        disableNameEdit: false,

        showAddItemForm: false,
        showDialogWindow: false,

        headers: [
          {
            title: 'Food',
            align: 'start',
            sortable: false,
            key: 'name',
          },
          { title: 'Amount', key: 'amount' },
          { title: 'Measurement type', key: 'measurement' },
          { title: 'Added by adult', key: 'subUser' },
          { title: 'Actions', key: 'actions' },
        ],

        editedIndex: -1,
        editedItem: {
          itemName: '',
          amount: '',
          measurementType: 'KG',
          subUserId: localStorage.getItem("subUserId"),
          shoppingListId: '1',
          itemShoppingListId: '1'
        },
        defaultItem: {
          name: '',
          amount: '',
          measurement: 'KG',
          subUser: '',
        },

      }
    },
    computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
    },
    methods: {
      async getShoppingList(){
        try {
          const list = await shoppingListService.getShoppingListItems(localStorage.getItem("email"))
          for(let i = 0; i<list.items.length; i++){
            if(!this.buyItems.includes(list.items[i].item.name)){
              this.shoppingList.push({"name": list.items[i].item.name,"amount": list.items[i].amount, "measurement": list.items[i].measurementType, "subUser": list.items[i].subUserAccessLevel.toString(), "itemShoppingListId": list.items[i].itemShoppingListId})
            }
          }
        } catch(err) {
          console.log(err)
        }
      },
      async getAllItems(){
        try {
          const list = await fridgeService.getAllItems()
          for(let i = 0; i<list.length; i++){
            if (!this.shoppingList.includes(list[i].name)) {
              this.allItems.push(list[i].name)
            }
          }
        } catch (err) {
          console.log(err)
        }
      },
      editItem (item) {
        if(this.childUser){
          this.snackbarText = "You are not authorized to edit items"
          this.showSnackbar = true
        } else {
          this.editedIndex = this.shoppingList.indexOf(item)
          this.editedItem = Object.assign({}, item)
          this.editedItem.itemName = item.name
          this.disableNameEdit = true
          this.showDialogWindow = true
        }
      },
      close () {
        this.disableNameEdit = false
        this.showDialogWindow = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },
      required (v) {
        return !!v || 'Field is required'
      },
      isInt (v) {
        return Number.isInteger(Number(v)) || "The value must be an integer number"
      },
      isPositive (v) {
        return v > 0 || "The value must be greater than zero"
      },
      async buy(){
        if(this.childUser){
          this.snackbarText = "You are not authorized to buy items"
          this.showSnackbar = true
        } else {
          for (let i = 0; i < this.buyItems.length; i++) {
            const item = {
              "itemName": this.buyItems[i].name,
              "refrigeratorId": localStorage.getItem("fridgeId"),
              "amount": this.buyItems[i].amount,
              "measurementType": this.buyItems[i].measurement
            }
            await fridgeService.addNewItemToFridge(item)

            const itemToDelete = {
              "itemName": this.buyItems[i].name,
              "shoppingListId": localStorage.getItem("shoppingListId"),
              "amount": this.buyItems[i].amount,
              "measurementType": this.buyItems[i].measurement,
              "itemShoppingListId": this.buyItems[i].itemShoppingListId,
              "subUserId": localStorage.getItem("subUserId")
            }
            await shoppingListService.deleteItemFromShoppingList(itemToDelete)
          }
          this.buyItems = []
          this.shoppingList = []
          await this.getShoppingList()
        }
      },
       async addItem() {
         const itemToAdd = {
           "itemName": this.editedItem.itemName,
           "shoppingListId": localStorage.getItem("shoppingListId"),
           "amount": this.editedItem.amount,
           "measurementType": this.editedItem.measurementType,
           "subUserId": localStorage.getItem("subUserId")
         }
         const feedback = await shoppingListService.addShoppingListItems(itemToAdd)
         this.snackbarText = feedback.data
         this.showSnackbar = true
         this.disableNameEdit = false
         this.showDialogWindow = false
         this.shoppingList = []
         await this.getShoppingList()
       },
       async removeList(item) {
         if(this.childUser){
           this.snackbarText = "You are not authorized to remove items"
           this.showSnackbar = true
         } else {
           const itemToDelete = {
             "itemName": item.name,
             "shoppingListId": localStorage.getItem("shoppingListId"),
             "amount": item.amount,
             "measurementType": item.measurement,
             "itemShoppingListId": item.itemShoppingListId,
             "subUserId": localStorage.getItem("subUserId")
           }
           await shoppingListService.deleteItemFromShoppingList(itemToDelete)
           this.shoppingList = []
           await this.getShoppingList()
           this.allItems.push(itemToDelete.itemName)
         }
       },
      async mount() {
        await this.getShoppingList()
        await this.getAllItems()
      },
      async setUserLevel(){
        this.childUser = localStorage.getItem("userType") === "false";
      },
      async addRecommendedItems(){
        const shoppingListId = (await shoppingListService.getShoppingListItems(localStorage.getItem("email"))).shoppingListId
        const subUserId = localStorage.getItem("subUserId")
        await shoppingListService.addShoppingPopularItems(shoppingListId, subUserId)
        this.shoppingList = []
        await this.getShoppingList()
        this.selectedItem = "";
      },
    },
    beforeMount(){
      this.mount()
      this.setUserLevel()
    },
    mounted(){
      if (localStorage.getItem("token") === null){
        router.push("/")
      }
    }
  }
</script>

<style>

#container{
      margin-top: 150px;
}
#new-item-button{
    margin-top:6px;
}

</style>
