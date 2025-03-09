"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BarcodeGenerator } from "@/components/barcode-generator";
import { useI18n } from "@/lib/i18n/context";
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    MoreVertical,
    AlertTriangle,
    ArrowUpDown,
    Package,
    Barcode,
} from "lucide-react";

// Sample inventory data
const inventory = [
    {
        id: 1,
        sku: "COF-001",
        name: "Coffee Beans - Arabica",
        quantity: 150,
        minStock: 50,
        maxStock: 300,
        location: "Shelf A1",
        lastUpdated: "2025-04-01T14:30:00",
        barcode: "123456789012",
    },
    {
        id: 2,
        sku: "TEA-001",
        name: "Green Tea Leaves",
        quantity: 80,
        minStock: 30,
        maxStock: 200,
        location: "Shelf B2",
        lastUpdated: "2025-04-01T12:15:00",
        barcode: "223456789012",
    },
];

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { t } = useI18n();

    const filteredInventory = inventory.filter((item) => {
        return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("inventory.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("inventory.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("inventory.add_item")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("inventory.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("inventory.filter")}
                </Button>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("inventory.inventory_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.sku")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.product")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.quantity")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.stock_levels")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.location")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.last_updated")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredInventory.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-4 text-center text-muted-foreground"
                                        >
                                            {t("inventory.no_items")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => {
                                        const isLowStock =
                                            item.quantity <= item.minStock;
                                        const isOverStock =
                                            item.quantity >= item.maxStock;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {item.sku}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                                                            <Package className="h-4 w-4" />
                                                        </div>
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {isLowStock && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                {t(
                                                                    "inventory.low_stock",
                                                                )}
                                                            </span>
                                                        )}
                                                        {isOverStock && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                                <ArrowUpDown className="h-3 w-3 mr-1" />
                                                                {t(
                                                                    "inventory.over_stock",
                                                                )}
                                                            </span>
                                                        )}
                                                        {!isLowStock &&
                                                            !isOverStock && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                    {t(
                                                                        "inventory.optimal",
                                                                    )}
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {item.location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {new Date(
                                                        item.lastUpdated,
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Dialog>
                                                            <DialogTrigger
                                                                asChild
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-8 w-8"
                                                                >
                                                                    <Barcode className="h-4 w-4" />
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent>
                                                                <DialogHeader>
                                                                    <DialogTitle>
                                                                        {t(
                                                                            "inventory.product_barcode",
                                                                        )}
                                                                    </DialogTitle>
                                                                    <DialogDescription>
                                                                        {t(
                                                                            "inventory.barcode_description",
                                                                        )}
                                                                    </DialogDescription>
                                                                </DialogHeader>
                                                                <div className="py-4">
                                                                    <BarcodeGenerator
                                                                        value={
                                                                            item.barcode
                                                                        }
                                                                        text={`${item.sku} - ${item.name}`}
                                                                    />
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
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
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
