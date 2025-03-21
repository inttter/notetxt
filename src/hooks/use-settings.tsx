import { useEffect, useState } from 'react';
import { getSettings, saveSettings, defaultSettings } from '@/lib/settings';
import type { AppSettings, EditorSettings } from '@/utils/db';

export function useSettings() {
  const [settings, setSettings] = useState<Omit<AppSettings, 'id'>>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load settings from Dexie on the client-side
    const loadSettings = async () => {
      try {
        const loadedSettings = await getSettings();
        setSettings(loadedSettings);
        setIsLoaded(true);
      } catch (error) {
        console.error('Error loading settings:', error);
        setSettings(defaultSettings);
        setIsLoaded(true);
      };
    };

    loadSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<Omit<AppSettings, 'id'>>) => {
    const updatedSettings = {
      ...settings,
      ...newSettings,
    };

    setSettings(updatedSettings);
    await saveSettings(updatedSettings);
    return updatedSettings;
  };

  const updateEditorSettings = async (editorSettings: Partial<EditorSettings>) => {
    return await updateSettings({
      editor: {
        ...settings.editor,
        ...editorSettings,
      },
    });
  };

  const resetSettings = async () => {
    setSettings(defaultSettings);
    await saveSettings(defaultSettings);
    return defaultSettings;
  };

  return {
    settings,
    isLoaded,
    updateSettings,
    updateEditorSettings,
    resetSettings,
  }
}

