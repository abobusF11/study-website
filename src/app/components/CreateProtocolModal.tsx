'use client';

import { useState } from 'react';
import BaseModal from './BaseModal';

interface Group {
    id: number;
    name: string;
    course: string;
}

export default function CreateProtocolModal({isOpen, onClose, onSave, availableGroups: initialGroups}: {
    isOpen: boolean;
    onClose: () => void;
    onSave: (groups: Group[]) => void;
    availableGroups: Group[];
}) {
    const [selectedGroups, setSelectedGroups] = useState<Group[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredGroups = initialGroups
        .filter(group =>
            group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.course.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(group =>
            !selectedGroups.some(selected => selected.id === group.id)
        );

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
    };

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Создание нового протокола"
            width="max-w-5xl" // Можно переопределить
            hasUnsavedData={hasUnsavedData}
            resetForm={resetForm}
        >
            {/* Уникальное содержимое этой модалки */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Поиск групп..."
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">Доступные группы</h3>
                    <div className="border rounded-md p-2 h-64 overflow-y-auto">
                        {filteredGroups.length > 0 ? (
                            <ul className="space-y-2">
                                {filteredGroups.map(group => (
                                    <li key={group.id} className="flex justify-between items-center p-2 hover:bg-gray-50">
                                        <div>
                                            <p className="font-medium">{group.name}</p>
                                            <p className="text-sm text-gray-500">{group.course}</p>
                                        </div>
                                        <button
                                            onClick={() => addGroup(group)}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            Добавить
                                        </button>
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
                                            <p className="font-medium">{group.name}</p>
                                            <p className="text-sm text-gray-500">{group.course}</p>
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
                    onClick={() => onSave(selectedGroups)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                    disabled={selectedGroups.length === 0}
                >
                    Создать протокол
                </button>
            </div>
        </BaseModal>
    );
}