"use client";

import { PrismaClient } from "@prisma/client";
import { DatabaseOperations, User, Product } from "./types";

declare global {
    var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export class PostgresDB implements DatabaseOperations {
    private static instance: PostgresDB;

    private constructor() {}

    public static getInstance(): PostgresDB {
        if (!PostgresDB.instance) {
            PostgresDB.instance = new PostgresDB();
        }
        return PostgresDB.instance;
    }

    async getUsers(): Promise<User[]> {
        return (await prisma.user.findMany()) as unknown as User[];
    }

    async getUser(id: string): Promise<User | null> {
        return (await prisma.user.findUnique({
            where: { id },
        })) as unknown as User | null;
    }

    async getUserByEmail(email: string): Promise<User | null> {
        return (await prisma.user.findUnique({
            where: { email },
        })) as unknown as User | null;
    }

    async createUser(user: Omit<User, "id" | "created_at">): Promise<User> {
        const created_at = new Date().toISOString();
        return (await prisma.user.create({
            data: {
                ...user,
                created_at,
            },
        })) as unknown as User;
    }

    async updateUser(id: string, user: Partial<User>): Promise<User> {
        return (await prisma.user.update({
            where: { id },
            data: user,
        })) as unknown as User;
    }

    async deleteUser(id: string): Promise<boolean> {
        try {
            await prisma.user.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting user:", error);
            return false;
        }
    }

    async getProducts(filters?: Partial<Product>): Promise<Product[]> {
        if (!filters) {
            return (await prisma.product.findMany()) as unknown as Product[];
        }

        const whereClause = Object.entries(filters)
            .filter(([_, value]) => value !== undefined)
            .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        return (await prisma.product.findMany({
            where: whereClause,
        })) as unknown as Product[];
    }

    async getProduct(id: string): Promise<Product | null> {
        return (await prisma.product.findUnique({
            where: { id },
        })) as Product | null;
    }

    async createProduct(
        product: Omit<Product, "id" | "created_at" | "updated_at">,
    ): Promise<Product> {
        const now = new Date().toISOString();
        return (await prisma.product.create({
            data: {
                ...product,
                created_at: now,
                updated_at: now,
            },
        })) as unknown as Product;
    }

    async updateProduct(
        id: string,
        product: Partial<Product>,
    ): Promise<Product> {
        return (await prisma.product.update({
            where: { id },
            data: product,
        })) as unknown as Product;
    }

    async deleteProduct(id: string): Promise<boolean> {
        try {
            await prisma.product.delete({
                where: { id },
            });
            return true;
        } catch (error) {
            console.error("Error deleting product:", error);
            return false;
        }
    }

    async isConnected(): Promise<boolean> {
        try {
            await prisma.$queryRaw`SELECT 1`;
            return true;
        } catch (error) {
            console.error("Database connection error:", error);
            return false;
        }
    }

    async close(): Promise<void> {
        await prisma.$disconnect();
    }
}

export default PostgresDB.getInstance();
