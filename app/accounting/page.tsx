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
    Download,
    Eye,
    Calendar,
    DollarSign,
    TrendingUp,
    TrendingDown,
    CreditCard,
    Receipt,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    AlertCircle,
} from "lucide-react";

// Sample transactions data
const transactions = [
    {
        id: "TRX-001",
        date: "2025-04-01T14:30:00",
        description: "Sales Revenue",
        type: "income",
        amount: 1250.0,
        category: "Sales",
        reference: "INV-2025-001",
    },
    {
        id: "TRX-002",
        date: "2025-04-01T15:45:00",
        description: "Supplier Payment",
        type: "expense",
        amount: 750.0,
        category: "Inventory",
        reference: "PO-2025-001",
    },
];

export default function AccountingPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeTab, setActiveTab] = useState("all");
    const { t } = useI18n();

    const filteredTransactions = transactions.filter((transaction) => {
        const matchesSearch =
            transaction.description
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            transaction.reference
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        const matchesTab =
            activeTab === "all" || transaction.type === activeTab;

        return matchesSearch && matchesTab;
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("accounting.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("accounting.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                        <Calendar className="h-4 w-4 mr-2" />
                        {t("accounting.date_range")}
                    </Button>
                    <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        {t("accounting.export")}
                    </Button>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("accounting.total_revenue")}
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345.67</div>
                        <div className="flex items-center pt-1 text-xs text-green-500">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+12.5% {t("common.from_last_month")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("accounting.total_expenses")}
                        </CardTitle>
                        <Receipt className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$8,765.43</div>
                        <div className="flex items-center pt-1 text-xs text-red-500">
                            <TrendingDown className="h-3.5 w-3.5 mr-1" />
                            <span>-2.3% {t("common.from_last_month")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("accounting.net_profit")}
                        </CardTitle>
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$3,580.24</div>
                        <div className="flex items-center pt-1 text-xs text-green-500">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+8.4% {t("common.from_last_month")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("accounting.pending_payments")}
                        </CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,234.56</div>
                        <div className="flex items-center pt-1 text-xs text-yellow-500">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            <span>5 {t("accounting.payments_pending")}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("accounting.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("accounting.filter")}
                </Button>
            </div>

            <Tabs defaultValue="all" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="all">
                        {t("accounting.all_transactions")}
                    </TabsTrigger>
                    <TabsTrigger value="income">
                        {t("accounting.income")}
                    </TabsTrigger>
                    <TabsTrigger value="expense">
                        {t("accounting.expense")}
                    </TabsTrigger>
                </TabsList>

                <Card>
                    <CardHeader className="px-6 py-4">
                        <CardTitle className="text-lg">
                            {t("accounting.transaction_history")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("accounting.date")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("accounting.description")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("accounting.category")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("accounting.reference")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("accounting.amount")}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                            {t("accounting.actions")}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {filteredTransactions.length === 0 ? (
                                        <tr>
                                            <td
                                                colSpan={6}
                                                className="px-6 py-4 text-center text-muted-foreground"
                                            >
                                                {t(
                                                    "accounting.no_transactions",
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredTransactions.map(
                                            (transaction) => (
                                                <tr
                                                    key={transaction.id}
                                                    className="hover:bg-muted/50"
                                                >
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {new Date(
                                                            transaction.date,
                                                        ).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        <div className="flex items-center gap-2">
                                                            {transaction.type ===
                                                            "income" ? (
                                                                <ArrowUpRight className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <ArrowDownRight className="h-4 w-4 text-red-500" />
                                                            )}
                                                            {
                                                                transaction.description
                                                            }
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {transaction.category}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                        {transaction.reference}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <span
                                                            className={
                                                                transaction.type ===
                                                                "income"
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }
                                                        >
                                                            {transaction.type ===
                                                            "income"
                                                                ? "+"
                                                                : "-"}
                                                            $
                                                            {transaction.amount.toFixed(
                                                                2,
                                                            )}
                                                        </span>
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
            </Tabs>
        </div>
    );
}
