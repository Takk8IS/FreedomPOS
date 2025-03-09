import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { I18nProvider } from "@/lib/i18n/context";
import { Sidebar } from "@/components/sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Freedom POS - Point of Sale System",
    description: "Modern point of sale system for businesses",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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
                            <Sidebar />
                            <div className="flex-1 md:ml-64">{children}</div>
                        </div>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
