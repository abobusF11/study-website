'use client';

import {useEffect, useState} from 'react';
import BaseModal from "@/components/BaseModal";
import {CourseGroup, GroupCreate, GroupUpdate} from "@/types/GroupTypes";
import {Client} from "@/types/GroupTypes";
import {getCoursesList} from "@/types/CourseTypes";
import {createGroup, deleteUserGroup, updateGroup} from "@/utils/request";
import {PeopleSelector} from "@/components/GroupsPageBase/PeopleSelector";
import {Teacher} from "@/types/TeacherTypes";
import api from "@/lib/api";
import {CreateGroupModalProps} from "@/components/CreateGroupModal/types/GroupModalTypes";
import {validateCourseGroups} from "@/components/CreateGroupModal/utils/groupValidation";
import {CourseSection} from "@/components/CreateGroupModal/components/GroupCourseSection";
import {createDefaultClient, createDefaultCourse} from "@/components/CreateGroupModal/utils/groupDefaults";


export default function CreateGroupModal({isOpen, onClose, refresh, group, type}: CreateGroupModalProps) {

    type GroupModalState = {
        courseGroups: CourseGroup[];
        selectedDate: string;
        selectedTeachersIds: number[];
        selectedTeachers: Teacher[];
        teachers: Teacher[];
        isLoading?: boolean;
    };

    const [state, setState] = useState<GroupModalState>({
        courseGroups: [createDefaultCourse(1)],
        selectedDate: '',
        selectedTeachersIds: [], // Исправлено название
        selectedTeachers: [],
        teachers: [],
        isLoading: false,
    });

    const updateState = (partialState: Partial<GroupModalState>) => {
        setState(prev => ({...prev, ...partialState}));
    };

    const coursesList = getCoursesList();

    useEffect(() => {
        if (group) {
            updateState({
                selectedDate: group.date,
                courseGroups: group.courses,
                teachers: group.teachers
            })
        }
    }, [group]);

    useEffect(() => {
        loadTeachers();
        updateState({
            selectedTeachers: group?.teachers,
            selectedDate: group?.date
        });
    }, [isOpen]);

    const loadTeachers = async () => {
        try {
            const response = await api.get<Teacher[]>('/template/teacher/show');

            updateState({
                teachers: response.data.length > 0
                    ? [...response.data]
                    : [{ id: 1, initials: '', status: 1 }]
            });

        } catch (err) {
            console.error('Ошибка загрузки учителей:', err);
            updateState({
                teachers: [{ id: -1, initials: 'Ошибка загрузки', status: 0 }],
            });
        }
    };

    const addUser = (courseId: number) => {
        updateState({
            courseGroups: state.courseGroups.map(courseGroup => {
                if (courseGroup.id !== courseId) {
                    return courseGroup;
                }

                // Создаем нового пользователя с уникальным ID
                const newUserId = courseGroup.clients.length > 0
                    ? Math.max(...courseGroup.clients.map(c => c.id)) + 1
                    : 1;

                return {
                    ...courseGroup,
                    clients: [
                        ...courseGroup.clients,
                        createDefaultClient(newUserId)
                    ]
                };
            })
        });
    };

    const removeUser = (courseId: number, userId: number) => {
        updateState({
            courseGroups: state.courseGroups.map(courseGroup => {
                if (courseGroup.id !== courseId) {
                    return courseGroup;
                }
                return {
                    ...courseGroup,
                    clients: courseGroup.clients.filter(client => client.id !== userId)
                };
            })
        });
    };

    const addCourse = () => {
        const courses = state.courseGroups
        const newId = courses.length > 0 ? Math.max(...courses.map(c => c.id)) + 1 : 1;
        updateState({
            courseGroups: [...courses, createDefaultCourse(newId)]
        })
    }

    const removeCourseGroup = (courseGroupId: number) => {
        updateState({
            courseGroups: state.courseGroups.filter(course => course.id !== courseGroupId)
        })
    };

    const handleUserChange = (
        id: number,
        field: keyof Client,
        value: string,
        courseId: number
    ) => {
        updateState({
            courseGroups: state.courseGroups.map(courseGroup => {
                if (courseGroup.id !== courseId) {
                    return courseGroup;
                }

                return {
                    ...courseGroup,
                    clients: courseGroup.clients.map(client =>
                        client.id === id
                            ? {...client, [field]: value}
                            : client
                    )
                };
            })
        });
    };

    const checkUnsavedData = (): boolean => {
        if (state.selectedDate) return true;

        return state.courseGroups.some(course => {
            return course.clients.some(client => {
                return (
                    client.initials.trim() !== '' ||
                    (client.inn !== null && client.inn.toString().trim() !== '') ||
                    client.org.trim() !== '' ||
                    client.safety !== null
                );
            });
        });
    };

    const resetForm = () => {
        updateState({
            selectedDate: '',
            selectedTeachers: [],
        })
    };

    const handleSave = async () => {
        const isValid = validateCourseGroups(state.courseGroups, state.selectedDate);
        if (!isValid) return;

        if (type == "metodist" && group) {
            //Методист исправляет заявку пользователя
            try {
                const groupData: GroupCreate = {
                    date: state.selectedDate,
                    courses: state.courseGroups.map(course => ({
                        course_id: course.course_id,
                        clients: course.clients.map(client => ({
                            initials: client.initials,
                            inn: client.inn,
                            org: client.org,
                            safety: client.safety,
                            reg_num: client.reg_num,
                        }))
                    })),
                    teachers: state.selectedTeachersIds
                };

                const response = await createGroup(groupData, false);
                await deleteUserGroup(group.id)
                alert(`Группа №${response.id} отправлена на проверку, заявка №${group.id} удалена`)
            } catch (error) {
                console.error('Ошибка при создании измененной заявки:', error);
                alert('Произошла ошибка при сохранении заявки от методиста');
            }
        } else if (group && refresh) {
            //В режиме редактирования
            try {
                const groupData: GroupUpdate = {
                    id: group.id,
                    date: state.selectedDate,
                    courses: state.courseGroups.map(course => ({
                        id: course.id,
                        course_id: course.course_id,
                        clients: course.clients.map(client => ({
                            id: client.id,
                            initials: client.initials,
                            inn: client.inn,
                            org: client.org,
                            safety: client.safety,
                            reg_num: client.reg_num,
                        }))
                    })),
                    teachers: state.selectedTeachersIds || []
                };
                const response = await updateGroup(groupData)
                refresh()
                alert(`Группа №${response.id} успешно обновлена`)
            } catch (error) {
                console.error('Ошибка при сохранении группы:', error);
                alert('Произошла ошибка при сохранении группы');
            }
        } else if (refresh && !group) {
            // В режиме создания
            try {
                const groupData: GroupCreate = {
                    date: state.selectedDate,
                    courses: state.courseGroups.map(course => ({
                        course_id: course.course_id,
                        clients: course.clients.map(client => ({
                            initials: client.initials,
                            inn: client.inn,
                            org: client.org,
                            safety: client.safety,
                            reg_num: client.reg_num,
                        }))
                    })),
                    teachers: state.selectedTeachersIds
                };

                const response = await createGroup(groupData, false);
                refresh()
                alert(`Группа №${response.id} успешно создана`)
            } catch (error) {
                console.error('Ошибка при сохранении группы:', error);
                alert('Произошла ошибка при обновлении группы');
            }
        } else {
            //От пользователя
            try {
                const groupData: GroupCreate = {
                    date: state.selectedDate,
                    courses: state.courseGroups.map(course => ({
                        course_id: course.course_id,
                        clients: course.clients.map(client => ({
                            initials: client.initials,
                            inn: client.inn,
                            org: client.org,
                            safety: client.safety,
                            reg_num: client.reg_num,
                        }))
                    })),
                    teachers: null
                };

                const response = await createGroup(groupData, true);
                alert(`Группа №${response.id} отправлена на проверку`)
            } catch (error) {
                console.error('Ошибка при сохранении группы:', error);
                alert('Произошла ошибка при сохранении заявки от пользователя');
            }
        }
        onClose()
    };

    const handleChangeDate = (date: string): void => {
        updateState({
            selectedDate: date
        })
    }

    const handleChangeTeachers = (teachersIds: number[]): void => {
        updateState({
            selectedTeachersIds: teachersIds
        })
    }

    if (!isOpen) return null;

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title="Создание новой группы"
            width="max-w-6xl"
            hasUnsavedData={checkUnsavedData}
            resetForm={resetForm}
        >
            <div className="p-6">
                {!refresh ? (
                    <input
                        type="date"
                        className="mb-4"
                        onChange={(e) => handleChangeDate(e.target.value)}
                    />
                ) : (
                    <PeopleSelector
                        people={state.teachers}
                        selectedStaff={state.selectedTeachers}
                        onChangeDate={handleChangeDate}
                        onChangeTeachers={handleChangeTeachers}
                    />
                )}

                {state.courseGroups.map((course) => (
                    <CourseSection
                        key={course.id}
                        course={course}
                        coursesList={coursesList}
                        onUpdate={(updatedCourse) => {
                            updateState({
                                courseGroups: state.courseGroups.map(c =>
                                    c.id === updatedCourse.id ? updatedCourse : c
                                )
                            });
                        }}
                        onAddUser={() => addUser(course.id)}
                        onRemove={() => removeCourseGroup(course.id)}
                        handleUserChange={(id, field, value) => handleUserChange(id, field, value, course.id)}
                        removeUser={removeUser}
                    />
                ))}

                <div className="flex flex-row justify-between">
                    <button
                        onClick={addCourse}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                    >
                        Добавить курс
                    </button>

                    <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        {group ? 'Сохранить изменения' : 'Создать группу'}
                    </button>
                </div>

            </div>
        </BaseModal>
    );
}