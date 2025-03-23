import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export interface SystemSettings {
  business: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    taxId: string;
    currency: string;
    taxRate: number;
  };
  invoice: {
    showLogo: boolean;
    showHeader: boolean;
    showFooter: boolean;
    headerText: string;
    footerText: string;
    warrantyText: string;
  };
  payment: {
    cardPayments: boolean;
    cashPayments: boolean;
    mobilePayments: boolean;
    printReceipt: boolean;
    emailReceipt: boolean;
  };
  receipt: {
    headerText: string;
    footerText: string;
    showTax: boolean;
    showDiscounts: boolean;
    showBarcode: boolean;
  };
  notifications: {
    orderConfirmation: boolean;
    lowStock: boolean;
    dailySummary: boolean;
    marketingUpdates: boolean;
  };
}

type SettingsRecord = {
  key: string;
  value: any;
  category: string;
};

class SettingsService {
  private supabase;
  
  constructor() {
    this.supabase = createClientComponentClient();
  }

  async getSettings(): Promise<SystemSettings> {
    try {
      const { data, error } = await this.supabase
        .from('system_settings')
        .select('*');
      
      if (error) throw error;
      
      return this.transformSettings(data as SettingsRecord[]);
    } catch (error) {
      console.error('Failed to get settings:', error);
      throw error;
    }
  }

  async updateSettings(settings: Partial<SystemSettings>): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('system_settings')
        .upsert(this.flattenSettings(settings));
      
      if (error) throw error;
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  }

  private transformSettings(data: SettingsRecord[]): SystemSettings {
    const settings: SystemSettings = {
      business: {
        name: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        taxId: '',
        currency: '',
        taxRate: 0
      },
      invoice: {
        showLogo: false,
        showHeader: false,
        showFooter: false,
        headerText: '',
        footerText: '',
        warrantyText: ''
      },
      payment: {
        cardPayments: false,
        cashPayments: false,
        mobilePayments: false,
        printReceipt: false,
        emailReceipt: false
      },
      receipt: {
        headerText: '',
        footerText: '',
        showTax: false,
        showDiscounts: false,
        showBarcode: false
      },
      notifications: {
        orderConfirmation: false,
        lowStock: false,
        dailySummary: false,
        marketingUpdates: false
      }
    };

    data.forEach(record => {
      const [category, key] = record.key.split('.') as [keyof SystemSettings, string];
      if (category in settings) {
        (settings[category] as any)[key] = record.value;
      }
    });

    return settings;
  }

  private flattenSettings(settings: Partial<SystemSettings>): SettingsRecord[] {
    const flattened: SettingsRecord[] = [];
    for (const [category, values] of Object.entries(settings)) {
      for (const [key, value] of Object.entries(values)) {
        flattened.push({
          key: `${category}.${key}`,
          value,
          category
        });
      }
    }
    return flattened;
  }
}

export const settingsService = new SettingsService();
