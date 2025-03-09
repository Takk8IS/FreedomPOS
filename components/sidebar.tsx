"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useI18n } from "@/lib/i18n/context";
import {
    LayoutDashboard,
    ShoppingCart,
    Package,
    Users,
    Settings,
    CreditCard,
    BarChart3,
    Menu,
    X,
    Boxes,
    Truck,
    ShoppingBag,
    Calculator,
    DollarSign,
    Puzzle,
} from "lucide-react";

const menuItems = [
    {
        key: "dashboard",
        href: "/",
        icon: LayoutDashboard,
    },
    {
        key: "pos",
        href: "/pos",
        icon: CreditCard,
    },
    {
        key: "orders",
        href: "/orders",
        icon: ShoppingCart,
    },
    {
        key: "inventory",
        href: "/inventory",
        icon: Boxes,
    },
    {
        key: "providers",
        href: "/providers",
        icon: Truck,
    },
    {
        key: "procurements",
        href: "/procurements",
        icon: ShoppingBag,
    },
    {
        key: "customers",
        href: "/customers",
        icon: Users,
    },
    {
        key: "reports",
        href: "/reports",
        icon: BarChart3,
    },
    {
        key: "accounting",
        href: "/accounting",
        icon: Calculator,
    },
    {
        key: "fee",
        href: "/fee",
        icon: DollarSign,
    },
    {
        key: "modules",
        href: "/modules",
        icon: Puzzle,
    },
    {
        key: "settings",
        href: "/settings",
        icon: Settings,
    },
];

export function Sidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const { t } = useI18n();

    return (
        <>
            {/* Mobile menu button */}
            <Button
                variant="outline"
                size="icon"
                className="md:hidden fixed top-4 left-4 z-50"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? (
                    <X className="h-5 w-5" />
                ) : (
                    <Menu className="h-5 w-5" />
                )}
            </Button>

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-40 w-64 bg-background border-r transform transition-transform duration-200 ease-in-out md:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full",
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <h1 className="text-1xl font-bold">Freedom POS</h1>
                        <LanguageSwitcher />
                    </div>
                    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                        {menuItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted",
                                    )}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <item.icon className="h-5 w-5" />
                                    {t(`menu.${item.key}`)}
                                </Link>
                            );
                        })}
                    </nav>
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                                A
                            </div>
                            <div>
                                <p className="text-sm font-medium">
                                    {t("common.admin_user")}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    admin@freedompos.com
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
