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
    Eye,
    Download,
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
} from "lucide-react";

// Sample procurement data
const procurements = [
    {
        id: "PO-001",
        provider: "Global Coffee Suppliers",
        date: "2025-04-01T14:30:00",
        total: 2500.0,
        items: 5,
        status: "completed",
        paymentStatus: "paid",
        deliveryDate: "2025-04-05T10:00:00",
    },
    {
        id: "PO-002",
        provider: "Tea Masters Co.",
        date: "2025-04-02T09:15:00",
        total: 1800.0,
        items: 3,
        status: "pending",
        paymentStatus: "unpaid",
        deliveryDate: "2025-04-07T14:00:00",
    },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        case "pending":
            return <Clock className="h-4 w-4 text-yellow-500" />;
        case "cancelled":
            return <XCircle className="h-4 w-4 text-red-500" />;
        default:
            return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
};

export default function ProcurementsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { t } = useI18n();

    const filteredProcurements = procurements.filter((procurement) => {
        return (
            procurement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            procurement.provider
                .toLowerCase()
                .includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("procurements.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("procurements.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("procurements.new_purchase_order")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("procurements.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">
                        <Filter className="h-4 w-4 mr-2" />
                        {t("procurements.filter")}
                    </Button>
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        {t("procurements.export")}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("procurements.purchase_orders")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.po_number")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.provider")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.date")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.items")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.total")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.status")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.payment")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.delivery")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProcurements.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-6 py-4 text-center text-muted-foreground"
                                        >
                                            {t("procurements.no_orders")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProcurements.map((procurement) => (
                                        <tr
                                            key={procurement.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {procurement.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {procurement.provider}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(
                                                    procurement.date,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {procurement.items}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                ${procurement.total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    {getStatusIcon(
                                                        procurement.status,
                                                    )}
                                                    <span className="text-sm">
                                                        {t(
                                                            `procurements.${procurement.status}`,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        procurement.paymentStatus ===
                                                        "paid"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                    }`}
                                                >
                                                    {t(
                                                        `procurements.${procurement.paymentStatus}`,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(
                                                    procurement.deliveryDate,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
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
                                                        <Download className="h-4 w-4" />
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
