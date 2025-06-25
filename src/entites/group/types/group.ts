import {Teacher} from "@/entites/teacher/types/teacher";
import {CourseGroup} from "@/entites/course/types/course";

export interface Group {
    id: number;
    date: string;
    courses: CourseGroup[];
    teachers: Teacher[];
}