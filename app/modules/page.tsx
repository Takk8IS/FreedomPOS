"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
    Search,
    Filter,
    Download,
    Puzzle,
    ShoppingCart,
    Users,
    Package,
    BarChart3,
    Settings,
    CreditCard,
    Clock,
    Shield,
} from "lucide-react";

// Sample modules data
const modules = [
    {
        id: 1,
        name: "Point of Sale",
        icon: CreditCard,
        description: "Process sales and manage transactions",
        status: "active",
        version: "1.2.0",
        lastUpdated: "2025-04-01T14:30:00",
    },
    {
        id: 2,
        name: "Inventory Management",
        icon: Package,
        description: "Track and manage product inventory",
        status: "active",
        version: "1.1.5",
        lastUpdated: "2025-03-28T10:15:00",
    },
    {
        id: 3,
        name: "Customer Management",
        icon: Users,
        description: "Manage customer information and relationships",
        status: "active",
        version: "1.0.8",
        lastUpdated: "2025-03-25T16:45:00",
    },
    {
        id: 4,
        name: "Reports & Analytics",
        icon: BarChart3,
        description: "Generate reports and analyze business data",
        status: "active",
        version: "1.3.2",
        lastUpdated: "2025-04-02T09:30:00",
    },
    {
        id: 5,
        name: "Order Management",
        icon: ShoppingCart,
        description: "Track and process customer orders",
        status: "active",
        version: "1.1.0",
        lastUpdated: "2025-03-30T11:20:00",
    },
];

export default function ModulesPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredModules = modules.filter((module) => {
        return (
            module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            module.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Modules</h1>
                    <p className="text-muted-foreground">
                        Manage system modules and features
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Check Updates
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search modules..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredModules.map((module) => (
                    <Card key={module.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {module.name}
                            </CardTitle>
                            <module.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-sm text-muted-foreground">
                                    {module.description}
                                </p>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Version
                                        </p>
                                        <p className="text-sm font-medium">
                                            {module.version}
                                        </p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-muted-foreground">
                                            Last Updated
                                        </p>
                                        <p className="text-sm font-medium">
                                            {new Date(
                                                module.lastUpdated,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <div className="flex items-center gap-2">
                                        <Shield className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">
                                            Licensed
                                        </span>
                                    </div>
                                    <Switch
                                        checked={module.status === "active"}
                                        onCheckedChange={() => {}}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
