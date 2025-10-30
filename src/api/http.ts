import axios from 'axios'
import { getToken } from '../utils/token'

export const API_BASE_URL = "http://localhost:5208";

export const http = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

http.interceptors.request.use((config) => {
    const token = getToken()
    if (token) {
        config.headers = config.headers || {}
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

http.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error?.response?.status === 401) {
            // Opcional: disparar evento global para logout
            // window.dispatchEvent(new CustomEvent('unauthorized'))
        }
        return Promise.reject(error)
    }
)


