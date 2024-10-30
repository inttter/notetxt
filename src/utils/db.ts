import Dexie from 'dexie';

export interface Note {
  id: string;
  name: string;
  content: string;
  tags?: string[];
}

export interface CurrentNote {
  id: string;
  noteId: string;
}

export interface AppState {
  id: string;
  hasSeenWelcome: boolean;
}

export class NotesDatabase extends Dexie {
  notes: Dexie.Table<Note, string>;
  currentNote: Dexie.Table<CurrentNote, string>;
  appState: Dexie.Table<AppState, string>;

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

    this.notes = this.table('notes');
    this.currentNote = this.table('currentNote');
    this.appState = this.table('appState');
  }
}

const db = new NotesDatabase();
export default db;