"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import {
    Search,
    Plus,
    Filter,
    Download,
    Edit,
    Trash2,
    MoreVertical,
    Mail,
    Phone,
} from "lucide-react";

// Sample customers data
const customers = [
    {
        id: 1,
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "+1 (555) 123-4567",
        totalOrders: 12,
        totalSpent: 345.67,
        lastOrder: "2025-03-28T14:30:00",
    },
    {
        id: 2,
        name: "Jane Smith",
        email: "jane.smith@example.com",
        phone: "+1 (555) 234-5678",
        totalOrders: 8,
        totalSpent: 230.45,
        lastOrder: "2025-03-25T10:15:00",
    },
    {
        id: 3,
        name: "Robert Johnson",
        email: "robert.johnson@example.com",
        phone: "+1 (555) 345-6789",
        totalOrders: 15,
        totalSpent: 520.3,
        lastOrder: "2025-04-01T09:45:00",
    },
    {
        id: 4,
        name: "Emily Davis",
        email: "emily.davis@example.com",
        phone: "+1 (555) 456-7890",
        totalOrders: 5,
        totalSpent: 150.2,
        lastOrder: "2025-03-20T16:30:00",
    },
    {
        id: 5,
        name: "Michael Wilson",
        email: "michael.wilson@example.com",
        phone: "+1 (555) 567-8901",
        totalOrders: 20,
        totalSpent: 780.9,
        lastOrder: "2025-03-30T11:20:00",
    },
    {
        id: 6,
        name: "Sarah Brown",
        email: "sarah.brown@example.com",
        phone: "+1 (555) 678-9012",
        totalOrders: 10,
        totalSpent: 320.75,
        lastOrder: "2025-03-27T13:10:00",
    },
    {
        id: 7,
        name: "David Miller",
        email: "david.miller@example.com",
        phone: "+1 (555) 789-0123",
        totalOrders: 7,
        totalSpent: 190.5,
        lastOrder: "2025-03-22T15:45:00",
    },
    {
        id: 8,
        name: "Jennifer Taylor",
        email: "jennifer.taylor@example.com",
        phone: "+1 (555) 890-1234",
        totalOrders: 9,
        totalSpent: 275.6,
        lastOrder: "2025-03-26T12:30:00",
    },
    {
        id: 9,
        name: "James Anderson",
        email: "james.anderson@example.com",
        phone: "+1 (555) 901-2345",
        totalOrders: 14,
        totalSpent: 430.25,
        lastOrder: "2025-03-29T10:00:00",
    },
    {
        id: 10,
        name: "Lisa Thomas",
        email: "lisa.thomas@example.com",
        phone: "+1 (555) 012-3456",
        totalOrders: 6,
        totalSpent: 180.4,
        lastOrder: "2025-03-21T14:15:00",
    },
];

export default function CustomersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { t } = useI18n();

    const filteredCustomers = customers.filter((customer) => {
        return (
            customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone.includes(searchTerm)
        );
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("customers.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("customers.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("customers.add_customer")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("customers.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        {t("customers.filter")}
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        {t("customers.export")}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("customers.customer_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("customers.customer")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("customers.contact_info")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("customers.orders")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("customers.total_spent")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("customers.last_order")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("customers.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredCustomers.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-muted-foreground"
                                        >
                                            {t("customers.no_customers")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredCustomers.map((customer) => (
                                        <tr
                                            key={customer.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                                        {customer.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {customer.name}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {t("customers.id")}:{" "}
                                                            {customer.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {customer.email}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {customer.phone}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {customer.totalOrders}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                $
                                                {customer.totalSpent.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(
                                                    customer.lastOrder,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                    >
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
