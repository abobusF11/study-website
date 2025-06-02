import { useState } from 'react';
import { Order, OrderCreate, OrderUpdate } from "@/types/OrderTypes";
import api from "@/lib/api";

export function useOrderActions() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createOrder = async (order: OrderCreate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/orders/create', order, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при создании заказа');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const updateOrder = async (order: OrderUpdate) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put('/orders/update', order, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при обновлении заказа');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const approveOrder = async (orderId: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post(`/orders/approve?order_id=${orderId}`);
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при подтверждении заказа');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const rejectOrder = async (orderId: number, reason: string) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/orders/reject', {
                order_id: orderId,
                reason: reason
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            return response.data;
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Ошибка при отклонении заказа');
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        createOrder,
        updateOrder,
        approveOrder,
        rejectOrder
    };
}