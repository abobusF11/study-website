import {CourseGroup} from "@/app/features/groups/types/GroupTypes";
import {CoursesKeys} from "@/app/features/courses/types/CourseTypes";

export interface CourseSectionProps {
    course: CourseGroup;
    onUpdate: (updatedCourse: CourseGroup) => void;
    onRemove: (id: number) => void;
    onHandleUserChange: (clientId: number, value: string, courseId: number, field: CoursesKeys) => void;
}