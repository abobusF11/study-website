export interface TeacherCreate {
    id?: number | null;
    initials: string;
    status: number; // 1, 2 или 3
}

export interface Teacher {
    id: number;
    initials: string;
    status: number;
}

export const TEACHER_STATUSES = {
    1: 'Директор',
    2: 'Зам директора',
    3: 'Преподаватель'
} as const;

export type TeacherStatus = keyof typeof TEACHER_STATUSES;

export const getStatusTeacher = (status: number): string => {
    return TEACHER_STATUSES[status as TeacherStatus] || 'Неизвестный статус';
};

export interface TeacherCreateResponse {
    initials: string[];
}