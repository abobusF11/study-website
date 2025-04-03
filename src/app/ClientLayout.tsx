"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, {useContext, useEffect, useState} from 'react';
import api from '@/lib/api';

const AuthContext = React.createContext({
    isAuthenticated: false,
    loginStatus: () => {},
    logout: () => {},
    isLoading: true
});

export default function ClientLayout({ children }: {
    children: React.ReactNode;
}) {
    const [authState, setAuthState] = useState({
        isAuthenticated: false,
        isLoading: true
    });
    const router = useRouter();

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            await api.get('/auth/me');
            setAuthState({ isAuthenticated: true, isLoading: false });
        } catch (error) {
            setAuthState({ isAuthenticated: false, isLoading: false });
        }
    };

    const handleLogin = () => {
        setAuthState({ isAuthenticated: true, isLoading: false });
    };

    const handleLogout = async () => {
        try {
            await api.post('/auth/logout');
            setAuthState({ isAuthenticated: false, isLoading: false });
            router.push('/');
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };

    if (authState.isLoading) {
        return (
            <div className="bg-gray-100 flex flex-col min-h-screen">
                <div className="flex justify-center items-center h-screen">
                    <div className="text-xl">Проверка авторизации...</div>
                </div>
            </div>
        );
    }

    return (

        <AuthContext.Provider value={{
            isAuthenticated: authState.isAuthenticated,
            loginStatus: handleLogin,
            logout: handleLogout,
            isLoading: authState.isLoading
        }}>
            <div className="bg-gray-100 flex flex-col min-h-screen">
                {/* Навигация */}
                <nav className="bg-blue-600 text-white p-4 shadow-md">
                    <div className="container mx-auto flex justify-between items-center">
                        <Link href="/" className="text-2xl font-bold">Название сайта</Link>
                        <ul className="flex space-x-4 items-center">
                            <li><Link href="/" className="hover:underline">Главная</Link></li>
                            <li><Link href="/about" className="hover:underline">О нас</Link></li>

                            {authState.isAuthenticated ? (
                                <>
                                    <li><Link href="/template" className="hover:underline">Шаблон</Link></li>
                                    <li>
                                        <button
                                            onClick={handleLogout}
                                            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md transition"
                                        >
                                            Выйти
                                        </button>
                                    </li>
                                </>
                            ) : (
                                <li>
                                    <Link
                                        href="/auth/login"
                                        className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-md transition"
                                    >
                                        Войти
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>

                {/* Основное содержимое страниц */}
                <main className="flex-1 flex items-center justify-center p-4">
                    {children}
                </main>

                {/* Подвал */}
                <footer className="bg-gray-800 text-white p-4 mt-8">
                    <div className="container mx-auto text-center">
                        <p>© 2025 Название сайта. Все права защищены.</p>
                    </div>
                </footer>
            </div>
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}