import { PrismaClient } from '@prisma/client';
import { DatabaseOperations, User, Product, WhereCondition } from './types';

/**
 * PostgresDB class to handle database operations using Prisma
 */
export class PostgresDB implements DatabaseOperations {
  private static instance: PostgresDB;
  private prisma: PrismaClient | null = null;
  private initialized = false;

  private constructor() {
    // Private constructor to enforce singleton pattern
  }

  /**
   * Get the singleton instance of PostgresDB
   */
  public static getInstance(): PostgresDB {
    if (!PostgresDB.instance) {
      PostgresDB.instance = new PostgresDB();
    }
    return PostgresDB.instance;
  }

  /**
   * Initialize the Prisma client
   */
  public async init(): Promise<void> {
    try {
      if (this.initialized) return;
      
      this.prisma = new PrismaClient();
      await this.prisma.$connect();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize Postgres:', error);
      throw new Error(`Postgres initialization failed: ${error instanceof Error ?

import { PrismaClient } from '@prisma/client';
import { User, Product, DatabaseOperations } from './types';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Avoid multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export class PostgresDB implements DatabaseOperations {
  private static instance: PostgresDB;

  private constructor() {}

  public static getInstance(): PostgresDB {
    if (!PostgresDB.instance) {
      PostgresDB.instance = new PostgresDB();
    }
    return PostgresDB.instance;
  }

  // Users
  async getUsers(): Promise<User[]> {
    return await prisma.user.findMany();
  }

  async getUser(id: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async createUser(user: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const created_at = new Date().toISOString();
    return await prisma.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        store_name: user.store_name,
        reset_token: user.reset_token,
        reset_token_expires: user.reset_token_expires,
        created_at,
        last_login: user.last_login
      }
    });
  }

  async updateUser(id: string, user: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data: user
    });
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      await prisma.user.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }

  // Products
  async getProducts(filters?: Partial<Product>): Promise<Product[]> {
    if (!filters) {
      return await prisma.product.findMany();
    }
    
    // Filter out undefined values
    const whereClause = Object.entries(filters)
      .filter(([_, value]) => value !== undefined)
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
      
    return await prisma.product.findMany({
      where: whereClause
    });
  }

  async getProduct(id: string): Promise<Product | null> {
    return await prisma.product.findUnique({
      where: { id }
    });
  }

  async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const now = new Date().toISOString();
    return await prisma.product.create({
      data: {
        name: product.name,
        description: product.description,
        price: product.price,
        stock: product.stock,
        category: product.category,
        sku: product.sku,
        created_at: now,
        updated_at: now
      }
    });
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<Product> {
    return await prisma.product.update({
      where: { id },
      data: product
    });
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      await prisma.product.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Database management methods required by DatabaseOperations interface
  async isConnected(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('Database connection error:', error);
      return false;
    }
  }

  async close(): Promise<void> {
    await prisma.$disconnect();
  }
}

export default PostgresDB.getInstance();

