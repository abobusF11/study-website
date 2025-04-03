export interface Group {
    id: number;
    course_id: number;
    clients: Clients[];
}

export interface Clients {
    id: number;
    initials: string;
    inn: string;
}

export interface ClientCreate {
    initials: string;
    inn: string;
}

export interface GroupCreateResponse {
    id: number;
    course_id: number;
    clients: ClientCreate[];
}