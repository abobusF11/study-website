import axios from 'axios'
import {authConfig} from "@/config/auth";

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
});

api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            const pathname = window.location.pathname;
            const isPrivateRoute = authConfig.protectedRoutes.some(route =>
                pathname.startsWith(route)
            );

            if (isPrivateRoute) { // Редиректим только если это защищенный маршрут
                document.cookie = 'token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
                window.location.replace('/auth/login');
            }
        }
        return Promise.reject(error);
    }
);

export default api