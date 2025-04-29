import GroupsPage from "@/components/GroupsPageBase/GroupsPageBase";
import {GroupType} from "@/types/GroupTypes";

export default function ArchivePage() {
    return (
        <GroupsPage
            type={GroupType.ARCHIVE}
            title="Архив"
        />
    );
}