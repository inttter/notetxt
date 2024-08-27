import React from 'react';
import { Pencil, Download, Trash2 } from 'lucide-react';

const NoteList = ({ notes, currentNoteId, onChangeNote, onAddNote, onRemoveNote, handleEditClick, editingNoteId, newName, handleNameChange, handleSaveName, handleKeyDown, openDownloadDialog }) => {
  return (
    <div className="flex flex-col space-y-2">
      {notes.length === 0 ? (
        <div className="text-stone-500 text-base text-center mt-1 mb-1">
          No notes found.
          <span
            className="text-stone-400 hover:text-opacity-80 text-base text-center border-b border-neutral-700 ml-1 duration-300 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onAddNote();
            }}
          >
            Create a new one?
          </span>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`flex justify-between items-center p-2 rounded-md border text-sm md:text-base text-zinc-300 cursor-pointer duration-300 ${
              currentNoteId === note.id
                ? 'bg-neutral-800 bg-opacity-50 border-neutral-800'
                : 'bg-neutral-900 bg-opacity-50 border-neutral-800'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onChangeNote(note.id);
            }}
            aria-label="Note List Item"
          >
            {editingNoteId === note.id ? (
              <input
                type="text"
                value={newName}
                onChange={handleNameChange}
                onBlur={handleSaveName}
                onKeyDown={handleKeyDown}
                placeholder="Note Title"
                className="bg-transparent text-zinc-300 focus:text-stone-400 placeholder:text-stone-600 caret-amber-400 outline-none rounded-md flex-grow min-w-[8rem] text-base duration-300"
                autoFocus
              />
            ) : (
              <div className="flex-1 truncate">
                <span className="block truncate overflow-ellipsis text-base w-full md:w-80">
                  {note.name || 'New Note'}
                </span>
                <span
                  className={`block text-xs truncate overflow-ellipsis duration-300 ${
                    currentNoteId === note.id ? 'text-stone-400' : 'text-stone-500 '
                  }`}
                >
                  {note.content ? note.content.substring(0, 50) + '...' : ''}
                </span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <button
                className="text-stone-500 hover:text-stone-400 duration-300"
                aria-label="Rename Note"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditClick(note);
                }}
              >
                <Pencil size={20} />
              </button>
              <button
                className="text-stone-500 hover:text-stone-400 duration-300"
                aria-label="Download Note"
                onClick={(e) => {
                  e.stopPropagation();
                  openDownloadDialog(note);
                }}
              >
                <Download size={20} />
              </button>
              <button
                aria-label="Delete Note"
                className="text-stone-500 hover:text-stone-400 duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveNote(note.id);
                }}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;