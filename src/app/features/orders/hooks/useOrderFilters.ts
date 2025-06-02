import { useState, useEffect, useCallback } from 'react';
import { Order } from "@/types/OrderTypes";

type FilterOptions = {
    status?: string;
    serviceType?: string;
    dateFrom?: string;
    dateTo?: string;
    searchTerm?: string;
};

export function useOrderFilters(orders: Order[]) {
    const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
    const [filters, setFilters] = useState<FilterOptions>({
        status: '',
        serviceType: '',
        dateFrom: '',
        dateTo: '',
        searchTerm: ''
    });

    const updateFilter = (name: keyof FilterOptions, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const applyFilters = useCallback(() => {
        let result = [...orders];

        // Фильтр по статусу
        if (filters.status) {
            result = result.filter(order => order.status === filters.status);
        }

        // Фильтр по типу услуги
        if (filters.serviceType) {
            result = result.filter(order => order.service_type === filters.serviceType);
        }

        // Фильтр по дате (от)
        if (filters.dateFrom) {
            const fromDate = new Date(filters.dateFrom);
            result = result.filter(order => new Date(order.desired_date) >= fromDate);
        }

        // Фильтр по дате (до)
        if (filters.dateTo) {
            const toDate = new Date(filters.dateTo);
            result = result.filter(order => new Date(order.desired_date) <= toDate);
        }

        // Поиск по тексту
        if (filters.searchTerm) {
            const searchLower = filters.searchTerm.toLowerCase();
            result = result.filter(order => 
                order.client_name.toLowerCase().includes(searchLower) ||
                order.client_email.toLowerCase().includes(searchLower) ||
                order.description.toLowerCase().includes(searchLower)
            );
        }

        setFilteredOrders(result);
    }, [orders, filters]);

    // Применяем фильтры при изменении заказов или фильтров
    useEffect(() => {
        applyFilters();
    }, [applyFilters, orders]);

    const resetFilters = () => {
        setFilters({
            status: '',
            serviceType: '',
            dateFrom: '',
            dateTo: '',
            searchTerm: ''
        });
    };

    return {
        filteredOrders,
        filters,
        updateFilter,
        resetFilters
    };
}