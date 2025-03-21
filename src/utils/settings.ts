import db from '@/utils/db';
import type { AppSettings } from '@/utils/db';

export const defaultSettings: Omit<AppSettings, 'id'> = {
  editor: {
    defaultNoteName: 'New Note',
    defaultFileType: '.txt',
    defaultPreviewMode: false,
    showRecentNotes: true,
  },
};

export async function getSettings(): Promise<Omit<AppSettings, 'id'>> {
  try {
    // Check if settings table exists
    const tableExists = db.tables.some(table => table.name === 'settings');
    
    if (!tableExists) {
      return defaultSettings;
    };
    
    const settings = await db.settings.get('user-settings')
    
    if (!settings) {
      return defaultSettings;
    };
    
    // Remove the id before returning
    const { id, ...settingsWithoutId } = settings;
    return settingsWithoutId;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return defaultSettings;
  };
};

export async function saveSettings(settings: Omit<AppSettings, 'id'>): Promise<void> {
  try {
    // Check if settings table exists
    const tableExists = db.tables.some(table => table.name === 'settings');
    
    if (!tableExists) {
      // Create settings table if it doesn't exist
      db.version(db.verno + 1).stores({
        settings: 'id'
      });
      await db.open();
    };
    
    await db.settings.put({
      id: 'user-settings',
      ...settings
    });
  } catch (error) {
    console.error('Failed to save settings:', error);
    throw error;
  };
};