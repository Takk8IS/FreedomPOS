import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { DatabaseOperations, User, Product, WhereCondition } from './types';
import { PostgresDB } from './postgres';

// Database schema
export interface HiPOSDB extends DBSchema {
  users: {
    key: string;
    value: User;
    indexes: { 'by-email': string };
  };
  products: {
    key: string;
    value: Product;
    indexes: {};
  };
}

// Environment detection
export enum StorageEnvironment {
  DESKTOP = 'desktop',
  WEB = 'web',
}

// Detect if running in Tauri/desktop environment or web
function detectEnvironment(): StorageEnvironment {
  // Check for Tauri-specific variables
  if (
    typeof window !== 'undefined' &&
    // @ts-ignore - Tauri global object
    (window.__TAURI__ || process.env.TAURI_BUILD === 'true')
  ) {
    return StorageEnvironment.DESKTOP;
  }
  
  // Check if specific web environment variable is set
  if (process.env.NEXT_PUBLIC_USE_POSTGRES === 'true') {
    return StorageEnvironment.WEB;
  }
  
  // Default based on environment - if we're running server-side, use Postgres
  if (typeof window === 'undefined') {
    return StorageEnvironment.WEB;
  }
  
  // Default to desktop if we can't determine
  return StorageEnvironment.DESKTOP;
}

// Database class implementing the DatabaseOperations interface
export class Database implements DatabaseOperations {
  private db: IDBPDatabase<HiPOSDB> | null = null;
  private static instance: Database;
  private storageType: StorageEnvironment;
  private postgresDB: PostgresDB | null = null;
  private initialized = false;
  
  private constructor() {
    this.storageType = detectEnvironment();
    if (this.storageType === StorageEnvironment.WEB) {
      this.postgresDB = PostgresDB.getInstance();
    }
  }
  
  /**
   * Get the singleton instance of the Database
   */
  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
  
  /**
   * Initialize the database connection
   */
  public async init(): Promise<void> {
    try {
      if (this.initialized) return;
      
      if (this.storageType === StorageEnvironment.DESKTOP) {
        this.db = await openDB<HiPOSDB>('hipos', 2, {
          upgrade(db, oldVersion, newVersion) {
            if (oldVersion < 1) {
              const userStore = db.createObjectStore('users', { keyPath: 'id' });
              userStore.createIndex('by-email', 'email', { unique: true });
            }
            if (oldVersion < 2) {
              db.createObjectStore('products', { keyPath: 'id' });
            }
          },
        });
      } else {
        // PostgresDB is already initialized in its singleton
        if (!this.postgresDB) {
          this.postgresDB = PostgresDB.getInstance();
        }
        await this.postgresDB.init();
      }
      
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw new Error(`Database initialization failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * SELECT operation - get all records from a table
   */
  public async select<T extends keyof HiPOSDB>(
    table: T,
  ): Promise<HiPOSDB[T]['value'][]> {
    try {
      await this.ensureInitialized();
      
      if (this.storageType === StorageEnvironment.DESKTOP) {
        if (!this.db) throw new Error('IndexedDB not initialized');
        return await this.db.getAll(table);
      } else {
        if (!this.postgresDB) throw new Error('PostgresDB not initialized');
        return await this.postgresDB.select(table);
      }
    } catch (error) {
      console.error(`Failed to select from ${String(table)}:`, error);
      throw new Error(`SELECT operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * SELECT operation with WHERE clause - get records matching condition
   */
  public async selectWhere<T extends keyof HiPOSDB>(
    table: T,
    where: WhereCondition
  ): Promise<HiPOSDB[T]['value'][]> {
    try {
      await this.ensureInitialized();
      
      if (this.storageType === StorageEnvironment.DESKTOP) {
        if (!this.db) throw new Error('IndexedDB not initialized');
        
        if (where.field === 'id') {
          // If searching by ID, use get for better performance
          const record = await this.db.get(table, where.value);
          return record ? [record] : [];
        } else if (table === 'users' && where.field === 'email') {
          // If searching users by email, use the index
          return await this.db.getAllFromIndex(table, 'by-email', where.value);
        } else {
          // Otherwise, get all and filter manually
          const allRecords = await this.db.getAll(table);
          return allRecords.filter(
            record => (record as any)[where.field] === where.value
          );
        }
      } else {
        if (!this.postgresDB) throw new Error('PostgresDB not initialized');
        return await this.postgresDB.selectWhere(table, where);
      }
    } catch (error) {
      console.error(`Failed to select from ${String(table)} with condition:`, error);
      throw new Error(`SELECT WHERE operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get a single record by ID
   */
  public async getById<T extends keyof HiPOSDB>(
    table: T,
    id: string
  ): Promise<HiPOSDB[T]['value'] | undefined> {
    try {
      await this.ensureInitialized();
      
      if (this.storageType === StorageEnvironment.DESKTOP) {
        if (!this.db) throw new Error('IndexedDB not initialized');
        return await this.db.get(table, id);
      } else {
        if (!this.postgresDB) throw new Error('PostgresDB not initialized');
        return await this.postgresDB.getById(table, id);
      }
    } catch (error) {
      console.error(`Failed to get ${String(table)} by ID:`, error);
      throw new Error(`getById operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * INSERT operation - add a new record
   */
  public async insert<T extends keyof HiPOSDB>(
    table: T,
    data: HiPOSDB[T]['value']
  ): Promise<HiPOSDB[T]['value']> {
    try {
      await this.ensureInitialized();
      
      // Add timestamps 
      const now = new Date().toISOString();
      const dataWithTimestamps = {
        ...data,
        created_at: now,
      };
      
      if (table === 'products') {
        (dataWithTimestamps as any).updated_at = now;
      }
      
      if (this.storageType === StorageEnvironment.DESKTOP) {
        if (!this.db) throw new Error('IndexedDB not initialized');
        await this.db.put(table, dataWithTimestamps);
        return dataWithTimestamps;
      } else {
        if (!this.postgresDB) throw new Error('PostgresDB not initialized');
        return await this.postgresDB.insert(table, dataWithTimestamps);
      }
    } catch (error) {
      console.error(`Failed to insert into ${String(table)}:`, error);
      throw new Error(`INSERT operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * UPDATE operation - update an existing record
   */
  public async update<T extends keyof HiPOSDB>(
    table: T,
    id: string,
    data: Partial<HiPOSDB[T]['value']>
  ): Promise<HiPOSDB[T]['value']> {
    try {
      await this.ensureInitialized();
      
      // Add updated_at timestamp for products
      const dataWithTimestamps = { ...data };
      if (table === 'products') {
        (dataWithTimestamps as any).updated_at = new Date().toISOString();
      }
      
      if (this.storageType === StorageEnvironment.DESKTOP) {
        if (!this.db) throw new Error('IndexedDB not initialized');
        
        // Get existing record
        const existingRecord = await this.db.get(table, id);
        if (!existingRecord) {
          throw new Error(`Record with ID ${id} not found`);
        }
        
        // Merge existing with new data
        const updatedRecord = {
          ...existingRecord,
          ...dataWithTimestamps,
        };
        
        // Save the updated record
        await this.db.put(table, updatedRecord);
        return updatedRecord;
      } else {
        if (!this.postgresDB) throw new Error('PostgresDB not initialized');
        return await this.postgresDB.update(table, id, dataWithTimestamps);
      }
    } catch (error) {
      console.error(`Failed to update ${String(table)}:`, error);
      throw new Error(`UPDATE operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * DELETE operation - remove a record
   */
  public async delete<T extends keyof HiPOSDB>(
    table: T,
    id: string
  ): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      if (this.storageType === StorageEnvironment.DESKTOP) {
        if (!this.db) throw new Error('IndexedDB not initialized');
        
        // Check if record exists
        const existing = await this.db.get(table, id);
        if (!existing) {
          return false;
        }
        
        // Delete the record
        await this.db.delete(table, id);
        return true;
      } else {
        if (!this.postgresDB) throw new Error('PostgresDB not initialized');
        return await this.postgresDB.delete(table, id);
      }
    } catch (error) {
      console.error(`Failed to delete from ${String(table)}:`, error);
      throw new Error(`DELETE operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Helper method to ensure the database is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.init();
    }
  }
  
  /**
   * Close database connections
   */
  public async close(): Promise<void> {
    try {
      if (this.storageType === StorageEnvironment.DESKTOP && this.db) {
        this.db.close();
        this.db = null;
      }
      
      if (this.storageType === StorageEnvironment.WEB && this.postgresDB) {
        await this.postgresDB.close();
      }
      
      this.initialized = false;
    } catch (error) {
      console.error('Failed to close database:', error);
      throw new Error(`Close operation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  /**
   * Get the current storage environment (for debugging)
   */
  public getStorageType(): StorageEnvironment {
    return this.storageType;
  }
}

// Export a default instance
export default Database.getInstance();

import { openDB, IDBPDatabase } from 'idb';
import postgres from './postgres';
import { 
  User, 
  Product, 
  DatabaseOperations, 
  HiPOSDB, 
  StorageEnvironment, 
  detectEnvironment 
} from './types';

class Database {
  private db: IDBPDatabase<HiPOSDB> | null = null;
  private static instance: Database;
  private isDesktop: boolean = false;

  private constructor() {
    // Check if we're in a Tauri environment to determine if desktop app
    this.isDesktop = typeof window !== 'undefined' && 
      window.navigator.userAgent.includes('Tauri') || 
      process.env.TAURI_BUILD === 'true';
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  async connect() {
    if (!this.db && typeof window !== 'undefined') {
      this.db = await openDB<HiPOSDB>('hipos', 2, {
        upgrade(db, oldVersion, newVersion) {
          if (oldVersion < 1) {
            const userStore = db.createObjectStore('users', { keyPath: 'id' });
            userStore.createIndex('by-email', 'email', { unique: true });
          }
          if (oldVersion < 2) {
            db.createObjectStore('products', { keyPath: 'id' });
          }
        },
      });
    }
  }

  // This is the main method that decides where to route database operations
  private async getDbHandler() {
    // Always use IndexedDB for desktop
    if (this.isDesktop) {
      await this.connect();
      return 'indexeddb';
    }

    // For web: use Postgres if server-side or if explicitly set to use database server
    if (typeof window === 'undefined' || process.env.NEXT_PUBLIC_USE_POSTGRES === 'true') {
      return 'postgres';
    }

    // Fallback to IndexedDB for web if Postgres isn't explicitly enabled
    await this.connect();
    return 'indexeddb';
  }

  // Generic CRUD operations that route to the appropriate database handler
  async select(table: string, where?: { field: string; value: any }) {
    const dbHandler = await this.getDbHandler();
    
    if (dbHandler === 'postgres') {
      if (table === 'users') {
        if (where?.field === 'email') {
          return await postgres.getUserByEmail(where.value);
        } else if (where?.field === 'id') {
          return await postgres.getUserById(where.value);
        }
        return await postgres.getUsers();
      } else if (table === 'products') {
        if (where?.field === 'id') {
          return await postgres.getProductById(where.value);
        }
        return await postgres.getProducts();
      }
    } else if (this.db) {
      if (where) {
        if (where.field === 'id') {
          return await this.db.get(table, where.value);
        } else if (where.field === 'email' && table === 'users') {
          const index = this.db.transaction(table).store.index('by-email');
          return await index.get(where.value);
        }
      } else {
        return await this.db.getAll(table);
      }
    }
    return null;
  }

  async insert(table: string, data: any) {
    const dbHandler = await this.getDbHandler();
    
    if (dbHandler === 'postgres') {
      if (table === 'users') {
        return await postgres.createUser(data);
      } else if (table === 'products') {
        return await postgres.createProduct(data);
      }
    } else if (this.db) {
      if (!data.id) {
        data.id = crypto.randomUUID();
      }
      
      if (!data.created_at) {
        data.created_at = new Date().toISOString();
      }
      
      if (table === 'products' && !data.updated_at) {
        data.updated_at = new Date().toISOString();
      }
      
      await this.db.put(table, data);
      return data;
    }
    return null;
  }

  async update(table: string, id: string, data: any) {
    const dbHandler = await this.getDbHandler();
    
    if (dbHandler === 'postgres') {
      if (table === 'users') {
        return await postgres.updateUser(id, data);
      } else if (table === 'products') {
        return await postgres.updateProduct(id, data);
      }
    } else if (this.db) {
      const item = await this.db.get(table, id);
      
      if (item) {
        const updatedItem = { ...item, ...data };
        
        if (table === 'products') {
          updatedItem.updated_at = new Date().toISOString();
        }
        
        await this.db.put(table, updatedItem);
        return updatedItem;
      }
    }
    return null;
  }

  async delete(table: string, id: string) {
    const dbHandler = await this.getDbHandler();
    
    if (dbHandler === 'postgres') {
      if (table === 'users') {
        return await postgres.deleteUser(id);
      } else if (table === 'products') {
        return await postgres.deleteProduct(id);
      }
    } else if (this.db) {
      const item = await this.db.get(table, id);
      
      if (item) {
        await this.db.delete(table, id);
        return item;
      }
    }
    return null;
  }
}

export default Database.getInstance();

"use client";

import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface HiPOSDB extends DBSchema {
  users: {
    key: string;
    value: {
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
    };
    indexes: { 'by-email': string };
  };
  products: {
    key: string;
    value: {
      id: string;
      name: string;
      description?: string;
      price: number;
      stock: number;
      category?: string;
      sku?: string;
      created_at: string;
      updated_at: string;
    };
  };
}

class Database {
  private static instance: Database;
  private db: IDBPDatabase<HiPOSDB> | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private async getDB() {
    if (!this.db) {
      this.db = await openDB<HiPOSDB>('hipos', 2, {
        upgrade(db, oldVersion, newVersion) {
          if (oldVersion < 1) {
            const userStore = db.createObjectStore('users', { keyPath: 'id' });
            userStore.createIndex('by-email', 'email', { unique: true });
          }
          if (oldVersion < 2) {
            db.createObjectStore('products', { keyPath: 'id' });
          }
        },
      });
    }
    return this.db;
  }

  public async query(sql: string, params: any[] = []) {
    const db = await this.getDB();
    
    // Parse the SQL-like query to determine the operation
    const operation = sql.trim().split(' ')[0].toLowerCase();
    
    switch (operation) {
      case 'select':
        return this.handleSelect(sql, params, db);
      case 'insert':
        return this.handleInsert(sql, params, db);
      case 'update':
        return this.handleUpdate(sql, params, db);
      case 'delete':
        return this.handleDelete(sql, params, db);
      default:
        throw new Error(`Unsupported operation: ${operation}`);
    }
  }

  private async handleSelect(sql: string, params: any[], db: IDBPDatabase<HiPOSDB>) {
    // Check if query is for products
    if (sql.includes('FROM products')) {
      if (sql.includes('WHERE id =')) {
        const id = params[0];
        const product = await db.get('products', id);
        return { rows: product ? [product] : [] };
      }
      // Get all products
      const allProducts = await db.getAll('products');
      return { rows: allProducts };
    }
    
    // Handle user queries
    if (sql.includes('WHERE email =')) {
      const email = params[0];
      const user = await db.getFromIndex('users', 'by-email', email);
      return { rows: user ? [user] : [] };
    }
    
    if (sql.includes('WHERE id =')) {
      const id = params[0];
      const user = await db.get('users', id);
      return { rows: user ? [user] : [] };
    }

    // Default to getting all users
    const allUsers = await db.getAll('users');
    return { rows: allUsers };
  }

  private async handleInsert(sql: string, params: any[], db: IDBPDatabase<HiPOSDB>) {
    if (sql.includes('INTO products')) {
      const [id, name, description, price, stock, category, sku] = params;
      const now = new Date().toISOString();
      const product = {
        id,
        name,
        description,
        price,
        stock,
        category,
        sku,
        created_at: now,
        updated_at: now
      };
      await db.add('products', product);
      return { rows: [product] };
    }
    
    if (sql.includes('INTO users')) {
      const [id, name, email, password, role, store_name] = params;
      const user = {
        id,
        name,
        email,
        password,
        role,
        store_name,
        created_at: new Date().toISOString()
      };
      await db.add('users', user);
      return { rows: [user] };
    }
    throw new Error('Unsupported insert operation');
  }

  private async handleUpdate(sql: string, params: any[], db: IDBPDatabase<HiPOSDB>) {
    if (sql.includes('products SET')) {
      const id = params[params.length - 1]; // Last param is ID
      const product = await db.get('products', id);
      if (product) {
        // Extract field names from SQL
        const setClause = sql.split('SET')[1].split('WHERE')[0].trim();
        const fields = setClause.split(',').map(field => field.split('=')[0].trim());
        
        // Update fields
        fields.forEach((field, index) => {
          if (field !== 'updated_at') {
            (product as any)[field] = params[index];
          }
        });
        
        product.updated_at = new Date().toISOString();
        await db.put('products', product);
        return { rows: [product] };
      }
      return { rows: [] };
    }
    
    if (sql.includes('users SET')) {
      let user;
      
      // Handle password reset
      if (sql.includes('reset_token')) {
        const [token, expires, email] = params;
        user = await db.getFromIndex('users', 'by-email', email);
        if (user) {
          user.reset_token = token;
          user.reset_token_expires = expires;
          await db.put('users', user);
        }
      }
      
      // Handle password update
      else if (sql.includes('password =')) {
        const [password, token] = params;
        const allUsers = await db.getAll('users');
        user = allUsers.find(u => u.reset_token === token);
        if (user) {
          user.password = password;
          user.reset_token = undefined;
          user.reset_token_expires = undefined;
          await db.put('users', user);
        }
      }
      
      // Handle last login update
      else if (sql.includes('last_login')) {
        const [id] = params;
        user = await db.get('users', id);
        if (user) {
          user.last_login = new Date().toISOString();
          await db.put('users', user);
        }
      }

      return { rows: user ? [user] : [] };
    }
    throw new Error('Unsupported update operation');
  }

  private async handleDelete(sql: string, params: any[], db: IDBPDatabase<HiPOSDB>) {
    if (sql.includes('FROM products')) {
      const id = params[0];
      await db.delete('products', id);
      return { rows: [] };
    }
    
    if (sql.includes('FROM users')) {
      const id = params[0];
      await db.delete('users', id);
      return { rows: [] };
    }
    throw new Error('Unsupported delete operation');
  }
}

export const db = Database.getInstance();