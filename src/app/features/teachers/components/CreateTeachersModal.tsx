'use client';

import { useState, useEffect, useCallback } from 'react';
import BaseModal from "@/app/components/BaseModal";
import { TEACHER_STATUSES, TeacherCreate } from "@/app/features/teachers/types/TeacherTypes";
import api from "@/lib/api";
import { createTeachers } from "@/utils/request";

interface CreateTeachersModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DEFAULT_TEACHER: TeacherCreate = {
    initials: '',
    status: 1
};

export default function CreateTeachersModal({ isOpen, onClose }: CreateTeachersModalProps) {
    const [teachers, setTeachers] = useState<TeacherCreate[]>([DEFAULT_TEACHER]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addTeacher = useCallback(() => {
        setTeachers(prev => [...prev, { ...DEFAULT_TEACHER }]);
    }, []);

    const removeTeacher = useCallback((index: number) => {
        setTeachers(prev => prev.length > 1 ? prev.filter((_, i) => i !== index) : prev);
    }, []);

    const handleTeacherChange = useCallback((index: number, field: keyof TeacherCreate, value: string | number) => {
        setTeachers(prev => prev.map((teacher, i) =>
            i === index ? { ...teacher, [field]: value } : teacher
        ));
    }, []);

    const hasUnsavedData = useCallback(() => {
        return teachers.some(teacher => teacher.initials.trim() !== '');
    }, [teachers]);

    const resetForm = useCallback(() => {
        setTeachers([DEFAULT_TEACHER]);
    }, []);

    const loadTeachers = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await api.get<TeacherCreate[]>('/template/teacher/show');
            setTeachers(response.data.length > 0 ? [...response.data] : [DEFAULT_TEACHER]);
        } catch (err) {
            setError('Не удалось загрузить учителей');
            console.error('Ошибка загрузки учителей:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSaveTeachers = useCallback(async () => {
        if (!hasUnsavedData()) return;

        try {
            await createTeachers(teachers);
            onClose();
        } catch (error) {
            console.error('Ошибка сохранения учителей:', error);
            setError('Не удалось сохранить учителей');
        }
    }, [teachers, onClose, hasUnsavedData]);

    useEffect(() => {
        if (isOpen) {
            loadTeachers();
        }
    }, [isOpen, loadTeachers]);

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Добавление учителей"
            width="max-w-3xl"
            hasUnsavedData={hasUnsavedData}
            resetForm={resetForm}
        >
            <div className="p-6">
                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2">Список учителей</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">№</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ФИО</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
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
                                            value={teacher.initials}
                                            onChange={(e) => handleTeacherChange(index, 'initials', e.target.value)}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                            placeholder="Введите ФИО учителя"
                                            disabled={isLoading}
                                        />
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <select
                                            value={teacher.status}
                                            onChange={(e) => handleTeacherChange(index, 'status', Number(e.target.value))}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                            disabled={isLoading}
                                        >
                                            {Object.entries(TEACHER_STATUSES).map(([value, label]) => (
                                                <option key={value} value={value}>
                                                    {label}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => removeTeacher(index)}
                                            className="text-red-600 hover:text-red-900 disabled:text-gray-400"
                                            disabled={teachers.length === 1 || isLoading}
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

                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={addTeacher}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
                        disabled={isLoading}
                    >
                        Добавить учителя
                    </button>

                    {isLoading && (
                        <span className="text-gray-500">Загрузка...</span>
                    )}
                </div>

                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={handleSaveTeachers}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                        disabled={!hasUnsavedData() || isLoading}
                    >
                        Сохранить учителей
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}