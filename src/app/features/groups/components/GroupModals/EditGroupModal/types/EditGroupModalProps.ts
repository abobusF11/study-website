import {Group} from "@/app/features/groups/types/GroupTypes";

export interface EditGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    refresh: () => void;
    group: Group | null;
}