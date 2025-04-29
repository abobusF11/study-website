import {CourseId, COURSES} from "@/types/CourseTypes";
import {CourseGroup} from "@/types/GroupTypes";

export const validateCourseGroups = (courseGroups: CourseGroup[], selectedDate: string): boolean => {
    if (courseGroups.length === 0) {
        alert('Добавьте хотя бы один курс');
        return false;
    }

    if (!selectedDate) {
        alert('Выберите дату для группы');
        return false;
    }

    for (const course of courseGroups) {
        const courseConfig = COURSES[course.course_id as CourseId];
        for (const [index, client] of course.clients.entries()) {
            for (const field of courseConfig.fields) {
                if ('required' in field && field.required) {
                    const value = client[field.key];
                    if (value === null || value === undefined ||
                        (typeof value === 'string' && value.trim() === '') ||
                        (typeof value === 'number' && isNaN(value))) {
                        alert(`Клиент #${index + 1} в курсе "${courseConfig.name}": не заполнено обязательное поле "${field.name}"`);
                        return false;
                    }
                }
            }
        }
    }

    return true;
};