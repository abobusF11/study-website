import React, {useEffect, useState} from 'react';
import {Teacher} from "@/app/features/teachers/types/TeacherTypes";

interface PeopleSelectorProps{
    people: Teacher[]; //Вообще все учителя что есть
    selectedStaff: Teacher[]; //Только выбранные учителя
    onChangeDate: (date: string) => void;
    onChangeTeachers: (teacherIds: number[]) => void;
}

export const PeopleSelector: React.FC<PeopleSelectorProps> = ({ people, selectedStaff, onChangeDate, onChangeTeachers }) => {
    const [selectedDirector, setSelectedDirector] = useState<Teacher | null>(null);
    const [selectedDeputy, setSelectedDeputy] = useState<Teacher | null>(null);
    const [selectedTeachers, setSelectedTeachers] = useState<Teacher[]>([]);
    const [selectedDate, setSelectedDate] = useState<string>('');
    const [dropdownOpen, setDropdownOpen] = useState({
        director: false,
        deputy: false,
        teachers: false,
    });

    // Автоматически назначаем директора, зам. директора и преподавателей при изменении `people`
    useEffect(() => {
        if (selectedStaff && selectedStaff.length > 0) {
            // Находим директора (status === 1)
            const director = selectedStaff.find(person => person.status === 1);
            if (director) setSelectedDirector(director);

            // Находим зам. директора (status === 2)
            const deputy = selectedStaff.find(person => person.status === 2);
            if (deputy) setSelectedDeputy(deputy);

            // Находим всех преподавателей (status === 3)
            const teachers = selectedStaff.filter(person => person.status === 3);
            if (teachers.length > 0) setSelectedTeachers(teachers);
        }
    }, [selectedStaff]);

    // Обновляем список ID преподавателей при изменении выбранных людей
    useEffect(() => {
        const allSelectedIds = [
            selectedDirector?.id,
            selectedDeputy?.id,
            ...selectedTeachers.map(t => t.id)
        ].filter((id): id is number => id !== undefined);

        onChangeTeachers(allSelectedIds);
    }, [selectedDirector, selectedDeputy, selectedTeachers]);

    const toggleDropdown = (type: keyof typeof dropdownOpen) => {
        setDropdownOpen(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleSelect = (person: Teacher, type: 'director' | 'deputy' | 'teacher') => {
        if (type === 'director') {
            setSelectedDirector(person);
            setDropdownOpen(prev => ({ ...prev, director: false }));
        } else if (type === 'deputy') {
            setSelectedDeputy(person);
            setDropdownOpen(prev => ({ ...prev, deputy: false }));
        } else {
            const isSelected = selectedTeachers.some(t => t.id === person.id);
            setSelectedTeachers(
                isSelected
                    ? selectedTeachers.filter(t => t.id !== person.id)
                    : [...selectedTeachers, person]
            );
            setDropdownOpen(prev => ({ ...prev, teachers: false }));
        }
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(e.target.value);
        onChangeDate(e.target.value);
    };

    const isSelected = (person: Teacher, type: 'director' | 'deputy' | 'teacher') => {
        if (type === 'director') return selectedDirector?.id === person.id;
        if (type === 'deputy') return selectedDeputy?.id === person.id;
        return selectedTeachers.some(t => t.id === person.id);
    };

    return (
        <div className="flex-1 mb-6 flex flex-row justify-between gap-4">
            {/* Дата начала обучения */}
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Начало обучения
                </label>
                <input
                    type="date"
                    value={selectedDate}
                    onChange={handleDateChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            {/* Выбор директора */}
            <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Директор
                </label>
                <div
                    className="w-full p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
                    onClick={() => toggleDropdown('director')}
                >
                    <span>{selectedDirector?.initials || 'Директор'}</span>
                    <span>▼</span>
                </div>
                {dropdownOpen.director && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {people
                            .filter(p => p.status === 1)
                            .map(person => (
                                <div
                                    key={person.id}
                                    className={`p-2 hover:bg-blue-50 cursor-pointer flex justify-between ${isSelected(person, 'director') ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleSelect(person, 'director')}
                                >
                                    <span>{person.initials}</span>
                                    {isSelected(person, 'director') && <span>✓</span>}
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Выбор зам. директора */}
            <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Зам. директора
                </label>
                <div
                    className="w-full p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
                    onClick={() => toggleDropdown('deputy')}
                >
                    <span>{selectedDeputy?.initials || 'Зам. директора'}</span>
                    <span>▼</span>
                </div>
                {dropdownOpen.deputy && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {people
                            .filter(p => p.status === 2)
                            .map(person => (
                                <div
                                    key={person.id}
                                    className={`p-2 hover:bg-blue-50 cursor-pointer flex justify-between ${isSelected(person, 'deputy') ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleSelect(person, 'deputy')}
                                >
                                    <span>{person.initials}</span>
                                    {isSelected(person, 'deputy') && <span>✓</span>}
                                </div>
                            ))}
                    </div>
                )}
            </div>

            {/* Выбор преподавателей */}
            <div className="flex-1 relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Преподаватели
                </label>
                <div
                    className="w-full p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
                    onClick={() => toggleDropdown('teachers')}
                >
          <span>
            {selectedTeachers.length > 0
                ? `Выбрано: ${selectedTeachers.length}`
                : 'Преподаватели'}
          </span>
                    <span>▼</span>
                </div>
                {dropdownOpen.teachers && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {people
                            .filter(p => p.status === 3)
                            .map(person => (
                                <div
                                    key={person.id}
                                    className={`p-2 hover:bg-blue-50 cursor-pointer flex justify-between ${isSelected(person, 'teacher') ? 'bg-blue-100' : ''}`}
                                    onClick={() => handleSelect(person, 'teacher')}
                                >
                                    <span>{person.initials}</span>
                                    {isSelected(person, 'teacher') && <span>✓</span>}
                                </div>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};
