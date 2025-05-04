import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { isMobile } from 'react-device-detect';
import { Check, DoorOpen, FileText, Loader2, RotateCcw, Settings2, Trash2 } from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';
import ConfirmDeleteAll from '@/components/Dialogs/ConfirmDeleteAll';
import Head from 'next/head';
import db from '@/utils/db';

export default function SettingsPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSettingsLoaded, setIsSettingsLoaded] = useState(false);
  const [initialSettings, setInitialSettings] = useState(null);
  const [isModified, setIsModified] = useState(false); 

  const [defaultNoteName, setDefaultNoteName] = useState('New Note');
  const [defaultFileType, setDefaultFileType] = useState('.txt');
  const [defaultPreviewMode, setDefaultPreviewMode] = useState(false);
  const [showRecentNotes, setShowRecentNotes] = useState(true);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);

  const settingsPageTitle = 'Settings';
  const settingsPageDescription = 'Manage all of your Notetxt settings from here.';

  // Load settings from database
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Check if settings table exists
        const tableExists = db.tables.some((table) => table.name === 'settings');

        if (!tableExists) {
          // If the table doesn't exist yet, create it when saving
          setIsSettingsLoaded(true);
          return;
        };

        const settings = await db.settings.get('user-settings');

        // Fetch the users' settings and place them in the states,
        // or fall back to defaults if not found
        if (settings) {
          setDefaultNoteName(settings.editor?.defaultNoteName || 'New Note');
          setDefaultFileType(settings.editor?.defaultFileType || '.txt');
          setDefaultPreviewMode(settings.editor?.defaultPreviewMode || false);
          setShowRecentNotes(settings.editor?.showRecentNotes ?? true);

          // Save initial settings to compare with modified ones
          setInitialSettings({
            defaultNoteName: settings.editor?.defaultNoteName || 'New Note',
            defaultFileType: settings.editor?.defaultFileType || '.txt',
            defaultPreviewMode: settings.editor?.defaultPreviewMode || false,
            showRecentNotes: settings.editor?.showRecentNotes ?? true
          });
        };

        setIsSettingsLoaded(true);
      } catch (error) {
        console.error('Failed to load settings:', error);
        toast.error('Failed to load settings');
        setIsSettingsLoaded(true);
      };
    };

    loadSettings();
  }, []);

  const handleSaveSettings = async () => {
    setIsLoading(true);
  
    setTimeout(async () => {
      try {
        // Check if the settings table exists
        const tableExists = db.tables.some((table) => table.name === 'settings');
  
        if (!tableExists) {
          // Create the settings table if it doesn't exist
          db.version(db.verno + 1).stores({
            settings: 'id',
          });
          await db.open();
        };
  
        const settings = {
          id: 'user-settings',
          editor: {
            defaultNoteName,
            defaultFileType,
            defaultPreviewMode,
            showRecentNotes,
          },
        };
  
        // Save settings
        await db.settings.put(settings);
  
        // Notify user that settings were updated
        toast.success('Settings saved successfully!', {
          description: 'Your preferences have been updated.',
        });
        
        setIsModified(false);
        setInitialSettings({ // Set initial settings again to use newly-saved settings
          defaultNoteName,
          defaultFileType,
          defaultPreviewMode,
          showRecentNotes
        });
      } catch (error) {
        console.error('Failed to save settings:', error);
        toast.error('Failed to save settings.', {
          description: 'Please try again later.',
        });
      } finally {
        setIsLoading(false);
      }
    }, 500); // Delay saving by 500ms to prevent spamming of operation
  };

  // Reset settings back to defaults
  const handleResetSettings = () => {
    setDefaultNoteName('New Note');
    setDefaultFileType('.txt');
    setDefaultPreviewMode(false);
    setShowRecentNotes(true);

    // Notify user that settings were reset but not saved yet
    toast.info('Settings reset to defaults', {
      description: 'Click "Save changes" to apply these changes.',
    });

    setIsModified(true);
  };

  const handleDeleteAllNotes = async () => {
    try {
      await db.notes.clear();

      toast.success('Successfully deleted all current notes.');
      setIsDeleteAllDialogOpen(false);
    } catch (error) {
      console.error('Failed to delete all notes:', error);
      toast.error('Failed to delete all notes.');
    };
  };

  // Checks to see if the current settings match initial settings
  // (if not, then changes have been made to them)
  const hasChanges = (
    defaultNoteName !== initialSettings?.defaultNoteName ||
    defaultFileType !== initialSettings?.defaultFileType ||
    defaultPreviewMode !== initialSettings?.defaultPreviewMode ||
    showRecentNotes !== initialSettings?.showRecentNotes
  );

  // Settings Fields
  const settingsFields = {
    defaultNoteName: {
      label: 'Default Note Name',
      description: 'The default name given to all new notes when they are created.',
    },
    defaultFileType: {
      label: 'Default File Type',
      description: 'Choose the default file type to select when downloading your notes.',
    },
    defaultPreviewMode: {
      label: 'Enable Preview On New Notes',
      description: 'When enabled, new or imported notes will open with the Markdown preview mode toggled on.',
    },
    showRecentNotes: {
      label: 'Show Recent Notes',
      description: 'When enabled, the three newest notes will appear in the Command Menu.',
    },
    deleteAllNotes: {
      label: 'Delete All Notes',
      description: 'Permanently delete all current notes. This cannot be undone!'
    }
  };

  // Settings Section Fields
  const settingsSectionFields = {
    noteSettings: {
      title: 'Note Settings',
      description: 'Configure how notes are created and managed.',
    },
    dangerZone: {
      title: 'Danger Zone',
      description: 'Be careful when making changes in this section!',
    },
  };

  const fileTypes = [
    { name: 'Rich Text', value: '.txt', icon: <FileText size={15} className="mr-1 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={15} className="mr-1 text-stone-400" /> },
  ];

  if (!isSettingsLoaded) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[100vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-zinc-100 font-medium" aria-label="Loading Message">
            Loading settings...
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-dark min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
      <Head>
        <title>Settings • Notetxt</title>
      </Head>

      <Toaster className="pointer-events-auto" richColors closeButton theme="dark" position={isMobile ? "top-center" : "bottom-right"}  />
      <motion.div
        className="max-w-3xl w-full px-4 py-8 space-y-4 flex-col"
        initial={{ opacity: 0.01 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
      
      <div>
        <div
          className="text-2xl text-zinc-100 font-ia-quattro font-semibold tracking-tight flex items-center -mb-0.5"
          aria-label="Settings Page Title"
        >
          <Settings2 size={20} className="mr-1" /> {settingsPageTitle}
        </div>
        <div 
          className="text-zinc-300/85 text-sm" 
          aria-label="Settings Page Description"
        >
          {settingsPageDescription}
        </div>
      </div>

        {/* Note Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{settingsSectionFields.noteSettings.title}</CardTitle>
            <CardDescription>{settingsSectionFields.noteSettings.description}</CardDescription>
          </CardHeader>

          <hr className="border border-neutral-800 rounded-full mb-3" />
          <CardContent className="space-y-6">
            {/* Default Note Name */}
            <div className="space-y-2">
              <Label htmlFor="default-note-name" aria-label="Default Note Name Label">
                {settingsFields.defaultNoteName.label}
              </Label>
              <Input
                id="default-note-name"
                value={defaultNoteName}
                onChange={(e) => setDefaultNoteName(e.target.value)}
                placeholder="Note Name"
                className="text-sm h-9"
              />
              <div className="text-xs md:text-sm text-zinc-300/85" aria-label="Default Note Name Description">
                {settingsFields.defaultNoteName.description}
              </div>
            </div>

            {/* Default File Type */}
            <div className="space-y-2">
              <Label htmlFor="default-file-type" aria-label="Default File Name Label">
                {settingsFields.defaultFileType.label}
              </Label>
              <Select value={defaultFileType} onValueChange={setDefaultFileType}>
                <SelectTrigger
                  className="px-3 py-2 bg-dark border border-neutral-800 hover:border-neutral-700 text-zinc-100 text-sm duration-300 flex items-center focus:outline-none outline-none"
                  id="default-file-type"
                >
                  <div className="flex items-center">
                    {fileTypes.find((type) => type.value === defaultFileType)?.icon}
                    <span>
                      {fileTypes.find((type) => type.value === defaultFileType)?.name || 'Select Format'} ({fileTypes.find((type) => type.value === defaultFileType)?.value})
                    </span>
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-dark border border-neutral-800/60 text-zinc-100 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden duration-300">
                  {fileTypes.map((fileTypeItem) => (
                    <SelectItem
                      key={fileTypeItem.value}
                      className="text-zinc-300 text-sm hover:bg-dark-focus rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300 flex items-center"
                      aria-label="Default File Type Option"
                      value={fileTypeItem.value}
                    >
                      <div className="flex items-center">
                        {fileTypeItem.icon}
                        <span>{fileTypeItem.name} ({fileTypeItem.value})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-xs md:text-sm text-zinc-300/85" aria-label="Default File Type Description">
                {settingsFields.defaultFileType.description}
              </div>
            </div>

            {/* Default Preview Mode */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="default-preview-mode" aria-label="Default Preview Mode Label">
                  {settingsFields.defaultPreviewMode.label}
                </Label>
                <Switch id="default-preview-mode" checked={defaultPreviewMode} onCheckedChange={setDefaultPreviewMode} />
              </div>
              <div className="text-xs md:text-sm text-zinc-300/85" aria-label="Default Preview Mode Description">
                {settingsFields.defaultPreviewMode.description}
              </div>
            </div>
            
            {/* Show Recent Notes */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-recent-notes" aria-label="Show Recent Notes Label">
                  {settingsFields.showRecentNotes.label}
                </Label>
                <Switch id="show-recent-notes" checked={showRecentNotes} onCheckedChange={setShowRecentNotes} />
              </div>
              <div className="text-xs md:text-sm text-zinc-300/85" aria-label="Show Recent Notes Description">
                {settingsFields.showRecentNotes.description}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle>{settingsSectionFields.dangerZone.title}</CardTitle>
            <CardDescription>{settingsSectionFields.dangerZone.description}</CardDescription>
          </CardHeader>

          <hr className="border border-neutral-800 rounded-full mb-3" />
          <CardContent className="space-y-6">
            {/* Delete All Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="delete-all-notes" aria-label="Delete All Notes Label">
                    {settingsFields.deleteAllNotes.label}
                  </Label>                  
                  <div className="text-xs md:text-sm text-zinc-300/85" aria-label="Delete All Notes Description">
                    {settingsFields.deleteAllNotes.description}
                  </div>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-2 md:text-sm text-xs bg-destructive/80 hover:bg-destructive/65 text-white"
                  onClick={() => setIsDeleteAllDialogOpen(true)}
                >
                  <Trash2 size={16} /> Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex w-full">
          {/* Exit Button */}
          <Button 
            variant="default"
            size="lg"
            className="text-zinc-100 text-sm" 
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/editor");
              }
            }}
          >
            <DoorOpen size={16} /> Exit
          </Button>

          <div className="ml-auto flex gap-2">
            {/* Reset Settings Button */}
            <Button
              variant="default"
              className="text-zinc-100 text-sm"
              onClick={handleResetSettings}
              aria-label="Reset Settings Button"
            >
              <RotateCcw size={16} /> Reset
            </Button>

            {/* Save Settings Button */}
            <Button
              variant="primary"
              className="text-sm duration-300 flex items-center group"
              onClick={handleSaveSettings}
              disabled={!hasChanges || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check size={16} /> Save changes
                </>
              )}
            </Button>
          </div>
        </div>
        {isDeleteAllDialogOpen && (
          <ConfirmDeleteAll
            isOpen={isDeleteAllDialogOpen}
            onConfirm={handleDeleteAllNotes}
            onCancel={() => setIsDeleteAllDialogOpen(false)}
          />
        )}
      </motion.div>
    </div>
  );
}
