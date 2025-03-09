"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import axios from "axios";

export class XeroIntegration {
    private supabase;
    private apiUrl = "https://api.xero.com/api.xro/2.0";
    private tokenData: {
        access_token: string;
        refresh_token: string;
        expires_at: number;
    } | null = null;

    constructor() {
        this.supabase = createClientComponentClient();
    }

    async connect(credentials: { clientId: string; clientSecret: string }) {
        try {
            // Store credentials in Supabase for later use
            await this.supabase.from("integrations").upsert({
                type: "xero",
                credentials: {
                    client_id: credentials.clientId,
                    client_secret: credentials.clientSecret,
                },
                created_at: new Date().toISOString(),
            });

            // Redirect to Xero OAuth page to get authorization code
            const redirectUri = `${window.location.origin}/api/xero/callback`;
            const scope = encodeURIComponent(
                "accounting.transactions accounting.contacts accounting.settings",
            );

            window.location.href = `https://login.xero.com/identity/connect/authorize?response_type=code&client_id=${
                credentials.clientId
            }&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&state=${Math.random().toString(36).substring(2, 15)}`;

            return { success: true };
        } catch (error) {
            console.error("Xero connection error:", error);
            return { success: false, error };
        }
    }

    private async getToken() {
        // Check if we have a valid token
        if (this.tokenData && this.tokenData.expires_at > Date.now()) {
            return this.tokenData.access_token;
        }

        // Get credentials from Supabase
        const { data: integration } = await this.supabase
            .from("integrations")
            .select("*")
            .eq("type", "xero")
            .single();

        if (!integration) {
            throw new Error("Xero integration not found");
        }

        const { client_id, client_secret } = integration.credentials;

        // If we have a refresh token, use it to get a new access token
        if (this.tokenData?.refresh_token) {
            const response = await axios.post(
                "https://identity.xero.com/connect/token",
                new URLSearchParams({
                    grant_type: "refresh_token",
                    refresh_token: this.tokenData.refresh_token,
                    client_id,
                    client_secret,
                }),
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            );

            this.tokenData = {
                access_token: response.data.access_token,
                refresh_token: response.data.refresh_token,
                expires_at: Date.now() + response.data.expires_in * 1000,
            };

            return this.tokenData.access_token;
        }

        throw new Error("No valid token or refresh token available");
    }

    async syncSales(startDate: Date, endDate: Date) {
        try {
            const token = await this.getToken();

            // Format dates for Xero API (YYYY-MM-DD)
            const formattedStartDate = startDate.toISOString().split("T")[0];
            const formattedEndDate = endDate.toISOString().split("T")[0];

            // Get sales invoices from Xero
            const response = await axios.get(`${this.apiUrl}/Invoices`, {
                params: {
                    where: `Date >= DateTime(${formattedStartDate}) && Date <= DateTime(${formattedEndDate})`,
                    order: "Date DESC",
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Save the sales data to Supabase
            const salesData = response.data.Invoices.map((invoice: any) => ({
                invoice_id: invoice.InvoiceID,
                invoice_number: invoice.InvoiceNumber,
                date: invoice.Date,
                due_date: invoice.DueDate,
                status: invoice.Status,
                total: invoice.Total,
                customer_id: invoice.Contact.ContactID,
                customer_name: invoice.Contact.Name,
                line_items: invoice.LineItems,
                synced_at: new Date().toISOString(),
            }));

            await this.supabase
                .from("xero_sales")
                .upsert(salesData, { onConflict: "invoice_id" });

            return { success: true, count: salesData.length };
        } catch (error) {
            console.error("Error syncing sales:", error);
            return { success: false, error };
        }
    }

    async syncProducts() {
        try {
            const token = await this.getToken();

            // Get products (items) from Xero
            const response = await axios.get(`${this.apiUrl}/Items`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Save the product data to Supabase
            const productsData = response.data.Items.map((item: any) => ({
                item_id: item.ItemID,
                code: item.Code,
                name: item.Name,
                description: item.Description,
                purchase_price: item.PurchaseDetails?.UnitPrice || 0,
                sales_price: item.SalesDetails?.UnitPrice || 0,
                is_sold: item.IsSold,
                is_purchased: item.IsPurchased,
                inventory_tracked: item.IsTrackedAsInventory,
                synced_at: new Date().toISOString(),
            }));

            await this.supabase
                .from("xero_products")
                .upsert(productsData, { onConflict: "item_id" });

            return { success: true, count: productsData.length };
        } catch (error) {
            console.error("Error syncing products:", error);
            return { success: false, error };
        }
    }

    async syncCustomers() {
        try {
            const token = await this.getToken();

            // Get customers (contacts) from Xero
            const response = await axios.get(`${this.apiUrl}/Contacts`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            // Save the customer data to Supabase
            const customersData = response.data.Contacts.map(
                (contact: any) => ({
                    contact_id: contact.ContactID,
                    name: contact.Name,
                    first_name: contact.FirstName,
                    last_name: contact.LastName,
                    email: contact.EmailAddress,
                    phone: contact.Phones?.[0]?.PhoneNumber,
                    address: contact.Addresses?.[0] || null,
                    is_customer: contact.IsCustomer,
                    is_supplier: contact.IsSupplier,
                    synced_at: new Date().toISOString(),
                }),
            );

            await this.supabase
                .from("xero_customers")
                .upsert(customersData, { onConflict: "contact_id" });

            return { success: true, count: customersData.length };
        } catch (error) {
            console.error("Error syncing customers:", error);
            return { success: false, error };
        }
    }
}
