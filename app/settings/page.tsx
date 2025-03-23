"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { InvoiceTemplate } from "@/components/invoice-template";
import { useI18n } from "@/lib/i18n/context";
import { 
  Save, 
  Store, 
  CreditCard, 
  Receipt, 
  Printer, 
  Users, 
  Bell, 
  Shield, 
  HelpCircle,
  Smartphone,
  Mail,
  Globe,
  FileText
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const { t, language, setLanguage } = useI18n();
  const { toast } = useToast();
  const [storeSettings, setStoreSettings] = useState({
    name: "My Store",
    address: "123 Main Street, City, State, 12345",
    phone: "(555) 123-4567",
    email: "contact@mystore.com",
    website: "https://mystore.com",
    taxRate: "10",
    currency: "USD",
    taxId: "123-45-6789"
  });

  const [notifications, setNotifications] = useState({
    orderConfirmation: true,
    lowStock: true,
    dailySummary: false,
    marketingUpdates: false
  });

  const [invoiceSettings, setInvoiceSettings] = useState({
    showLogo: true,
    showHeader: true,
    showFooter: true,
    headerText: t('settings.header_text'),
    footerText: t('settings.footer_text'),
    warrantyText: t('settings.warranty_text'),
  });

  const handleStoreSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setStoreSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (key: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInvoiceSettingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInvoiceSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInvoiceToggle = (key: keyof typeof invoiceSettings) => {
    setInvoiceSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Handle language change
  const handleLanguageChange = (value: string) => {
    if (value === 'en' || value === 'es') {
      setLanguage(value);
      toast({
        title: "Success",
        description: "Language updated successfully"
      });
    }
  };

  // Sample invoice data for preview
  const sampleInvoice = {
    number: "INV-2025-001",
    date: "2025-04-01",
    dueDate: "2025-05-01",
    items: [
      {
        name: "Product 1",
        quantity: 2,
        price: 29.99,
        tax: 5.40
      },
      {
        name: "Product 2",
        quantity: 1,
        price: 49.99,
        tax: 9.00
      }
    ],
    subtotal: 109.97,
    tax: 14.40,
    total: 124.37
  };

  return (
    <div className="p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.subtitle')}</p>
      </header>

      <Tabs defaultValue="store" className="space-y-6">
        <TabsList className="mb-6">
          <TabsTrigger value="store" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            {t('settings.store_information')}
          </TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            {t('settings.payment_settings')}
          </TabsTrigger>
          <TabsTrigger value="invoice" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            {t('settings.invoice_settings')}
          </TabsTrigger>
          <TabsTrigger value="receipt" className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            {t('settings.receipt_customization')}
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('settings.user_management')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('settings.notification_settings')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="store">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.store_information')}</CardTitle>
              <CardDescription>{t('settings.store_details')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('settings.store_name')}</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    value={storeSettings.name} 
                    onChange={handleStoreSettingsChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">{t('settings.address')}</Label>
                  <Input 
                    id="address" 
                    name="address" 
                    value={storeSettings.address} 
                    onChange={handleStoreSettingsChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('settings.phone')}</Label>
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={storeSettings.phone} 
                      onChange={handleStoreSettingsChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t('settings.email')}</Label>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={storeSettings.email} 
                      onChange={handleStoreSettingsChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">{t('settings.website')}</Label>
                  <div className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                    <Input 
                      id="website" 
                      name="website" 
                      value={storeSettings.website} 
                      onChange={handleStoreSettingsChange} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxRate">{t('settings.tax_rate')} (%)</Label>
                  <Input 
                    id="taxRate" 
                    name="taxRate" 
                    type="number" 
                    value={storeSettings.taxRate} 
                    onChange={handleStoreSettingsChange} 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="taxId">{t('settings.tax_id')}</Label>
                  <Input 
                    id="taxId" 
                    name="taxId" 
                    value={storeSettings.taxId} 
                    onChange={handleStoreSettingsChange} 
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.regional_settings')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="currency">{t('settings.currency')}</Label>
                    <Input 
                      id="currency" 
                      name="currency" 
                      value={storeSettings.currency} 
                      onChange={handleStoreSettingsChange} 
                    />
                  </div>
                  
                  {/* Added Language Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.language')}</Label>
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <Select value={language} onValueChange={handleLanguageChange}>
                        <SelectTrigger id="language" className="w-full">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="es">Español</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save_changes')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="invoice">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('settings.invoice_settings')}</CardTitle>
                <CardDescription>{t('settings.invoice_layout')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showLogo">{t('settings.show_logo')}</Label>
                    <Switch
                      id="showLogo"
                      checked={invoiceSettings.showLogo}
                      onCheckedChange={() => handleInvoiceToggle('showLogo')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showHeader">{t('settings.show_header')}</Label>
                    <Switch
                      id="showHeader"
                      checked={invoiceSettings.showHeader}
                      onCheckedChange={() => handleInvoiceToggle('showHeader')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="showFooter">{t('settings.show_footer')}</Label>
                    <Switch
                      id="showFooter"
                      checked={invoiceSettings.showFooter}
                      onCheckedChange={() => handleInvoiceToggle('showFooter')}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="headerText">{t('settings.header_text')}</Label>
                    <Textarea
                      id="headerText"
                      name="headerText"
                      value={invoiceSettings.headerText}
                      onChange={handleInvoiceSettingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="footerText">{t('settings.footer_text')}</Label>
                    <Textarea
                      id="footerText"
                      name="footerText"
                      value={invoiceSettings.footerText}
                      onChange={handleInvoiceSettingChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="warrantyText">{t('settings.warranty_text')}</Label>
                    <Textarea
                      id="warrantyText"
                      name="warrantyText"
                      value={invoiceSettings.warrantyText}
                      onChange={handleInvoiceSettingChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>
                  <Save className="h-4 w-4 mr-2" />
                  {t('settings.save_changes')}
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('settings.invoice_preview')}</CardTitle>
                <CardDescription>{t('settings.preview_description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <InvoiceTemplate
                  invoice={sampleInvoice}
                  business={storeSettings}
                  customer={{
                    name: "John Doe",
                    address: "456 Customer St, City, State 12345",
                    email: "john@example.com",
                    phone: "(555) 987-6543"
                  }}
                  settings={invoiceSettings}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.payment_settings')}</CardTitle>
              <CardDescription>{t('settings.payment_config')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.payment_methods')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-4 w-4" />
                      <Label htmlFor="card-payments">{t('settings.card_payments')}</Label>
                    </div>
                    <Switch id="card-payments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 17V17.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 13.5C11.9816 13.1754 12.0692 12.8536 12.2495 12.5832C12.4299 12.3127 12.6933 12.1093 13 12C13.3759 11.8563 13.7132 11.6274 13.9856 11.3311C14.2579 11.0348 14.4577 10.6794 14.5693 10.2939C14.6809 9.90836 14.7013 9.50279 14.6287 9.1076C14.5562 8.71241 14.3928 8.33942 14.1513 8.01493C13.9099 7.69044 13.5968 7.42342 13.2336 7.23416C12.8704 7.04491 12.4672 6.93772 12.0545 6.92222C11.6418 6.90672 11.2311 6.98322 10.8538 7.14498C10.4766 7.30675 10.1428 7.54986 9.875 7.85498" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <Label htmlFor="cash-payments">{t('settings.cash_payments')}</Label>
                    </div>
                    <Switch id="cash-payments" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.5 12.5C19.5 16.6421 16.1421 20 12 20C7.85786 20 4.5 16.6421 4.5 12.5C4.5 8.35786 7.85786 5 12 5C16.1421 5 19.5 8.35786 19.5 12.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 8V12.5L14.5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <Label htmlFor="mobile-payments">{t('settings.mobile_payments')}</Label>
                    </div>
                    <Switch id="mobile-payments" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.receipt_options')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Printer className="h-4 w-4" />
                      <Label htmlFor="print-receipt">{t('settings.print_receipt')}</Label>
                    </div>
                    <Switch id="print-receipt" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <Label htmlFor="email-receipt">{t('settings.email_receipt')}</Label>
                    </div>
                    <Switch id="email-receipt" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save_changes')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="receipt">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.receipt_customization')}</CardTitle>
              <CardDescription>{t('settings.receipt_layout')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.receipt_header')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="header-text">{t('settings.header_text')}</Label>
                  <Input id="header-text" defaultValue="Thank you for your purchase!" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.receipt_content')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="show-tax">{t('settings.show_tax')}</Label>
                    </div>
                    <Switch id="show-tax" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="show-discounts">{t('settings.show_discounts')}</Label>
                    </div>
                    <Switch id="show-discounts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="show-barcode">{t('settings.show_barcode')}</Label>
                    </div>
                    <Switch id="show-barcode" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.receipt_footer')}</h3>
                <div className="space-y-2">
                  <Label htmlFor="footer-text">{t('settings.footer_text')}</Label>
                  <Input id="footer-text" defaultValue="Please come again!" />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save_changes')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.user_management')}</CardTitle>
              <CardDescription>{t('settings.manage_users')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">{t('settings.users')}</h3>
                  <Button size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    {t('settings.add_user')}
                  </Button>
                </div>
                <div className="border rounded-md">
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                        A
                      </div>
                      <div>
                        <p className="font-medium">Admin User</p>
                        <p className="text-sm text-muted-foreground">admin@hipos.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">
                        {t('settings.roles.admin')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        M
                      </div>
                      <div>
                        <p className="font-medium">Manager User</p>
                        <p className="text-sm text-muted-foreground">manager@hipos.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                        {t('settings.roles.manager')}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                        C
                      </div>
                      <div>
                        <p className="font-medium">Cashier User</p>
                        <p className="text-sm text-muted-foreground">cashier@hipos.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">
                        {t('settings.roles.cashier')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.permissions')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="allow-discounts">{t('settings.allow_discounts')}</Label>
                    </div>
                    <Switch id="allow-discounts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="allow-refunds">{t('settings.allow_refunds')}</Label>
                    </div>
                    <Switch id="allow-refunds" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="view-reports">{t('settings.view_reports')}</Label>
                    </div>
                    <Switch id="view-reports" defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save_changes')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notification_settings')}</CardTitle>
              <CardDescription>{t('settings.notification_preferences')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.email_notifications')}</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="order-confirmation">{t('settings.order_confirmation')}</Label>
                    </div>
                    <Switch 
                      id="order-confirmation" 
                      checked={notifications.orderConfirmation}
                      onCheckedChange={() => handleNotificationChange('orderConfirmation')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="low-stock">{t('settings.low_stock')}</Label>
                    </div>
                    <Switch 
                      id="low-stock" 
                      checked={notifications.lowStock}
                      onCheckedChange={() => handleNotificationChange('lowStock')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="daily-summary">{t('settings.daily_summary')}</Label>
                    </div>
                    <Switch 
                      id="daily-summary" 
                      checked={notifications.dailySummary}
                      onCheckedChange={() => handleNotificationChange('dailySummary')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Label htmlFor="marketing-updates">{t('settings.marketing_updates')}</Label>
                    </div>
                    <Switch 
                      id="marketing-updates" 
                      checked={notifications.marketingUpdates}
                      onCheckedChange={() => handleNotificationChange('marketingUpdates')}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>
                <Save className="h-4 w-4 mr-2" />
                {t('settings.save_changes')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}