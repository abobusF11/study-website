import {useState} from 'react';
import {Group} from "@/app/features/groups/types/GroupTypes";
import {useCourseStore} from "@/app/features/courses/hooks/useCourses";
import {GroupRow} from "@/app/features/groups/components/GroupsPage/GroupTable/GroupRow";
interface GroupTableProps {
    groups: Group[];
    onDelete: (protocolId: number) => void;
    onRefresh: () => void;
    typeTable: "activeTable" | "archiveTable" | "ordersTable";
}

export const GroupTable = ({groups, onDelete, onRefresh, typeTable}: GroupTableProps) => {
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
    const [editingGroup, setEditingGroup] = useState<Group | null>(null);
    const { courses } = useCourseStore(); // Получаем курсы из хука useCourses

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

    const getType = (): "metodist-active-editing" | "metodist-archive-editing" | "metodist-orders-editing" => {
        switch(typeTable) {
            case "activeTable": return "metodist-active-editing";
            case "archiveTable": return "metodist-archive-editing";
            case "ordersTable": return "metodist-orders-editing";
            default: return "metodist-active-editing"; // fallback
        }
    };

    // Функция для получения курса по ID
    const getCourseById = (courseId: number) => {
        return courses.find(course => course.id === courseId);
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
                            getCourseById={getCourseById}
                        />
                    )}
                    </tbody>
                </table>
            </div>

            {/*{editingGroup && (*/}
            {/*    <EditGroupModal*/}
            {/*        isOpen={true}*/}
            {/*        onClose={() => setEditingGroup(null)}*/}
            {/*        refresh={onRefresh}*/}
            {/*        group={editingGroup}*/}
            {/*    />*/}
            {/*)}*/}
        </div>
    );
};