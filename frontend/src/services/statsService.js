import axios from "axios";

export default {
    getPersonalGarbageYear(fridgeId, year){
        return axios.get("http://localhost:8080/api/garbages/refrigerator/totalAmountYear/"+fridgeId + "?year=" + year, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response
        }).catch(function (err) {
            return err.response
        })
    },
    getPersonalGarbageMonth(fridgeId, year){
        return axios.get("http://localhost:8080/api/garbages/refrigerator/amountEachMonth/"+fridgeId + "?year=" + year, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response.data
        })
    },
    getAverageGarbageYear(fridgeId, year){
        return axios.get("http://localhost:8080/api/garbages/averageAmountYear/"+fridgeId + "?year=" + year, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    getAverageGarbageMonth(fridgeId, year){
        return axios.get("http://localhost:8080/api/garbages/averageAmountEachMonth/"+fridgeId + "?year=" + year, {
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
