'use client';
import Link from "next/link";
import {useState} from "react";
import CreateGroupModal from "@/app/components/CreateGroupModal";
import CreateProtocolModal from "@/app/components/CreateProtocolModal";


export default function Create() {

    const templates = [
        { id: 1, name: 'Шаблон группы П-401', type: 'Группа', author: 'Иванов И.И.', date: '2024-03-15' },
        { id: 2, name: 'Протокол экзамена', type: 'Протокол', author: 'Петрова А.С.', date: '2024-02-28' },
        { id: 3, name: 'Шаблон курса React', type: 'Курс', author: 'Сидоров В.В.', date: '2024-01-10' },
        { id: 4, name: 'Шаблон аттестации', type: 'Протокол', author: 'Иванов И.И.', date: '2023-12-05' },
    ];

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);

    // Заглушечные данные курсов
    const courses = [
        { id: 1, name: 'Frontend-разработка (React)', course: "Привет"},
        { id: 2, name: 'Backend-разработка (Node.js)', course: "Привет"},
        { id: 3, name: 'Дизайн интерфейсов', course: "Привет"}
    ];

    const handleSaveGroup = (selectedCourse: string, users: any[]) => {
        console.log('Сохранение группы:', { selectedCourse, users });
        setIsGroupModalOpen(false);
        // Здесь можно добавить логику сохранения в API
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">Шаблоны</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Кнопка 1 - Создать новую группу */}
                <button
                    onClick={() => setIsGroupModalOpen(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center"
                >
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Создать новую группу
                </button>

                {/* Кнопка 2 - Создать новый протокол */}
                <button onClick={() => setIsProtocolModalOpen(true)} className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Создать новый протокол
                </button>

                {/* Кнопка 3 - Преподаватели */}
                <button className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Преподаватели
                </button>

                {/* Кнопка 4 - Архив */}
                <button className="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    Архив
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-md mt-10 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Тип</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Автор</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {templates.map((template) => (
                            <tr key={template.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {template.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${template.type === 'Группа' ? 'bg-blue-100 text-blue-800' :
                        template.type === 'Протокол' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'}`}>
                      {template.type}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {template.author}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {template.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <Link href="#" className="text-blue-600 hover:text-blue-900">Изменить</Link>
                                        <span className="text-gray-300">|</span>
                                        <Link href="#" className="text-red-600 hover:text-red-900">Удалить</Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    Показано 1 - 4 из 4 записей
                </div>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50" disabled>
                        Назад
                    </button>
                    <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 disabled:opacity-50" disabled>
                        Вперед
                    </button>
                </div>
            </div>

            <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                onSave={handleSaveGroup}
                courses={courses}
            />

            <CreateProtocolModal
                isOpen={isProtocolModalOpen}
                onClose={() => setIsProtocolModalOpen(false)}
                onSave={(selectedGroups) => {
                    console.log('Создан протокол для:', selectedGroups);
                    // setGroups(prev => [...prev, ...selectedGroups]);
                }}
                availableGroups={courses}
            />

        </div>
    );
}