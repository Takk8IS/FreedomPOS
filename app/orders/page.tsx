"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/context";
import {
    Search,
    Filter,
    Calendar,
    Download,
    Printer,
    Eye,
    CheckCircle2,
    Clock,
    XCircle,
    AlertCircle,
} from "lucide-react";

// Sample orders data
const orders = [
    {
        id: "ORD-001",
        customer: "John Doe",
        date: "2025-04-01T14:30:00",
        total: 42.5,
        status: "completed",
        items: 3,
    },
    {
        id: "ORD-002",
        customer: "Jane Smith",
        date: "2025-04-01T15:45:00",
        total: 28.99,
        status: "completed",
        items: 2,
    },
    {
        id: "ORD-003",
        customer: "Robert Johnson",
        date: "2025-04-01T16:20:00",
        total: 35.75,
        status: "processing",
        items: 4,
    },
    {
        id: "ORD-004",
        customer: "Emily Davis",
        date: "2025-04-01T17:10:00",
        total: 19.99,
        status: "processing",
        items: 1,
    },
    {
        id: "ORD-005",
        customer: "Michael Wilson",
        date: "2025-04-01T18:05:00",
        total: 52.25,
        status: "cancelled",
        items: 3,
    },
    {
        id: "ORD-006",
        customer: "Sarah Brown",
        date: "2025-04-02T10:15:00",
        total: 31.5,
        status: "completed",
        items: 2,
    },
    {
        id: "ORD-007",
        customer: "David Miller",
        date: "2025-04-02T11:30:00",
        total: 45.0,
        status: "processing",
        items: 5,
    },
    {
        id: "ORD-008",
        customer: "Jennifer Taylor",
        date: "2025-04-02T12:45:00",
        total: 22.75,
        status: "pending",
        items: 2,
    },
    {
        id: "ORD-009",
        customer: "James Anderson",
        date: "2025-04-02T13:20:00",
        total: 38.99,
        status: "completed",
        items: 3,
    },
    {
        id: "ORD-010",
        customer: "Lisa Thomas",
        date: "2025-04-02T14:10:00",
        total: 27.5,
        status: "pending",
        items: 2,
    },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        case "processing":
            return <Clock className="h-4 w-4 text-blue-500" />;
        case "cancelled":
            return <XCircle className="h-4 w-4 text-red-500" />;
        case "pending":
            return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        default:
            return null;
    }
};

export default function OrdersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const { t } = useI18n();

    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesTab = activeTab === "all" || order.status === activeTab;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t("orders.title")}</h1>
                    <p className="text-muted-foreground">
                        {t("orders.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        {t("orders.filter")}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {t("orders.date_range")}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t("orders.export")}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Printer className="h-4 w-4 mr-2" />
                        {t("orders.print")}
                    </Button>
                </div>
            </header>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("orders.search_placeholder")}
                        className="pl-8 w-full md:w-96"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="all">
                        {t("orders.all_orders")}
                    </TabsTrigger>
                    <TabsTrigger value="completed">
                        {t("orders.completed")}
                    </TabsTrigger>
                    <TabsTrigger value="processing">
                        {t("orders.processing")}
                    </TabsTrigger>
                    <TabsTrigger value="pending">
                        {t("orders.pending")}
                    </TabsTrigger>
                    <TabsTrigger value="cancelled">
                        {t("orders.cancelled")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <Card>
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg">
                                {t("orders.order_list")}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("orders.order_id")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("orders.customer")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("orders.date")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("orders.items")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("orders.total")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("orders.status")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("orders.actions")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredOrders.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={7}
                                                    className="px-6 py-4 text-center text-muted-foreground"
                                                >
                                                    {t("orders.no_orders")}
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredOrders.map((order) => (
                                                <tr
                                                    key={order.id}
                                                    className="hover:bg-muted/50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        {order.id}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {order.customer}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {new Date(
                                                            order.date,
                                                        ).toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {order.items}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        $
                                                        {order.total.toFixed(2)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex items-center gap-1.5">
                                                            {getStatusIcon(
                                                                order.status,
                                                            )}
                                                            <span>
                                                                {t(
                                                                    `orders.${order.status}`,
                                                                )}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="h-8 w-8"
                                                            >
                                                                <Printer className="h-4 w-4" />
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
                </TabsContent>

                {["completed", "processing", "pending", "cancelled"].map(
                    (status) => (
                        <TabsContent
                            key={status}
                            value={status}
                            className="space-y-4"
                        >
                            <Card>
                                <CardHeader className="px-6 py-4">
                                    <CardTitle className="text-lg">
                                        {t(`orders.${status}`)}{" "}
                                        {t("orders.title")}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <div className="overflow-x-auto">
                                        <table className="w-full">
                                            <thead className="bg-muted/50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {t("orders.order_id")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {t("orders.customer")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {t("orders.date")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {t("orders.items")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {t("orders.total")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {t("orders.status")}
                                                    </th>
                                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                        {t("orders.actions")}
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {filteredOrders.length === 0 ? (
                                                    <tr>
                                                        <td
                                                            colSpan={7}
                                                            className="px-6 py-4 text-center text-muted-foreground"
                                                        >
                                                            {t(
                                                                "orders.no_status_orders",
                                                            )}
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    filteredOrders.map(
                                                        (order) => (
                                                            <tr
                                                                key={order.id}
                                                                className="hover:bg-muted/50"
                                                            >
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    {order.id}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {
                                                                        order.customer
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {new Date(
                                                                        order.date,
                                                                    ).toLocaleString()}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    {
                                                                        order.items
                                                                    }
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                    $
                                                                    {order.total.toFixed(
                                                                        2,
                                                                    )}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    <div className="flex items-center gap-1.5">
                                                                        {getStatusIcon(
                                                                            order.status,
                                                                        )}
                                                                        <span>
                                                                            {t(
                                                                                `orders.${order.status}`,
                                                                            )}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    <div className="flex items-center gap-2">
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-8 w-8"
                                                                        >
                                                                            <Printer className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ),
                )}
            </Tabs>
        </div>
    );
}
