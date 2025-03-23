"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/hooks/use-toast";
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    MoreVertical,
    DollarSign,
    Percent,
    Save,
    Loader2,
    Download,
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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

interface Fee {
    id: number;
    name: string;
    type: "percentage" | "fixed";
    value: number;
    description: string;
    appliesTo: string;
    status: "active" | "inactive";
}

// Sample fees data
const fees: Fee[] = [
    {
        id: 1,
        name: "Standard Service Fee",
        type: "percentage",
        value: 2.5,
        description: "Standard service charge for all transactions",
        appliesTo: "all",
        status: "active",
    },
    {
        id: 2,
        name: "Delivery Fee",
        type: "fixed",
        value: 5.0,
        description: "Fixed delivery charge per order",
        appliesTo: "delivery",
        status: "active",
    },
];

export default function FeePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
    const [loading, setLoading] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Fee>>({
        type: "percentage" as const,
        status: "active" as const,
        appliesTo: "all",
    });
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const { t } = useI18n();
    const { toast } = useToast();

    const filteredFees = fees.filter((fee) => {
        const matchesSearch =
            fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            fee.description.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || fee.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleEdit = (fee: Fee) => {
        setSelectedFee(fee);
        setEditForm(fee);
        setShowEditDialog(true);
    };

    const handleDelete = (fee: Fee) => {
        setSelectedFee(fee);
        setShowDeleteDialog(true);
    };

    const handleAdd = () => {
        setEditForm({
            type: "percentage" as const,
            status: "active" as const,
            appliesTo: "all",
        });
        setShowAddDialog(true);
    };

    const handleExport = (format: "excel" | "pdf") => {
        try {
            const exportData = filteredFees.map((fee) => ({
                ID: fee.id,
                Name: fee.name,
                Type: fee.type,
                Value:
                    fee.type === "percentage"
                        ? `${fee.value}%`
                        : `$${fee.value.toFixed(2)}`,
                Description: fee.description,
                "Applies To": fee.appliesTo,
                Status: fee.status,
            }));

            if (format === "excel") {
                const ws = XLSX.utils.json_to_sheet(exportData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Fees");
                XLSX.writeFile(wb, "Fees_List.xlsx");
            } else {
                const doc = new jsPDF();

                doc.setFontSize(16);
                doc.text("Service Fees Report", 14, 15);
                doc.setFontSize(10);
                doc.text(
                    `Generated on ${new Date().toLocaleDateString()}`,
                    14,
                    22,
                );

                autoTable(doc, {
                    head: [
                        [
                            "ID",
                            "Name",
                            "Type",
                            "Value",
                            "Description",
                            "Applies To",
                            "Status",
                        ],
                    ],
                    body: exportData.map((row) => Object.values(row)),
                    startY: 30,
                    styles: { fontSize: 8 },
                    headStyles: { fillColor: [66, 66, 66] },
                });

                doc.save("Fees_Report.pdf");
            }

            toast({
                title: "Success",
                description: `Fee list exported to ${format.toUpperCase()} successfully`,
            });
        } catch (error) {
            toast({
                title: "Error",
                description: `Failed to export fee list to ${format.toUpperCase()}`,
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
                description: "Fee updated successfully",
            });

            setShowEditDialog(false);
            setSelectedFee(null);
            setEditForm({
                type: "percentage" as const,
                status: "active" as const,
                appliesTo: "all",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update fee",
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
                description: "Fee added successfully",
            });

            setShowAddDialog(false);
            setEditForm({
                type: "percentage" as const,
                status: "active" as const,
                appliesTo: "all",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add fee",
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
                description: "Fee deleted successfully",
            });

            setShowDeleteDialog(false);
            setSelectedFee(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete fee",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const FeeForm = ({ isEdit = false }: { isEdit?: boolean } = {}) => {
        return (
            <div className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="name">Fee Name</Label>
                    <Input
                        id="name"
                        value={editForm.name || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                            }))
                        }
                        placeholder="Enter fee name"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Type</Label>
                        <Select
                            value={editForm.type}
                            onValueChange={(value: "percentage" | "fixed") =>
                                setEditForm((prev) => ({
                                    ...prev,
                                    type: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="percentage">
                                    Percentage
                                </SelectItem>
                                <SelectItem value="fixed">
                                    Fixed Amount
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Value</Label>
                        <div className="flex items-center">
                            {editForm.type === "fixed" ? (
                                <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                            ) : (
                                <Percent className="h-4 w-4 mr-2 text-muted-foreground" />
                            )}
                            <Input
                                type="number"
                                step={
                                    editForm.type === "fixed" ? "0.01" : "0.1"
                                }
                                value={editForm.value || ""}
                                onChange={(e) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        value: parseFloat(e.target.value),
                                    }))
                                }
                                placeholder={`Enter ${editForm.type === "fixed" ? "amount" : "percentage"}`}
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                        value={editForm.description || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                description: e.target.value,
                            }))
                        }
                        placeholder="Enter fee description"
                    />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Applies To</Label>
                        <Select
                            value={editForm.appliesTo}
                            onValueChange={(value: string) =>
                                setEditForm((prev) => ({
                                    ...prev,
                                    appliesTo: value,
                                }))
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select application" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">
                                    All Transactions
                                </SelectItem>
                                <SelectItem value="delivery">
                                    Delivery Only
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Status</Label>
                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm">Active</span>
                            <Switch
                                checked={editForm.status === "active"}
                                onCheckedChange={(checked) =>
                                    setEditForm((prev) => ({
                                        ...prev,
                                        status: checked
                                            ? ("active" as const)
                                            : ("inactive" as const),
                                    }))
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">{t("fee.title")}</h1>
                    <p className="text-muted-foreground">{t("fee.subtitle")}</p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("fee.add_fee")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("fee.search_placeholder")}
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
                            <SelectItem value="all">All Fees</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
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
                        {t("fee.fee_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.name")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.type")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.value")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.description")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.applies_to")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.status")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("fee.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredFees.map((fee) => (
                                    <tr
                                        key={fee.id}
                                        className="hover:bg-muted/50"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                {fee.type === "percentage" ? (
                                                    <div className="h-8 w-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                                        <Percent className="h-4 w-4" />
                                                    </div>
                                                ) : (
                                                    <div className="h-8 w-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                                                        <DollarSign className="h-4 w-4" />
                                                    </div>
                                                )}
                                                <span className="font-medium">
                                                    {fee.name}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {t(`fee.${fee.type}`)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {fee.type === "percentage" ? (
                                                <span>{fee.value}%</span>
                                            ) : (
                                                <span>
                                                    ${fee.value.toFixed(2)}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {fee.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            {t(`fee.${fee.appliesTo}`)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    fee.status === "active"
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                }`}
                                            >
                                                {t(`fee.${fee.status}`)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        handleEdit(fee)
                                                    }
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-destructive"
                                                    onClick={() =>
                                                        handleDelete(fee)
                                                    }
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
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Fee</DialogTitle>
                        <DialogDescription>
                            Make changes to the fee configuration
                        </DialogDescription>
                    </DialogHeader>
                    <FeeForm isEdit={true} />
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
                        <DialogTitle>Add New Fee</DialogTitle>
                        <DialogDescription>
                            Configure a new service fee
                        </DialogDescription>
                    </DialogHeader>
                    <FeeForm />
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
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Fee
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
                            delete the fee
                            {selectedFee && ` "${selectedFee.name}"`} and remove
                            it from all transactions.
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
