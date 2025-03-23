"use client";

export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    store_name?: string;
    reset_token?: string;
    reset_token_expires?: string;
    created_at: string;
    last_login?: string;
}

export interface Product {
    id: string;
    name: string;
    description?: string;
    price: number;
    stock: number;
    category?: string;
    sku?: string;
    created_at: string;
    updated_at: string;
}

export interface PostgresConfig {
    connectionString: string;
    ssl?: boolean | { rejectUnauthorized: boolean };
}

export interface HiPOSDB {
    users: {
        key: string;
        value: User;
        indexes: { "by-email": string };
    };
    products: {
        key: string;
        value: Product;
    };
}

export interface DatabaseOperations {
    getUser(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
    createUser(user: Omit<User, "id" | "created_at">): Promise<User>;
    updateUser(id: string, data: Partial<User>): Promise<User>;
    deleteUser(id: string): Promise<boolean>;

    getProduct(id: string): Promise<Product | null>;
    getProducts(filters?: Partial<Product>): Promise<Product[]>;
    createProduct(
        product: Omit<Product, "id" | "created_at" | "updated_at">,
    ): Promise<Product>;
    updateProduct(id: string, data: Partial<Product>): Promise<Product>;
    deleteProduct(id: string): Promise<boolean>;

    isConnected(): Promise<boolean>;
    close(): Promise<void>;
}

export enum StorageEnvironment {
    DESKTOP = "desktop",
    WEB = "web",
}

export function detectEnvironment(): StorageEnvironment {
    const isTauri =
        typeof window !== "undefined" &&
        (window as any)["__TAURI__"] !== undefined;

    return isTauri ? StorageEnvironment.DESKTOP : StorageEnvironment.WEB;
}

export function isUser(obj: any): obj is User {
    return (
        obj &&
        typeof obj.id === "string" &&
        typeof obj.name === "string" &&
        typeof obj.email === "string" &&
        typeof obj.password === "string" &&
        typeof obj.role === "string" &&
        typeof obj.created_at === "string"
    );
}
