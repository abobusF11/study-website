import {Teacher} from "@/app/features/teachers/types/TeacherTypes";

//ГРУППЫ
export interface GroupCreate {
    date: string;
    courses: CourseGroupCreate[];
    teachers: number[] | null;
    is_order: boolean;
}

export interface Group {
    id: number;
    date: string;
    courses: CourseGroup[];
    teachers: Teacher[];
}

export interface GroupUpdate {
    id: number;
    date: string;
    courses: CourseGroupUpdate[];
    teachers: number[];
}

//Ответы
export interface GroupCreateResponse {
    id: number;
}

export interface GroupUpdateResponse {
    id: number;
}

// Курсы
interface CourseBase {
    name: string;
    hours: number;
}

export interface CourseGroupCreate{
    course_id: number;
    clients: ClientCreate[];
}

export interface CourseGroup extends CourseBase{
    id: number;
    course_id: number;
    clients: Client[];
}

export interface CourseGroupUpdate extends CourseBase{
    id: number;
    clients: ClientUpdate[];
}

// Клиенты
interface ClientBase{
    initials: string;
    inn: string | null;
    org: string;
    safety: number | null;
    reg_num: number | null;
}

export interface ClientCreate extends ClientBase {}

export interface Client extends ClientBase {
    id: number;
}

export interface ClientUpdate extends ClientBase {
    id: number;
}

export enum GroupType {
    TEMPLATE = 'active',
    ARCHIVE = 'archive',
    FROM_USER = 'from-user'
}
