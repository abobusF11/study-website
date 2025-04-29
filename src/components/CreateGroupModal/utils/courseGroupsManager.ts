import {CourseGroup} from "@/types/GroupTypes";

export const updateCourseGroup = (
    groups: CourseGroup[],
    courseId: number,
    updater: (course: CourseGroup) => CourseGroup
) => {
    return groups.map(course =>
        course.id === courseId ? updater(course) : course
    );
};
