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