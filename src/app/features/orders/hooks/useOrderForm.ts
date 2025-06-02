import { useState, useEffect } from 'react';
import { Order, OrderCreate } from "@/types/OrderTypes";

export function useOrderForm(initialOrder?: Order) {
    const [formData, setFormData] = useState<OrderCreate>({
        client_name: '',
        client_email: '',
        client_phone: '',
        service_type: '',
        description: '',
        desired_date: '',
        status: 'pending'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialOrder) {
            setFormData({
                client_name: initialOrder.client_name,
                client_email: initialOrder.client_email,
                client_phone: initialOrder.client_phone,
                service_type: initialOrder.service_type,
                description: initialOrder.description,
                desired_date: initialOrder.desired_date,
                status: initialOrder.status
            });
        }
    }, [initialOrder]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Очищаем ошибку поля при изменении
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        
        if (!formData.client_name.trim()) {
            newErrors.client_name = 'Имя клиента обязательно';
        }
        
        if (!formData.client_email.trim()) {
            newErrors.client_email = 'Email клиента обязателен';
        } else if (!/\S+@\S+\.\S+/.test(formData.client_email)) {
            newErrors.client_email = 'Некорректный email';
        }
        
        if (!formData.client_phone.trim()) {
            newErrors.client_phone = 'Телефон клиента обязателен';
        }
        
        if (!formData.service_type.trim()) {
            newErrors.service_type = 'Тип услуги обязателен';
        }
        
        if (!formData.desired_date.trim()) {
            newErrors.desired_date = 'Желаемая дата обязательна';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const resetForm = () => {
        setFormData({
            client_name: '',
            client_email: '',
            client_phone: '',
            service_type: '',
            description: '',
            desired_date: '',
            status: 'pending'
        });
        setErrors({});
    };

    return {
        formData,
        errors,
        isSubmitting,
        setIsSubmitting,
        handleChange,
        validateForm,
        resetForm
    };
}