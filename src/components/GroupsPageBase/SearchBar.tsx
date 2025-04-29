"use client";
import {useEffect, useRef, useState, useCallback} from "react";
import {FiSearch, FiX} from "react-icons/fi";
import {Group} from "@/types/GroupTypes";

interface SearchGroupsProps {
    groups: Group[];
    placeholder?: string;
    onLocalSearch: (results: Group[]) => void; // Теперь обязательный параметр
    onDatabaseSearch?: (query: string) => Promise<Group[]>;
    debounceDelay?: number;
    minQueryLength?: number;
}

export default function SearchGroups(
    {
        groups: initialGroups,
        placeholder = "Поиск...",
        onLocalSearch,
        onDatabaseSearch,
        debounceDelay = 500,
        minQueryLength = 2,
    }: SearchGroupsProps) {
    const [query, setQuery] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Поиск среди групп
    const searchLocal = useCallback((searchQuery: string, groups: Group[]): Group[] => {
        if (!searchQuery.trim()) return groups;

        const queryLower = searchQuery.toLowerCase();

        return groups.filter(group => {
            return group.courses.some(course => {
                return course.clients.some(client => {
                    return (
                        client.initials.toLowerCase().includes(queryLower) ||
                        (client.org?.toLowerCase().includes(queryLower)) ||
                        (client.inn?.includes(queryLower)) ||
                        (client.safety?.toString().includes(queryLower))
                    );
                });
            });
        });
    }, []);

    // Поиск в БД
    const searchDatabase = useCallback(async (searchQuery: string) => {
        if (!onDatabaseSearch) return [];

        try {
            return await onDatabaseSearch(searchQuery);
        } catch (error) {
            console.error("Ошибка поиска в БД:", error);
            return [];
        }
    }, [onDatabaseSearch]);

    // Основной обработчик поиска
    const handleSearch = useCallback(async (searchQuery: string) => {
        const localResults = searchLocal(searchQuery, initialGroups);
        onLocalSearch(localResults);

        if (localResults.length === 0 && searchQuery.length >= minQueryLength && onDatabaseSearch) {
            const dbResults = await searchDatabase(searchQuery);
            onLocalSearch(dbResults);
        }
    }, [initialGroups, minQueryLength, onDatabaseSearch, onLocalSearch, searchDatabase, searchLocal]);

    // Очистка поиска
    const handleClear = useCallback(() => {
        setQuery("");
        onLocalSearch(initialGroups);
        inputRef.current?.focus();
    }, [initialGroups, onLocalSearch]);

    // Инициализация и debounce поиска
    useEffect(() => {
        if (!isInitialized) {
            // Первоначальная загрузка
            onLocalSearch(initialGroups);
            setIsInitialized(true);
            return;
        }

        const timer = setTimeout(() => {
            handleSearch(query);
        }, debounceDelay);

        return () => clearTimeout(timer);
    }, [query, debounceDelay, handleSearch, initialGroups, isInitialized, onLocalSearch]);

    return (
        <div className="relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400"/>
            </div>
            <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={placeholder}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
            />
            {query && (
                <button
                    onClick={handleClear}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    aria-label="Очистить поиск"
                >
                    <FiX className="text-gray-400 hover:text-gray-600 transition-colors"/>
                </button>
            )}
        </div>
    );
}