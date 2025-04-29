'use client';

import {GroupType} from "@/types/GroupTypes";
import useGroups from "@/components/GroupsPageBase/hooks/useGroups";
import GroupsToolbar from "@/components/GroupsPageBase/GroupsToolbar";
import {GroupTable} from "@/components/GroupsPageBase/GroupTable";
import SearchGroups from "@/components/GroupsPageBase/SearchBar";
import CreateGroupModal from "@/components/CreateGroupModal/CreateGroupModal";
import CreateTeachersModal from "@/components/CreateTeachersModal";
import {useState} from "react";

interface GroupsPageProps {
    type: GroupType;
    title: string;
    metodist?: "metodist" | null;
}

export default function GroupsPage({ type, title, metodist}: GroupsPageProps) {
    const {
        groups,
        visibleGroups,
        handleDelete,
        refreshGroups,
        setVisibleGroups
    } = useGroups(type);
    const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
    const [isTeachersModalOpen, setIsTeachersModalOpen] = useState(false);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-8">{title}</h1>

            <GroupsToolbar
                type={type}
                openGroupModal={() => setIsGroupModalOpen(true)}
                openTeacherModal={() => setIsTeachersModalOpen(true)}
            />

            <SearchGroups groups={groups} onLocalSearch={setVisibleGroups}/>

            <GroupTable
                groups={visibleGroups}
                onDelete={handleDelete}
                onRefresh={refreshGroups}
                type={metodist}
            />

            <CreateGroupModal
                isOpen={isGroupModalOpen}
                onClose={() => setIsGroupModalOpen(false)}
                refresh={refreshGroups}
                type={metodist}
            />

            <CreateTeachersModal
                isOpen={isTeachersModalOpen}
                onClose={() => setIsTeachersModalOpen(false)}
            />

        </div>
    );
}