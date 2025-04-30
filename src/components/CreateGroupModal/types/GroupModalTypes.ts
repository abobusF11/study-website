import {Group} from "@/types/GroupTypes";

export interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    refresh?: () => void;
    group?: Group | null;
    type?: "metodist" | null | undefined;
}