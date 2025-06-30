import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: "https://nexora-6ld3.onrender.com/",
    withCredentials: true, //send cookies with the req
});