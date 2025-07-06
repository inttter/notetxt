import Dexie from 'dexie';

export interface Note {
  id: string;
  name: string;
  content: string;
  tags?: string[];
}

export interface Template {
  id: string;
  name: string;
  content: string;
  createdAt: Date;
}

export interface CurrentNote {
  id: string;
  noteId: string;
}

export interface AppState {
  id: string;
  hasSeenWelcome: boolean;
}

export interface EditorSettings {
  defaultPreviewMode: boolean;
  defaultFileType: string;
  defaultNoteName: string;
  showRecentNotes: boolean;
}

export interface AppSettings {
  id: string;
  editor: EditorSettings;
}

export class NotesDatabase extends Dexie {
  notes: Dexie.Table<Note, string>;
  templates: Dexie.Table<Template, string>;
  currentNote: Dexie.Table<CurrentNote, string>;
  appState: Dexie.Table<AppState, string>;
  settings: Dexie.Table<AppSettings, string>;

  constructor() {
    super('Notetxt');

    this.version(1).stores({
      notes: 'id, name, content',
      currentNote: 'id, noteId',
    });

    this.version(2).stores({
      notes: 'id, name, content, tags',
      currentNote: 'id, noteId',
    }).upgrade(tx => {
      // Initialize 'tags' for existing notes
      return tx.table('notes').toCollection().modify(note => {
        if (!note.tags) {
          note.tags = [];
        }
      });
    });

    this.version(3).stores({
      notes: 'id, name, content, tags',
      currentNote: 'id, noteId',
      appState: 'id'
    }).upgrade(async tx => {
      // Initialize app state with welcome note flag off
      // by default for existing databases
      await tx.table('appState').put({
        id: 'flags',
        hasSeenWelcome: false
      });
    });

    this.version(4).stores({
      notes: 'id, name, content, tags',
      currentNote: 'id, noteId',
      appState: 'id',
      settings: 'id',
    }).upgrade(async tx => {
      const oldSettings = await tx.table('settings').get('user-settings');

      if (oldSettings && 'note' in oldSettings) {
        // Migrate from old 'note' structure to new 'editor' structure
        // (not sure that this is needed, but just in case)
        await tx.table('settings').put({
          id: 'user-settings',
          editor: {
            defaultNoteName: oldSettings.note.defaultName || 'New Note',
            defaultFileType: oldSettings.note.defaultFileType || '.txt',
            defaultPreviewMode: oldSettings.note.defaultPreviewMode || false,
            showRecentNotes: oldSettings.note.showRecentNotes || true,
          },
        });
      } else {
        // Initialize default settings
        await tx.table('settings').put({
          id: 'user-settings',
          editor: {
            defaultNoteName: 'New Note',
            defaultFileType: '.txt',
            defaultPreviewMode: false,
            showRecentNotes: true,
          },
        });
      };
    });

    this.version(5).stores({
      notes: 'id, name, content, tags',
      templates: 'id, name, content, createdAt',
      currentNote: 'id, noteId',
      appState: 'id',
      settings: 'id',
    });

    this.notes = this.table('notes');
    this.templates = this.table('templates');
    this.currentNote = this.table('currentNote');
    this.appState = this.table('appState');
    this.settings = this.table('settings');
  }
}

const db = new NotesDatabase();
export default db;
