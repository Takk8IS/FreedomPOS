"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    ShoppingCart,
    BarChart3,
    Settings,
    Users,
    Package,
    CreditCard,
} from "lucide-react";
import { useI18n } from "@/lib/i18n/context";
import { useState, useEffect } from "react";

export default function Home() {
    const { t } = useI18n();
    const [mounted, setMounted] = useState(false);
    const [recentSales] = useState([
        { id: 1, amount: 95.93 },
        { id: 2, amount: 84.48 },
        { id: 3, amount: 48.05 },
        { id: 4, amount: 46.09 },
        { id: 5, amount: 19.51 },
    ]);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <div className="p-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold">{t("menu.dashboard")}</h1>
                <p className="text-muted-foreground">{t("common.welcome")}</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.total_revenue")}
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345.67</div>
                        <p className="text-xs text-muted-foreground">
                            +12.5% {t("common.from_last_month")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.total_orders")}
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">245</div>
                        <p className="text-xs text-muted-foreground">
                            +18% {t("common.from_last_month")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.products")}
                        </CardTitle>
                        <Package className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">128</div>
                        <p className="text-xs text-muted-foreground">
                            +3 {t("common.new_this_month")}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("dashboard.total_customers")}
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <p className="text-xs text-muted-foreground">
                            +5.2% {t("common.from_last_month")}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7 mt-8">
                <Card className="col-span-full lg:col-span-4">
                    <CardHeader>
                        <CardTitle>{t("dashboard.recent_sales")}</CardTitle>
                        <CardDescription>
                            {t("dashboard.you_made_sales")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentSales.map((sale) => (
                                <div
                                    key={sale.id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                            {sale.id}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {t("dashboard.order")} #
                                                {1000 + sale.id}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {t("dashboard.customer")}{" "}
                                                {sale.id}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            ${sale.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            {t("common.view_all")} {t("dashboard.orders")}
                        </Button>
                    </CardFooter>
                </Card>

                <Card className="col-span-full lg:col-span-3">
                    <CardHeader>
                        <CardTitle>{t("dashboard.popular_products")}</CardTitle>
                        <CardDescription>
                            {t("dashboard.top_selling")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                {
                                    name: t("products.coffee"),
                                    sold: 20,
                                    price: 5.0,
                                },
                                {
                                    name: t("products.sandwich"),
                                    sold: 18,
                                    price: 7.0,
                                },
                                {
                                    name: t("products.salad"),
                                    sold: 16,
                                    price: 9.0,
                                },
                                {
                                    name: t("products.pizza"),
                                    sold: 14,
                                    price: 11.0,
                                },
                                {
                                    name: t("products.burger"),
                                    sold: 12,
                                    price: 13.0,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between"
                                >
                                    <div>
                                        <p className="text-sm font-medium">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.sold} {t("common.sold")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            ${item.price.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full">
                            {t("common.view_all")} {t("dashboard.products")}
                        </Button>
                    </CardFooter>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
                <Card>
                    <CardHeader>
                        <CardTitle>{t("dashboard.quick_actions")}</CardTitle>
                        <CardDescription>
                            {t("dashboard.common_tasks")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-2">
                        <Button className="w-full justify-start">
                            <CreditCard className="mr-2 h-4 w-4" />
                            {t("dashboard.new_sale")}
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <Package className="mr-2 h-4 w-4" />
                            {t("dashboard.add_product")}
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <Users className="mr-2 h-4 w-4" />
                            {t("dashboard.add_customer")}
                        </Button>
                        <Button
                            className="w-full justify-start"
                            variant="outline"
                        >
                            <Settings className="mr-2 h-4 w-4" />
                            {t("dashboard.system_settings")}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
