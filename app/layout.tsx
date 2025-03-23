"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/context";
import { Sidebar } from "@/components/sidebar";
import { auth } from "@/lib/auth";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const publicPaths = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
];

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [showSidebar, setShowSidebar] = useState(false);

    useEffect(() => {
        setShowSidebar(!publicPaths.includes(pathname));
    }, [pathname]);

    useEffect(() => {
        const checkAuth = async () => {
            const isPublicPath = publicPaths.includes(pathname);
            const isAuthenticated = await auth.validateSession();

            if (isAuthenticated && isPublicPath) {
                router.push("/");
            } else if (!isAuthenticated && !isPublicPath) {
                router.push("/login");
            }
        };

        checkAuth();
    }, [pathname, router]);

    return (
        <html lang="en" suppressHydrationWarning>
            <body className={inter.className}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <I18nProvider>
                        <div className="flex min-h-screen">
                            {showSidebar && <Sidebar />}
                            <div
                                className={`flex-1 ${showSidebar ? "md:ml-64" : ""}`}
                            >
                                {children}
                            </div>
                        </div>
                        <Toaster />
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
