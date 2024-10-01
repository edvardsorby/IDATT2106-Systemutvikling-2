import axios from "axios";

export default {
    login(info){
        return axios.post("http://localhost:8080/api/auth/authenticate", info).then((response) => {
            localStorage.setItem("token", response.data.token)
            return response
        }).catch(function (err) {
            return err.response
        })
    },
    registerUser(info){
        return axios.post("http://localhost:8080/api/auth/register", info).then((response) => {
            localStorage.setItem("token", response.data.token)
            return response
        }).catch(function (err) {
            return err.response
        })
    },
    getFridgeId(email) {
        return axios.get("http://localhost:8080/api/refrigerators/getRefrigeratorByUser?userEmail=" + email, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            localStorage.setItem("fridgeId", response.data.refrigeratorId)
            return response
        }).catch(function (err) {
            console.log(err)
        })
    },
    checkPinCode(subuser) {
        return axios.post("http://localhost:8080/api/subusers/validatePinCode", subuser, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("token")
            }
        }).then((response) => {
            return response
        }).catch(function (err) {
            if (err.response.status===404){
                return err.response
            } else {
                return {"data": "Pin code is incorrect"}
            }
        })
    }
}
