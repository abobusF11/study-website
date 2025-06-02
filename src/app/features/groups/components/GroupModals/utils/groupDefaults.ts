import {Client, CourseGroup} from "@/app/features/groups/types/GroupTypes";
import {Course} from "@/app/features/courses/types/CourseTypes";

export function createDefaultCourse(id: number, course: Course): CourseGroup {
    return {
        id,
        name: course.name,
        course_id: course.id,
        clients: [createDefaultClient(1)],
        hours: course.hours,
    };
}

export function createDefaultClient(id: number): Client {
    return {
        id,
        initials: '',
        inn: null,
        org: '',
        safety: null,
        reg_num: null
    };
}