import axios from 'axios'
const baseUrl = process.env.REACT_APP_API_URL

axios.interceptors.response.use((response) => response,
 (err) => {
    console.log(err)
    if(err.response && err.response.status == 401 && 
        err.response.data.code == "TOKEN_EXPIRED"
    ) {
        localStorage.clear()
        window.location.href = "/auth?tokenExpired=true"
    }
})
export default {
    post: async (endpoint, data) => {
        const tokenKey = localStorage.getItem('authToken')
        
        if(tokenKey)
            return await axios.post(`${baseUrl}/${endpoint}`, data, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.post(`${baseUrl}/${endpoint}`, data)
    },
    put: async (endpoint, data) => {
        const tokenKey = localStorage.getItem('authToken')

        if(tokenKey)
            return await axios.put(`${baseUrl}/${endpoint}`, data, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.put(`${baseUrl}/${endpoint}`, data)
    },
    get: async (endpoint) => {
        const tokenKey = localStorage.getItem('authToken')

        if(tokenKey)
            return await axios.get(`${baseUrl}/${endpoint}`, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.get(`${baseUrl}/${endpoint}`)
    },
    delete: async (endpoint) => {
        const tokenKey = localStorage.getItem('authToken')

        if(tokenKey)
            return await axios.delete(`${baseUrl}/${endpoint}`, {
                headers: {
                    Authorization: tokenKey
                }
            })
        return await axios.delete(`${baseUrl}/${endpoint}`)
    }
}