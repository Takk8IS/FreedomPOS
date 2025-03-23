"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { BarcodeGenerator } from "@/components/barcode-generator";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n/context";
import {
    Search,
    Plus,
    Filter,
    Edit,
    Trash2,
    MoreVertical,
    AlertTriangle,
    ArrowUpDown,
    Package,
    Barcode,
    Save,
    Loader2,
} from "lucide-react";

interface InventoryItem {
    id: number;
    sku: string;
    name: string;
    quantity: number;
    minStock: number;
    maxStock: number;
    location: string;
    lastUpdated: string;
    barcode: string;
}

// Sample inventory data
const inventory = [
    {
        id: 1,
        sku: "COF-001",
        name: "Coffee Beans - Arabica",
        quantity: 150,
        minStock: 50,
        maxStock: 300,
        location: "Shelf A1",
        lastUpdated: "2025-04-01T14:30:00",
        barcode: "123456789012",
    },
    {
        id: 2,
        sku: "TEA-001",
        name: "Green Tea Leaves",
        quantity: 80,
        minStock: 30,
        maxStock: 200,
        location: "Shelf B2",
        lastUpdated: "2025-04-01T12:15:00",
        barcode: "223456789012",
    },
];

export default function InventoryPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showBarcodeDialog, setShowBarcodeDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});
    const { t } = useI18n();
    const { toast } = useToast();

    const filteredInventory = inventory.filter((item) => {
        return (
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.location.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleShowBarcode = (item: InventoryItem) => {
        setSelectedItem(item);
        setShowBarcodeDialog(true);
    };

    const handleEdit = (item: InventoryItem) => {
        setSelectedItem(item);
        setEditForm(item);
        setShowEditDialog(true);
    };

    const handleDelete = (item: InventoryItem) => {
        setSelectedItem(item);
        setShowDeleteDialog(true);
    };

    const handleAdd = () => {
        setEditForm({});
        setShowAddDialog(true);
    };

    const handleSaveEdit = async () => {
        try {
            setLoading(true);
            // In a real app, this would be an API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            toast({
                title: "Success",
                description: "Item updated successfully",
            });

            setShowEditDialog(false);
            setSelectedItem(null);
            setEditForm({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update item",
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
                description: "Item added successfully",
            });

            setShowAddDialog(false);
            setEditForm({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add item",
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
                description: "Item deleted successfully",
            });

            setShowDeleteDialog(false);
            setSelectedItem(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete item",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const ItemForm = () => (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                        id="sku"
                        value={editForm.sku || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                sku: e.target.value,
                            }))
                        }
                        placeholder="Enter SKU"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="barcode">Barcode</Label>
                    <Input
                        id="barcode"
                        value={editForm.barcode || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                barcode: e.target.value,
                            }))
                        }
                        placeholder="Enter barcode"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                    id="name"
                    value={editForm.name || ""}
                    onChange={(e) =>
                        setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    placeholder="Enter product name"
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                        id="quantity"
                        type="number"
                        value={editForm.quantity || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                quantity: parseInt(e.target.value),
                            }))
                        }
                        placeholder="Enter quantity"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="minStock">Min Stock</Label>
                    <Input
                        id="minStock"
                        type="number"
                        value={editForm.minStock || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                minStock: parseInt(e.target.value),
                            }))
                        }
                        placeholder="Enter min stock"
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="maxStock">Max Stock</Label>
                    <Input
                        id="maxStock"
                        type="number"
                        value={editForm.maxStock || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                maxStock: parseInt(e.target.value),
                            }))
                        }
                        placeholder="Enter max stock"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                    id="location"
                    value={editForm.location || ""}
                    onChange={(e) =>
                        setEditForm((prev) => ({
                            ...prev,
                            location: e.target.value,
                        }))
                    }
                    placeholder="Enter location"
                />
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("inventory.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("inventory.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("inventory.add_item")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("inventory.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("inventory.filter")}
                </Button>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("inventory.inventory_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.sku")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.product")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.quantity")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.stock_levels")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.location")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.last_updated")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("inventory.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredInventory.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-6 py-4 text-center text-muted-foreground"
                                        >
                                            {t("inventory.no_items")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredInventory.map((item) => {
                                        const isLowStock =
                                            item.quantity <= item.minStock;
                                        const isOverStock =
                                            item.quantity >= item.maxStock;

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-muted/50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    {item.sku}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center">
                                                            <Package className="h-4 w-4" />
                                                        </div>
                                                        <span>{item.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {item.quantity}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        {isLowStock && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                                                <AlertTriangle className="h-3 w-3 mr-1" />
                                                                {t(
                                                                    "inventory.low_stock",
                                                                )}
                                                            </span>
                                                        )}
                                                        {isOverStock && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                                                                <ArrowUpDown className="h-3 w-3 mr-1" />
                                                                {t(
                                                                    "inventory.over_stock",
                                                                )}
                                                            </span>
                                                        )}
                                                        {!isLowStock &&
                                                            !isOverStock && (
                                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                                    {t(
                                                                        "inventory.optimal",
                                                                    )}
                                                                </span>
                                                            )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {item.location}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    {new Date(
                                                        item.lastUpdated,
                                                    ).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            year: "numeric",
                                                            month: "numeric",
                                                            day: "numeric",
                                                        },
                                                    )}{" "}
                                                    {new Date(
                                                        item.lastUpdated,
                                                    ).toLocaleTimeString(
                                                        "en-US",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                            second: "2-digit",
                                                        },
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                handleShowBarcode(
                                                                    item,
                                                                )
                                                            }
                                                        >
                                                            <Barcode className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() =>
                                                                handleEdit(item)
                                                            }
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item,
                                                                )
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
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Barcode Dialog */}
            <Dialog
                open={showBarcodeDialog}
                onOpenChange={setShowBarcodeDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {t("inventory.product_barcode")}
                        </DialogTitle>
                        <DialogDescription>
                            {selectedItem && t("inventory.barcode_description")}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {selectedItem && (
                            <BarcodeGenerator
                                value={selectedItem.barcode}
                                text={`${selectedItem.sku} - ${selectedItem.name}`}
                            />
                        )}
                    </div>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Item</DialogTitle>
                        <DialogDescription>
                            Make changes to the inventory item
                        </DialogDescription>
                    </DialogHeader>
                    <ItemForm />
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
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription>
                            Add a new item to inventory
                        </DialogDescription>
                    </DialogHeader>
                    <ItemForm />
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
                                    Add Item
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
                            delete the item
                            {selectedItem && ` "${selectedItem.name}"`} from
                            inventory.
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
