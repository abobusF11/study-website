import api from "@/lib/api";
import {Group, GroupCreate, GroupCreateResponse, GroupUpdate, GroupUpdateResponse} from "@/types/GroupTypes";
import {TeacherCreate} from "@/types/TeacherTypes";

export const showGroups = async (type: string): Promise<Group[]> => {
    //type: active, archive, from-user
    try {
        if (type != "from-user") {
            const response = await api.get<Group[]>(`/template/group/show?date_filter=${type}`);
            return response.data;
        } else {
            const response = await api.get<Group[]>(`/clients/group/show`);
            console.log(JSON.stringify(response.data));
            return response.data;
        }
    } catch (error) {
        console.error('Full error:', error);
        throw error;
    }
};

export const createGroup = async (group: GroupCreate, fromUser: boolean): Promise<GroupCreateResponse> => {
    try {
        if (fromUser) {
            console.log(JSON.stringify(group));
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

export const deleteGroup = async (groupId: number) => {
    try {
        const response = await api.delete(
            "/template/group/delete",
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

export const authMe = async () => {
    try {
        const response = await api.get("auth/me")
        console.log(response)
    } catch (error) {
        console.error('Error creating authMe:', error);
        throw error;
    }
}