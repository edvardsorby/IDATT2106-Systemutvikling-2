<template>
  <v-app>
    <div id="settings-container">
      <v-card id="user-information" class="mx-auto" max-width="320">
          <div id="information">
            <v-toolbar color="teal">
              <v-toolbar-title class="font-weight-bold">Account information</v-toolbar-title>
            </v-toolbar>
            <v-card-subtitle te>e-mail:</v-card-subtitle>
            <v-card-text>{{ email }}</v-card-text>
            <v-sheet id="user-information" width="300">
              <v-text-field id="first-name-input" label="First name" v-model="firstname" :readonly="!change" :rules="[ checkName(firstname) ]"></v-text-field>
              <v-text-field id="last-name-input" label="Last name" v-model="lastname" :readonly="!change" :rules="[ checkLastName(lastname) ]"></v-text-field>
              <v-text-field id="phone-number-input" label="Phone number" v-model="phone" :readonly="!change" :rules="[ checkPhoneNumber(phone) ]"></v-text-field>
              <v-text-field id="household-input" label="Household number" v-model="household" :readonly="!change" :rules="[ checkHousehold(household) ]"></v-text-field>
            </v-sheet>
          </div>
          <div id="buttons">
            <div class="settings-buttons"><v-btn id="info-button" class="font-weight-bold" color="primary" @click="changeAccountInfo" :disabled="childUser">{{ picked }}</v-btn></div>
            <div id="newSubUser" class="settings-buttons">
              <v-row>
                <v-dialog v-model="dialog" persistent width="400">
                  <template v-slot:activator="{ props }">
                    <v-btn
                        id="addNewSubuserButton"
                        class="font-weight-bold"
                        color="teal"
                        v-bind="props"
                        :disabled="childUser"
                    >Add new user
                    </v-btn>
                  </template>
                  <v-card>
                    <v-card-title>
                      <span class="text-h5">New user</span>
                    </v-card-title>
                    <v-card-text>
                      <v-container>
                        <v-row>
                          <v-col cols="12">
                            <v-text-field
                                v-model="usernameNewSubuser"
                                label="Username*"
                                :rules="[checkUsername]"></v-text-field>
                          </v-col>
                          <v-col cols="12">
                            <v-select
                                v-model="usertypeNewSubuser"
                                :items="types"
                                label="User level*"
                                :rules="[checkUsertype]"
                            ></v-select>
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                                v-if="usertypeNewSubuser==='Adult'"
                                v-model="pinCode"
                                label="Pin-Code*"
                                :rules="[checkPin]"
                            ></v-text-field>
                          </v-col>
                        </v-row>
                      </v-container>
                      <small>*indicates required field</small>
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer></v-spacer>
                      <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Close</v-btn>
                      <v-btn color="blue-darken-1" variant="text" @click="addSubuser">Save
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-dialog>
              </v-row>
            </div>
          </div>
          <div class="error-message"><p v-if="childUser">You are not authorized to make changes</p></div>
      </v-card>
      <div id="users">
        <UserComponent
            v-on:update-users="getSubusers"
            v-for="user in users"
            :key="user.subUserId"
            :name="user.name"
            :user="user"
            :type="user.accessLevel"
            :id="user.subUserId"/>
      </div>
    </div>
    <v-snackbar v-model="snackbar" color="teal" :timeout="2000">{{ snackbarText }}
      <template v-slot:actions>
        <v-btn color="white" variant="text" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script>
import UserComponent from "@/components/UserComponent.vue";
import settingsService from "@/services/settingsService.js";
import router from "@/router";
export default {
  components: {UserComponent},
  data(){
    return {
      email: localStorage.getItem("email"),
      firstname: localStorage.getItem("firstname"),
      lastname: localStorage.getItem("lastname"),
      phone: localStorage.getItem("phone"),
      household: localStorage.getItem("household"),
      types: ["Adult", "Child"],
      picked: "Change your information",
      users: [],
      snackbarText: "",
      snackbar: false,
      dialog: false,
      change: false,
      editing: false,
      childUser: true,
      usernameNewSubuser: null,
      usertypeNewSubuser: null,
      pinCode: '',
      nameCheck: false,
      lastnameCheck: false,
      phoneCheck: false,
      householdCheck: false,
      pinCheck: false,
      usernameCheck: false,
      usertypeCheck: false,
      typeToSend: false
    };
  },
  methods: {
    async setUserLevel(){
      this.childUser = localStorage.getItem("userType") === "false";
    },
    async getSubusers(){
      this.users = []
      this.users = await settingsService.getAllSubusers(localStorage.getItem("email"))
    },
    async addSubuser(){
      if(this.usernameCheck && this.usertypeCheck) {
        this.typeToSend = this.usertypeNewSubuser === "Adult"
        if ((this.typeToSend && this.pinCheck) || !this.typeToSend){
          const subuser = {
            "name": this.usernameNewSubuser,
            "accessLevel": this.typeToSend,
            "userEmail": localStorage.getItem("email"),
            "pinCode": this.pinCode
          }
          const feedback = await settingsService.addNewSubuser(subuser)
          this.snackbarText = feedback.data
          this.snackbar = true
          if(feedback.status === 201) {
            await this.getSubusers()
            this.dialog = false
          }
        } else {
          this.snackbarText = "Missing pin code"
          this.snackbar = true
        }
        }else {
          this.snackbarText = "Failed to add user"
          this.snackbar = true
        }
    },
    async changeAccountInfo(){
      if(!this.editing){
        this.change = !this.change
        this.editing = !this.editing
        this.picked = "Save your new information"
      } else {
        if(this.nameCheck && this.lastnameCheck && this.householdCheck && this.phoneCheck) {
          const firstName = this.firstname
          const lastName = this.lastname
          const update = {
            "email": localStorage.getItem("email"),
            "firstName": firstName,
            "lastName": lastName,
            "phoneNumber": this.phone,
            "household": this.household
          }

          const feedback = await settingsService.updateInformation(update)
          const updatedInformation = await settingsService.getUserInfo(localStorage.getItem("email"))
          localStorage.setItem("firstname", updatedInformation.firstName)
          localStorage.setItem("lastname", updatedInformation.lastName)
          localStorage.setItem("phone", updatedInformation.phoneNumber)
          localStorage.setItem("household", updatedInformation.household)

          if (feedback.status === 200){
            this.change = !this.change
            this.editing = !this.editing
            this.picked = "Change your information"
          }
          this.snackbarText = feedback.data
          this.snackbar = true
        }
      }
    },
    checkName(value) {
      if (value?.length > 0) {
        this.nameCheck = true
        return true
      } else {
        this.nameCheck = false
        return 'First name cannot be empty.'
      }
    },
    checkLastName(value) {
      if (value?.length > 0) {
        this.lastnameCheck = true
        return true
      } else {
        this.lastnameCheck = false
        return 'Last name cannot be empty.'
      }
    },
    checkPhoneNumber(value) {
      if (/^[0-9]{8}$/.test(value)) {
        this.phoneCheck = true
        return true
      } else {
        this.phoneCheck = false
        return 'Number must be 8 digits.'
      }
    },
    checkHousehold(value) {
      if (value > 0) {
        this.householdCheck = true
        return true
      } else {
        this.householdCheck = false
        return 'There must be at least 1 household member.'
      }
    },
    checkUsername(value) {
      if (value?.length > 0) {
        this.usernameCheck = true
        return true
      } else {
        this.usernameCheck = false
        return 'Username cannot be empty.'
      }
    },
    checkUsertype(value) {
      if (value?.length > 0) {
        this.usertypeCheck = true
        return true
      } else {
        this.usertypeCheck = false
        return 'Usertype cannot be empty.'
      }
    },
    checkPin(value) {
      if (/^((?!(0))\d{4})$/.test(value)) {
        this.pinCheck = true;
        return true
      } else {
        this.pinCheck = false;
        return 'PIN must be 4 digits and cannot start with 0.'
      }
    }
  },
  beforeMount() {
    this.getSubusers()
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
#settings-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  overflow: hidden;
}
#information{
  display: flex;
  align-content: center;
  flex-direction: column;
}
#users{
  min-width: 500px;
  width: calc(100% - 400px);
  width: -moz-calc(100% - 400px);
  width: -webkit-calc(100% - 400px);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: center;
  text-align: center;
  overflow: hidden;
}
#user-information{
  margin: 10px;
}

.settings-buttons {
  margin-top: 20px;
}

#newSubUser {
  margin-left: 10px;
  margin-bottom: 12px;
}

#buttons {
  display:flex;
  align-content:center;
  flex-direction: column;
  padding-bottom: 10px;
}
</style>
