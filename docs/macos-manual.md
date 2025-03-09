# Freedom POS: macOS User Manual

![Freedom POS Logo](https://freedompos.com/logo.png)

## Table of Contents

1. [Introduction](#introduction)
2. [System Requirements](#system-requirements)
3. [Installation](#installation)
4. [Getting Started](#getting-started)
5. [Using the POS System](#using-the-pos-system)
6. [Inventory Management](#inventory-management)
7. [Customer Management](#customer-management)
8. [Orders & Procurement](#orders--procurement)
9. [Reports](#reports)
10. [Settings & Configuration](#settings--configuration)
11. [Troubleshooting](#troubleshooting)
12. [Getting Support](#getting-support)

## Introduction

Freedom POS is a versatile point-of-sale system designed for small to medium businesses. This manual will guide you through installing, setting up, and using Freedom POS on your Mac computer. Freedom POS provides a comprehensive solution for managing sales, inventory, customers, and reporting in a single integrated platform optimized for macOS.

## System Requirements

To run Freedom POS on macOS, your computer should meet the following specifications:

- **Operating System**: macOS Monterey (12) or newer
- **Processor**: Intel Core i3 or Apple Silicon (M1 or newer)
- **Memory**: Minimum 4GB RAM (8GB recommended)
- **Storage**: At least 2GB of available disk space
- **Display**: 1280x800 or higher resolution
- **Internet**: Broadband connection for initial setup and updates
- **Peripherals** (optional):
    - Receipt printer (ESC/POS compatible)
    - Cash drawer
    - Barcode scanner
    - Customer display

## Installation

### Download the Installer

1. Go to the [Freedom POS releases page](https://github.com/Takk8IS/FreedomPOS/releases)
2. Find the latest release and download the macOS installer (`.dmg` file)

### Installation Steps

1. Locate the downloaded `.dmg` file and double-click to mount it
2. Drag the Freedom POS app to your Applications folder
3. If you see a security warning when first launching the app:
    - Right-click (or Control-click) the app icon
    - Select "Open" from the context menu
    - Click "Open" in the dialog that appears
4. The app will finish installation and launch

> **Note for Apple Silicon Macs**: Freedom POS is universal and runs natively on both Intel and Apple Silicon Macs without requiring Rosetta 2.

## Getting Started

### First Launch

1. Launch Freedom POS from the Applications folder or Launchpad
2. The application will initialize and show the login screen
3. For first-time setup, use the default credentials:
    - Username: `admin`
    - Password: `admin`
4. You will be prompted to change the default password immediately

### Initial Configuration

After logging in for the first time, you'll need to configure the system:

1. **Business Information**

    - Enter your business name, address, and contact information
    - Upload your business logo (optional)
    - Set your tax rates and currency format

2. **User Accounts**

    - Create accounts for staff members
    - Assign appropriate roles and permissions

3. **Hardware Setup**
    - Configure your receipt printer
    - Set up your cash drawer
    - Connect your barcode scanner

## Using the POS System

The POS (Point of Sale) module is where you'll process customer transactions.

### Processing a Sale

1. Click on the "POS" module in the main navigation
2. Start a new transaction by clicking "New Sale"
3. Add items to the sale by:
    - Scanning a barcode
    - Searching for products by name or code
    - Browsing categories
4. Adjust quantities as needed
5. Apply discounts if applicable
6. Click "Checkout" when all items are added
7. Select the payment method:
    - Cash
    - Card
    - Mixed payment
8. Enter the received amount
9. Complete the transaction
10. Print or email the receipt as needed

> **Tip**: Use keyboard shortcuts to speed up transactions. Press ⌘K to view all available shortcuts.

### Managing Open Tabs

1. Click "Open Tabs" to view all current open transactions
2. Select a tab to continue processing it
3. Click "Close Tab" after completing payment

### Processing Returns

1. Click "Returns" in the POS module
2. Search for the original transaction by receipt number or date
3. Select the items to be returned
4. Process the refund through the appropriate payment method
5. Print a return receipt

## Inventory Management

The Inventory module helps you keep track of your products and stock levels.

### Adding Products

1. Go to the "Products" module
2. Click "Add New Product"
3. Fill in the product details:
    - Name
    - SKU/Barcode
    - Description
    - Category
    - Pricing (cost and selling price)
    - Tax rate
    - Stock levels
    - Reorder points
4. Upload product images (optional)
5. Click "Save" to add the product to your inventory

### Managing Categories

1. Go to "Products" > "Categories"
2. Add, edit, or delete product categories
3. Organize categories in a hierarchical structure if needed

### Stock Control

1. Go to "Inventory" module
2. View current stock levels for all products
3. Perform stock adjustments:
    - Click "Stock Adjustment"
    - Select reason (damage, shrinkage, correction, etc.)
    - Enter adjustment quantities
    - Save the adjustment

### Stock Counts

1. Go to "Inventory" > "Stock Count"
2. Start a new stock count
3. Enter counted quantities for each product
4. Review discrepancies
5. Approve and apply the stock count to update inventory

> **Tip**: For large inventories, use the CSV import/export feature to manage stock counts with a spreadsheet application.

## Customer Management

The Customers module allows you to maintain your customer database and track customer activities.

### Adding Customers

1. Go to the "Customers" module
2. Click "Add New Customer"
3. Enter customer details:
    - Name
    - Contact information
    - Address
    - Notes
4. Click "Save" to add the customer

### Customer Lookup

1. Use the search function in the Customers module
2. Search by name, phone, or email
3. View customer details and purchase history

### Customer Analytics

1. Go to "Customers" > "Analytics"
2. View metrics like:
    - Top customers by spend
    - Purchase frequency
    - Average transaction value
    - Recent vs. lapsed customers

## Orders & Procurement

The Procurement module helps you manage product ordering and receiving.

### Creating Purchase Orders

1. Go to "Procurements" module
2. Click "New Purchase Order"
3. Select a supplier
4. Add products and quantities
5. Set expected delivery date
6. Save and send the purchase order

### Receiving Orders

1. Go to "Procurements" > "Receive"
2. Select the open purchase order
3. Enter received quantities
4. Adjust for any discrepancies
5. Complete the receiving process to update inventory

### Managing Suppliers

1. Go to "Providers" module
2. Add, edit, or view supplier information
3. Track order history and performance

## Reports

The Reports module provides insights into your business performance.

### Available Reports

- **Sales Reports**: Daily, weekly, monthly sales
- **Product Reports**: Best/worst sellers, profit margins
- **Inventory Reports**: Stock levels, value, turnover
- **Customer Reports**: Purchase behavior, loyalty
- **Staff Reports**: Performance, transactions processed

### Generating Reports

1. Go to the "Reports" module
2. Select the report type
3. Set parameters (date range, categories, etc.)
4. Click "Generate Report"
5. View on screen, print, or export to CSV/PDF

> **Tip**: You can schedule reports to be automatically generated and emailed at regular intervals. Configure this in Settings > Reports > Scheduled Reports.

## Settings & Configuration

The Settings module allows you to customize Freedom POS to your needs.

### System Settings

1. Go to "Settings" module
2. Configure:
    - Business information
    - Receipt templates
    - Tax rates
    - Payment methods
    - User roles and permissions
    - Email settings
    - Backup & restore

### Customization

1. Go to "Settings" > "Appearance"
2. Customize:
    - Color theme
    - Layout options
    - Receipt design
    - Displayed information

### macOS Integration

Freedom POS integrates with several macOS features:

1. **iCloud Backup**: Enable automatic backups to iCloud
2. **Continuity Camera**: Use your iPhone as a document scanner
3. **Handoff**: Start a transaction on your Mac and continue on your iPad
4. **Apple Pay**: Accept Apple Pay payments with compatible hardware

## Troubleshooting

### Common Issues

#### Application Won't Start

1. Check if macOS is blocking the app:
    - Go to System Settings > Privacy & Security
    - Check if there's a message about Freedom POS being blocked
    - Click "Open Anyway" if necessary
2. Verify app permissions:
    - Go to System Settings > Privacy & Security > Privacy
    - Ensure Freedom POS has necessary permissions (Camera, Microphone, etc.)
3. Reinstall the application

#### Printer Not Connecting

1. Ensure the printer is powered on and connected
2. Check macOS printer settings to confirm it's set up correctly:
    - System Settings > Printers & Scanners
3. Restart the printer and the Freedom POS application

#### Performance Issues

1. Close other applications to free up system resources
2. Check Activity Monitor to identify resource-intensive processes
3. Clear application cache (Settings > System > Clear Cache)

### Error Messages

| Error Code | Description                 | Solution                                     |
| ---------- | --------------------------- | -------------------------------------------- |
| E1001      | Database connection error   | Check internet connection or contact support |
| E1002      | Printer communication error | Verify printer is connected and turned on    |
| E1003      | Invalid license             | Verify your license information in Settings  |
| E1004      | Data synchronization failed | Check internet connection and try again      |

## Getting Support

### Help Resources

- **In-app Help**: Click the "?" icon in the top-right corner
- **Knowledge Base**: Visit [help.freedompos.com](https://help.freedompos.com)
- **Video Tutorials**: [tutorials.freedompos.com](https://tutorials.freedompos.com)

### Contact Support

- **Email**: support@freedompos.com
- **Phone**: 1-800-FREEDOM
- **Chat**: Available within the application during business hours

### Providing Feedback

We welcome your suggestions for improving Freedom POS:

1. Go to "Settings" > "Feedback"
2. Complete the feedback form
3. Submit your ideas or report issues

---

_This manual was created for Freedom POS version 1.0 and may not reflect changes in newer versions._

## Licence

Copyright (c)
License: Attribution 4.0 International (CC BY 4.0)
Author: David C Cavalcante

## Donations

If this project has been helpful, consider making a donation:

**USDT (TRC-20)**: `TP6zpvjt2ZNGfWKPevfp65ZrcbKMWSQXDi`

Your support helps us continue to develop innovative tools.

## Support

To contribute to public and social projects focused on research and artificial intelligence, feel free to support with any amount you prefer.

## About the Author

David C Cavalcante

- Philosopher & Writer, Artificial Intelligence Consultant Tech Lead, Researcher & Author, Strategic Marketing & Design Specialist, Developer & Software Engineer

- **LinkedIn**: [linkedin.com/in/hellodav](https://linkedin.com/in/hellodav/)
- **Medium**: [medium.com/@davcavalcante](https://medium.com/@davcavalcante/)

Takk™ Innovate Studio

- Positive results, rapid innovation
- Leading the Digital Revolution as the Pioneering 100% Artificial Intelligence Team

- **GitHub**: [github.com/takk8is](https://github.com/takk8is)
- **X**: [x.com/takk8is](https://x.com/takk8is/)
- **Medium**: [takk8is.medium.com](https://takk8is.medium.com/)
- **URL**: [takk.ag](https://takk.ag/)
