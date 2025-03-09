"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

interface QBToken {
    access_token: string;
    refresh_token: string;
    expires_at: number;
}

interface QBSale {
    id: string;
    date: string;
    amount: number;
    customer_id?: string;
    items: Array<{ id: string; quantity: number; price: number }>;
}

interface QBProduct {
    id: string;
    name: string;
    description?: string;
    price: number;
    sku?: string;
}

interface QBCustomer {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: {
        line1?: string;
        line2?: string;
        city?: string;
        state?: string;
        postal_code?: string;
        country?: string;
    };
}

export class QuickBooksIntegration {
    private supabase;
    private baseUrl = "https://quickbooks.api.intuit.com/v3/company";
    private token: QBToken | null = null;

    constructor() {
        this.supabase = createClientComponentClient();
    }

    async connect(credentials: { clientId: string; clientSecret: string }) {
        try {
            // Store credentials securely
            await this.supabase.from("integrations").upsert({
                type: "quickbooks",
                credentials: {
                    client_id: credentials.clientId,
                    client_secret: credentials.clientSecret,
                },
            });

            // Redirect to QuickBooks authorization page
            const redirectUri = `${window.location.origin}/api/quickbooks/callback`;
            const authUrl = `https://appcenter.intuit.com/connect/oauth2?client_id=${
                credentials.clientId
            }&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=com.intuit.quickbooks.accounting`;

            window.location.href = authUrl;
            return true;
        } catch (error) {
            console.error("QuickBooks connection error:", error);
            throw new Error("Failed to connect to QuickBooks");
        }
    }

    async syncSales(startDate: Date, endDate: Date) {
        try {
            await this.refreshTokenIfNeeded();

            if (!this.token) {
                throw new Error("Not authenticated with QuickBooks");
            }

            // Format dates for QuickBooks API
            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];

            // Fetch sales from QuickBooks
            const response = await axios.get(
                `${this.baseUrl}/sales?startDate=${formattedStartDate}&endDate=${formattedEndDate}`,
                {
                    headers: {
                        Authorization: `Bearer ${this.token.access_token}`,
                        "Content-Type": "application/json",
                    },
                },
            );

            const sales: QBSale[] = response.data.sales;

            // Store sales in Supabase
            await this.supabase.from("sales").upsert(
                sales.map((sale) => ({
                    external_id: sale.id,
                    source: "quickbooks",
                    date: sale.date,
                    amount: sale.amount,
                    customer_id: sale.customer_id,
                    line_items: sale.items,
                    raw_data: sale,
                })),
            );

            return sales.length;
        } catch (error) {
            console.error("QuickBooks sales sync error:", error);
            throw new Error("Failed to sync sales with QuickBooks");
        }
    }

    async syncProducts() {
        try {
            await this.refreshTokenIfNeeded();

            if (!this.token) {
                throw new Error("Not authenticated with QuickBooks");
            }

            // Fetch products from QuickBooks
            const response = await axios.get(`${this.baseUrl}/items`, {
                headers: {
                    Authorization: `Bearer ${this.token.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            const products: QBProduct[] = response.data.items;

            // Store products in Supabase
            await this.supabase.from("products").upsert(
                products.map((product) => ({
                    external_id: product.id,
                    source: "quickbooks",
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    sku: product.sku,
                    raw_data: product,
                })),
            );

            return products.length;
        } catch (error) {
            console.error("QuickBooks products sync error:", error);
            throw new Error("Failed to sync products with QuickBooks");
        }
    }

    async syncCustomers() {
        try {
            await this.refreshTokenIfNeeded();

            if (!this.token) {
                throw new Error("Not authenticated with QuickBooks");
            }

            // Fetch customers from QuickBooks
            const response = await axios.get(`${this.baseUrl}/customers`, {
                headers: {
                    Authorization: `Bearer ${this.token.access_token}`,
                    "Content-Type": "application/json",
                },
            });

            const customers: QBCustomer[] = response.data.customers;

            // Store customers in Supabase
            await this.supabase.from("customers").upsert(
                customers.map((customer) => ({
                    external_id: customer.id,
                    source: "quickbooks",
                    name: customer.name,
                    email: customer.email,
                    phone: customer.phone,
                    address: customer.address,
                    raw_data: customer,
                })),
            );

            return customers.length;
        } catch (error) {
            console.error("QuickBooks customers sync error:", error);
            throw new Error("Failed to sync customers with QuickBooks");
        }
    }

    private async refreshTokenIfNeeded() {
        // Get the current token from Supabase
        const { data } = await this.supabase
            .from("auth_tokens")
            .select("*")
            .eq("provider", "quickbooks")
            .single();

        if (!data) {
            throw new Error("No QuickBooks authentication found");
        }

        this.token = {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            expires_at: data.expires_at,
        };

        // Check if token is expired or about to expire
        const isExpired = Date.now() >= this.token.expires_at - 300000; // 5 minutes buffer

        if (isExpired) {
            // Get integration credentials
            const { data: integration } = await this.supabase
                .from("integrations")
                .select("*")
                .eq("type", "quickbooks")
                .single();

            if (!integration) {
                throw new Error("QuickBooks integration not found");
            }

            // Refresh token
            const response = await axios.post(
                "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer",
                new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: this.token.refresh_token,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Basic ${Buffer.from(
                            `${integration.credentials.client_id}:${integration.credentials.client_secret}`,
                        ).toString("base64")}`,
                    },
                },
            );

            // Update token in Supabase
            const newToken = {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_at: Date.now() + response.data.expires_in * 1000,
            };

            await this.supabase
                .from("auth_tokens")
                .update({
                    access_token: newToken.access_token,
                    refresh_token: newToken.refresh_token,
                    expires_at: newToken.expires_at,
                })
                .eq("provider", "quickbooks");

            this.token = newToken;
        }
    }
}
