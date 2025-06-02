import axios from 'axios';
import { Course } from '@/app/features/courses/types/CourseTypes';
import api from '@/lib/api';
import {CourseCreate} from "@/app/features/courses/types/CourseTypes";
import {create} from "zustand";

interface CourseStore {
    courses: Course[];
    isLoading: boolean;
    fetchCourses: () => Promise<void>;
    createCourse: (course: CourseCreate) => Promise<Course | null>;
    deleteCourse: (id: number) => Promise<boolean>;
}

export const useCourseStore = create<CourseStore>((set) => ({
    courses: [],
    isLoading: false,

    fetchCourses: async () => {
        try {
            set({ isLoading: true });
            const response = await api.get<Course[]>('/courses');
            set({ courses: response.data });
        } catch (err) {
            console.log(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || 'Ошибка загрузки курсов'
                    : 'Неизвестная ошибка'
            );
        } finally {
            set({ isLoading: false });
        }
    },

    createCourse: async (course: CourseCreate) => {
        try {
            const response = await api.post<Course>('/courses', course);
            set((state) => ({ courses: [...state.courses, response.data] }));
            return response.data;
        } catch (err) {
            console.log(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || 'Ошибка создания курса'
                    : 'Неизвестная ошибка'
            );
            return null;
        }
    },

    deleteCourse: async (id: number) => {
        try {
            await api.delete(`/courses/${id}`);
            set((state) => ({ courses: state.courses.filter((c) => c.id !== id) }));
            return true;
        } catch (err) {
            console.log(
                axios.isAxiosError(err)
                    ? err.response?.data?.message || 'Ошибка удаления курса'
                    : 'Неизвестная ошибка'
            );
            return false;
        }
    },
}));