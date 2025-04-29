import GroupsPage from "@/components/GroupsPageBase/GroupsPageBase";
import {GroupType} from "@/types/GroupTypes";

export default function TemplatePage() {
    return (
        <GroupsPage
            type={GroupType.TEMPLATE}
            title="Активные группы"
        />
    );
}