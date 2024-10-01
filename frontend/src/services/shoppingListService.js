import axios from "axios";

export default {
    getShoppingListItems(email){
        return axios.get("http://localhost:8080/api/shoppingList/getItemsFromShoppingList?email=" + email, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            localStorage.setItem("shoppingListId", response.data.shoppingListId)
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    deleteItemFromShoppingList(item){
        return axios.delete("http://localhost:8080/api/shoppingList/deleteItemFromShoppingList", {
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
    addShoppingListItems(item){
        return axios.post("http://localhost:8080/api/shoppingList/addItemToShoppingList", item, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response
        }).catch(function (err) {
            return err.response
        })
    },
    addShoppingPopularItems(shoppingListId, subUserId){
        return axios.get("http://localhost:8080/api/shoppingList/addMostPopularItems?shoppingListId="+shoppingListId+"&subUserId="+subUserId, {
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
