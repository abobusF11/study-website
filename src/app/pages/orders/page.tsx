import GroupsPage from "@/app/features/groups/components/GroupsPage/GroupsPage";
import {GroupType} from "@/app/features/groups/types/GroupTypes";

export default function OrdersPage() {
    return (
        <GroupsPage
            type={GroupType.FROM_USER}
            title="Заявки"
            typeTable="ordersTable"
        />
    );
}