import {Group, GroupCreate} from "@/app/features/groups/types/GroupTypes";
import {create} from "zustand";

interface GroupStore{
    group: Group[];
    fetchGroups: () => Promise<void>;
    createGroup: (group: GroupCreate) => Promise<void>;
    deleteGroup: (id: number) => Promise<void>;
}

export const useGroupStore = create<GroupStore>((set) => ({
    group: [],
    fetchGroups: async () => {},
    createGroup: async (group: GroupCreate) => {},
    deleteGroup: async () => {},
}));