'use client';

import {useEffect, useState} from 'react';
import BaseModal from "@/app/components/BaseModal";
import CoursesFieldsRow from "@/app/features/courses/components/CreateCourseModal/CoursesFieldsRow";
import {useCourseStore} from "@/app/features/courses/hooks/useCourses";
import CoursesList from "@/app/features/courses/components/CreateCourseModal/CoursesList";
import {Course} from "@/app/features/courses/types/CourseTypes";

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    refresh?: () => void;
}

interface CourseFormState {
    name: string;
    hours: number;
    fields: string[];
}

export default function CreateCourseModal({isOpen, onClose, refresh}: CreateCourseModalProps) {
    const [state, setState] = useState<CourseFormState>({
        name: '',
        hours: 0,
        fields: []
    });

    const {courses, createCourse, fetchCourses, deleteCourse} = useCourseStore()

    const [isLoading, setIsLoading] = useState(false);
    const [idEditing, setIdEditing] = useState<number | null>(null);

    useEffect(() => {
        const loadCourses = async () => await fetchCourses();
        loadCourses();
    }, [])

    const handleSave = async () => {
        try {
            setIsLoading(true);
            await createCourse(state);

            if (refresh) {
                refresh();
                await fetchCourses();
            }
        } catch (error) {
            console.error('Ошибка при создании курса:', error);
            alert('Произошла ошибка при создании курса');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFieldToggle = (field: string) => {
        setState(prev => {
            const newFields = prev.fields.includes(field)
                ? prev.fields.filter(f => f !== field)
                : [...prev.fields, field];
            return {...prev, fields: newFields};
        });
    };

    const hasUnsavedData = () => {
        return state.name.trim() !== '' || state.hours > 0 || state.fields.length > 0;
    };

    const resetForm = () => {
        setState({
            name: '',
            hours: 0,
            fields: []
        });
    };

    const onEditing = (course: Course) => {
        setState({
            name: course.name,
            hours: course.hours,
            fields: course.fields,
        })
        setIdEditing(course.id);
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={idEditing ? "Редактирование курса" : "Создание нового курса"}
            width="max-w-3xl"
            hasUnsavedData={hasUnsavedData}
            resetForm={resetForm}
        >
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Название курса</label>
                        <input
                            type="text"
                            value={state.name}
                            onChange={(e) => setState(prev => ({ ...prev, name: e.target.value }))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Введите название курса"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Количество часов</label>
                        <input
                            type="number"
                            value={state.hours || ''}
                            onChange={(e) => setState(prev => ({ ...prev, hours: parseInt(e.target.value) || 0 }))}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                            placeholder="0"
                            min="0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Поля курса</label>
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <CoursesFieldsRow
                            selectedFields={state.fields}
                            onFieldToggle={handleFieldToggle}
                        />
                    </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                    <button
                        onClick={resetForm}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Сбросить
                    </button>

                    {idEditing !== null && (
                        <button
                            onClick={() => deleteCourse(idEditing).then(() => resetForm())}
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Удалить
                        </button>
                    )}

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                        disabled={isLoading || !hasUnsavedData()}
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {idEditing ? 'Сохранение...' : 'Создание...'}
                            </span>
                        ) : idEditing ? 'Сохранить изменения' : 'Создать курс'}
                    </button>
                </div>

                <CoursesList courses={courses} onEditing={onEditing} />
            </div>
        </BaseModal>
    );
}