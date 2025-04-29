import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {Group, GroupType} from "@/types/GroupTypes";
import api from "@/lib/api";
import {showGroups} from "@/utils/request";

export default function useGroups(type: GroupType) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [visibleGroups, setVisibleGroups] = useState<Group[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        try {
            setLoading(true);
            const data = await showGroups(type);
            setGroups(data);
            setVisibleGroups(data);
            setError(null);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Ошибка загрузки'
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    }, [type]);

    const handleDelete = useCallback(async (id: number) => {
        try {
            await api.delete(`/groups/${id}`);
            setGroups(prev => prev.filter(g => g.id !== id));
        } catch (err) {
            setError('Ошибка удаления группы');
        }
    }, []);

    useEffect(() => { fetchGroups(); }, [fetchGroups]);

    return {
        groups,
        visibleGroups,
        loading,
        error,
        handleDelete,
        refreshGroups: fetchGroups,
        setVisibleGroups
    };
}