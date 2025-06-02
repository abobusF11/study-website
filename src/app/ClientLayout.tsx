"use client";
import Link from 'next/link';
import React, { useEffect } from 'react';
import {useAuthStore} from "@/app/features/auth/hooks/useAuth";
// import { useAuth } from './features/auth/hooks/useAuth';

export default function ClientLayout({ children }: {
    children: React.ReactNode;
}) {
    // const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuth();
    const { user, isAuthenticated, isLoading, logout, checkAuth } = useAuthStore();

    // Проверяем, является ли пользователь администратором
    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const handleLogout = async () => {
        await logout();
    };

    if (isLoading) {
        return (
            <div className="bg-gray-100 flex flex-col min-h-screen">
                <div className="flex justify-center items-center h-screen">
                    <div className="text-xl">Проверка авторизации...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-100 flex flex-col min-h-screen">
            {/* Навигация */}
            <nav className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex justify-between items-center">
                    <Link href="/" className="text-2xl font-bold">ООО "УМЦ "Энергоэффективность""</Link>
                    <ul className="flex space-x-4 items-center">
                        <li><Link href="/" className="hover:underline">Главная</Link></li>
                        <li><Link href="/pages/about" className="hover:underline">О нас</Link></li>
                        <li><Link href="/pages/service" className="hover:underline">Услуги</Link></li>

                        {isAuthenticated ? (
                            <>
                                <li><Link href="/pages/template" className="hover:underline">Шаблон</Link></li>
                                
                                {/* Добавляем кнопку Методисты только для администратора */}
                                {isAdmin && (
                                    <li><Link href="/pages/methodists" className="hover:underline">Методисты</Link></li>
                                )}
                                
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
                                    href="/pages/auth/login"
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
                    <p>© 2025 ООО "УМЦ "Энергоэффективность"". Все права защищены.</p>
                </div>
            </footer>
        </div>
    );
}