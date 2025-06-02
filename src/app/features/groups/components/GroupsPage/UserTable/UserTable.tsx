import {Client, CourseGroup} from "@/app/features/groups/types/GroupTypes";
import {CourseField} from "@/app/features/courses/types/CourseTypes";

interface UserTableProps {
    courseFields: readonly CourseField[];
    course: CourseGroup;
    handleUserChange: (user_id: number, field: keyof Client, value: string, courseId?: number) => void;
    removeUser: (idUser: number) => void;
    type: "user" | "metodist";
}

export default function UserTable(
    {
        courseFields,
        course,
        handleUserChange,
        removeUser,
        type
    }: UserTableProps
)
{
    const filteredFields = type === "user"
        ? courseFields.filter(field => field.key !== "reg_num")
        : courseFields;

    return (
        <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Список пользователей</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            №
                        </th>
                        {filteredFields.map(field => ( // Используем filteredFields вместо courseFields
                            <th
                                key={field.key}
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                                {field.name}
                                {field.required && <span className="text-red-500">*</span>}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {course.clients.map((user, index) => (
                        <tr key={user.id}>
                            <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                                {index + 1}
                            </td>

                            {filteredFields.map(field => ( // Используем filteredFields вместо courseFields
                                <td key={`${user.id}-${field.key}`} className="px-4 py-4 whitespace-nowrap">
                                    {field.type === 'select' ? (
                                        <select
                                            value={user[field.key as keyof Client] || ''}
                                            onChange={(e) => handleUserChange(
                                                user.id,
                                                field.key as keyof Client,
                                                e.target.value === '' ? "" : e.target.value
                                            )}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                        >
                                            <option value="">-- Выберите --</option>
                                            {field.options?.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type={field.type === 'number' ? 'number' : 'text'}
                                            value={user[field.key as keyof Client] || ''}
                                            onChange={(e) => handleUserChange(
                                                user.id,
                                                field.key as keyof Client,
                                                field.type === 'number' ? (e.target.value === '' ? "" : e.target.value) : e.target.value
                                            )}
                                            className="p-2 border border-gray-300 rounded-md w-full"
                                            placeholder={`${field.name.toLowerCase()}`}
                                            required={field.required}
                                        />
                                    )}
                                </td>
                            ))}

                            <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                                <button
                                    onClick={() => removeUser(user.id)}
                                    className="text-red-600 hover:text-red-900"
                                    disabled={course.clients.length === 1}
                                >
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}