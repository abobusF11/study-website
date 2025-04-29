'use client';

import {ReactNode, useCallback, useEffect, useRef} from 'react';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    width?: string;
    hasUnsavedData?: () => boolean;
    resetForm?: () => void;
}

export default function BaseModal(
    {
        isOpen,
        onClose,
        title,
        children,
        width = 'max-w-4xl',
        hasUnsavedData,
        resetForm
    }: BaseModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
        if (hasUnsavedData?.()) {
            const confirmClose = window.confirm(
                'У вас есть несохранённые данные. Закрыть модальное окно?'
            );
            if (!confirmClose) return;
        }
        resetForm?.();
        onClose();
    }, [hasUnsavedData, resetForm, onClose]);


    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                handleClose(); // Используется handleClose из замыкания
            }
        };

        if (isOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, handleClose]); // handleClose меняется при каждом рендере

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div
                ref={modalRef}
                className={`bg-white rounded-lg shadow-xl w-full ${width} max-h-[90vh] overflow-y-auto`}
            >
                <div className="p-6">
                    {/* Заголовок и кнопка закрытия */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold">{title}</h2>
                        <button
                            onClick={handleClose}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                      d="M6 18L18 6M6 6l12 12"/>
                            </svg>
                        </button>
                    </div>

                    {children}

                </div>
            </div>
        </div>
    );
}