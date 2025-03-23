"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/lib/i18n/context";
import { format, isWithinInterval, startOfDay, endOfDay, parseISO } from "date-fns";
import { useReactToPrint } from "react-to-print";
import * as XLSX from 'xlsx';
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable';
import { 
  Search, 
  Filter, 
  Calendar as CalendarIcon, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  AlertCircle,
  ChevronDown
} from "lucide-react";

// Sample orders data
const orders = [
  { 
    id: "ORD-001", 
    customer: "John Doe", 
    date: "2025-04-01T14:30:00", 
    total: 42.50, 
    status: "completed", 
    items: 3 
  },
  { 
    id: "ORD-002", 
    customer: "Jane Smith", 
    date: "2025-04-01T15:45:00", 
    total: 28.99, 
    status: "completed", 
    items: 2 
  },
  { 
    id: "ORD-003", 
    customer: "Robert Johnson", 
    date: "2025-04-01T16:20:00", 
    total: 35.75, 
    status: "processing", 
    items: 4 
  },
  { 
    id: "ORD-004", 
    customer: "Emily Davis", 
    date: "2025-04-01T17:10:00", 
    total: 19.99, 
    status: "processing", 
    items: 1 
  },
  { 
    id: "ORD-005", 
    customer: "Michael Wilson", 
    date: "2025-04-01T18:05:00", 
    total: 52.25, 
    status: "cancelled", 
    items: 3 
  },
  { 
    id: "ORD-006", 
    customer: "Sarah Brown", 
    date: "2025-04-02T10:15:00", 
    total: 31.50, 
    status: "completed", 
    items: 2 
  },
  { 
    id: "ORD-007", 
    customer: "David Miller", 
    date: "2025-04-02T11:30:00", 
    total: 45.00, 
    status: "processing", 
    items: 5 
  },
  { 
    id: "ORD-008", 
    customer: "Jennifer Taylor", 
    date: "2025-04-02T12:45:00", 
    total: 22.75, 
    status: "pending", 
    items: 2 
  },
  { 
    id: "ORD-009", 
    customer: "James Anderson", 
    date: "2025-04-02T13:20:00", 
    total: 38.99, 
    status: "completed", 
    items: 3 
  },
  { 
    id: "ORD-010", 
    customer: "Lisa Thomas", 
    date: "2025-04-02T14:10:00", 
    total: 27.50, 
    status: "pending", 
    items: 2 
  }
];

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    case "processing":
      return <Clock className="h-4 w-4 text-blue-500" />;
    case "cancelled":
      return <XCircle className="h-4 w-4 text-red-500" />;
    case "pending":
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface FilterOptions {
  status: string[];
  minAmount: number | undefined;
  maxAmount: number | undefined;
}

interface OrderDetails {
  id: string;
  customer: string;
  date: string;
  items: number;
  total: number;
  status: string;
  paymentMethod?: string;
  notes?: string;
  itemDetails?: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
}

const orderDetails: Record<string, OrderDetails> = {
  "ORD-001": {
    id: "ORD-001",
    customer: "John Doe",
    date: "2025-04-01T14:30:00",
    items: 3,
    total: 42.50,
    status: "completed",
    paymentMethod: "Credit Card",
    notes: "Delivery to main entrance",
    itemDetails: [
      { name: "Espresso", quantity: 2, price: 3.50, total: 7.00 },
      { name: "Cappuccino", quantity: 1, price: 4.50, total: 4.50 },
      { name: "Chocolate Cake", quantity: 2, price: 15.50, total: 31.00 }
    ]
  }
};

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [showFilters, setShowFilters] = useState(false);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    status: [],
    minAmount: undefined,
    maxAmount: undefined
  });
  const [selectedOrder, setSelectedOrder] = useState<OrderDetails | null>(null);
  const { t } = useI18n();
  const { toast } = useToast();
  const printRef = useRef<HTMLDivElement>(null);
  const orderPrintRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: 'Orders_List',
    onAfterPrint: () => {
      toast({
        title: "Success",
        description: "Orders list printed successfully"
      });
    }
  });

  const handlePrintOrder = useReactToPrint({
    content: () => orderPrintRef.current,
    documentTitle: `Order_${selectedOrder?.id}`,
    onAfterPrint: () => {
      toast({
        title: "Success",
        description: `Order ${selectedOrder?.id} printed successfully`
      });
    }
  });

  const exportToExcel = () => {
    const exportData = filteredOrders.map(order => ({
      'Order ID': order.id,
      'Customer': order.customer,
      'Date': format(new Date(order.date), 'PPP'),
      'Items': order.items,
      'Total': `$${order.total.toFixed(2)}`,
      'Status': order.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Orders');
    XLSX.writeFile(wb, 'Orders_Export.xlsx');

    toast({
      title: "Success",
      description: "Orders exported to Excel successfully"
    });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Orders Report', 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on ${format(new Date(), 'PPP')}`, 14, 22);

    const tableData = filteredOrders.map(order => [
      order.id,
      order.customer,
      format(new Date(order.date), 'PPP'),
      order.items.toString(),
      `$${order.total.toFixed(2)}`,
      order.status
    ]);

    autoTable(doc, {
      head: [['Order ID', 'Customer', 'Date', 'Items', 'Total', 'Status']],
      body: tableData,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] }
    });

    doc.save('Orders_Report.pdf');

    toast({
      title: "Success",
      description: "Orders exported to PDF successfully"
    });
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === "all" || 
      order.status === activeTab;

    const matchesDateRange = 
      !dateRange.from || !dateRange.to ||
      isWithinInterval(new Date(order.date), {
        start: startOfDay(dateRange.from),
        end: endOfDay(dateRange.to)
      });

    const matchesFilters = 
      (!filterOptions.status.length || filterOptions.status.includes(order.status)) &&
      (!filterOptions.minAmount || order.total >= filterOptions.minAmount) &&
      (!filterOptions.maxAmount || order.total <= filterOptions.maxAmount);
    
    return matchesSearch && matchesTab && matchesDateRange && matchesFilters;
  });

  const viewOrder = (orderId: string) => {
    const orderDetail = orderDetails[orderId];
    if (orderDetail) {
      setSelectedOrder(orderDetail);
    } else {
      toast({
        title: "Error",
        description: "Order details not found",
        variant: "destructive"
      });
    }
  };

  const printOrder = (orderId: string) => {
    const orderDetail = orderDetails[orderId];
    if (orderDetail) {
      setSelectedOrder(orderDetail);
      setTimeout(() => {
        handlePrintOrder();
      }, 100);
    } else {
      toast({
        title: "Error",
        description: "Order details not found",
        variant: "destructive"
      });
    }
  };

  const OrderDetailsView = ({ order }: { order: OrderDetails }) => (
    <div ref={orderPrintRef} className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">Order {order.id}</h2>
          <p className="text-muted-foreground">
            {format(parseISO(order.date), 'PPpp')}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {getStatusIcon(order.status)}
          <span className="capitalize">{order.status}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-medium mb-2">Customer Details</h3>
          <p>{order.customer}</p>
        </div>
        <div>
          <h3 className="font-medium mb-2">Payment Method</h3>
          <p>{order.paymentMethod}</p>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-4">Order Items</h3>
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {order.itemDetails?.map((item, index) => (
              <tr key={index}>
                <td className="py-2">{item.name}</td>
                <td className="text-right">{item.quantity}</td>
                <td className="text-right">${item.price.toFixed(2)}</td>
                <td className="text-right">${item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t">
            <tr>
              <td colSpan={3} className="py-2 text-right font-medium">Total:</td>
              <td className="py-2 text-right font-medium">${order.total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      {order.notes && (
        <div>
          <h3 className="font-medium mb-2">Notes</h3>
          <p className="text-muted-foreground">{order.notes}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t('orders.title')}</h1>
          <p className="text-muted-foreground">{t('orders.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                {t('orders.filter')}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t('orders.filter')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={filterOptions.status.join(',')}
                    onValueChange={(value) => setFilterOptions(prev => ({
                      ...prev,
                      status: value ? value.split(',') : []
                    }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="completed,processing,pending,cancelled">All</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Amount Range</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Min"
                      value={filterOptions.minAmount || ''}
                      onChange={(e) => setFilterOptions(prev => ({
                        ...prev,
                        minAmount: e.target.value ? Number(e.target.value) : undefined
                      }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      value={filterOptions.maxAmount || ''}
                      onChange={(e) => setFilterOptions(prev => ({
                        ...prev,
                        maxAmount: e.target.value ? Number(e.target.value) : undefined
                      }))}
                    />
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {t('orders.date_range')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={{
                  from: dateRange.from,
                  to: dateRange.to
                }}
                onSelect={(range: any) => setDateRange(range)}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" size="sm" onClick={exportToExcel}>
            <Download className="h-4 w-4 mr-2" />
            {t('orders.export')}
          </Button>

          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            {t('orders.print')}
          </Button>
        </div>
      </header>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder={t('orders.search_placeholder')}
            className="pl-8 w-full md:w-96"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              View complete order information
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && <OrderDetailsView order={selectedOrder} />}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>
              Close
            </Button>
            <Button onClick={handlePrintOrder}>
              <Printer className="h-4 w-4 mr-2" />
              Print Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="all">{t('orders.all_orders')}</TabsTrigger>
          <TabsTrigger value="completed">{t('orders.completed')}</TabsTrigger>
          <TabsTrigger value="processing">{t('orders.processing')}</TabsTrigger>
          <TabsTrigger value="pending">{t('orders.pending')}</TabsTrigger>
          <TabsTrigger value="cancelled">{t('orders.cancelled')}</TabsTrigger>
        </TabsList>

        <div ref={printRef}>
          <TabsContent value="all" className="space-y-4">
            <Card>
              <CardHeader className="px-6 py-4">
                <CardTitle className="text-lg">{t('orders.order_list')}</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.order_id')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.customer')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.date')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.items')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.total')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.status')}</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredOrders.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                            {t('orders.no_orders')}
                          </td>
                        </tr>
                      ) : (
                        filteredOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-muted/50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {order.id}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.customer}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {format(parseISO(order.date), 'PPp')}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {order.items}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              ${order.total.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-1.5">
                                {getStatusIcon(order.status)}
                                <span>{t(`orders.${order.status}`)}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => viewOrder(order.id)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8"
                                  onClick={() => printOrder(order.id)}
                                >
                                  <Printer className="h-4 w-4" />
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
          </TabsContent>

          {["completed", "processing", "pending", "cancelled"].map((status) => (
            <TabsContent key={status} value={status} className="space-y-4">
              <Card>
                <CardHeader className="px-6 py-4">
                  <CardTitle className="text-lg">{t(`orders.${status}`)} {t('orders.title')}</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.order_id')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.customer')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.date')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.items')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.total')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.status')}</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('orders.actions')}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredOrders.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="px-6 py-4 text-center text-muted-foreground">
                              {t('orders.no_orders')}
                            </td>
                          </tr>
                        ) : (
                          filteredOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-muted/50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                {order.id}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {order.customer}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {format(parseISO(order.date), 'PPp')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {order.items}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                ${order.total.toFixed(2)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-1.5">
                                  {getStatusIcon(order.status)}
                                  <span>{t(`orders.${order.status}`)}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => viewOrder(order.id)}
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => printOrder(order.id)}
                                  >
                                    <Printer className="h-4 w-4" />
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
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}