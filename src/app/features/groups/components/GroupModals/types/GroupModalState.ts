import {CourseGroup} from "@/app/features/groups/types/GroupTypes";

export type GroupModalState = {
    courseGroups: CourseGroup[];
    selectedDate: string;
    selectedTeachers: number[];
};