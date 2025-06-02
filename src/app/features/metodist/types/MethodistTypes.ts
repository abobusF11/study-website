export interface Methodist {
    id: number;
    login: string;
    password?: string;
}

export interface MethodistData {
    id: number;
    login: string;
    password: string;
}

export interface UpdateMethodistRequest {
    id: number;
    login: string;
    password: string;
}

export interface AddMethodistRequest {
    login: string;
    password: string;
}

export interface User {
    login: string;
    role: 'metodist' | 'admin';
}