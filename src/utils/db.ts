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

export class NotesDatabase extends Dexie {
  notes: Dexie.Table<Note, string>;
  currentNote: Dexie.Table<CurrentNote, string>;

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

    this.notes = this.table('notes');
    this.currentNote = this.table('currentNote');
  }
}

const db = new NotesDatabase();
export default db;