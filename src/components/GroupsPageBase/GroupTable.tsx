import {useState} from 'react';
import {Group, GroupType} from "@/types/GroupTypes";
import {CourseField, CourseId, COURSES} from "@/types/CourseTypes";
import CreateGroupModal from "@/components/CreateGroupModal/CreateGroupModal";

interface GroupTableProps {
    groups: Group[];
    onDelete: (protocolId: number) => void;
    onRefresh: () => void;
    type: "metodist" | null;
}

export const GroupTable = ({groups, onDelete, onRefresh, type}: GroupTableProps) => {
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const handleEdit = (group: Group) => {
        setEditingGroup(group);
    };

    const handleDelete = (protocolId: number, protocolName: string) => {
        const isConfirmed = confirm(`Вы точно хотите удалить протокол "${protocolName}"?`);
        if (isConfirmed) {
            onDelete(protocolId);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md mt-10 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Группа
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Дата начала
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {groups.flatMap(group =>
                        <GroupRow
                            key={group.id}
                            group={group}
                            isExpanded={expandedGroups.includes(group.id)}
                            onToggle={toggleGroup}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    )}
                    </tbody>
                </table>
            </div>

            {editingGroup && (
                <CreateGroupModal
                    isOpen={true}
                    onClose={() => setEditingGroup(null)}
                    refresh={onRefresh}
                    group={editingGroup}
                    type={type}
                />
            )}
        </div>
    );
};

interface GroupRowProps {
    group: Group;
    isExpanded: boolean;
    onToggle: (groupId: number) => void;
    onDelete: (protocolId: number, protocolName: string) => void;
    onEdit: (group: Group) => void;
}

const GroupRow = ({group, isExpanded, onToggle, onDelete, onEdit}: GroupRowProps) => {
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
                        {/* Вложенная таблица для каждого курса в группе */}
                        {group.courses.map((course) => (
                            <div key={course.id} className="mb-8">
                                <h3 className="text-lg font-medium mb-2">
                                    Курс: {COURSES[course.course_id as CourseId]?.name || 'Неизвестный курс'}
                                </h3>
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                    <tr>
                                        {/* Динамические заголовки на основе полей курса */}
                                        {COURSES[course.course_id as CourseId]?.fields.map((field) => (
                                            <th
                                                key={field.key}
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {field.name}
                                            </th>
                                        )) ?? (
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Нет данных о курсе
                                            </th>
                                        )}
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {course.clients.map((client) => (
                                        <tr key={client.id} className="hover:bg-gray-50">
                                            {COURSES[course.course_id as CourseId]?.fields.map((field) => {
                                                const value = client[field.key as keyof typeof client];
                                                const displayValue = formatFieldValue(value, field);

                                                return (
                                                    <td
                                                        key={`${client.id}-${field.key}`}
                                                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                                    >
                                                        {displayValue}
                                                    </td>
                                                );
                                            }) ?? (
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    Нет данных
                                                </td>
                                            )}
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
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

        case 'text':
        default:
            return String(value);
    }
};