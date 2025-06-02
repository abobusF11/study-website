import GroupsPage from "@/app/features/groups/components/GroupsPage/GroupsPage";
import {GroupType} from "@/app/features/groups/types/GroupTypes";

export default function TemplatePage() {
    return (
        <GroupsPage
            type={GroupType.TEMPLATE}
            title="Активные группы"
            typeTable = "activeTable"
        />
    );
}