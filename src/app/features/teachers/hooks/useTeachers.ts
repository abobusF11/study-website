import { useState, useEffect } from 'react';
import axios from 'axios';
import { Teacher } from "@/app/features/teachers/types/TeacherTypes";
import api from "@/lib/api";

export function useTeachers() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);

    const fetchTeachers = async () => {
        try {
            const response = await api.get<Teacher[]>('/template/teacher/show');
            setTeachers(response.data);
        } catch (err) {
            console.log(axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Ошибка загрузки преподавателей'
                : 'Неизвестная ошибка');
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await api.delete(`/template/teacher/delete?teacher_id=${id}`);
            setTeachers(prev => prev.filter(teacher => teacher.id !== id));
            return true;
        } catch {
            console.log('Ошибка удаления преподавателя');
            return false;
        }
    };

    // useEffect(() => { fetchTeachers(); }, [fetchTeachers]);

    return {
        teachers,
        handleDelete,
        fetchTeachers,
    };
}

interface Teacher {
    teachers: Teacher[];
    fetchTeachers: () => Promise<void>;

    handleDelete: (id: number) => Promise<void>;
}

// export const useTeacherStore = create<>