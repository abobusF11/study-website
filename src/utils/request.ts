import api from "@/lib/api";
import {ClientCreate, Group, GroupCreateResponse} from "@/types/GroupTypes";
import {ProtocolCreateResponse} from "@/types/ProtocolTypes";
import {TeacherCreate} from "@/types/TeacherTypes";


export const createGroup = async (selectedCourseId: number, users: ClientCreate[]): Promise<GroupCreateResponse> => {
    try {
        const response = await api.post<GroupCreateResponse>(
            "/template/group/create",
            {
                course_id: selectedCourseId,
                clients: users
            },
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

export const createProtocol = async (
    startDate: Date,
    endDate: Date,
    groupIds: Group[]
): Promise<ProtocolCreateResponse> => {
    try {
        // Форматируем даты в строки в формате YYYY-MM-DD
        const formatDate = (date: Date): string => {
            return date.toISOString().split('T')[0];
        };

        const response = await api.post<ProtocolCreateResponse>(
            "/template/protocol/create",
            {
                start_date: formatDate(startDate),
                end_date: formatDate(endDate),
                group_ids: groupIds.map(group => group.id),
            },
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

export const createTeachers = async (
    teachers: TeacherCreate[]
): Promise<ProtocolCreateResponse> => {
    try {
        const response = await api.post<ProtocolCreateResponse>(
            "/template/teacher/replace-all",
            teachers,
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