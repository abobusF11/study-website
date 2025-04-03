import {Group} from "@/types/GroupTypes";

export interface ProtocolCreateResponse {
    id: number;
    start_date: string;
    end_date: string;
    groups: number[];
}

export interface Protocol {
    id: number;
    start_date: string;
    end_date: string;
    groups: Group[];
}

