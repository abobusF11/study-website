'use client';

import { GroupType } from "@/app/features/groups/types/GroupTypes";
import GroupsToolbar from "@/app/features/groups/components/GroupsPage/Toolbar/GroupsToolbar";
import { GroupTable } from "@/app/features/groups/components/GroupsPage/GroupTable/GroupTable";
import SearchBar from "@/app/features/groups/components/GroupsPage/SearchBar/SearchBar";
import CreateGroupModal from "@/app/features/groups/components/GroupModals/CreateGroupModal/components/CreateGroupModal";
import CreateTeachersModal from "@/app/features/teachers/components/CreateTeachersModal";
import CreateCourseModal from "@/app/features/courses/components/CreateCourseModal/CreateCourseModal";
import { useState } from "react";
import {useGroups} from "@/app/features/groups/hooks/useGroups";

interface GroupsPageProps {
    type: GroupType;
    title: string;
    typeTable: "activeTable" | "archiveTable" | "ordersTable";
}

/**
 * Основной компонент страницы групп
 * Управляет отображением групп, поиском и модальными окнами
 */
export default function GroupsPage({ type, title, typeTable }: GroupsPageProps) {
    // Получаем данные и методы для работы с группами
    const {
        groups,
        handleDelete,
        fetchGroups,
        setVisibleGroups,
    } = useGroups(type);
    
    // Состояния для управления модальными окнами
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);
    const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);

    // Обработчики для открытия модальных окон
    const openGroupModal = () => setIsGroupModalOpen(true);
    const closeGroupModal = () => setIsGroupModalOpen(false);
    const openTeacherModal = () => setIsTeachersModalOpen(true);
    const closeTeacherModal = () => setIsTeachersModalOpen(false);
    const openCourseModal = () => setIsCourseModalOpen(true);
    const closeCourseModal = () => setIsCourseModalOpen(false);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">{title}</h1>

            {/* Панель инструментов с кнопками навигации */}
            <GroupsToolbar
                type={type}
                openGroupModal={openGroupModal}
                openTeacherModal={openTeacherModal}
                openCourseModal={openCourseModal}
            />

            {/* Компонент поиска */}
            <SearchBar 
                groups={groups} 
                onLocalSearch={setVisibleGroups}
            />

            <GroupTable
                groups={groups}
                onDelete={handleDelete}
                onRefresh={fetchGroups}
                typeTable={typeTable}
            />

            {/* Модальные окна */}
            <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={closeGroupModal}
            />

            {/*<EditGroupModal*/}
            {/*    isOpen={isGroupModalOpen}*/}
            {/*    onClose={closeGroupModal}*/}
            {/*    group*/}
            {/*/>*/}

            <CreateTeachersModal
                isOpen={isTeachersModalOpen}
                onClose={closeTeacherModal}
            />
            
            <CreateCourseModal
                isOpen={isCourseModalOpen}
                onClose={closeCourseModal}
                refresh={fetchGroups}
            />
        </div>
    );
}