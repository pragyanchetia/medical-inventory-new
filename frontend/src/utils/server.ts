import axios from 'axios';

export const server = axios.create({
    baseURL: 'http://localhost:4000/api/',
    withCredentials: true,
    headers: {
        Authorization: typeof window !== "undefined" ? `Bearer ${localStorage.getItem("token")}` : undefined
    }
});
 