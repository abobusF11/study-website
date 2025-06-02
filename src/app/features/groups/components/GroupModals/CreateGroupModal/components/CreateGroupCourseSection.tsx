import {useState} from 'react';
import {CourseSectionProps} from "@/app/features/groups/components/GroupModals/EditGroupModal/types/CourseSectionProps";
import {useCourseStore} from "@/app/features/courses/hooks/useCourses";
import {createDefaultClient} from "@/app/features/groups/components/GroupModals/utils/groupDefaults";
import {coursesName, CoursesKeys} from "@/app/features/courses/types/CourseTypes";

export const CreateCourseSection = (
    {
        course,
        onUpdate,
        onRemove,
        onHandleUserChange
    }: CourseSectionProps) => {

    const {courses} = useCourseStore();
    const currentCourse = courses.find(c => c.id === course.course_id);
    const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);


    const addUser = () => {
        const newClientId = course.clients.length > 0 ? Math.max(...course.clients.map(c => c.id)) + 1 : 1;

        onUpdate(
            {
                ...course,
                clients: [
                    ...course.clients, createDefaultClient(newClientId)
                ]
            }
        );
    }

    const removeUser = (userId: number) => {
        onUpdate({
            ...course,
            clients: course.clients.filter(c => c.id !== userId)
        })
    }


    const handleCourseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newCourseId = Number(e.target.value);
        const selectedCourse = courses.find(c => c.id === newCourseId);

        setSelectedCourseId(newCourseId);
        onUpdate({
            ...course,
            course_id: newCourseId,
            name: selectedCourse?.name || "не найдено",
            hours: selectedCourse?.hours || 0,
        });
    };

    return (
        <div className="mb-8 bg-white rounded-lg shadow-md overflow-hidden border border-gray-100">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                <div className="flex flex-row gap-4 items-center">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Выберите курс</label>
                        <select
                            value={selectedCourseId ?? ""}
                            onChange={handleCourseChange}
                            className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                        >
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>{course.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Часы:</span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                            {currentCourse?.hours || 0} ч.
                        </span>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            №
                        </th>
                        {currentCourse?.fields.map(field => (
                            <th key={`table-title-${field}`} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {coursesName[field as CoursesKeys]}
                            </th>
                        ))}
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {course.clients.map((client, index) => (
                        <tr key={`client-${client.id}`} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {index+1}
                            </td>

                            {currentCourse?.fields.map(field => (
                                <td key={`client-${field}`} className="px-6 py-4 whitespace-nowrap">
                                    <input
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 shadow-sm"
                                        type="text"
                                        placeholder="Введите значение"
                                        onChange={(e) => {
                                            onHandleUserChange(client.id, e.target.value, currentCourse?.id, field as CoursesKeys);
                                        }}
                                    />
                                </td>
                            ))}

                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button
                                    onClick={() => removeUser(client.id)}
                                    className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-md transition-colors duration-200"
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="flex space-x-3">
                    <button
                        onClick={addUser}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                        <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Добавить пользователя
                    </button>
                </div>
                <button
                    onClick={() => onRemove(course.id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Удалить курс
                </button>
            </div>
        </div>
    );
}
