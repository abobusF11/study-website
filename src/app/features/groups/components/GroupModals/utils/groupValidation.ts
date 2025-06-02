import { CourseGroup } from "@/app/features/groups/types/GroupTypes";

export const validateCourseGroups = (courseGroups: CourseGroup[], selectedDate: string): boolean => {

    if (courseGroups.length === 0) {
        alert('Добавьте хотя бы один курс');
        return false;
    }

    if (!selectedDate) {
        alert('Выберите дату для группы');
        return false;
    }
    
    // Базовая проверка без валидации полей курса
    return true;
};