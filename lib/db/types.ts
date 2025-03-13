// Common database types

// User entity
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  store_name?: string;
  reset_token?: string;
  reset_token_expires?: string;
  created_at: string;
  last_login?: string;
}

// Product entity
export interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category?: string;
  sku?: string;
  created_at: string;
  updated_at: string;
}

// Where condition for queries
export interface WhereCondition {
  field: string;
  value: any;
}

// Database operations interface
export interface DatabaseOperations {
  init(): Promise<void>;
  select<T extends string>(table: T): Promise<any[]>;
  selectWhere<T extends string>(table: T, where: WhereCondition): Promise<any[]>;
  getById<T extends string>(table: T, id: string): Promise<any | undefined>;
  insert<T extends string>(table: T, data: any): Promise<any>;
  update<T extends string>(table: T, id: string, data: Partial<any>): Promise<any>;
  delete<T extends string>(table: T, id: string): Promise<boolean>;
  close(): Promise<void>;
}

/**
 * Shared types for database models between IndexedDB and Postgres
 * These types ensure consistency between local storage in desktop apps
 * and server-side storage in web applications.
 */

/**
 * User entity representing application users
 */
export interface User {
  id: string;              // Primary key
  name: string;            // User's full name
  email: string;           // Unique email for login
  password: string;        // Hashed password
  role: string;            // User role (admin, manager, cashier, etc.)
  store_name?: string;     // Optional store association
  reset_token?: string;    // Optional password reset token
  reset_token_expires?: string; // Optional token expiration date
  created_at: string;      // Creation timestamp
  last_login?: string;     // Optional last login timestamp
}

/**
 * Product entity representing inventory items
 */
export interface Product {
  id: string;              // Primary key
  name: string;            // Product name
  description?: string;    // Optional product description
  price: number;           // Product price
  stock: number;           // Current stock quantity
  category?: string;       // Optional product category
  sku?: string;            // Optional Stock Keeping Unit
  created_at: string;      // Creation timestamp
  updated_at: string;      // Last update timestamp
}

/**
 * Database operations interface
 * Defines the common operations that should be implemented
 * by both IndexedDB and Postgres adapters
 */
export interface DatabaseOperations {
  // User operations
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User>;
  deleteUser(id: string): Promise<boolean>;
  
  // Product operations
  getProduct(id: string): Promise<Product | null>;
  getProducts(filters?: Partial<Product>): Promise<Product[]>;
  createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product>;
  updateProduct(id: string, data: Partial<Product>): Promise<Product>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Database management
  isConnected(): Promise<boolean>;
  close(): Promise<void>;
}

/**
 * Storage environment type
 * Used to determine which storage implementation to use
 */
export enum StorageEnvironment {
  DESKTOP = 'desktop',  // IndexedDB (Tauri desktop)
  WEB = 'web'           // Postgres (Web version)
}

/**
 * Helper function to determine the current environment
 * based on runtime conditions
 */
export function detectEnvironment(): StorageEnvironment {
  // Check if running in Tauri environment
  const isTauri = typeof window !== 'undefined' && window['__TAURI__' as any] !== undefined;
  
  return isTauri ? StorageEnvironment.DESKTOP : StorageEnvironment.WEB;
}

/**
 * Database configuration for Postgres
 */
export interface PostgresConfig {
  connectionString: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

/**
 * IndexedDB database structure
 * Used for TypeScript type checking in IndexedDB operations
 */
export interface HiPOSDB {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  products: {
    key: string;
    value: Product;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  store_name?: string;
  reset_token?: string;
  reset_token_expires?: string;
  created_at: string;
  last_login?: string;
}

export function isUser(obj: any): obj is User {
  return obj && 
         typeof obj.email === 'string' && 
         typeof obj.password === 'string' &&
         typeof obj.role === 'string';
}

