"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KitchenOrderDisplay } from "@/components/kitchen-order-display";
import {
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Coffee,
    UtensilsCrossed,
    Beer,
    Pizza,
    IceCream,
} from "lucide-react";

// Sample orders data
const orders = [
    {
        id: "KO-001",
        tableNumber: "12",
        orderNumber: "ORD-2025-001",
        status: "pending",
        items: [
            {
                id: 1,
                name: "Margherita Pizza",
                quantity: 2,
                notes: "Extra cheese",
                status: "pending",
            },
            {
                id: 2,
                name: "Caesar Salad",
                quantity: 1,
                notes: "No croutons",
                status: "pending",
            },
        ],
        orderTime: "2025-04-01T14:30:00",
        priority: "normal",
    },
    {
        id: "KO-002",
        tableNumber: "15",
        orderNumber: "ORD-2025-002",
        status: "in-progress",
        items: [
            {
                id: 3,
                name: "Grilled Chicken",
                quantity: 1,
                notes: "Well done",
                status: "in-progress",
            },
            {
                id: 4,
                name: "French Fries",
                quantity: 2,
                notes: "Extra crispy",
                status: "completed",
            },
        ],
        orderTime: "2025-04-01T14:35:00",
        priority: "high",
    },
];

const categories = [
    { id: "all", name: "All Orders", icon: UtensilsCrossed },
    { id: "kitchen", name: "Kitchen", icon: Coffee },
    { id: "bar", name: "Bar", icon: Beer },
    { id: "pizza", name: "Pizza", icon: Pizza },
    { id: "dessert", name: "Desserts", icon: IceCream },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        case "in-progress":
            return <Clock className="h-4 w-4 text-blue-500" />;
        case "cancelled":
            return <XCircle className="h-4 w-4 text-red-500" />;
        case "pending":
            return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        default:
            return null;
    }
};

export default function KitchenPage() {
    const [activeCategory, setActiveCategory] = useState("all");

    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">Kitchen Display</h1>
                <p className="text-muted-foreground">
                    Manage and track kitchen orders
                </p>
            </header>

            <Tabs defaultValue="all" onValueChange={setActiveCategory}>
                <TabsList className="mb-4">
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category.id}
                            value={category.id}
                            className="flex items-center gap-2"
                        >
                            <category.icon className="h-4 w-4" />
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {orders.map((order) => (
                        <KitchenOrderDisplay key={order.id} order={order} />
                    ))}
                </div>
            </Tabs>
        </div>
    );
}
