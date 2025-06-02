'use client';
import {useRouter} from 'next/navigation';
import {GroupType} from "@/app/features/groups/types/GroupTypes";
import NavButton from "./NavButton";

interface GroupsToolbarProps {
    type: GroupType;
    openGroupModal: () => void;
    openTeacherModal: () => void;
    openCourseModal: () => void; // Новый обработчик
}

export default function GroupsToolbar({ type, openGroupModal, openTeacherModal, openCourseModal }: GroupsToolbarProps) {
    const router = useRouter();

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-5 mb-3">
            {/* Кнопка "Активные" */}
            <NavButton
                color="green"
                icon="M5 13l4 4L19 7"
                text="Активные"
                onClick={() => router.push('/pages/template')}
                active={type === GroupType.TEMPLATE}
            />

            {/* Кнопка "Архив" */}
            <NavButton
                color="yellow"
                icon="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                text="Архив"
                onClick={() => router.push('/pages/archive')}
                active={type === GroupType.ARCHIVE}
            />

            {/* Кнопка "Создать группу" */}
            <NavButton
                color="blue"
                icon="M12 4v16m8-8H4"
                text="Создать группу"
                onClick={openGroupModal}
                active={false}
            />
            
            {/* Кнопка "Создать курс" */}
            <NavButton
                color="blue"
                icon="M12 6v6m0 0v6m0-6h6m-6 0H6"
                text="Создать курс"
                onClick={openCourseModal}
                active={false}
            />

            {/* Кнопка "Преподаватели" */}
            <NavButton
                color="purple"
                icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                text="Преподаватели"
                onClick={openTeacherModal}
                active={false}
            />

            {/* Кнопка "Заявки" */}
            <NavButton
                color="orange"
                icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                text="Заявки"
                onClick={() => router.push('/pages/orders')}
                active={type === GroupType.FROM_USER}
            />
        </div>
    );
}