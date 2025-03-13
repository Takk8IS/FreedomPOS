"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/context";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { addDays } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertCircle,
  Plus,
  Save,
  Loader2,
  Printer
} from "lucide-react";

interface Transaction {
  id: string;
  date: string;
  description: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  reference: string;
  status: string;
}

type TransactionFormData = Partial<Transaction> & {
  type: 'income' | 'expense';
  status: string;
};

const categories: Record<'income' | 'expense', string[]> = {
  income: ["Sales", "Services", "Investments", "Other Income"],
  expense: ["Inventory", "Utilities", "Rent", "Salaries", "Marketing", "Other Expenses"]
};

// Sample transactions data
const transactions: Transaction[] = [
  { 
    id: "TRX-001",
    date: "2025-04-01T14:30:00",
    description: "Sales Revenue",
    type: "income",
    amount: 1250.00,
    category: "Sales",
    reference: "INV-2025-001",
    status: "completed"
  },
  { 
    id: "TRX-002",
    date: "2025-04-01T15:45:00",
    description: "Supplier Payment",
    type: "expense",
    amount: 750.00,
    category: "Inventory",
    reference: "PO-2025-001",
    status: "completed"
  }
];


export default function AccountingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({
    from: addDays(new Date(), -30),
    to: new Date(),
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [editForm, setEditForm] = useState<TransactionFormData>({
    type: 'income',
    status: 'completed'
  });
  const { t } = useI18n();
  const { toast } = useToast();

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch = 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      transaction.type === activeTab;
    
    const transactionDate = new Date(transaction.date);
    const matchesDateRange = 
      (!dateRange?.from || transactionDate >= dateRange.from) &&
      (!dateRange?.to || transactionDate <= dateRange.to);
    
    return matchesSearch && matchesTab && matchesDateRange;
  });

  const handleExport = async (exportFormat: 'excel' | 'pdf') => {
    try {
      setLoading(true);

      const exportData = filteredTransactions.map(transaction => ({
        'ID': transaction.id,
        'Date': exportFormat === 'excel' ? transaction.date : format(new Date(transaction.date), 'PPP'),
        'Description': transaction.description,
        'Type': transaction.type,
        'Amount': `$${transaction.amount.toFixed(2)}`,
        'Category': transaction.category,
        'Reference': transaction.reference,
        'Status': transaction.status
      }));

      if (exportFormat === 'excel') {
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
        XLSX.writeFile(wb, 'Transactions_Report.xlsx');
      } else {
        const doc = new jsPDF();
        
        doc.setFontSize(16);
        // Setting font size only once is sufficient
        doc.text('Financial Transactions Report', 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 22);
        doc.text(`Period: ${dateRange.from ? format(dateRange.from, 'PPP') : 'N/A'} - ${dateRange.to ? format(dateRange.to, 'PPP') : 'N/A'}`, 14, 29);
        autoTable(doc, {
          head: [['ID', 'Date', 'Description', 'Type', 'Amount', 'Category', 'Reference', 'Status']],
          body: exportData.map(row => Object.values(row)),
          startY: 35,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 66, 66] }
        });

        doc.save('Transactions_Report.pdf');
      }

      toast({
        title: "Success",
        description: `Report exported to ${exportFormat.toUpperCase()} successfully`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to export report to ${exportFormat.toUpperCase()}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleAdd = () => {
    setEditForm({
      type: 'income',
      status: 'completed'
    });
    setShowAddDialog(true);
  };

  const handleView = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowViewDialog(true);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Success",
        description: "Transaction added successfully"
      });
      
      setShowAddDialog(false);
      setEditForm({
        type: 'income',
        status: 'completed'
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add transaction",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('accounting.title')}</h1>
          <p className="text-muted-foreground">{t('accounting.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <DatePickerWithRange
            date={dateRange}
            onDateChange={(selectedDateRange: DateRange | undefined) => setDateRange(selectedDateRange || { from: undefined, to: undefined })}
          />
          <Button variant="outline" onClick={() => handleExport('excel')} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExport('pdf')} disabled={loading}>
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handlePrint} disabled={loading}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('accounting.total_revenue')}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalIncome.toFixed(2)}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>+12.5% {t('common.from_last_month')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('accounting.total_expenses')}</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
            <div className="flex items-center pt-1 text-xs text-red-500">
              <TrendingDown className="h-3.5 w-3.5 mr-1" />
              <span>-2.3% {t('common.from_last_month')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('accounting.net_profit')}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${netProfit.toFixed(2)}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <TrendingUp className="h-3.5 w-3.5 mr-1" />
              <span>+8.4% {t('common.from_last_month')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{t('accounting.pending_payments')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1,234.56</div>
            <div className="flex items-center pt-1 text-xs text-yellow-500">
              <AlertCircle className="h-3.5 w-3.5 mr-1" />
              <span>5 {t('accounting.payments_pending')}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('accounting.search_placeholder')}
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          {t('accounting.filter')}
        </Button>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('accounting.all_transactions')}</TabsTrigger>
          <TabsTrigger value="income">{t('accounting.income')}</TabsTrigger>
          <TabsTrigger value="expense">{t('accounting.expense')}</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader className="px-6 py-4">
            <CardTitle className="text-lg">{t('accounting.transaction_history')}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('accounting.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('accounting.description')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('accounting.category')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('accounting.reference')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('accounting.amount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('accounting.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                        {t('accounting.no_transactions')}
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {format(new Date(transaction.date), 'PPP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {transaction.type === 'income' ? (
                              <ArrowUpRight className="h-4 w-4 text-green-500" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 text-red-500" />
                            )}
                            {transaction.description}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {transaction.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {transaction.reference}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleView(transaction)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Download className="h-4 w-4" />
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
      </Tabs>

      {/* Add Transaction Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Add a new financial transaction
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select
                  value={editForm.type}
                  onValueChange={(value: 'income' | 'expense') => 
                    setEditForm(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editForm.category}
                  onValueChange={(value) => 
                    setEditForm(prev => ({ ...prev, category: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories[editForm.type ?? 'income'].map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={editForm.description || ''}
                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter transaction description"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Amount</Label>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 mr-2 text-muted-foreground" />
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.amount || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, amount: parseFloat(e.target.value) }))}
                    placeholder="Enter amount"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Reference</Label>
                <Input
                  value={editForm.reference || ''}
                  onChange={(e) => setEditForm(prev => ({ ...prev, reference: e.target.value }))}
                  placeholder="Enter reference number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="datetime-local"
                value={editForm.date || new Date().toISOString().slice(0, 16)}
                onChange={(e) => setEditForm(prev => ({ ...prev, date: e.target.value }))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Transaction
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Transaction Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              View transaction information
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Transaction ID</Label>
                  <p className="font-medium">{selectedTransaction.id}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{format(new Date(selectedTransaction.date), 'PPP')}</p>
                </div>
              </div>
              <div>
                <Label className="text-muted-foreground">Description</Label>
                <p className="font-medium">{selectedTransaction.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Type</Label>
                  <p className="font-medium capitalize">{selectedTransaction.type}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Category</Label>
                  <p className="font-medium">{selectedTransaction.category}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Amount</Label>
                  <p className={`font-medium ${
                    selectedTransaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedTransaction.type === 'income' ? '+' : '-'}${selectedTransaction.amount.toFixed(2)}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Reference</Label>
                  <p className="font-medium">{selectedTransaction.reference}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}