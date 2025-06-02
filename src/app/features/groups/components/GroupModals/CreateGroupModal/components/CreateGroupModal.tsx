'use client';

import {useCallback, useEffect, useState} from 'react';
import BaseModal from "@/app/components/BaseModal";
import {GroupCreate} from "@/app/features/groups/types/GroupTypes";
import {Client} from "@/app/features/groups/types/GroupTypes";
import {createGroup} from "@/utils/request";
import {PeopleSelector} from "@/app/features/groups/components/GroupsPage/PeopleSelector/PeopleSelector";
import {
    CreateGroupModalProps
} from "@/app/features/groups/components/GroupModals/CreateGroupModal/types/GroupModalTypes";
import {validateCourseGroups} from "@/app/features/groups/components/GroupModals/utils/groupValidation";
import {
    CreateCourseSection
} from "@/app/features/groups/components/GroupModals/CreateGroupModal/components/CreateGroupCourseSection";
import {
    createDefaultClient,
    createDefaultCourse
} from "@/app/features/groups/components/GroupModals/utils/groupDefaults";
import {useCourseStore} from "@/app/features/courses/hooks/useCourses";
import {useTeachers} from "@/app/features/teachers/hooks/useTeachers";
import {GroupModalState} from "@/app/features/groups/components/GroupModals/types/GroupModalState";
import {CoursesKeys} from "@/app/features/courses/types/CourseTypes";


export default function CreateGroupModal(
    {isOpen, onClose, refresh}: CreateGroupModalProps
) {
    const {courses, fetchCourses, isLoading} = useCourseStore();
    const {teachers, fetchTeachers} = useTeachers();
    const [state, setState] = useState<GroupModalState>({
        courseGroups: [],
        selectedDate: '2024-12-12',
        selectedTeachers: [],
    });

    useEffect(() => {
        if (isOpen) {
            const loadCourses = async () => await fetchCourses();
            loadCourses();
            updateState({
                courseGroups: [{
                    id: 0,
                    name: courses[0].name,
                    course_id: courses[0].id,
                    hours: courses[0].hours,
                    clients: [createDefaultClient(0)],
                }]
            });
        }
    }, [isOpen, fetchCourses]);

    useEffect(() => {
        if (isOpen && courses.length === 0 && !isLoading) {
            alert("Нет курсов");
            onClose();
        }
    }, [isOpen, courses, isLoading, onClose]);


    const updateState = (partialState: Partial<GroupModalState>) => {
        setState(prev => ({...prev, ...partialState}));
    };


    const addCourse = () => {
        const coursesGroups = state.courseGroups
        const newId = coursesGroups.length > 0 ? Math.max(...coursesGroups.map(c => c.id)) + 1 : 1;
        updateState({
            courseGroups: [...coursesGroups, createDefaultCourse(newId, courses[0])]
        })
    }

    const removeCourseGroup = (courseGroupId: number) => {
        updateState({
            courseGroups: state.courseGroups.filter(course => course.id !== courseGroupId)
        })
    };

    const handleUserChange = (
        clientId: number,
        value: string,
        courseId: number,
        field: CoursesKeys
    ) => {
        updateState({
            courseGroups: state.courseGroups.map((course) => {
                if (course.course_id !== courseId) {
                    return course
                }

                return {
                    ...course,
                    clients: course.clients.map(client =>
                        client.id === clientId ? {...client, [field]: value} : client
                    )
                };
            })
        })
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
                is_order: false,
                teachers: null
            };

            const response = await createGroup(groupData, false);
            refresh()
            alert(`Группа №${response.id} успешно создана`)
        } catch (error) {
            console.error('Ошибка при создании группы:', error);
            alert('Произошла ошибка при создании группы');
        }

        onClose()
    };

    if (!isOpen) return null;

    if (isLoading) {
        return (
            <BaseModal
                isOpen={isOpen}
                onClose={onClose}
                title={"Создание группы"}
                width="max-w-6xl"
                hasUnsavedData={checkUnsavedData}
                resetForm={resetForm}
            >
                <div className="p-6 flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            </BaseModal>
        );
    }

    return (
        <BaseModal
            isOpen={isOpen}
            onClose={onClose}
            title={"Создание группы"}
            width="max-w-6xl"
            hasUnsavedData={checkUnsavedData}
            resetForm={resetForm}
        >
            <div className="p-6">
                {state.courseGroups.map((courseGroup) => (
                    <CreateCourseSection
                        key={`courseGroup-${courseGroup.id}`}
                        onUpdate={(updatedCourse) => {
                            updateState({
                                courseGroups: state.courseGroups.map(c =>
                                    c.id === updatedCourse.id ? updatedCourse : c
                                )
                            });
                        }}
                        onRemove={removeCourseGroup}
                        onHandleUserChange={handleUserChange}
                        course={courseGroup}
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
                        Создание
                    </button>
                </div>
            </div>
        </BaseModal>
    );
}