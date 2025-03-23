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
    Edit,
    Trash2,
    MoreVertical,
    Mail,
    Phone,
    Globe,
    Building2,
    Loader2,
    Save,
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

interface Provider {
    id: number;
    name: string;
    contact: string;
    email: string;
    phone: string;
    website: string;
    address: string;
    status: string;
    products: number;
}

// Sample providers data
const providers = [
    {
        id: 1,
        name: "Global Coffee Suppliers",
        contact: "John Smith",
        email: "john@globalcoffee.com",
        phone: "+1 (555) 123-4567",
        website: "www.globalcoffee.com",
        address: "123 Coffee Lane, Bean City, 12345",
        status: "active",
        products: 15,
    },
    {
        id: 2,
        name: "Tea Masters Co.",
        contact: "Sarah Johnson",
        email: "sarah@teamasters.com",
        phone: "+1 (555) 234-5678",
        website: "www.teamasters.com",
        address: "456 Tea Avenue, Leaf Town, 67890",
        status: "active",
        products: 8,
    },
];

export default function ProvidersPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showAddDialog, setShowAddDialog] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<Provider | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Provider>>({});
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const { t } = useI18n();
    const { toast } = useToast();

    const filteredProviders = providers.filter((provider) => {
        const matchesSearch =
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus =
            filterStatus === "all" || provider.status === filterStatus;

        return matchesSearch && matchesStatus;
    });

    const handleEdit = (provider: Provider) => {
        setSelectedProvider(provider);
        setEditForm(provider);
        setShowEditDialog(true);
    };

    const handleDelete = (provider: Provider) => {
        setSelectedProvider(provider);
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
                description: "Provider updated successfully",
            });

            setShowEditDialog(false);
            setSelectedProvider(null);
            setEditForm({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update provider",
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
                description: "Provider added successfully",
            });

            setShowAddDialog(false);
            setEditForm({});
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add provider",
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
                description: "Provider deleted successfully",
            });

            setShowDeleteDialog(false);
            setSelectedProvider(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete provider",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const ProviderForm = () => (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Provider Name</Label>
                <Input
                    id="name"
                    value={editForm.name || ""}
                    onChange={(e) =>
                        setEditForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                    placeholder="Enter provider name"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact">Contact Person</Label>
                <Input
                    id="contact"
                    value={editForm.contact || ""}
                    onChange={(e) =>
                        setEditForm((prev) => ({
                            ...prev,
                            contact: e.target.value,
                        }))
                    }
                    placeholder="Enter contact person name"
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                            id="email"
                            type="email"
                            value={editForm.email || ""}
                            onChange={(e) =>
                                setEditForm((prev) => ({
                                    ...prev,
                                    email: e.target.value,
                                }))
                            }
                            placeholder="Enter email"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <div className="flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                        <Input
                            id="phone"
                            value={editForm.phone || ""}
                            onChange={(e) =>
                                setEditForm((prev) => ({
                                    ...prev,
                                    phone: e.target.value,
                                }))
                            }
                            placeholder="Enter phone number"
                        />
                    </div>
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                        id="website"
                        value={editForm.website || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                website: e.target.value,
                            }))
                        }
                        placeholder="Enter website URL"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <div className="flex items-center">
                    <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input
                        id="address"
                        value={editForm.address || ""}
                        onChange={(e) =>
                            setEditForm((prev) => ({
                                ...prev,
                                address: e.target.value,
                            }))
                        }
                        placeholder="Enter address"
                    />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                    value={editForm.status || "active"}
                    onValueChange={(value) =>
                        setEditForm((prev) => ({ ...prev, status: value }))
                    }
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );

    return (
        <div className="p-6">
            <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        {t("providers.title")}
                    </h1>
                    <p className="text-muted-foreground">
                        {t("providers.subtitle")}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={handleAdd}>
                        <Plus className="h-4 w-4 mr-2" />
                        {t("providers.add_provider")}
                    </Button>
                </div>
            </header>

            <div className="mb-6 flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder={t("providers.search_placeholder")}
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Providers</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Card>
                <CardHeader className="px-6 py-4">
                    <CardTitle className="text-lg">
                        {t("providers.provider_list")}
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.provider")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.contact_info")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.address")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.status")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.products")}
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                        {t("providers.actions")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredProviders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={6}
                                            className="px-6 py-4 text-center text-muted-foreground"
                                        >
                                            {t("providers.no_providers")}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProviders.map((provider) => (
                                        <tr
                                            key={provider.id}
                                            className="hover:bg-muted/50"
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
                                                        {provider.name.charAt(
                                                            0,
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">
                                                            {provider.name}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {provider.contact}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm">
                                                        <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {provider.email}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {provider.phone}
                                                    </div>
                                                    <div className="flex items-center text-sm">
                                                        <Globe className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                        {provider.website}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center text-sm">
                                                    <Building2 className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                                    {provider.address}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    {t("providers.active")}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                {provider.products}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8"
                                                        onClick={() =>
                                                            handleEdit(provider)
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
                                                                provider,
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Provider</DialogTitle>
                        <DialogDescription>
                            Make changes to the provider information
                        </DialogDescription>
                    </DialogHeader>
                    <ProviderForm />
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
                        <DialogTitle>Add New Provider</DialogTitle>
                        <DialogDescription>
                            Add a new provider to the system
                        </DialogDescription>
                    </DialogHeader>
                    <ProviderForm />
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
                                    Add Provider
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
                            delete the provider
                            {selectedProvider &&
                                ` "${selectedProvider.name}"`}{" "}
                            and all associated data.
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
