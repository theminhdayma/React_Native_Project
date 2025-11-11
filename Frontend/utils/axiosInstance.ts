import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: "http://192.168.2.180:8080/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 10000
})

