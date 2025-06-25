import {Client} from "@/app/features/groups/types/GroupTypes";

interface CourseBase {
    name: string;
    hours: number;
}

export interface CourseGroup extends CourseBase{
    id: number;
    course_id: number;
    clients: Client[];
}