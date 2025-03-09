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
    Mail,
    Phone,
    Globe,
    Building2,
} from "lucide-react";

// Sample providers data
const providers = [
    {
        id: 1,
        name: "Global Coffee Suppliers",
        contact: "John Smith",
        email: "john@globalcoffee.com",
        phone: "+1 (555) 123-4567",
        website: "www.globalcoffee.com",
        address: "123 Coffee Lane, Bean City, 12345",
        status: "active",
        products: 15,
    },
    {
        id: 2,
        name: "Tea Masters Co.",
        contact: "Sarah Johnson",
        email: "sarah@teamasters.com",
        phone: "+1 (555) 234-5678",
        website: "www.teamasters.com",
        address: "456 Tea Avenue, Leaf Town, 67890",
        status: "active",
        products: 8,
    },
];

export default function ProvidersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const { t } = useI18n();

    const filteredProviders = providers.filter((provider) => {
        return (
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("providers.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("providers.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("providers.add_provider")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("providers.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("providers.filter")}
                </Button>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("providers.provider_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.provider")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.contact_info")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.address")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.status")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.products")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProviders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-muted-foreground"
                                        >
                                            {t("providers.no_providers")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProviders.map((provider) => (
                                        <tr
                                            key={provider.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                        {provider.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {provider.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {provider.contact}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {provider.email}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {provider.phone}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Globe className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {provider.website}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm">
                                                    <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                    {provider.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    {t("providers.active")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {provider.products}
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
