# FreedomPOS API Documentation

## Overview

The FreedomPOS API allows integration with third-party applications and services. This documentation covers all available endpoints, authentication methods, and integration examples.

## Authentication

API uses JWT tokens for authentication. All requests must include an Authorization header.

## Endpoints

### Sales

```http
POST /api/sales
GET /api/sales
GET /api/sales/{id}
```

### Inventory

```http
GET /api/products
POST /api/products
PUT /api/products/{id}
```

### Customers

```http
GET /api/customers
POST /api/customers
PUT /api/customers/{id}
```

### Integration

#### QuickBooks Integration

```http
POST /api/integrations/quickbooks/connect
GET /api/integrations/quickbooks/sync
```

#### Xero Integration

```http
POST /api/integrations/xero/connect
GET /api/integrations/xero/sync
```

## Data Models

Detailed schema information for all API resources.
