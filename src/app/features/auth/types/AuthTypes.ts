export interface LoginCredentials {
    login?: string;
    password?: string;
    formData?: FormData;
}

interface User {
    id: number;
    login: string;
    role: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}