import {CourseId, CourseListItem, COURSES} from "@/types/CourseTypes";
import UserTable from "@/components/GroupsPageBase/UserTable";
import {Client, CourseGroup} from "@/types/GroupTypes";

interface CourseSectionProps {
    course: CourseGroup;
    onUpdate: (updatedCourse: CourseGroup) => void;
    onAddUser: () => void;
    onRemove: () => void;
    coursesList: CourseListItem[];
    handleUserChange: (user_id: number, field: keyof Client, value: string, courseId?: number) => void;
    removeUser: (courseId: number, userId: number) => void;
}

export const CourseSection = (
    {
        course,
        onUpdate,
        onAddUser,
        onRemove,
        coursesList,
        handleUserChange,
        removeUser
    }: CourseSectionProps) => {

    return (
        <div key={course.id} className="mb-8 border-b border-gray-200 pb-6">
            <div className="flex flex-row gap-4 mb-6">
                <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Выберите курс</label>
                    <select
                        value={course.course_id || ""}
                        onChange={(e) => {
                            onUpdate({
                                ...course,
                                course_id: Number(e.target.value) as CourseId,
                            })
                        }}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    >
                        {coursesList.map(course => (
                            <option key={course.id} value={course.id}>
                                {course.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <UserTable
                courseFields={COURSES[course.course_id as CourseId].fields}
                course={course}
                handleUserChange={(id, field, value) => handleUserChange(id, field, value, course.id)}
                removeUser={(userId) => removeUser(course.id, userId)}
            />

            <div className="flex flex-row">
                <button
                    onClick={onAddUser}
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md mb-6"
                >
                    Добавить пользователя
                </button>

                <button
                    onClick={onRemove}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mb-6 mx-4"
                >
                    Удалить курс
                </button>
            </div>

        </div>
    );
}
