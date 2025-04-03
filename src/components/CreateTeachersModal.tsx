'use client';

import {useEffect, useState} from 'react';
import BaseModal from "@/components/BaseModal";
import {TeacherCreate} from "@/types/TeacherTypes";
import api from "@/lib/api";

interface CreateTeachersModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (teachers: TeacherCreate[]) => void;
    existingTeachers?: string[]; // Теперь принимаем массив строк
}

export default function CreateTeachersModal({ isOpen, onClose, onSave }: CreateTeachersModalProps) {
    const [teachers, setTeachers] = useState<string[]>(['']); // Храним массив строк
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addTeacher = () => {
        setTeachers([...teachers, '']); // Добавляем пустую строку
    };

    const removeTeacher = (index: number) => {
        if (teachers.length <= 1) return; // Не удаляем последнего учителя
        setTeachers(teachers.filter((_, i) => i !== index));
    };

    const handleTeacherChange = (index: number, value: string) => {
        const newTeachers = [...teachers];
        newTeachers[index] = value;
        setTeachers(newTeachers);
    };

    const checkUnsavedData = (): boolean => {
        return teachers.some(teacher => teacher.trim() !== '');
    };

    const resetForm = () => {
        setTeachers(['']);
    };

    useEffect(() => {
        if (isOpen) {
            loadTeachers();
        }
    }, [isOpen]);

    const loadTeachers = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/template/teacher/show');
            const teacherInitials = response.data.map((t: TeacherCreate) => t.initials);
            setTeachers(teacherInitials.length > 0 ? teacherInitials : ['']);
        } catch (err) {
            setError('Не удалось загрузить учителей');
            console.error('Ошибка загрузки учителей:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Добавление учителей"
            width="max-w-3xl"
            hasUnsavedData={checkUnsavedData}
            resetForm={resetForm}
        >
            <div className="p-6">
                {/* Таблица учителей */}
                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Список учителей</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {teachers.map((teacher, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {index + 1}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <input
                                            type="text"
                                            value={teacher}
                                            onChange={(e) => handleTeacherChange(index, e.target.value)}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                            placeholder="Введите ФИО учителя"
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => removeTeacher(index)}
                                            className="text-red-600 hover:text-red-900"
                                            disabled={teachers.length === 1}
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

                {/* Кнопка добавления учителя */}
                <button
                    onClick={addTeacher}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6"
                >
                    Добавить учителя
                </button>

                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={() => onSave(teachers.map(initials => ({ initials })))}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        disabled={!checkUnsavedData()}
                    >
                        Сохранить учителей
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}