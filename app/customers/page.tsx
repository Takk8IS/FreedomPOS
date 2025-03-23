"use client";

import { useState, useCallback, useRef } from "react";
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
  Save,
  Loader2,
  Download,
  Eye
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
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
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  totalOrders: number;
  totalSpent: number;
  lastOrder: string;
}

// Sample customers data
const customers = [
  { 
    id: 1, 
    name: "John Doe", 
    email: "john.doe@example.com", 
    phone: "+1 (555) 123-4567", 
    totalOrders: 12, 
    totalSpent: 345.67, 
    lastOrder: "2025-03-28T14:30:00" 
  },
  { 
    id: 2, 
    name: "Jane Smith", 
    email: "jane.smith@example.com", 
    phone: "+1 (555) 234-5678", 
    totalOrders: 8, 
    totalSpent: 230.45, 
    lastOrder: "2025-03-25T10:15:00" 
  }
];

// Componente separado para o formulário de cliente
const CustomerForm = ({ 
  formData, 
  onChange, 
  isEdit = false 
}: { 
  formData: Partial<Customer>, 
  onChange: (field: keyof Customer, value: string) => void, 
  isEdit?: boolean 
}) => (
  <div className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="name">Full Name</Label>
      <Input
        id="name"
        value={formData.name || ''}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Enter customer name"
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <div className="flex items-center">
        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
        <Input
          id="email"
          type="email"
          value={formData.email || ''}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter email address"
        />
      </div>
    </div>
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number</Label>
      <div className="flex items-center">
        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
        <Input
          id="phone"
          value={formData.phone || ''}
          onChange={(e) => onChange('phone', e.target.value)}
          placeholder="Enter phone number"
        />
      </div>
    </div>
  </div>
);

// Componente separado para o diálogo de visualização
const ViewDialog = ({ 
  open, 
  onOpenChange, 
  customer 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  customer: Customer | null 
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl">
      <DialogHeader>
        <DialogTitle>Customer Details</DialogTitle>
        <DialogDescription>
          View complete customer information
        </DialogDescription>
      </DialogHeader>
      {customer && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Personal Information</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Name:</span> {customer.name}</p>
                <p><span className="font-medium">Email:</span> {customer.email}</p>
                <p><span className="font-medium">Phone:</span> {customer.phone}</p>
              </div>
            </div>
            <div>
              <h3 className="font-medium mb-2">Order History</h3>
              <div className="space-y-1">
                <p><span className="font-medium">Total Orders:</span> {customer.totalOrders}</p>
                <p><span className="font-medium">Total Spent:</span> ${customer.totalSpent.toFixed(2)}</p>
                <p><span className="font-medium">Last Order:</span> {format(new Date(customer.lastOrder), 'PPP')}</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Componente separado para o diálogo de edição
const EditDialog = ({ 
  open, 
  onOpenChange, 
  formData, 
  onChange, 
  onSave, 
  loading 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  formData: Partial<Customer>, 
  onChange: (field: keyof Customer, value: string) => void, 
  onSave: () => void, 
  loading: boolean 
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogDescription>
          Make changes to customer information
        </DialogDescription>
      </DialogHeader>
      <CustomerForm formData={formData} onChange={onChange} isEdit />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={onSave} disabled={loading}>
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
);

// Componente separado para o diálogo de adição
const AddDialog = ({ 
  open, 
  onOpenChange, 
  formData, 
  onChange, 
  onSave, 
  loading 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  formData: Partial<Customer>, 
  onChange: (field: keyof Customer, value: string) => void, 
  onSave: () => void, 
  loading: boolean 
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogDescription>
          Add a new customer to the system
        </DialogDescription>
      </DialogHeader>
      <CustomerForm formData={formData} onChange={onChange} />
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={onSave} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </>
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

// Componente separado para o diálogo de exclusão
const DeleteDialog = ({ 
  open, 
  onOpenChange, 
  customer, 
  onConfirm, 
  loading 
}: { 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  customer: Customer | null, 
  onConfirm: () => void, 
  loading: boolean 
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the customer
          {customer && ` "${customer.name}"`} and all associated data.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm} disabled={loading}>
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
);

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState<Partial<Customer>>({});
  const { t } = useI18n();
  const { toast } = useToast();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredCustomers = customers.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm)
    );
  });

  const handleFormChange = useCallback((field: keyof Customer, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleView = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setViewDialogOpen(true);
  }, []);

  const handleEdit = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setEditForm(customer);
    setEditDialogOpen(true);
  }, []);

  const handleDelete = useCallback((customer: Customer) => {
    setSelectedCustomer(customer);
    setDeleteDialogOpen(true);
  }, []);

  const handleAdd = useCallback(() => {
    setEditForm({});
    setAddDialogOpen(true);
  }, []);

  const handleExport = useCallback((exportFormat: 'excel' | 'pdf') => {
    try {
      const exportData = filteredCustomers.map(customer => ({
        'ID': customer.id,
        'Name': customer.name,
        'Email': customer.email,
        'Phone': customer.phone,
        'Total Orders': customer.totalOrders,
        'Total Spent': `$${customer.totalSpent.toFixed(2)}`,
        'Last Order': exportFormat === 'excel' ? customer.lastOrder : format(new Date(customer.lastOrder), 'PPP')
      }));

      if (exportFormat === 'excel') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Customers');
        XLSX.writeFile(wb, 'Customers_List.xlsx');
      } else {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        doc.text('Customers Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 22);

        autoTable(doc, {
          head: [['ID', 'Name', 'Email', 'Phone', 'Total Orders', 'Total Spent', 'Last Order']],
          body: exportData.map(row => Object.values(row)),
          startY: 30,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 66, 66] }
        });

        doc.save('Customers_Report.pdf');
      }

      toast({
        title: "Success",
        description: `Customer list exported to ${exportFormat.toUpperCase()} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to export customer list to ${exportFormat.toUpperCase()}`,
        variant: "destructive"
      });
    }
  }, [filteredCustomers, toast]);

  const handleSaveEdit = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Customer updated successfully"
      });
      
      setEditDialogOpen(false);
      setSelectedCustomer(null);
      setEditForm({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update customer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSaveAdd = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Customer added successfully"
      });
      
      setAddDialogOpen(false);
      setEditForm({});
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add customer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleConfirmDelete = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Customer deleted successfully"
      });
      
      setDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('customers.title')}</h1>
          <p className="text-muted-foreground">{t('customers.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-2" />
            {t('customers.add_customer')}
          </Button>
        </div>
      </header>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder={t('customers.search_placeholder')}
            className="pl-8"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            {t('customers.filter')}
          </Button>
          <Button variant="outline" onClick={() => handleExport('excel')}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')}>
            <Download className="h-4 w-4 mr-2" />
            Export to PDF
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="px-6 py-4">
          <CardTitle className="text-lg">{t('customers.customer_list')}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('customers.customer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('customers.contact_info')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('customers.orders')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('customers.total_spent')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('customers.last_order')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('customers.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                      {t('customers.no_customers')}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <tr key={customer.id} className="hover:bg-muted/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                            {customer.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-xs text-muted-foreground">{t('customers.id')}: {customer.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {customer.email}
                          </div>
                          <div className="flex items-center text-sm">
                            <Phone className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                            {customer.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {customer.totalOrders}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        ${customer.totalSpent.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {format(new Date(customer.lastOrder), 'PPP')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleView(customer)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => handleEdit(customer)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive"
                            onClick={() => handleDelete(customer)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
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

      {/* Diálogos separados como componentes */}
      <ViewDialog 
        open={viewDialogOpen} 
        onOpenChange={setViewDialogOpen} 
        customer={selectedCustomer} 
      />
      
      <EditDialog 
        open={editDialogOpen} 
        onOpenChange={setEditDialogOpen} 
        formData={editForm} 
        onChange={handleFormChange} 
        onSave={handleSaveEdit} 
        loading={loading} 
      />
      
      <AddDialog 
        open={addDialogOpen} 
        onOpenChange={setAddDialogOpen} 
        formData={editForm} 
        onChange={handleFormChange} 
        onSave={handleSaveAdd} 
        loading={loading} 
      />
      
      <DeleteDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        customer={selectedCustomer} 
        onConfirm={handleConfirmDelete} 
        loading={loading} 
      />
    </div>
  );
}