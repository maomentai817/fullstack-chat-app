import axios from "axios"

export const instance = axios.create({
    baseURL: 'http://localhost:5001/api',
    withCredentials: true,
})