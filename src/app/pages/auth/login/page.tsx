"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';
import {useAuthStore} from "@/app/features/auth/hooks/useAuth";
// import { useAuth } from "@/app/features/auth/hooks/useAuth";

export default function LoginPage() {
    // Используем хук useAuth из features
    // const { login, isAuthenticated, isLoading: authLoading, error: authError, checkAuth } = useAuth();
    const { login, isAuthenticated, isLoading: authLoading, error: authError, checkAuth } = useAuthStore();
    const [loginValue, setLoginValue] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Если пользователь уже авторизован, перенаправляем на страницу шаблонов
    useEffect(() => {
        if (isAuthenticated) {
            router.push("/pages/template");
        }
    }, [isAuthenticated, router]);

    useEffect(() => {
        console.log("321", isAuthenticated);
    }, [isAuthenticated]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            // Создаем FormData для отправки на сервер
            const formData = new FormData();
            formData.append('username', loginValue); // Важно! Имя поля должно быть 'username'
            formData.append('password', password);
            
            // Используем функцию login из хука useAuth
            const success = await login({
                formData: formData
            });
            
            if (success) {
                router.push("/pages/template");
            } else {
                setError('Неверный логин или пароль');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            setError(error.message || 'Неверный логин или пароль');
        } finally {
            setIsLoading(false);
        }
    };

    // Показываем сообщение о загрузке, если проверяем аутентификацию
    if (authLoading) {
        return (
            <div className="w-full max-w-md">
                <div className="bg-white p-8 rounded-xl shadow-lg">
                    <div className="text-center">
                        <div className="text-xl">Проверка авторизации...</div>
                    </div>
                </div>
            </div>
        );
    }

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

                {(error || authError) && (
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
                                <p className="text-sm text-red-700">{error || authError}</p>
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
                            value={loginValue}
                            onChange={(e) => setLoginValue(e.target.value)}
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
            </motion.div>
        </div>
    );
}