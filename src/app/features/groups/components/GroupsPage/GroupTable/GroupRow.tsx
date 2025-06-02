import {Group} from "@/app/features/groups/types/GroupTypes";
import {CourseField, coursesName, CoursesKeys} from "@/app/features/courses/types/CourseTypes";

interface GroupRowProps {
    group: Group;
    isExpanded: boolean;
    onToggle: (groupId: number) => void;
    onDelete: (protocolId: number, protocolName: string) => void;
    onEdit: (group: Group) => void;
    getCourseById: (courseId: number) => any;
}

export const GroupRow = (
    {group, isExpanded, onToggle, onDelete, onEdit, getCourseById}: GroupRowProps
) => {
    return (
        <>
            <tr key={group.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap w-1/6">
                    <button
                        onClick={() => onToggle(group.id)}
                        className="flex items-center text-sm font-medium text-gray-900"
                    >
                        <span className="mr-2">
                            {isExpanded ? '▼' : '►'}
                        </span>
                        Группа №{group.id}
                    </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-1/6">
                    {group.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium w-2/3">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => onEdit(group)}
                            className="text-blue-600 hover:text-blue-900"
                        >
                            Редактировать
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-blue-600 hover:text-blue-900">
                            XML
                        </button>
                        <span className="text-gray-300">|</span>
                        <button className="text-blue-600 hover:text-blue-900">
                            Скачать документы
                        </button>
                        <span className="text-gray-300">|</span>
                        <button
                            onClick={() => onDelete(group.id, `Группа №${group.id}`)}
                            className="text-red-600 hover:text-red-900"
                        >
                            Удалить
                        </button>
                    </div>
                </td>
            </tr>
            {isExpanded && (
                <tr>
                    <td colSpan={3} className="px-6 py-4 bg-gray-50">
                        {group.courses.map((course) => {
                            const courseInfo = getCourseById(course.course_id);
                            return (
                                <div key={course.id} className="mb-8">
                                    <h3 className="text-lg font-medium mb-2">
                                        Курс: {courseInfo?.name || 'Неизвестный курс'}
                                    </h3>
                                    {courseInfo ? (
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                            <tr>
                                                {/* Динамические заголовки на основе полей курса */}
                                                {courseInfo.fields.map((field: string) => (
                                                    <th
                                                        key={field}
                                                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                                    >
                                                        {coursesName[field as CoursesKeys]}
                                                    </th>
                                                ))}
                                            </tr>
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                            {course.clients.map((client) => (
                                                <tr key={client.id} className="hover:bg-gray-50">
                                                    {courseInfo.fields.map((field: string) => {
                                                        const value = client[field as CoursesKeys];
                                                        const displayValue = formatFieldValue(value, field);

                                                        return (
                                                            <td
                                                                key={`${client.id}-${field}`}
                                                                className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                            >
                                                                {displayValue}
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="text-center py-4 text-gray-500">
                                            Информация о курсе не найдена
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </td>
                </tr>
            )}
        </>
    );
};


const formatFieldValue = (
    value: unknown,
    field: CourseField // Принимаем все поле для доступа к options
): string => {
    if (value === null || value === undefined || value === '') {
        return "—";
    }

    switch (field.type) {
        case 'select':
            const selectedOption = field.options?.find(opt => opt.value === value);
            return selectedOption?.label ?? String(value);

        case 'number':
            return typeof value === 'number'
                ? value.toLocaleString()
                : isNaN(Number(value))
                    ? String(value)
                    : Number(value).toLocaleString();
        case "string":
            return value.toLocaleString();

        default:
            return String(value);
    }
};