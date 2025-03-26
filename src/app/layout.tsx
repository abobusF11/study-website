import './globals.css';
import { Inter } from 'next/font/google';
import Link from 'next/link';

const inter = Inter({ subsets: ['latin'] });

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'GOIDA',
    description: 'Учитесь с нами и будет все заебок'
};

export default function RootLayout({children,}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body className={`${inter.className} bg-gray-100 flex flex-col min-h-screen`}>
        {/* Навигация */}
        <nav className="bg-blue-600 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold">Мой Сайт</Link>
                <ul className="flex space-x-4">
                    <li><Link href="/" className="hover:underline">Главная</Link></li>
                    <li><Link href="/about" className="hover:underline">О нас</Link></li>
                    <li><Link href="/create" className="hover:underline">Шаблон</Link></li>
                </ul>
            </div>
        </nav>

        {/* Основное содержимое страниц */}
        <main className="container mx-auto p-4 mt-8 flex-grow">
            {children}
        </main>

        {/* Подвал */}
        <footer className="bg-gray-800 text-white p-4 mt-8">
            <div className="container mx-auto text-center">
                <p>© 2024 Мой Сайт. Все права защищены.</p>
            </div>
        </footer>
        </body>
        </html>
    );
}