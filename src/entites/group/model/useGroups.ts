import {useState} from "react";
import {GroupType} from "@/shared/types/enums/group";
import {Group} from "@/entites/group/types/group";

export function useGroups(type: GroupType) {
    const [groups, setGroups] = useState<Group[]>([]);
    const [visibleGroups, setVisibleGroups] = useState<Group[]>([]);

    const fetchGroups = async (type: string) => {
        try {
            if (type != "from-user") {
                const response = await api.get<Group[]>(`/group?date_filter=${type}`);
                setGroups(response.data);
                setVisibleGroups(response.data);
            } else {
                const response = await api.get<Group[]>(`/clients/group`);
                setGroups(response.data);
                setVisibleGroups(response.data);
            }
        } catch (err) {
            console.log(axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Ошибка загрузки'
                : 'Неизвестная ошибка');
        }
    };

    const handleDelete = useCallback(async (id: number) => {
        try {
            await api.delete(`/groups/${id}`);
            setGroups(prev => prev.filter(g => g.id !== id));
            setVisibleGroups(prev => prev.filter(g => g.id !== id));
        } catch {
            console.log('Ошибка удаления группы');
        }
    }, []);

    useEffect(() => {
        fetchGroups(type);
    }, []);

    return {
        groups,
        visibleGroups,
        handleDelete,
        fetchGroups,
        setVisibleGroups
    };
}