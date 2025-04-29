'use client';
import {useRouter} from 'next/navigation';
import {GroupType} from "@/types/GroupTypes";
import NavButton from "@/components/GroupsPageBase/NavButton";

const buttonConfigs = [
    {path: '/template', color: 'green', icon: 'M5 13l4 4L19 7', text: 'Активные'},
    {
        path: '/archive',
        color: 'yellow',
        icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
        text: 'Архив'
    },
    {path: '', color: 'blue', icon: 'M12 4v16m8-8H4', text: 'Создать группу', action: true},
    {
        path: '',
        color: 'purple',
        icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
        text: 'Преподаватели',
        action: true
    },
    {
        path: '/orders',
        color: 'orange',
        icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
        text: 'Заявки'
    }
];

export default function GroupsToolbar(
    {
        type,
        openGroupModal,
        openTeacherModal,
    }: {
        type: GroupType,
        openGroupModal: () => void;
        openTeacherModal: () => void;
    }) {
    const router = useRouter();

    const handleAction = (text: string) => {
        if (text === 'Создать группу') {
            openGroupModal()
        } else if (text === 'Преподаватели') {
            openTeacherModal()
        }
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-5 lg:grid-cols-5 gap-5 mb-6">
            {buttonConfigs.map((btn) => (
                <NavButton
                    key={btn.text}
                    color={btn.color}
                    icon={btn.icon}
                    text={btn.text}
                    onClick={btn.action
                        ? () => handleAction(btn.text)
                        : () => router.push(btn.path)}
                    active={btn.path === `/${type}`}
                />
            ))}
        </div>
    );
}