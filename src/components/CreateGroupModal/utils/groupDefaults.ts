import {Client, CourseGroup} from "@/types/GroupTypes";
import {CourseId} from "@/types/CourseTypes";

export function createDefaultCourse(id: number): CourseGroup {
    return {
        id,
        course_id: 1 as CourseId,
        clients: [createDefaultClient(1)],
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