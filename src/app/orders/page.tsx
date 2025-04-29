import GroupsPage from "@/components/GroupsPageBase/GroupsPageBase";
import {GroupType} from "@/types/GroupTypes";

export default function OrdersPage() {
    return (
        <GroupsPage
            type={GroupType.FROM_USER}
            title="Заявки"
            metodist={"metodist"}
        />
    );
}