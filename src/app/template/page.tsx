'use client';
import {useEffect, useState} from "react";
import CreateGroupModal from "@/components/CreateGroupModal";
import CreateTeachersModal from "@/components/CreateTeachersModal";
import {createGroup, createProtocol, createTeachers} from "@/utils/request";
import {ClientCreate, Group} from "@/types/GroupTypes";
import {Protocol} from "@/types/ProtocolTypes";
import api from "@/lib/api";
import CreateProtocolModal from "@/components/CreateProtocolModal";
import { ProtocolTable } from "@/components/ProtocolTable";
import {TeacherCreate} from "@/types/TeacherTypes";

export default function Template() {

    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isProtocolModalOpen, setIsProtocolModalOpen] = useState(false);
    const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);

    const [protocols, setProtocols] = useState<Protocol[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProtocols = async () => {
            try {
                const response = await api.get('/template/protocol/show');
                setProtocols(response.data);
            } catch (err) {
                setError('Не удалось загрузить протоколы');
                console.error('Ошибка загрузки протоколов:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProtocols();
    }, []);

    useEffect(() => {
        console.log("Протоколы обновлены:", protocols);
    }, [protocols]); // Срабатывает при каждом изменении `protocols`

    // Заглушечные данные курсов
    const courses = [
        {id: 1, name: 'Frontend-разработка (React)'},
        {id: 2, name: 'Backend-разработка (Node.js)'},
        {id: 3, name: 'Дизайн интерфейсов'}
    ];

    const handleDeleteProtocol = async (protocolId: number) => {
        try {
            await api.post(`/template/protocol/delete/${protocolId}`);
            // Обновляем список после удаления
            setProtocols(prev => prev.filter(p => p.id !== protocolId));
        } catch (err) {
            console.error('Ошибка удаления протокола:', err);
            alert('Не удалось удалить протокол');
        }
    };

    const handleSaveGroup = async (selectedCourseId: number, users: ClientCreate[]) => {
        if (!selectedCourseId || selectedCourseId <= 0) {
            alert('Выберете курс');
            return; // или можно выбросить ошибку throw new Error('Укажите курс');
        }

        // Проверка на пустой массив клиентов
        if (!users || users.length === 0) {
            alert('Список клиентов пуст! Добавьте хотя бы одного клиента.');
            return;
        }

        // Проверка каждого клиента на пустые поля
        const hasEmptyFields = users.some(client =>
            !client.initials?.trim() || !client.inn?.trim()
        );

        if (hasEmptyFields) {
            alert('У клиента отсутствуют некоторые поля');
            return;
        }

        try {
            await createGroup(selectedCourseId, users);
            setIsGroupModalOpen(false);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleSaveProtocol = async (groups: Group[], dates: { startDate: Date; endDate: Date }) => {
        try {
            await createProtocol(dates.startDate, dates.endDate, groups);
            setIsProtocolModalOpen(false);
        } catch (error) {
            console.error('Ошибка:', error);
        }
    };

    const handleSaveTeachers = async (teachers: TeacherCreate[]) => {
        try {
            await createTeachers(teachers);
            setIsTeachersModalOpen(false);
        } catch (error) {
            console.error('Ошибка:', error);
        }
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/>
                    </svg>
                    Создать новую группу
                </button>

                {/* Кнопка 2 - Создать новый протокол */}
                <button onClick={() => setIsProtocolModalOpen(true)}
                        className="bg-green-500 hover:bg-green-600 text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    Создать новый протокол
                </button>

                {/* Кнопка 3 - Преподаватели */}
                <button onClick={() => setIsTeachersModalOpen(true)}
                        className="bg-purple-500 hover:bg-purple-600 text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Преподаватели
                </button>

                {/* Кнопка 4 - Архив */}
                <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white p-6 rounded-lg shadow-md transition-colors flex flex-col items-center">
                    <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/>
                    </svg>
                    Архив
                </button>
            </div>

            <ProtocolTable protocols={protocols, } />

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
                onSave={handleSaveProtocol}
            />

            <CreateTeachersModal
                isOpen={isTeachersModalOpen}
                onClose={() => setIsTeachersModalOpen(false)}
                onSave={handleSaveTeachers}
            />

        </div>
    );
}