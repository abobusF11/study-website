'use client';

import {useEffect, useState} from 'react';
import BaseModal from './BaseModal';
import api from "@/lib/api";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {Group} from "@/types/GroupTypes";

export default function CreateProtocolModal({isOpen, onClose, onSave}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (groups: Group[], dates: { startDate: Date; endDate: Date }) => void;
}) {
    const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedGroups, setExpandedGroups] = useState<number[]>([]);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());

    useEffect(() => {
        if (isOpen) {
            loadGroups();
        }
    }, [isOpen]);

    const loadGroups = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await api.get('/template/group/show');
            setGroups(response.data);
        } catch (err) {
            setError('Не удалось загрузить группы');
            console.error('Ошибка загрузки групп:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredGroups = groups
        .filter(group =>
            group.id.toString().includes(searchTerm.toLowerCase()) || // поиск по ID
            group.clients.some(client =>
                client.initials.toLowerCase().includes(searchTerm.toLowerCase()) // поиск по initials клиентов
            )
        )
        .filter(group =>
            !selectedGroups.some(selected => selected.id === group.id)
        );

    const toggleGroup = (groupId: number) => {
        setExpandedGroups(prev =>
            prev.includes(groupId)
                ? prev.filter(id => id !== groupId)
                : [...prev, groupId]
        );
    };

    const addGroup = (group: Group) => {
        setSelectedGroups([...selectedGroups, group]);
    };

    const removeGroup = (group: Group) => {
        setSelectedGroups(selectedGroups.filter(g => g.id !== group.id));
    };

    const hasUnsavedData = (): boolean => {
        return selectedGroups.length > 0;
    };

    const resetForm = (): void => {
        setSelectedGroups([]);
        setSearchTerm('');
        setExpandedGroups([])
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Создание нового протокола"
            width="max-w-5xl"
            hasUnsavedData={hasUnsavedData}
            resetForm={resetForm}
        >
            <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата начала
                    </label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => {
                            if (date) setStartDate(date);
                        }}
                        dateFormat="dd.MM.yyyy"
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Дата окончания
                    </label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => {
                            if (date) setEndDate(date);
                        }}
                        dateFormat="dd.MM.yyyy"
                        className="w-full p-2 border border-gray-300 rounded-md"
                        minDate={startDate} // Окончание не может быть раньше начала
                    />
                </div>
            </div>

            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Поиск по ID группы или имени клиента..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">Доступные группы</h3>
                    <div className="border rounded-md p-2 h-64 overflow-y-auto">
                        {isLoading ? (
                            <p className="text-gray-500 text-center py-8">Загрузка...</p>
                        ) : error ? (
                            <p className="text-red-500 text-center py-8">{error}</p>
                        ) : filteredGroups.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredGroups.map(group => (
                                    <li key={group.id}>
                                        <div className="flex justify-between items-center p-2 hover:bg-gray-50">
                                            <div>
                                                <p className="font-medium">Группа №{group.id}</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        toggleGroup(group.id);
                                                        console.log(filteredGroups)
                                                    }
                                                }
                                                    className="text-gray-600 hover:text-gray-800"
                                                >
                                                    {expandedGroups.includes(group.id) ? 'Скрыть' : 'Показать'}
                                                </button>
                                                <button
                                                    onClick={() => addGroup(group)}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Добавить
                                                </button>
                                            </div>
                                        </div>

                                        {expandedGroups.includes(group.id) && (
                                            <div className="ml-4 p-2 bg-gray-50 rounded">
                                                <h4 className="font-medium mb-1">Клиенты:</h4>
                                                <ul className="space-y-1">
                                                    {group.clients.map(client => (
                                                        <li key={client.id} className="flex gap-2">
                                                            <span>{client.id}</span>
                                                            <span>{client.initials}</span>
                                                            <span>(ИНН: {client.inn})</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Группы не найдены</p>
                        )}
                    </div>
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">Выбранные группы ({selectedGroups.length})</h3>
                    <div className="border rounded-md p-2 h-64 overflow-y-auto">
                        {selectedGroups.length > 0 ? (
                            <ul className="space-y-2">
                                {selectedGroups.map(group => (
                                    <li key={group.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">Группа №{group.id}</p>
                                        </div>
                                        <button
                                            onClick={() => removeGroup(group)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            Удалить
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 text-center py-8">Добавьте группы из списка</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 border border-gray-300 rounded-md"
                >
                    Отмена
                </button>
                <button
                    onClick={() => onSave(selectedGroups, {startDate, endDate})}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    disabled={selectedGroups.length === 0}
                >
                    Создать протокол
                </button>
            </div>
        </BaseModal>
    );
}