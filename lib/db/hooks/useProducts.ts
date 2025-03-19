"use client";

import { useState, useEffect } from "react";
import { db } from "../index";

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

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        loadProducts();
    }, []);

    async function loadProducts() {
        try {
            const result = await db.query(
                `SELECT
            id,
            name,
            description,
            price,
            stock,
            category,
            sku,
            created_at,
            updated_at
        FROM products
        ORDER BY created_at DESC`,
            );
            setProducts(result.rows as Product[]);
            setLoading(false);
        } catch (err) {
            setError(err as Error);
            setLoading(false);
        }
    }

    async function addProduct(
        product: Omit<Product, "id" | "created_at" | "updated_at">,
    ) {
        try {
            const id = crypto.randomUUID();
            await db.query(
                `INSERT INTO products (id, name, description, price, stock, category, sku)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [
                    id,
                    product.name,
                    product.description,
                    product.price,
                    product.stock,
                    product.category,
                    product.sku,
                ],
            );
            await loadProducts();
            return id;
        } catch (err) {
            throw err;
        }
    }

    async function updateProduct(id: string, updates: Partial<Product>) {
        try {
            const setClause = Object.keys(updates)
                .map((key) => `${key} = ?`)
                .join(", ");
            const values = [...Object.values(updates), id];

            await db.query(
                `UPDATE products SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
                values,
            );
            await loadProducts();
        } catch (err) {
            throw err;
        }
    }

    async function deleteProduct(id: string) {
        try {
            await db.query("DELETE FROM products WHERE id = ?", [id]);
            await loadProducts();
        } catch (err) {
            throw err;
        }
    }

    return {
        products,
        loading,
        error,
        addProduct,
        updateProduct,
        deleteProduct,
        refresh: loadProducts,
    };
}
