"use client";

import { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import { Button } from "@/components/ui/button";
import { Printer, Download, Mail } from "lucide-react";

interface InvoiceTemplateProps {
  invoice: {
    number: string;
    date: string;
    dueDate: string;
    items: Array<{
      name: string;
      quantity: number;
      price: number;
      tax: number;
    }>;
    subtotal: number;
    tax: number;
    total: number;
  };
  business: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
    logo?: string;
  };
  customer: {
    name: string;
    address: string;
    email: string;
    phone: string;
  };
  settings: {
    showLogo: boolean;
    showHeader: boolean;
    showFooter: boolean;
    headerText: string;
    footerText: string;
    warrantyText: string;
  };
}

export function InvoiceTemplate({
  invoice,
  business,
  customer,
  settings
}: InvoiceTemplateProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        <Button variant="outline">
          <Mail className="h-4 w-4 mr-2" />
          Email
        </Button>
      </div>

      <div ref={invoiceRef} className="bg-white p-8 shadow-lg">
        {/* Header */}
        {settings.showHeader && (
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground">{settings.headerText}</p>
          </div>
        )}

        {/* Business Info and Logo */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold">{business.name}</h1>
            <p className="text-muted-foreground">{business.address}</p>
            <p className="text-muted-foreground">{business.phone}</p>
            <p className="text-muted-foreground">{business.email}</p>
            <p className="text-muted-foreground">{business.website}</p>
            <p className="text-muted-foreground">Tax ID: {business.taxId}</p>
          </div>
          {settings.showLogo && business.logo && (
            <img src={business.logo} alt="Business Logo" className="h-20" />
          )}
        </div>

        {/* Invoice Details */}
        <div className="flex justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">Bill To:</h2>
            <p className="font-medium">{customer.name}</p>
            <p className="text-muted-foreground">{customer.address}</p>
            <p className="text-muted-foreground">{customer.phone}</p>
            <p className="text-muted-foreground">{customer.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold mb-2">Invoice Details:</h2>
            <p>Invoice Number: {invoice.number}</p>
            <p>Date: {invoice.date}</p>
            <p>Due Date: {invoice.dueDate}</p>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full mb-8">
          <thead className="border-b">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Quantity</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Tax</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {invoice.items.map((item, index) => (
              <tr key={index}>
                <td className="py-2">{item.name}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">${item.price.toFixed(2)}</td>
                <td className="text-right py-2">${item.tax.toFixed(2)}</td>
                <td className="text-right py-2">
                  ${((item.quantity * item.price) + item.tax).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Tax:</span>
              <span>${invoice.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total:</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Warranty Text */}
        {settings.warrantyText && (
          <div className="mb-8">
            <h3 className="font-semibold mb-2">Warranty Information:</h3>
            <p className="text-sm text-muted-foreground">{settings.warrantyText}</p>
          </div>
        )}

        {/* Footer */}
        {settings.showFooter && (
          <div className="text-center text-sm text-muted-foreground mt-8 pt-8 border-t">
            {settings.footerText}
          </div>
        )}
      </div>
    </div>
  );
}