import axios from "axios";

export default {
    getUserInfo(email){
        return axios.get("http://localhost:8080/api/users/login/getUser?email=" + email, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    getAllSubusers(email){
        return axios.get("http://localhost:8080/api/subusers/getUsersFromMaster?email=" + email, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    addNewSubuser(subuser){
        return axios.post("http://localhost:8080/api/subusers/addSubUser", subuser, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response
        }).catch(function (err) {
            return err.response
        })
    },
    deleteSubuser(subuserID){
        return axios.delete("http://localhost:8080/api/subusers/deleteSubUser/" + subuserID, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response
        }).catch(function (err) {
            return err.response
        })
    },
    updateSubuser(update){
        return axios.put("http://localhost:8080/api/subusers/updateSubuser",  update, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response.data
        }).catch(function (err) {
            return err.response
        })
    },
    updateInformation(update){
        return axios.put("http://localhost:8080/api/users/updateUser",  update, {
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
