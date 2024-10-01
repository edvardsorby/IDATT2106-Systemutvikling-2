import axios from "axios";

export default {
    getAllCategories(){
        return axios.get("http://localhost:8080/api/categories/getAllCategories", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    getAllItemsByCategory(fridgeId, categoryId){
        return axios.get("http://localhost:8080/api/refrigerators/getItemInRefrigeratorByCategory/+" + fridgeId + "?categoryId=" + categoryId, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    getAllItems(){
        return axios.get("http://localhost:8080/api/items/getAllItems", {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    getAllItemsInFridge(email){
        return axios.get("http://localhost:8080/api/refrigerators/getRefrigeratorByUser?userEmail="+email, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data.items
        }).catch(function (err) {
            return err.response
        })
    },
    addNewItemToFridge(item){
        return axios.post("http://localhost:8080/api/refrigerators/addItemInRefrigerator", item, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    deleteItem(item){
        return axios.delete("http://localhost:8080/api/refrigerators/removeItem", {
            data: item,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    updateItemInFridge(item){
        return axios.put("http://localhost:8080/api/refrigerators/updateItemInRefrigerator", item, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response
        }).catch(function (err) {
            return err.response
        })
    }
}
