"use client";

import db from "@/lib/db";

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    storeName?: string;
}

export class AuthService {
    private static instance: AuthService;

    private constructor() {}

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }

    public getCurrentUser(): User | null {
        if (typeof window === "undefined") return null;

        const userStr = localStorage.getItem("user");
        if (!userStr) return null;

        try {
            return JSON.parse(userStr);
        } catch {
            return null;
        }
    }

    public isAuthenticated(): boolean {
        return !!this.getCurrentUser();
    }

    public getRole(): string | null {
        const user = this.getCurrentUser();
        return user?.role || null;
    }

    public async hasPermission(): Promise<boolean> {
        const user = this.getCurrentUser();
        if (!user) return false;

        return user.role === "admin";
    }

    public async validateSession(): Promise<boolean> {
        const user = this.getCurrentUser();
        if (!user) return false;
        try {
            const result: any = await db.query(
                "SELECT id FROM users WHERE id = ? AND email = ?",
                [user.id, user.email],
            );

            return result.rows.length > 0;
        } catch {
            return false;
        }
    }

    public async logout(): Promise<void> {
        localStorage.removeItem("user");
    }
}

export const auth = AuthService.getInstance();
