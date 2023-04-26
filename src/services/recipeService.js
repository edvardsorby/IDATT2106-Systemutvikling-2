import axios from "axios";

export default {
    async getRecipe(refrigeratorId){
        return axios.get("http://localhost:8080/api/recipes/generateRecipe?refrigeratorId=" + refrigeratorId).then((response) => {
            console.log("Generating recipe...")
            return response.data
        }).catch(function (err) {
            console.log(err.response)
        })
    },
    async generateWeeklyMenus(email, numPeople){
        return axios.get("http://localhost:8080/api/recipes/generateWeeklyMenu/" + email + "?numPeople=" + numPeople).then((response) => {
            console.log("Generating recipe...")
            return response.data
        }).catch(function (err) {
            console.log(err.response)
        })
    },
    async getWeeklyMenu(email){
        return axios.get("http://localhost:8080/api/recipes/getWeeklyMenu/" + email).then((response) => {
            console.log("Getting recipe...")
            return response.data
        }).catch(function (err) {
            console.log(err.response)
        })
    }
}
