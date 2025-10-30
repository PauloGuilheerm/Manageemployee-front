import axios from 'axios'
import { getToken } from '../utils/token'
import toast from 'react-hot-toast';

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
        const status = error?.response?.status
        const data = error?.response?.data
        const message = data?.message || data?.title || error?.message || 'Erro inesperado'
        if (status === 401) {
            toast.error('Não autorizado')
        }
        return Promise.reject({ status, message, data })
    }
)


