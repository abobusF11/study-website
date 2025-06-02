import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/navigation';
import { create } from 'zustand';
import api from '@/lib/api';
import {AuthState, LoginCredentials} from "@/app/features/auth/types/AuthTypes";

// export function useAuth() {
//     const router = useRouter();
//     const [authState, setAuthState] = useState<AuthState>({
//         user: null,
//         isAuthenticated: false,
//         isLoading: true,
//         error: null,
//     });
//
//     // Проверка текущей сессии при загрузке
//     const checkAuth = useCallback(async () => {
//         try {
//             setAuthState(prev => ({...prev, isLoading: true}));
//
//             // Для обычных пользователей проверяем сессию на бэкенде
//             const response = await api.get('/auth/me');
//             if (response.status === 200) {
//                 setAuthState({
//                     user: response.data,
//                     isAuthenticated: true,
//                     isLoading: false,
//                     error: null,
//                 });
//             }
//         } catch (error) {
//             setAuthState({
//                 user: null,
//                 isAuthenticated: false,
//                 isLoading: false,
//                 error: null,
//             });
//         }
//     }, []);
//
//     // Вызов проверки аутентификации при монтировании компонента
//     useEffect(() => {
//         checkAuth();
//     }, [checkAuth]);
//
//     // Функция для входа в систему
//     const login = async (credentials: LoginCredentials) => {
//         try {
//             setAuthState(prev => ({...prev, isLoading: true, error: null}));
//
//             const response = await api.post('/auth/login', credentials.formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                 }
//             });
//
//             if (response.status === 200) {
//                 setAuthState({
//                     user: response.data,
//                     isAuthenticated: true,
//                     isLoading: false,
//                     error: null,
//                 });
//
//                 await checkAuth();
//                 return true;
//             }
//         } catch (error: any) {
//             setAuthState(prev => ({
//                 ...prev,
//                 isLoading: false,
//                 error: error.response?.data?.detail || 'Ошибка при входе в систему',
//             }));
//             return false;
//         }
//     };
//
//     // Функция для выхода из системы
//     const logout = async () => {
//         try {
//             // Если это не админ, делаем запрос на бэкенд
//             if (!localStorage.getItem('isAdmin')) {
//                 await api.post('/auth/logout');
//             }
//         } catch (error) {
//             console.error('Ошибка при выходе из системы:', error);
//         } finally {
//             delete api.defaults.headers.common['Authorization'];
//
//             // Обновляем состояние
//             setAuthState({
//                 user: null,
//                 isAuthenticated: false,
//                 isLoading: false,
//                 error: null,
//             });
//             // Перенаправляем на страницу входа
//             router.push('/pages/auth/login');
//         }
//     };
//
//     return {
//         user: authState.user,
//         isAuthenticated: authState.isAuthenticated,
//         isLoading: authState.isLoading,
//         error: authState.error,
//         login,
//         logout,
//         checkAuth,
//     };
// }

interface AuthStore extends AuthState {
    login: (credentials: LoginCredentials) => Promise<boolean>;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    checkAuth: async () => {
        try {
            set({ isLoading: true });
            const response = await api.get('/auth/me');
            if (response.status === 200) {
                set({
                    user: response.data,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
            }
        } catch (error) {
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },

    login: async (credentials) => {
        try {
            set({ isLoading: true, error: null });
            const response = await api.post('/auth/login', credentials.formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            if (response.status === 200) {
                set({
                    user: response.data,
                    isAuthenticated: true,
                    isLoading: false,
                    error: null,
                });
                return true;
            }
        } catch (error: any) {
            set({
                isLoading: false,
                error: error.response?.data?.detail || 'Ошибка при входе в систему',
            });
            return false;
        }
        return false;
    },

    logout: async () => {
        try {
            if (!localStorage.getItem('isAdmin')) {
                await api.post('/auth/logout');
            }
        } catch (error) {
            console.error('Ошибка при выходе из системы:', error);
        } finally {
            delete api.defaults.headers.common['Authorization'];
            set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
                error: null,
            });
        }
    },
}));