import axios from "axios";

export default {
    async getRecipe(refrigeratorId){
        return axios.get("http://localhost:8080/api/recipes/generateRecipe?refrigeratorId=" + refrigeratorId, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response.status
        })
    },
    async generateWeeklyMenus(email, numPeople){
        return axios.get("http://localhost:8080/api/recipes/generateWeeklyMenu/" + email + "?numPeople=" + numPeople, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    async getWeeklyMenu(email){
        return axios.get("http://localhost:8080/api/recipes/getWeeklyMenu/" + email, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    }
}
