import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Order } from "@/types/OrderTypes";
import api from "@/lib/api";

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [visibleOrders, setVisibleOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            const response = await api.get<Order[]>('/orders/show');
            setOrders(response.data);
            setVisibleOrders(response.data);
            setError(null);
        } catch (err) {
            setError(axios.isAxiosError(err)
                ? err.response?.data?.detail || 'Ошибка загрузки заказов'
                : 'Неизвестная ошибка');
        } finally {
            setLoading(false);
        }
    }, []);

    const handleDelete = useCallback(async (id: number) => {
        try {
            await api.delete(`/orders/delete?order_id=${id}`);
            setOrders(prev => prev.filter(order => order.id !== id));
            setVisibleOrders(prev => prev.filter(order => order.id !== id));
            return true;
        } catch (err) {
            setError('Ошибка удаления заказа');
            return false;
        }
    }, []);

    useEffect(() => { fetchOrders(); }, [fetchOrders]);

    return {
        orders,
        visibleOrders,
        loading,
        error,
        handleDelete,
        refreshOrders: fetchOrders,
        setVisibleOrders
    };
}