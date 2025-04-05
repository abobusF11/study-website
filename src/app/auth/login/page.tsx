"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import api from "@/lib/api";
import Link from "next/link";
import {useAuth} from "@/app/ClientLayout";

interface Token {
    access_token: string;
    token_type: string;
}

export default function LoginPage() {
    const { loginStatus } = useAuth();
    const [login, setLogin] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('username', login);
            formData.append('password', password);

            await api.post<Token>("/auth/login", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            router.push("/dashboard");
            loginStatus(); // Устанавливаем статус авторизации
            router.push("/dashboard");
        } catch (error) {
            console.error('Login error:', error);
            setError('Неверный логин или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-8 rounded-xl shadow-lg"
            >
                <div className="text-center">
                    <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
                        Вход в систему
                    </h2>
                </div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-red-50 border-l-4 border-red-500 p-4 my-4"
                    >
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="login" className="block text-sm font-medium text-gray-700 mb-1">
                            Логин
                        </label>
                        <input
                            id="login"
                            name="login"
                            type="text"
                            required
                            value={login}
                            onChange={(e) => setLogin(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ваш логин"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Пароль
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Ваш пароль"
                        />
                    </div>

                    <div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            disabled={isLoading}
                            className={`w-full py-2 px-4 border border-transparent rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Вход...
                                </>
                            ) : 'Войти'}
                        </motion.button>
                    </div>
                </form>

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Нет аккаунта?{' '}
                        <Link
                            href="/auth/register"
                            className="font-medium text-blue-600 hover:text-blue-500 hover:underline"
                        >
                            Зарегистрироваться
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}