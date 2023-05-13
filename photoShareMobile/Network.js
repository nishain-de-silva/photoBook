import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { API_URL } from "@env"
const baseUrl = API_URL

export const networkNavigation = {
    navigate: () => {
        console.log("navigation method is not implemented")
    }
}


// const navigation = useNavigation()
axios.interceptors.response.use((response) => response,
 (err) => {
    console.log(err)
    if(err.response && err.response.status == 401 && 
        err.response.data.code == "TOKEN_EXPIRED"
    ) {
        AsyncStorage.clear().then(() => {
            networkNavigation.navigate("auth")
        })
    }
})


export default {
    post: async (endpoint, data) => {
        const tokenKey = await AsyncStorage.getItem('authToken')
        if(tokenKey)
            return await axios.post(`${baseUrl}/${endpoint}`, data, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.post(`${baseUrl}/${endpoint}`, data)
    },
    put: async (endpoint, data) => {
        const tokenKey = await AsyncStorage.getItem('authToken')

        if(tokenKey)
            return await axios.put(`${baseUrl}/${endpoint}`, data, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.put(`${baseUrl}/${endpoint}`, data)
    },
    get: async (endpoint) => {
        const tokenKey = await AsyncStorage.getItem('authToken')

        if(tokenKey)
            return await axios.get(`${baseUrl}/${endpoint}`, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.get(`${baseUrl}/${endpoint}`)
    },
    delete: async (endpoint) => {
        const tokenKey = await AsyncStorage.getItem('authToken')

        if(tokenKey)
            return await axios.delete(`${baseUrl}/${endpoint}`, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.delete(`${baseUrl}/${endpoint}`)
    }
}