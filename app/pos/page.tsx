"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/context";
import {
    Search,
    Plus,
    Minus,
    Trash2,
    CreditCard,
    Coffee,
    Pizza,
    Utensils,
    IceCream,
    Beer,
} from "lucide-react";

// Sample product categories
const categories = [
    { id: 1, name: "coffee", icon: Coffee },
    { id: 2, name: "pizza", icon: Pizza },
    { id: 3, name: "main_dishes", icon: Utensils },
    { id: 4, name: "desserts", icon: IceCream },
    { id: 5, name: "drinks", icon: Beer },
];

// Sample products
const products = [
    { id: 1, name: "Espresso", price: 2.5, category: 1 },
    { id: 2, name: "Cappuccino", price: 3.5, category: 1 },
    { id: 3, name: "Latte", price: 4.0, category: 1 },
    { id: 4, name: "Margherita Pizza", price: 12.99, category: 2 },
    { id: 5, name: "Pepperoni Pizza", price: 14.99, category: 2 },
    { id: 6, name: "Vegetarian Pizza", price: 13.99, category: 2 },
    { id: 7, name: "Pasta Carbonara", price: 11.99, category: 3 },
    { id: 8, name: "Grilled Chicken", price: 15.99, category: 3 },
    { id: 9, name: "Chocolate Cake", price: 6.99, category: 4 },
    { id: 10, name: "Ice Cream", price: 4.99, category: 4 },
    { id: 11, name: "Soda", price: 2.99, category: 5 },
    { id: 12, name: "Beer", price: 5.99, category: 5 },
];

type CartItem = {
    id: number;
    name: string;
    price: number;
    quantity: number;
};

export default function POSPage() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeCategory, setActiveCategory] = useState<number | "all">("all");
    const { t } = useI18n();

    const addToCart = (product: {
        id: number;
        name: string;
        price: number;
    }) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find(
                (item) => item.id === product.id,
            );
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item,
                );
            } else {
                return [...prevCart, { ...product, quantity: 1 }];
            }
        });
    };

    const removeFromCart = (id: number) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === id);
            if (existingItem && existingItem.quantity > 1) {
                return prevCart.map((item) =>
                    item.id === id
                        ? { ...item, quantity: item.quantity - 1 }
                        : item,
                );
            } else {
                return prevCart.filter((item) => item.id !== id);
            }
        });
    };

    const clearCart = () => {
        setCart([]);
    };

    const filteredProducts = products.filter((product) => {
        const matchesSearch = product.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase());
        const matchesCategory =
            activeCategory === "all" || product.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
    );
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t("pos.title")}</h1>
                    <p className="text-muted-foreground">{t("pos.subtitle")}</p>
                </div>
            </header>
            <div className="mb-6 flex flex-col md:flex-row gap-4">
                {/* Products Section */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder={t("pos.search_products")}
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <Tabs
                        defaultValue="all"
                        className="flex-1 flex flex-col overflow-hidden"
                    >
                        <TabsList className="grid grid-flow-col auto-cols-max gap-2 overflow-x-auto justify-start pb-2">
                            <TabsTrigger
                                value="all"
                                onClick={() => setActiveCategory("all")}
                                className="px-3 py-1.5"
                            >
                                {t("pos.categories.all")}
                            </TabsTrigger>
                            {categories.map((category) => (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id.toString()}
                                    onClick={() =>
                                        setActiveCategory(category.id)
                                    }
                                    className="px-3 py-1.5 flex items-center gap-1"
                                >
                                    <category.icon className="h-4 w-4" />
                                    {t(`pos.categories.${category.name}`)}
                                </TabsTrigger>
                            ))}
                        </TabsList>

                        <TabsContent
                            value="all"
                            className="flex-1 overflow-y-auto mt-2"
                        >
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {filteredProducts.map((product) => (
                                    <Card
                                        key={product.id}
                                        className="cursor-pointer hover:bg-accent transition-colors"
                                        onClick={() => addToCart(product)}
                                    >
                                        <CardContent className="p-4">
                                            <div className="text-center">
                                                <div className="h-12 w-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                                                    {(() => {
                                                        const category =
                                                            categories.find(
                                                                (c) =>
                                                                    c.id ===
                                                                    product.category,
                                                            );
                                                        const Icon =
                                                            category?.icon ||
                                                            Coffee;
                                                        return (
                                                            <Icon className="h-6 w-6" />
                                                        );
                                                    })()}
                                                </div>
                                                <h3 className="font-medium">
                                                    {product.name}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {categories.map((category) => (
                            <TabsContent
                                key={category.id}
                                value={category.id.toString()}
                                className="flex-1 overflow-y-auto mt-2"
                            >
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {products
                                        .filter(
                                            (product) =>
                                                product.category ===
                                                category.id,
                                        )
                                        .map((product) => (
                                            <Card
                                                key={product.id}
                                                className="cursor-pointer hover:bg-accent transition-colors"
                                                onClick={() =>
                                                    addToCart(product)
                                                }
                                            >
                                                <CardContent className="p-4">
                                                    <div className="text-center">
                                                        <div className="h-12 w-12 mx-auto mb-2 bg-muted rounded-full flex items-center justify-center">
                                                            <category.icon className="h-6 w-6" />
                                                        </div>
                                                        <h3 className="font-medium">
                                                            {product.name}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground">
                                                            $
                                                            {product.price.toFixed(
                                                                2,
                                                            )}
                                                        </p>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            </TabsContent>
                        ))}
                    </Tabs>
                </div>

                {/* Cart Section */}
                <div className="w-full max-w-md flex flex-col bg-card border rounded-lg overflow-hidden">
                    <CardHeader className="px-4 py-3 border-b">
                        <CardTitle className="text-lg">
                            {t("pos.current_order")}
                        </CardTitle>
                    </CardHeader>

                    <div className="flex-1 overflow-y-auto p-4">
                        {cart.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-muted-foreground">
                                <p>{t("pos.no_items")}</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between"
                                    >
                                        <div className="flex-1">
                                            <p className="font-medium">
                                                {item.name}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                ${item.price.toFixed(2)} x{" "}
                                                {item.quantity}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() =>
                                                    removeFromCart(item.id)
                                                }
                                            >
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                            <span className="w-8 text-center">
                                                {item.quantity}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="h-8 w-8"
                                                onClick={() => addToCart(item)}
                                            >
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-destructive"
                                                onClick={() =>
                                                    setCart(
                                                        cart.filter(
                                                            (i) =>
                                                                i.id !==
                                                                item.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="border-t p-4">
                        <div className="space-y-1.5 mb-4">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    {t("pos.subtotal")}
                                </span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">
                                    {t("pos.tax_amount")}
                                </span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-1.5">
                                <span>{t("pos.total")}</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <Button
                                variant="outline"
                                onClick={clearCart}
                                disabled={cart.length === 0}
                            >
                                {t("pos.clear_cart")}
                            </Button>
                            <Button disabled={cart.length === 0}>
                                <CreditCard className="mr-2 h-4 w-4" />
                                {t("pos.pay")}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
