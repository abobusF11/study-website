import GroupsPage from "@/app/features/groups/components/GroupsPage/GroupsPage";
import {GroupType} from "@/app/features/groups/types/GroupTypes";

export default function ArchivePage() {
    return (
        <GroupsPage
            type={GroupType.ARCHIVE}
            title="Архив"
            typeTable="archiveTable"
        />
    );
}