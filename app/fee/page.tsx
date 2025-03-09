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
    Edit,
    Trash2,
    MoreVertical,
    DollarSign,
    Percent,
    Clock,
} from "lucide-react";

// Sample fees data
const fees = [
    {
        id: 1,
        name: "Standard Service Fee",
        type: "percentage",
        value: 2.5,
        description: "Standard service charge for all transactions",
        appliesTo: "all",
        status: "active",
    },
    {
        id: 2,
        name: "Delivery Fee",
        type: "fixed",
        value: 5.0,
        description: "Fixed delivery charge per order",
        appliesTo: "delivery",
        status: "active",
    },
    // Add more sample data as needed
];

export default function FeePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { t } = useI18n();

    const filteredFees = fees.filter((fee) => {
        return (
            fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t("fee.title")}</h1>
                    <p className="text-muted-foreground">{t("fee.subtitle")}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("fee.add_fee")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("fee.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("fee.filter")}
                </Button>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("fee.fee_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.name")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.type")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.value")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.description")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.applies_to")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.status")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredFees.map((fee) => (
                                    <tr
                                        key={fee.id}
                                        className="hover:bg-muted/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {fee.type === "percentage" ? (
                                                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                        <Percent className="h-4 w-4" />
                                                    </div>
                                                ) : (
                                                    <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                        <DollarSign className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <span className="font-medium">
                                                    {fee.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {t(`fee.${fee.type}`)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {fee.type === "percentage" ? (
                                                <span>{fee.value}%</span>
                                            ) : (
                                                <span>
                                                    ${fee.value.toFixed(2)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {fee.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {t(`fee.${fee.appliesTo}`)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    fee.status === "active"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                }`}
                                            >
                                                {t(`fee.${fee.status}`)}
                                            </span>
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
