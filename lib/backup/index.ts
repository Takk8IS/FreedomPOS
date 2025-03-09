"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export class BackupService {
    private supabase;

    constructor() {
        this.supabase = createClientComponentClient();
    }

    async createBackup() {
        try {
            // Call database backup function
            const { data, error } = await this.supabase.rpc(
                "create_backup_tables",
            );

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error("Backup failed:", error);
            return { success: false, error };
        }
    }

    async restoreBackup(backupId: string) {
        try {
            // Call database restore function
            const { data, error } = await this.supabase.rpc("restore_backup", {
                backup_id: backupId,
            });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error("Restore failed:", error);
            return { success: false, error };
        }
    }

    async listBackups() {
        try {
            // Get list of available backups
            const { data, error } = await this.supabase
                .from("backup_metadata")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error("Failed to list backups:", error);
            return { success: false, error };
        }
    }

    async scheduleBackup(schedule: { frequency: string; time: string }) {
        try {
            // Schedule automated backup
            const { data, error } = await this.supabase.rpc(
                "schedule_backup",
                schedule,
            );

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error("Failed to schedule backup:", error);
            return { success: false, error };
        }
    }
}
