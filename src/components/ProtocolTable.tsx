import {useState} from 'react';
import {Protocol} from "@/types/ProtocolTypes";

interface ProtocolTableProps {
    protocols: Protocol[];
    onDelete: (protocolId: number) => void;
}

export const ProtocolTable = ({protocols, onDelete }: ProtocolTableProps) => {
    const [expandedProtocols, setExpandedProtocols] = useState<number[]>([]);
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);

    const toggleProtocol = (protocolId: number) => {
        setExpandedProtocols(prev =>
            prev.includes(protocolId)
                ? prev.filter(id => id !== protocolId)
                : [...prev, protocolId]
        );
    };

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
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
                            Протокол
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Период
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Количество групп
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Действия
                        </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {protocols.map((protocol) => (
                        <>
                            <tr key={protocol.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <button
                                        onClick={() => toggleProtocol(protocol.id)}
                                        className="flex items-center text-sm font-medium text-gray-900"
                                    >
                      <span className="mr-2">
                        {expandedProtocols.includes(protocol.id) ? '▼' : '►'}
                      </span>
                                        Протокол №{protocol.id}
                                    </button>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {protocol.start_date} - {protocol.end_date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {protocol.groups.length}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-900">
                                            Экспорт
                                        </button>
                                        <span className="text-gray-300">|</span>
                                        <button onClick={() => handleDelete(protocol.id, `Протокол №${protocol.id}`)} className="text-red-600 hover:text-red-900">
                                            Удалить
                                        </button>
                                    </div>
                                </td>
                            </tr>

                            {/* Группы протокола */}
                            {expandedProtocols.includes(protocol.id) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 bg-gray-50">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead>
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Группа
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Курс
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Участников
                                                </th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {protocol.groups.map((group) => (
                                                <>
                                                    <tr key={group.id} className="hover:bg-gray-100">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <button
                                                                onClick={() => toggleGroup(group.id)}
                                                                className="flex items-center text-sm text-gray-900"
                                                            >
                                    <span className="mr-2">
                                      {expandedGroups.includes(group.id) ? '▼' : '►'}
                                    </span>
                                                                Группа №{group.id}
                                                            </button>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            Курс №{group.course_id}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {group.clients.length}
                                                        </td>
                                                    </tr>

                                                    {/* Клиенты группы */}
                                                    {expandedGroups.includes(group.id) && (
                                                        <tr>
                                                            <td colSpan={3} className="px-6 py-4 bg-gray-100">
                                                                <table className="min-w-full divide-y divide-gray-200">
                                                                    <thead>
                                                                    <tr>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            ID
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            ФИО
                                                                        </th>
                                                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                                            ИНН
                                                                        </th>
                                                                    </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                    {group.clients.map((client) => (
                                                                        <tr key={client.id}
                                                                            className="hover:bg-gray-200">
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {client.id}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {client.initials}
                                                                            </td>
                                                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                                {client.inn}
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                    </tbody>
                                                                </table>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </>
                                            ))}
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            )}
                        </>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};