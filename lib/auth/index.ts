"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    storeName?: string;
}

export class AuthService {
    private static instance: AuthService;
    private supabase;

    private constructor() {
        this.supabase = createClientComponentClient();
    }

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
        try {
            const { data } = await this.supabase.auth.getSession();
            return !!data.session;
        } catch {
            return false;
        }
    }

    public async logout(): Promise<void> {
        await this.supabase.auth.signOut();
        localStorage.removeItem("user");
    }
}

export const auth = AuthService.getInstance();
