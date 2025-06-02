import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './styles/globals.css';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Название сайта',
    description: 'Учитесь с нами'
};

export default function RootLayout(
    {
        children,
    }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ru">
        <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
        </body>
        </html>
    );
}