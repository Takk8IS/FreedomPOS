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
    Eye,
    Download,
    MoreVertical,
    Clock,
    CheckCircle2,
    XCircle,
    AlertCircle,
    Save,
    Loader2,
    Calendar,
    DollarSign,
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface PurchaseOrder {
    id: string;
    provider: string;
    date: string;
    total: number;
    items: number;
    status: string;
    paymentStatus: string;
    deliveryDate: string;
}

// Sample procurement data
const procurements = [
    {
        id: "PO-001",
        provider: "Global Coffee Suppliers",
        date: "2025-04-01T14:30:00",
        total: 2500.0,
        items: 5,
        status: "completed",
        paymentStatus: "paid",
        deliveryDate: "2025-04-05T10:00:00",
    },
    {
        id: "PO-002",
        provider: "Tea Masters Co.",
        date: "2025-04-02T09:15:00",
        total: 1800.0,
        items: 3,
        status: "pending",
        paymentStatus: "unpaid",
        deliveryDate: "2025-04-07T14:00:00",
    },
];

const getStatusIcon = (status: string) => {
    switch (status) {
        case "completed":
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        case "pending":
            return <Clock className="h-4 w-4 text-yellow-500" />;
        case "cancelled":
            return <XCircle className="h-4 w-4 text-red-500" />;
        default:
            return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
};

export default function ProcurementsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showViewDialog, setShowViewDialog] = useState(false);
    const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
    const [loading, setLoading] = useState(false);
    const [editForm, setEditForm] = useState<Partial<PurchaseOrder>>({});
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const { t } = useI18n();
    const { toast } = useToast();

    const filteredProcurements = procurements.filter((po) => {
        const matchesSearch =
            po.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            po.provider.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || po.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleView = (po: PurchaseOrder) => {
        setSelectedPO(po);
        setShowViewDialog(true);
    };

    const handleEdit = (po: PurchaseOrder) => {
        setSelectedPO(po);
        setEditForm(po);
        setShowEditDialog(true);
    };

    const handleDelete = (po: PurchaseOrder) => {
        setSelectedPO(po);
        setShowDeleteDialog(true);
    };

    const handleAdd = () => {
        setEditForm({});
        setShowAddDialog(true);
    };

    const handleExport = (format: "excel" | "pdf") => {
        try {
            const exportData = filteredProcurements.map((po) => ({
                "PO Number": po.id,
                Provider: po.provider,
                Date:
                    format === "excel"
                        ? po.date
                        : new Date(po.date).toLocaleDateString("en-US"),
                Items: po.items,
                Total: `$${po.total.toFixed(2)}`,
                Status: po.status,
                "Payment Status": po.paymentStatus,
                "Delivery Date":
                    format === "excel"
                        ? po.deliveryDate
                        : new Date(po.deliveryDate).toLocaleDateString("en-US"),
            }));

            if (format === "excel") {
                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Purchase Orders");
                XLSX.writeFile(wb, "Purchase_Orders.xlsx");
            } else {
                const doc = new jsPDF();

                doc.setFontSize(16);
                doc.text("Purchase Orders Report", 14, 15);
                doc.setFontSize(10);
                doc.text(
                    `Generated on ${new Date().toLocaleDateString("en-US")}`,
                    14,
                    22,
                );

                autoTable(doc, {
                    head: [
                        [
                            "PO Number",
                            "Provider",
                            "Date",
                            "Items",
                            "Total",
                            "Status",
                            "Payment",
                            "Delivery",
                        ],
                    ],
                    body: exportData.map((row) => Object.values(row)),
                    startY: 30,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [66, 66, 66] },
                });

                doc.save("Purchase_Orders_Report.pdf");
            }

            toast({
                title: "Success",
                description: `Report exported to ${format.toUpperCase()} successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to export report to ${format.toUpperCase()}`,
                variant: "destructive",
            });
        }
    };

    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Purchase order updated successfully",
            });

            setShowEditDialog(false);
            setSelectedPO(null);
            setEditForm({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update purchase order",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveAdd = async () => {
        try {
            setLoading(true);
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Purchase order added successfully",
            });

            setShowAddDialog(false);
            setEditForm({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add purchase order",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmDelete = async () => {
        try {
            setLoading(true);
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Purchase order deleted successfully",
            });

            setShowDeleteDialog(false);
            setSelectedPO(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete purchase order",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const PurchaseOrderForm = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Select
                        value={editForm.provider}
                        onValueChange={(value) =>
                            setEditForm((prev) => ({
                                ...prev,
                                provider: value,
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Global Coffee Suppliers">
                                Global Coffee Suppliers
                            </SelectItem>
                            <SelectItem value="Tea Masters Co.">
                                Tea Masters Co.
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="items">Number of Items</Label>
                    <Input
                        id="items"
                        type="number"
                        value={editForm.items || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                items: parseInt(e.target.value),
                            }))
                        }
                        placeholder="Enter number of items"
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="total">Total Amount</Label>
                    <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                            id="total"
                            type="number"
                            step="0.01"
                            value={editForm.total || ""}
                            onChange={(e) =>
                                setEditForm((prev) => ({
                                    ...prev,
                                    total: parseFloat(e.target.value),
                                }))
                            }
                            placeholder="Enter total amount"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="deliveryDate">Delivery Date</Label>
                    <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                            id="deliveryDate"
                            type="datetime-local"
                            value={editForm.deliveryDate?.split("T").join("T")}
                            onChange={(e) =>
                                setEditForm((prev) => ({
                                    ...prev,
                                    deliveryDate: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                        value={editForm.status}
                        onValueChange={(value) =>
                            setEditForm((prev) => ({ ...prev, status: value }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="paymentStatus">Payment Status</Label>
                    <Select
                        value={editForm.paymentStatus}
                        onValueChange={(value) =>
                            setEditForm((prev) => ({
                                ...prev,
                                paymentStatus: value,
                            }))
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select payment status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="paid">Paid</SelectItem>
                            <SelectItem value="unpaid">Unpaid</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("procurements.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("procurements.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("procurements.new_purchase_order")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("procurements.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Select
                        value={filterStatus}
                        onValueChange={setFilterStatus}
                    >
                        <SelectTrigger className="w-[180px]">
                            <Filter className="h-4 w-4 mr-2" />
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Orders</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button
                        variant="outline"
                        onClick={() => handleExport("excel")}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export to Excel
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleExport("pdf")}
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export to PDF
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("procurements.purchase_orders")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.po_number")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.provider")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.date")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.items")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.total")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.status")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.payment")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.delivery")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("procurements.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProcurements.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-6 py-4 text-center text-muted-foreground"
                                        >
                                            {t("procurements.no_orders")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProcurements.map((po) => (
                                        <tr
                                            key={po.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {po.id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {po.provider}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(
                                                    po.date,
                                                ).toLocaleDateString("en-US")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {po.items}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                ${po.total.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    {getStatusIcon(po.status)}
                                                    <span className="text-sm">
                                                        {t(
                                                            `procurements.${po.status}`,
                                                        )}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        po.paymentStatus ===
                                                        "paid"
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                    }`}
                                                >
                                                    {t(
                                                        `procurements.${po.paymentStatus}`,
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {new Date(
                                                    po.deliveryDate,
                                                ).toLocaleDateString("en-US")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleView(po)
                                                        }
                                                    >
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleEdit(po)
                                                        }
                                                    >
                                                        <Save className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleDelete(po)
                                                        }
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

            {/* View Dialog */}
            <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Purchase Order Details</DialogTitle>
                        <DialogDescription>
                            View complete purchase order information
                        </DialogDescription>
                    </DialogHeader>
                    {selectedPO && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Order Information
                                    </h3>
                                    <div className="space-y-1">
                                        <p>
                                            <span className="font-medium">
                                                PO Number:
                                            </span>{" "}
                                            {selectedPO.id}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Date:
                                            </span>{" "}
                                            {new Date(
                                                selectedPO.date,
                                            ).toLocaleDateString("en-US")}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Status:
                                            </span>{" "}
                                            {selectedPO.status}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-medium mb-2">
                                        Provider Information
                                    </h3>
                                    <div className="space-y-1">
                                        <p>
                                            <span className="font-medium">
                                                Provider:
                                            </span>{" "}
                                            {selectedPO.provider}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Items:
                                            </span>{" "}
                                            {selectedPO.items}
                                        </p>
                                        <p>
                                            <span className="font-medium">
                                                Total:
                                            </span>{" "}
                                            ${selectedPO.total.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-medium">
                                    Delivery & Payment
                                </h3>
                                <div className="space-y-1">
                                    <p>
                                        <span className="font-medium">
                                            Delivery Date:
                                        </span>{" "}
                                        {new Date(
                                            selectedPO.deliveryDate,
                                        ).toLocaleDateString("en-US")}
                                    </p>
                                    <p>
                                        <span className="font-medium">
                                            Payment Status:
                                        </span>{" "}
                                        {selectedPO.paymentStatus}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Purchase Order</DialogTitle>
                        <DialogDescription>
                            Make changes to the purchase order
                        </DialogDescription>
                    </DialogHeader>
                    <PurchaseOrderForm />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowEditDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveEdit} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="mr-2 h-4 w-4" />
                                    Save Changes
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Add Dialog */}
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Purchase Order</DialogTitle>
                        <DialogDescription>
                            Create a new purchase order
                        </DialogDescription>
                    </DialogHeader>
                    <PurchaseOrderForm />
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowAddDialog(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={handleSaveAdd} disabled={loading}>
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Order
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={showDeleteDialog}
                onOpenChange={setShowDeleteDialog}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the purchase order
                            {selectedPO && ` "${selectedPO.id}"`} and all
                            associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
