<template>
  <div id="stats-container">
    <div id="stats">
      <v-card class="stats-card">
        <v-toolbar color="teal">
          <v-toolbar-title class="font-weight-bold">Personal yearly amount ({{ personalChosenYear }})</v-toolbar-title>
          <v-menu>
            <template v-slot:activator="{props}">
              <v-btn icon variant="tonal" v-bind="props">
                <v-icon>mdi-calendar-today</v-icon>
                <v-tooltip activator="parent" location="start">Change current year</v-tooltip>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(year, index) in years" :key="index" :value="year" @click="getPersonalYearAmount(year)">
                <v-list-item-title>{{year}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-card-text class="text-pre-wrap">{{displayPersonal}}</v-card-text>
      </v-card>

      <v-card class="stats-card">
        <v-toolbar color="teal">
          <v-toolbar-title class="font-weight-bold">Average all users ({{averageChosenYear}})</v-toolbar-title>
          <v-menu>
            <template v-slot:activator="{props}">
              <v-btn icon variant="tonal" v-bind="props">
                <v-icon>mdi-calendar-today</v-icon>
                <v-tooltip activator="parent" location="start">Change current year</v-tooltip>
              </v-btn>
            </template>
            <v-list>
              <v-list-item v-for="(year, index) in years" :key="index" :value="year" @click="getAverageYearAmount(year)">
                <v-list-item-title>{{year}}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
        <v-card-text class="text-pre-wrap">Average amount of garbage thrown in {{averageChosenYear}} is {{averageYearAmount}}kg</v-card-text>
      </v-card>
    </div>

    <div id="button-and-chart">
      <div>
        <v-menu>
          <template v-slot:activator="{props}">
            <v-btn icon variant="tonal" v-bind="props" id="change-graph-year">
              <v-icon>mdi-chart-line</v-icon>
              <v-tooltip activator="parent" location="start">Change year (showing: {{ chartYear }})</v-tooltip>
            </v-btn>
          </template>
          <v-list>
            <v-list-item v-for="(year, index) in years" :key="index" :value="year" @click="changeData(year)">
              <v-list-item-title>{{year}}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
      <Bar
        v-if="loaded"
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
    </div>
  </div>
</template>

<script>
import statsService from "@/services/statsService.js";
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import router from "@/router";

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default {
  components: { Bar },
  data(){
    return {
      displayPersonal: '',
      loaded:  false,
      personalChosenYear: new Date().getFullYear(),
      averageChosenYear: new Date().getFullYear(),
      personalYearAmount: 0,
      averageYearAmount: 0,
      years: ["2023", "2022", "2021","2020"],
      chartYear: new Date().getFullYear(),
      chartData: null,
      chartOptions: {
        scales:{
          y: {
            title: {
              display: true,
              text: "Kilograms"
            }
          },
          x: {
            title: {
              display: true,
              text: "Month"
            }
          }
        },
        responsive: true
      }
    }
  },
  methods: {
    changeData(year){
      this.createChart(year)
      this.chartYear = year
    },
    async getPersonalYearAmount(year){
      const data = await statsService.getPersonalGarbageYear(localStorage.getItem("fridgeId"), year)
      if (data.status === 200) {
        this.personalChosenYear = year
        this.displayPersonal = "In " + this.personalChosenYear + " you have thrown " + data.data + "kg food"
      } else {
        this.personalChosenYear = year
        this.displayPersonal = data.data
      }
    },
    async getAverageYearAmount(year){
      this.averageYearAmount = await statsService.getAverageGarbageYear(localStorage.getItem("fridgeId"), year)
      this.averageChosenYear = year
    },
    async createChart(year){
      this.loaded = false

      try {
        const userList = await statsService.getPersonalGarbageMonth(localStorage.getItem("fridgeId"), year)
        const averageList = await statsService.getAverageGarbageMonth(localStorage.getItem("fridgeId"), year)
        const data = {
          labels: [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
          datasets: [
            { label: "Your waste",
              data: userList,
              backgroundColor: "teal"
            }, { label: "Average waste",
              data: averageList,
              backgroundColor: "#6200EE"
            } ]
        }
        console.log(data)
        this.chartData = data

        this.loaded = true
      } catch (err){
        console.log(err)
      }

    }
  },
  beforeMount(){
    this.getPersonalYearAmount(this.personalChosenYear)
    this.getAverageYearAmount(this.averageChosenYear)
    this.createChart(this.chartYear)
  },
  mounted(){
    if (localStorage.getItem("token") === null){
      router.push("/")
    }
  }
}
</script>

<style scoped>
#stats-container{
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
  align-content: center;
}

#stats {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
}
.stats-card {
  width: 375px;
  margin: 20px;
}

#change-graph-year{
  float: right;
}
</style>
