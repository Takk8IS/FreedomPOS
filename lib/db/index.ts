"use client";

import { openDB, DBSchema, IDBPDatabase } from "idb";
import { DatabaseOperations, User, Product, IWhereCondition } from "./types";
import { PostgresDB } from "./postgres";

export interface HiPOSDB extends DBSchema {
    users: {
        key: string;
        value: User;
        indexes: { "by-email": string };
    };
    products: {
        key: string;
        value: Product;
        indexes: {};
    };
}

export enum StorageEnvironment {
    DESKTOP = "desktop",
    WEB = "web",
}

function detectEnvironment(): StorageEnvironment {
    if (
        typeof window !== "undefined" &&
        (window.__TAURI__ || process.env.TAURI_BUILD === "true")
    ) {
        return StorageEnvironment.DESKTOP;
    }

    if (process.env.NEXT_PUBLIC_USE_POSTGRES === "true") {
        return StorageEnvironment.WEB;
    }

    if (typeof window === "undefined") {
        return StorageEnvironment.WEB;
    }

    return StorageEnvironment.DESKTOP;
}

export class Database implements DatabaseOperations {
    private db: IDBPDatabase<HiPOSDB> | null = null;
    private static instance: Database;
    private storageType: StorageEnvironment;
    private postgresDB: PostgresDB | null = null;
    private initialized = false;

    private constructor() {
        this.storageType = detectEnvironment();
        if (this.storageType === StorageEnvironment.WEB) {
            this.postgresDB = PostgresDB.getInstance();
        }
    }

    static getInstance(): Database {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }

    private async ensureInitialized(): Promise<void> {
        if (!this.initialized) {
            await this.init();
        }
    }

    async init(): Promise<void> {
        try {
            if (this.initialized) return;

            if (this.storageType === StorageEnvironment.DESKTOP) {
                this.db = await openDB<HiPOSDB>("hipos", 2, {
                    upgrade(db, oldVersion) {
                        if (oldVersion < 1) {
                            const userStore = db.createObjectStore("users", {
                                keyPath: "id",
                            });
                            userStore.createIndex("by-email", "email", {
                                unique: true,
                            });
                        }
                        if (oldVersion < 2) {
                            db.createObjectStore("products", { keyPath: "id" });
                        }
                    },
                });
            } else {
                if (!this.postgresDB) {
                    this.postgresDB = PostgresDB.getInstance();
                }
                await this.postgresDB.init();
            }

            this.initialized = true;
        } catch (error) {
            console.error("Failed to initialize database:", error);
            throw new Error(
                `Database initialization failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async select<T extends keyof HiPOSDB>(
        table: T,
    ): Promise<HiPOSDB[T]["value"][]> {
        try {
            await this.ensureInitialized();

            if (this.storageType === StorageEnvironment.DESKTOP) {
                if (!this.db) throw new Error("IndexedDB not initialized");
                return await this.db.getAll(table);
            } else {
                if (!this.postgresDB)
                    throw new Error("PostgresDB not initialized");
                return await this.postgresDB.select(table);
            }
        } catch (error) {
            console.error(`Failed to select from ${String(table)}:`, error);
            throw new Error(
                `SELECT operation failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async selectWhere<T extends keyof HiPOSDB>(
        table: T,
        where: IWhereCondition,
    ): Promise<HiPOSDB[T]["value"][]> {
        try {
            await this.ensureInitialized();

            if (this.storageType === StorageEnvironment.DESKTOP) {
                if (!this.db) throw new Error("IndexedDB not initialized");

                if (where.field === "id") {
                    const record = await this.db.get(table, where.value);
                    return record ? [record] : [];
                } else if (table === "users" && where.field === "email") {
                    return (await this.db.getAllFromIndex(
                        table,
                        "by-email",
                        where.value,
                    )) as HiPOSDB[T]["value"][];
                } else {
                    const allRecords = await this.db.getAll(table);
                    return allRecords.filter(
                        (record) =>
                            (record as any)[where.field] === where.value,
                    );
                }
            } else {
                if (!this.postgresDB)
                    throw new Error("PostgresDB not initialized");
                return await this.postgresDB.selectWhere(table, where);
            }
        } catch (error) {
            console.error(
                `Failed to select from ${String(table)} with condition:`,
                error,
            );
            throw new Error(
                `SELECT WHERE operation failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async getById<T extends keyof HiPOSDB>(
        table: T,
        id: string,
    ): Promise<HiPOSDB[T]["value"] | undefined> {
        try {
            await this.ensureInitialized();

            if (this.storageType === StorageEnvironment.DESKTOP) {
                if (!this.db) throw new Error("IndexedDB not initialized");
                return await this.db.get(table, id);
            } else {
                if (!this.postgresDB)
                    throw new Error("PostgresDB not initialized");
                return await this.postgresDB.getById(table, id);
            }
        } catch (error) {
            console.error(`Failed to get ${String(table)} by ID:`, error);
            throw new Error(
                `getById operation failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async insert<T extends keyof HiPOSDB>(
        table: T,
        data: HiPOSDB[T]["value"],
    ): Promise<HiPOSDB[T]["value"]> {
        try {
            await this.ensureInitialized();

            const now = new Date().toISOString();
            const dataWithTimestamps = {
                ...data,
                created_at: now,
            };

            if (table === "products") {
                (dataWithTimestamps as any).updated_at = now;
            }

            if (this.storageType === StorageEnvironment.DESKTOP) {
                if (!this.db) throw new Error("IndexedDB not initialized");
                await this.db.put(table, dataWithTimestamps);
                return dataWithTimestamps;
            } else {
                if (!this.postgresDB)
                    throw new Error("PostgresDB not initialized");
                return await this.postgresDB.insert(table, dataWithTimestamps);
            }
        } catch (error) {
            console.error(`Failed to insert into ${String(table)}:`, error);
            throw new Error(
                `INSERT operation failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async update<T extends keyof HiPOSDB>(
        table: T,
        id: string,
        data: Partial<HiPOSDB[T]["value"]>,
    ): Promise<HiPOSDB[T]["value"]> {
        try {
            await this.ensureInitialized();

            const dataWithTimestamps = { ...data };
            if (table === "products") {
                (dataWithTimestamps as any).updated_at =
                    new Date().toISOString();
            }

            if (this.storageType === StorageEnvironment.DESKTOP) {
                if (!this.db) throw new Error("IndexedDB not initialized");

                const existingRecord = await this.db.get(table, id);
                if (!existingRecord) {
                    throw new Error(`Record with ID ${id} not found`);
                }

                const updatedRecord = {
                    ...existingRecord,
                    ...dataWithTimestamps,
                };

                await this.db.put(table, updatedRecord);
                return updatedRecord;
            } else {
                if (!this.postgresDB)
                    throw new Error("PostgresDB not initialized");
                return await this.postgresDB.update(
                    table,
                    id,
                    dataWithTimestamps,
                );
            }
        } catch (error) {
            console.error(`Failed to update ${String(table)}:`, error);
            throw new Error(
                `UPDATE operation failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async delete<T extends keyof HiPOSDB>(
        table: T,
        id: string,
    ): Promise<boolean> {
        try {
            await this.ensureInitialized();

            if (this.storageType === StorageEnvironment.DESKTOP) {
                if (!this.db) throw new Error("IndexedDB not initialized");

                const existing = await this.db.get(table, id);
                if (!existing) {
                    return false;
                }

                await this.db.delete(table, id);
                return true;
            } else {
                if (!this.postgresDB)
                    throw new Error("PostgresDB not initialized");
                return await this.postgresDB.delete(table, id);
            }
        } catch (error) {
            console.error(`Failed to delete from ${String(table)}:`, error);
            throw new Error(
                `DELETE operation failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    async close(): Promise<void> {
        try {
            if (this.storageType === StorageEnvironment.DESKTOP && this.db) {
                this.db.close();
                this.db = null;
            }

            if (
                this.storageType === StorageEnvironment.WEB &&
                this.postgresDB
            ) {
                await this.postgresDB.close();
            }

            this.initialized = false;
        } catch (error) {
            console.error("Failed to close database:", error);
            throw new Error(
                `Close operation failed: ${error instanceof Error ? error.message : String(error)}`,
            );
        }
    }

    getStorageType(): StorageEnvironment {
        return this.storageType;
    }
}

export default Database.getInstance();
