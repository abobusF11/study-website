'use client';

import {useState} from 'react';
import BaseModal from "@/app/components/BaseModal";

interface User {
    id: number;
    fio: string;
    inn: string;
}

interface Course {
    id: number;
    name: string;
}

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (selectedCourse: string, users: User[]) => void;
    courses: Course[];
}

export default function CreateGroupModal({isOpen, onClose, onSave, courses}: CreateGroupModalProps) {
    const [selectedCourse, setSelectedCourse] = useState('');
    const [users, setUsers] = useState<User[]>([{ id: 1, fio: '', inn: '' }]);

    const addUser = () => {
        setUsers([...users, { id: users.length + 1, fio: '', inn: '' }]);
    };

    const removeUser = (id: number) => {
        setUsers(users.filter(user => user.id !== id));
    };

    const handleUserChange = (id: number, field: keyof User, value: string) => {
        setUsers(users.map(user =>
            user.id === id ? { ...user, [field]: value } : user
        ));
    };

    // Функция проверки несохранённых данных
    const checkUnsavedData = (): boolean => {
        return users.some(user => user.fio.trim() !== '' || user.inn.trim() !== '');
    };

    // Функция сброса данных формы
    const resetForm = () => {
        setSelectedCourse('');
        setUsers([{ id: 1, fio: '', inn: '' }]);
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Создание новой группы"
            width="max-w-5xl"
            hasUnsavedData={checkUnsavedData}
            resetForm={resetForm}
        >
            <div className="p-6">

                {/* Выбор курса */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Выберите курс</label>
                    <select
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">-- Выберите курс --</option>
                        {courses.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Таблица пользователей */}
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Список пользователей</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ИНН</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user, index) => (
                                <tr key={user.id}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={user.fio}
                                            onChange={(e) => handleUserChange(user.id, 'fio', e.target.value)}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                            placeholder="Введите ФИО"
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={user.inn}
                                            onChange={(e) => handleUserChange(user.id, 'inn', e.target.value)}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                            placeholder="Введите ИНН"
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => removeUser(user.id)}
                                            className="text-red-600 hover:text-red-900"
                                            disabled={users.length === 1}
                                        >
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Кнопка добавления пользователя */}
                <button
                    onClick={addUser}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6"
                >
                    Добавить пользователя
                </button>

                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={() => onSave(selectedCourse, users)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Сохранить группу
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}