import api from "@/lib/api";
import {Group, GroupCreate, GroupCreateResponse, GroupUpdate, GroupUpdateResponse} from "@/app/features/groups/types/GroupTypes";
import {TeacherCreate} from "@/app/features/teachers/types/TeacherTypes";

export const createGroup = async (group: GroupCreate, fromUser: boolean): Promise<GroupCreateResponse> => {
    try {
        if (fromUser) {
            const response = await api.post<GroupCreateResponse>(
                "/clients/group/create",
                group,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        } else {
            const response = await api.post<GroupCreateResponse>(
                "/template/group/create",
                group,
                {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                }
            );
            return response.data;
        }
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
};

export const updateGroup = async (group: GroupUpdate): Promise<GroupUpdateResponse> => {
    try {
        const response = await api.put(
            "/template/group/update",
            group,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
};

export const deleteUserGroup = async (groupId: number) => {
    try {
        const response = await api.delete(
            "/clients/group/delete",
            {
                params: {
                    group_id: String(groupId)
                },
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
}


export const createTeachers = async (
    teachers: TeacherCreate[]
) => {
    try {
        const requestData = teachers.map(teacher => ({
            initials: teacher.initials,
            status: teacher.status,
            id: teacher.id ?? null // Если id undefined или null, явно ставим null
        }));
        const response = await api.post(
            "/template/teacher/replace-all",
            requestData,
            {
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating protocol:', error);
        throw error;
    }
};