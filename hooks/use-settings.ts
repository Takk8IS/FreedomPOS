import { useState, useEffect } from 'react';
import { settingsService, SystemSettings } from '@/lib/settings';
import { useToast } from '@/hooks/use-toast';

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      console.error('Failed to load settings:', error);
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }

  async function updateSettings(newSettings: Partial<SystemSettings>) {
    try {
      setSaving(true);
      await settingsService.updateSettings(newSettings);
      setSettings(prev => {
        if (!prev) return newSettings as SystemSettings;
        return { ...prev, ...newSettings };
      });
      toast({
        title: "Success",
        description: "Settings updated successfully"
      });
    } catch (error) {
      console.error('Failed to update settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  }

  return {
    settings,
    loading,
    saving,
    updateSettings,
    refresh: loadSettings
  };
}