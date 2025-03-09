"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Search,
    Filter,
    Plus,
    Edit,
    Trash2,
    Coffee,
    Pizza,
    Utensils,
    IceCream,
    Beer,
    MoreVertical,
} from "lucide-react";

// Sample product categories
const categories = [
    { id: 1, name: "Coffee", icon: Coffee },
    { id: 2, name: "Pizza", icon: Pizza },
    { id: 3, name: "Main Dishes", icon: Utensils },
    { id: 4, name: "Desserts", icon: IceCream },
    { id: 5, name: "Drinks", icon: Beer },
];

// Sample products
const products = [
    {
        id: 1,
        name: "Espresso",
        price: 2.5,
        category: 1,
        stock: 100,
        sku: "COF-001",
    },
    {
        id: 2,
        name: "Cappuccino",
        price: 3.5,
        category: 1,
        stock: 100,
        sku: "COF-002",
    },
    {
        id: 3,
        name: "Latte",
        price: 4.0,
        category: 1,
        stock: 100,
        sku: "COF-003",
    },
    {
        id: 4,
        name: "Margherita Pizza",
        price: 12.99,
        category: 2,
        stock: 20,
        sku: "PIZ-001",
    },
    {
        id: 5,
        name: "Pepperoni Pizza",
        price: 14.99,
        category: 2,
        stock: 15,
        sku: "PIZ-002",
    },
    {
        id: 6,
        name: "Vegetarian Pizza",
        price: 13.99,
        category: 2,
        stock: 18,
        sku: "PIZ-003",
    },
    {
        id: 7,
        name: "Pasta Carbonara",
        price: 11.99,
        category: 3,
        stock: 25,
        sku: "MAIN-001",
    },
    {
        id: 8,
        name: "Grilled Chicken",
        price: 15.99,
        category: 3,
        stock: 30,
        sku: "MAIN-002",
    },
    {
        id: 9,
        name: "Chocolate Cake",
        price: 6.99,
        category: 4,
        stock: 40,
        sku: "DES-001",
    },
    {
        id: 10,
        name: "Ice Cream",
        price: 4.99,
        category: 4,
        stock: 50,
        sku: "DES-002",
    },
    {
        id: 11,
        name: "Soda",
        price: 2.99,
        category: 5,
        stock: 200,
        sku: "DRK-001",
    },
    {
        id: 12,
        name: "Beer",
        price: 5.99,
        category: 5,
        stock: 150,
        sku: "DRK-002",
    },
];

export default function ProductsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<number | "all">("all");

    const filteredProducts = products.filter((product) => {
        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory =
            activeCategory === "all" || product.category === activeCategory;

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Products</h1>
                    <p className="text-muted-foreground">
                        Manage your product inventory
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Product
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Search products by name or SKU..."
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

            <Tabs
                defaultValue="all"
                onValueChange={(value) =>
                    setActiveCategory(value === "all" ? "all" : parseInt(value))
                }
            >
                <TabsList className="mb-4">
                    <TabsTrigger value="all">All Products</TabsTrigger>
                    {categories.map((category) => (
                        <TabsTrigger
                            key={category.id}
                            value={category.id.toString()}
                        >
                            <category.icon className="h-4 w-4 mr-2" />
                            {category.name}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="all" className="space-y-4">
                    <Card>
                        <CardHeader className="px-6 py-4">
                            <CardTitle className="text-lg">
                                Product List
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-muted/50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                SKU
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border">
                                        {filteredProducts.length === 0 ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-4 text-center text-muted-foreground"
                                                >
                                                    No products found
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredProducts.map((product) => {
                                                const category =
                                                    categories.find(
                                                        (c) =>
                                                            c.id ===
                                                            product.category,
                                                    );
                                                const Icon =
                                                    category?.icon || Coffee;

                                                return (
                                                    <tr
                                                        key={product.id}
                                                        className="hover:bg-muted/50"
                                                    >
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            {product.sku}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                                                                    <Icon className="h-4 w-4" />
                                                                </div>
                                                                <span>
                                                                    {
                                                                        product.name
                                                                    }
                                                                </span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {category?.name}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                            $
                                                            {product.price.toFixed(
                                                                2,
                                                            )}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            {product.stock}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {categories.map((category) => (
                    <TabsContent
                        key={category.id}
                        value={category.id.toString()}
                        className="space-y-4"
                    >
                        <Card>
                            <CardHeader className="px-6 py-4">
                                <CardTitle className="text-lg">
                                    {category.name} Products
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-muted/50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    SKU
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Product
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Price
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Stock
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {filteredProducts.length === 0 ? (
                                                <tr>
                                                    <td
                                                        colSpan={5}
                                                        className="px-6 py-4 text-center text-muted-foreground"
                                                    >
                                                        No{" "}
                                                        {category.name.toLowerCase()}{" "}
                                                        products found
                                                    </td>
                                                </tr>
                                            ) : (
                                                filteredProducts.map(
                                                    (product) => (
                                                        <tr
                                                            key={product.id}
                                                            className="hover:bg-muted/50"
                                                        >
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                {product.sku}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                                                                        <category.icon className="h-4 w-4" />
                                                                    </div>
                                                                    <span>
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                                $
                                                                {product.price.toFixed(
                                                                    2,
                                                                )}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                {product.stock}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
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
                                                    ),
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    );
}
