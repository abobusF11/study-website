//Создание
import {Teacher} from "@/types/TeacherTypes";
import {CourseId} from "@/types/CourseTypes";
//ГРУППЫ
export interface GroupCreate {
    date: string;
    courses: CourseGroupCreate[];
    teachers: number[] | null;
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
export interface CourseGroupCreate {
    course_id: CourseId;
    clients: ClientCreate[];
}

export interface CourseGroup {
    id: number;
    course_id: CourseId;
    clients: Client[];
}

export interface CourseGroupUpdate {
    id: number;
    course_id: CourseId;
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
