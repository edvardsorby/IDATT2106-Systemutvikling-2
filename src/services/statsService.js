import axios from "axios";

export default {
    getGarbageYear(fridgeId, year){
        return axios.get("http://localhost:8080/api/garbages/refrigerator/totalAmountYear/"+fridgeId + "?year=" + year, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            console.log("getting amount of garbage for specific year")
            return response.data
        }).catch(function (err) {
            console.log(err.response)
        })
    },
    getGarbageMonth(fridgeId, year){
        return axios.get("http://localhost:8080/api/garbages/refrigerator/amountEachMonth/"+fridgeId + "?year=" + year, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            console.log("getting amount of garbage for all months")
            console.log(response.data)
            return response.data
        }).catch(function (err) {
            console.log(err.response)
        })
    }
}
