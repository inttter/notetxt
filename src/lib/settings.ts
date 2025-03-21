import db, { type AppSettings, type EditorSettings } from '@/utils/db';

export const defaultSettings: Omit<AppSettings, 'id'> = {
  editor: {
    defaultNoteName: 'New Note',
    defaultFileType: '.txt',
    defaultPreviewMode: false,
    showRecentNotes: true
  },
};

export async function getSettings(): Promise<Omit<AppSettings, 'id'>> {
  try {
    const settings = await db.settings.get('user-settings');
    if (!settings) {
      // If settings don't exist, create them
      const newSettings = {
        id: 'user-settings',
        ...defaultSettings,
      }
      await db.settings.put(newSettings);
      return defaultSettings;
    }

    // Remove the id before returning
    const { id, ...settingsWithoutId } = settings;
    return settingsWithoutId;
  } catch (error) {
    console.error('Failed to get settings:', error);
    return defaultSettings;
  }
}

export async function saveSettings(settings: Omit<AppSettings, 'id'>): Promise<void> {
  try {
    await db.settings.update('user-settings', settings);
  } catch (error) {
    console.error('Failed to save settings:', error);
    // If update fails (might not exist yet), try`the below
    try {
      await db.settings.put({
        id: 'user-settings',
        ...settings,
      });
    } catch (putError) {
      console.error('Failed to put settings:', putError);
    };
  };
};

export type { EditorSettings };
