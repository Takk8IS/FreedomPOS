"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Download,
    Printer,
    BarChart3,
    LineChart,
    PieChart,
    TrendingUp,
    TrendingDown,
    DollarSign,
    ShoppingCart,
    Users,
    Loader2,
} from "lucide-react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LineChart as RechartsLineChart,
    Line,
    PieChart as RechartsPieChart,
    Pie,
    Cell,
} from "recharts";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/hooks/use-toast";
import { format as formatDate } from "date-fns";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { addDays } from "date-fns";

// Sample sales data
const salesData = [
    { name: "Jan", sales: 4000, orders: 240 },
    { name: "Feb", sales: 3000, orders: 198 },
    { name: "Mar", sales: 5000, orders: 280 },
    { name: "Apr", sales: 2780, orders: 190 },
    { name: "May", sales: 1890, orders: 130 },
    { name: "Jun", sales: 2390, orders: 150 },
    { name: "Jul", sales: 3490, orders: 220 },
];

// Sample product category data
const categoryData = [
    { name: "Coffee", value: 35 },
    { name: "Pizza", value: 25 },
    { name: "Main Dishes", value: 20 },
    { name: "Desserts", value: 15 },
    { name: "Drinks", value: 5 },
];

// Sample hourly sales data
const hourlySalesData = [
    { hour: "8 AM", sales: 120 },
    { hour: "9 AM", sales: 180 },
    { hour: "10 AM", sales: 250 },
    { hour: "11 AM", sales: 320 },
    { hour: "12 PM", sales: 450 },
    { hour: "1 PM", sales: 380 },
    { hour: "2 PM", sales: 290 },
    { hour: "3 PM", sales: 220 },
    { hour: "4 PM", sales: 280 },
    { hour: "5 PM", sales: 350 },
    { hour: "6 PM", sales: 420 },
    { hour: "7 PM", sales: 380 },
    { hour: "8 PM", sales: 290 },
    { hour: "9 PM", sales: 180 },
];

// Chart colors
const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

const tooltipStyle = {
    contentStyle: {
        backgroundColor: "hsl(var(--background))",
        border: "1px solid hsl(var(--border))",
        borderRadius: "var(--radius)",
    },
};

// Chart configurations
const commonAxisProps = {
    axisLine: true,
    tickLine: true,
    tick: true,
    stroke: "#666",
    fontSize: 12,
};

const xAxisProps = {
    ...commonAxisProps,
    height: 60,
    padding: { left: 20, right: 20 },
};

const yAxisProps = {
    ...commonAxisProps,
    width: 60,
};

export default function ReportsPage() {
    const [, setActiveTab] = useState("sales");
    const [loading, setLoading] = useState(false);
    const [dateRange, setDateRange] = useState({
        from: addDays(new Date(), -30),
        to: new Date(),
    });
    const { t } = useI18n();
    const { toast } = useToast();

    const handleExport = async (format: "excel" | "pdf") => {
        try {
            setLoading(true);

            const reportData = {
                sales: salesData.map((item) => ({
                    Month: item.name,
                    Sales: `$${item.sales}`,
                    Orders: item.orders,
                })),
                categories: categoryData.map((item) => ({
                    Category: item.name,
                    Value: `${item.value}%`,
                })),
                hourly: hourlySalesData.map((item) => ({
                    Hour: item.hour,
                    Sales: `$${item.sales}`,
                })),
            };

            if (format === "excel") {
                const wb = XLSX.utils.book_new();

                // Add sales worksheet
                const salesWS = XLSX.utils.json_to_sheet(reportData.sales);
                XLSX.utils.book_append_sheet(wb, salesWS, "Sales Overview");

                // Add categories worksheet
                const categoriesWS = XLSX.utils.json_to_sheet(
                    reportData.categories,
                );
                XLSX.utils.book_append_sheet(wb, categoriesWS, "Categories");

                // Add hourly sales worksheet
                const hourlyWS = XLSX.utils.json_to_sheet(reportData.hourly);
                XLSX.utils.book_append_sheet(wb, hourlyWS, "Hourly Sales");

                XLSX.writeFile(wb, "Sales_Report.xlsx");
            } else {
                const doc = new jsPDF();

                // Title
                doc.setFontSize(16);
                doc.text("Sales Report", 14, 15);
                doc.setFontSize(10);
                doc.text(
                    `Generated on ${formatDate(new Date(), "PPP")}`,
                    14,
                    22,
                );
                doc.text(
                    `Period: ${formatDate(dateRange.from, "PPP")} - ${formatDate(dateRange.to, "PPP")}`,
                    14,
                    29,
                );

                // Sales Overview
                doc.setFontSize(14);
                doc.text("Sales Overview", 14, 40);
                autoTable(doc, {
                    head: [["Month", "Sales", "Orders"]],
                    body: reportData.sales.map((row) => Object.values(row)),
                    startY: 45,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [66, 66, 66] },
                });

                // Categories
                doc.addPage();
                doc.setFontSize(14);
                doc.text("Sales by Category", 14, 15);
                autoTable(doc, {
                    head: [["Category", "Percentage"]],
                    body: reportData.categories.map((row) =>
                        Object.values(row),
                    ),
                    startY: 20,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [66, 66, 66] },
                });

                // Hourly Sales
                doc.addPage();
                doc.setFontSize(14);
                doc.text("Hourly Sales Distribution", 14, 15);
                autoTable(doc, {
                    head: [["Hour", "Sales"]],
                    body: reportData.hourly.map((row) => Object.values(row)),
                    startY: 20,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [66, 66, 66] },
                });

                doc.save("Sales_Report.pdf");
            }

            toast({
                title: "Success",
                description: `Report exported to ${format.toUpperCase()} successfully`,
            });
        } catch (error) {
            console.error("Export error:", error);
            toast({
                title: "Error",
                description: `Failed to export report to ${format.toUpperCase()}`,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t("menu.reports")}</h1>
                    <p className="text-muted-foreground">
                        {t("reports.analyze_performance")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <DatePickerWithRange
                        date={{
                            from: dateRange.from,
                            to: dateRange.to
                        }}
                        onDateChange={(newDateRange) => {
                            if (newDateRange?.from && newDateRange?.to) {
                                setDateRange({
                                    from: newDateRange.from,
                                    to: newDateRange.to
                                });
                            }
                        }}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("excel")}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4 mr-2" />
                        )}
                        Excel
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleExport("pdf")}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Download className="h-4 w-4 mr-2" />
                        )}
                        PDF
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrint}
                        disabled={loading}
                    >
                        {loading ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                            <Printer className="h-4 w-4 mr-2" />
                        )}
                        Print
                    </Button>
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("reports.total_sales")}
                        </CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$12,345.67</div>
                        <div className="flex items-center pt-1 text-xs text-green-500">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+12.5% {t("common.from_last_month")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("reports.orders")}
                        </CardTitle>
                        <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">245</div>
                        <div className="flex items-center pt-1 text-xs text-green-500">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+18% {t("common.from_last_month")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("reports.average_order")}
                        </CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$50.39</div>
                        <div className="flex items-center pt-1 text-xs text-red-500">
                            <TrendingDown className="h-3.5 w-3.5 mr-1" />
                            <span>-2.3% {t("common.from_last_month")}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            {t("reports.customers")}
                        </CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1,234</div>
                        <div className="flex items-center pt-1 text-xs text-green-500">
                            <TrendingUp className="h-3.5 w-3.5 mr-1" />
                            <span>+5.2% {t("common.from_last_month")}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="sales" onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger
                        value="sales"
                        className="flex items-center gap-2"
                    >
                        <BarChart3 className="h-4 w-4" />
                        {t("reports.sales_overview")}
                    </TabsTrigger>
                    <TabsTrigger
                        value="categories"
                        className="flex items-center gap-2"
                    >
                        <PieChart className="h-4 w-4" />
                        {t("reports.categories")}
                    </TabsTrigger>
                    <TabsTrigger
                        value="hourly"
                        className="flex items-center gap-2"
                    >
                        <LineChart className="h-4 w-4" />
                        {t("reports.hourly_sales")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="sales">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t("reports.sales_performance")}
                            </CardTitle>
                            <CardDescription>
                                {t("reports.monthly_overview")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: "100%", height: 400 }}>
                                <ResponsiveContainer>
                                    <BarChart
                                        data={salesData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" {...xAxisProps} />
                                        <YAxis
                                            yAxisId="left"
                                            orientation="left"
                                            {...yAxisProps}
                                            stroke={COLORS[0]}
                                        />
                                        <YAxis
                                            yAxisId="right"
                                            orientation="right"
                                            {...yAxisProps}
                                            stroke={COLORS[1]}
                                        />
                                        <Tooltip {...tooltipStyle} />
                                        <Legend />
                                        <Bar
                                            yAxisId="left"
                                            dataKey="sales"
                                            fill={COLORS[0]}
                                            name={t("reports.sales_amount")}
                                            radius={[4, 4, 0, 0]}
                                        />
                                        <Bar
                                            yAxisId="right"
                                            dataKey="orders"
                                            fill={COLORS[1]}
                                            name={t("reports.orders")}
                                            radius={[4, 4, 0, 0]}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                {t("reports.sales_by_category")}
                            </CardTitle>
                            <CardDescription>
                                {t("reports.category_distribution")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: "100%", height: 400 }}>
                                <ResponsiveContainer>
                                    <RechartsPieChart
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <Pie
                                            data={categoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={150}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) =>
                                                `${name} ${(percent * 100).toFixed(0)}%`
                                            }
                                        >
                                            {categoryData.map((_, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={
                                                        COLORS[
                                                            index %
                                                                COLORS.length
                                                        ]
                                                    }
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip {...tooltipStyle} />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="hourly">
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("reports.hourly_sales")}</CardTitle>
                            <CardDescription>
                                {t("reports.daily_distribution")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: "100%", height: 400 }}>
                                <ResponsiveContainer>
                                    <RechartsLineChart
                                        data={hourlySalesData}
                                        margin={{
                                            top: 20,
                                            right: 30,
                                            left: 20,
                                            bottom: 20,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="hour" {...xAxisProps} />
                                        <YAxis {...yAxisProps} />
                                        <Tooltip {...tooltipStyle} />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="sales"
                                            stroke={COLORS[2]}
                                            name={t("reports.sales_amount")}
                                            strokeWidth={2}
                                            dot={{ r: 4 }}
                                            activeDot={{ r: 6 }}
                                        />
                                    </RechartsLineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
