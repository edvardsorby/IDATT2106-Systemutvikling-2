<template>
  <v-card class="user-card" @click="chooseUser">
    <v-card-title id="name">{{ name }} </v-card-title>
    <v-card-subtitle id="type">{{ typeName }}</v-card-subtitle>
    <div><img src="../assets/user-logo.png" id="user-image" alt="empty"></div>

    <v-row id="change-info-button">
      <v-dialog v-model="showEditingWindow" persistent width="400">
        <template v-slot:activator="{ props }">
          <v-btn
              id="changeSubuserInfo"
              class="font-weight-bold"
              color="teal"
              v-if="$route.name !== 'chooseUser' && !isChildUser"
              v-bind="props"
              :disabled="isChildUser"
              @click="showEditingWindow = true"
          >
            Change info
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Change user info</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field v-model="newName" label="Username*" required></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-select
                      :disabled="isOriginalSuperUser"
                      v-model="newType"
                      :items="userTypes"
                      label="User level*"
                      required
                  ></v-select>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                      v-if="newType==='Adult'"
                      v-model="pinCode"
                      type="password"
                      label="Pin-Code*"
                      required
                      :rules="[ checkPin ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
            <div><small v-if="showError" class="error-message">*all required fields are not filled</small></div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="showEditingWindow = false">Close</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="updateUser">Save info</v-btn>
            <v-btn v-if="!isOriginalSuperUser" color="blue-darken-1" variant="text" @click="deleteSubuser">Delete user</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>


    <v-row justify="center">
      <v-dialog v-model="showPinCodeWindow" persistent width="400">
        <template v-slot:activator="{ props }"></template>
        <v-card>
          <v-card-title>
            <span class="text-h5">Enter PIN code</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                      label="Pin*"
                      v-model="pinCode"
                      type="password"
                      :rules="[ checkPin ]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
            <div><small v-if="showError" class="error-message">*all required fields are not filled</small></div>
            <div><small class="error-message" id="error-pinCode"></small></div>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="showPinCodeWindow = false">Close</v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="chooseSuperUser">Login</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-card>
  <v-snackbar v-model="snackbar" color="teal" :timeout="2000">{{ snackbarText }}
    <template v-slot:actions>
      <v-btn color="white" variant="text" @click="snackbar = false">Close</v-btn>
    </template>
  </v-snackbar>
</template>

<script>
import settingsService from "@/services/settingsService";
import router from "@/router"
import loginService from "@/services/loginService";
export default {
  name: "user-component",
  props: {
    name: String,
    type: Boolean,
    pin: Number,
    id: Number
  },
  data() {
    return {
      showPinCodeWindow: false,
      pinCode: '',
      newName: this.name,
      newType: this.typeName,
      typeName: null,

      showEditingWindow: false,

      isChildUser: false,
      currentUser: false,
      isOriginalSuperUser: false,

      pinCheck: false,
      showError: false,

      snackbarText: "",
      snackbar: false,

      userTypes: ["Adult", "Child"],
      typeToSend: false
    }
  },
  methods:{
    async deleteSubuser(){
      const feedback = await settingsService.deleteSubuser(this.id)
      if (feedback.status !== 200) {
        this.snackbarText = "Something went wrong, try again later"
        this.snackbar = true
      }
      this.$emit('update-users')
    },
    async updateUser(){
      this.typeToSend = this.newType === "Adult";
      const name = this.newName
      const type = this.typeToSend
      const pinCode = this.pinCode

      const update = {
        "name": name,
        "accessLevel": type,
        "subUserId": this.id,
        "pinCode": pinCode
      }
      if ((type === true && !this.pinCheck) || this.newName === ''){
        this.showError = true
      } else {
        this.snackbarText = await settingsService.updateSubuser(update)
        this.$emit('update-users')
        this.snackbar = true
        this.showEditingWindow = !this.showEditingWindow
        this.showError = false
      }
    },
    async setUserLevel(){
      this.isChildUser = localStorage.getItem("userType") === "false";
      this.currentUser = parseInt(localStorage.getItem("subUserId")) === this.id;
      this.isOriginalSuperUser = parseInt(localStorage.getItem("masterUserId")) === this.id;
      if (this.type === true){
        this.typeName = "Adult"
        this.newType = "Adult"
      } else {
        this.typeName = "Child"
        this.newType = "Child"
      }
    },
    editInfo(){
      this.showEditingWindow = true
    },
    checkPin(value) {
      if (/^((?!(0))\d{4})$/.test(value)) {
        this.pinCheck = true;
        this.showError = false
        return true
      } else {
        this.showError = true
        this.pinCheck = false;
        return 'PIN must be 4 digits and cannot start with 0.'
      }
    },
    chooseUser(){
      if (this.$route.name === "chooseUser" && this.type === false){
        localStorage.setItem("username", this.name)
        localStorage.setItem("userType", this.type)
        localStorage.setItem("subUserId", this.id)
        router.push("/fridge")
      } else if(this.$route.name === "chooseUser" && this.type === true){
        this.showPinCodeWindow = true
      }
    },
    async chooseSuperUser() {
      const name = this.name
      const type = this.type
      const pinCheck = this.pinCheck
      const check = {
        "subUserId": this.id,
        "pinCode": this.pinCode
      }
      await loginService.checkPinCode(check).then(function (response) {
        if (response.status === 200 && pinCheck) {
          localStorage.setItem("username", name)
          localStorage.setItem("userType", type)
          localStorage.setItem("subUserId", check.subUserId)
          router.push("/fridge")
        } else {
          document.getElementById("error-pinCode").innerHTML = response.data
        }
      }).catch(function (error) {
        console.log(error)
      })
    }
  },
  created(){
    this.setUserLevel()
  }
}
</script>

<style>
.user-card {
  display: inline-block;
  margin: 20px;
  width: 200px;
  height: 230px;
  cursor: pointer;
  border: 1px solid #39495c;
  text-align: center;
}
#user-image {
  width: 100px;
  height: 100px;
  margin-top: 4px;
}
#change-info-button {
  display:flex;
  align-content:center;
  flex-direction: column;
  padding-bottom: 10px;
  margin-top: 2px;
}
</style>
