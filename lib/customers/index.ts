"use client";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Customer } from '../db/types';

export class CustomerService {
  private supabase;
  
  constructor() {
    this.supabase = createClientComponentClient();
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .select('*');
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get customers:', error);
      throw error;
    }
  }

  async addCustomer(customer: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .insert([customer])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to add customer:', error);
      throw error;
    }
  }

  async updateCustomer(id: string, customer: Partial<Customer>): Promise<Customer> {
    try {
      const { data, error } = await this.supabase
        .from('customers')
        .update(customer)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Failed to update customer:', error);
      throw error;
    }
  }

  async deleteCustomer(id: string): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to delete customer:', error);
      throw error;
    }
  }
}

export const customerService = new CustomerService();