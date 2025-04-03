"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";

interface User {
    id: number;
    login: string;
}

export default function Dashboard() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        api.get<User>("/auth/me")
            .then((res) => setUser(res.data))
            .catch(() => alert("Требуется авторизация!"));
    }, []);

    return (
        <div>
            <h1>Dashboard</h1>
            {user && <p>Email: {user.login}</p>}
        </div>
    );
}