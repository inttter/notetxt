import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Pencil, Download, Trash2, X, Plus } from 'lucide-react';
import { MdOutlineTag } from "react-icons/md";

const NoteList = ({ notes, currentNoteId, onChangeNote, onAddNote, onRemoveNote, handleEditClick, editingNoteId, newName, handleNameChange, handleSaveName, handleKeyDown, openDownloadDialog, handleUpdateNoteTags, formatCreationDate }) => {
  const [newTags, setNewTags] = useState<{ [key: string]: string }>({});
  const [showTagInput, setShowTagInput] = useState<{ [key: string]: boolean }>({});
  const [showRemoveTags, setShowRemoveTags] = useState(false);
  const [formattedDates, setFormattedDates] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const dates = notes.reduce((acc, note) => {
      acc[note.id] = formatCreationDate(note.id);
      return acc;
    }, {} as { [key: string]: string });
    setFormattedDates(dates);
  }, [notes, formatCreationDate]);

  const handleAddTag = (e, noteId) => {
    e.stopPropagation();
    const newTag = newTags[noteId]?.trim();

    if (newTag) {
      const note = notes.find(n => n.id === noteId);
      const updatedTags = [...(note?.tags || []), newTag];

      // Don't allow a tag that already exists to the same note
      if (note.tags?.includes(newTag)) {
        toast.error('This tag already exists for the current note!');
        return;
      }

      // Updates tags after adding
      handleUpdateNoteTags(noteId, updatedTags);
      setNewTags(prev => ({ ...prev, [noteId]: '' }));

      // Hide input after adding a tag
      setShowTagInput(prev => ({ ...prev, [noteId]: false }));
    }
  };

  const handleRemoveTag = (e, noteId, tag) => {
    e.stopPropagation();
    const note = notes.find(n => n.id === noteId);
    const updatedTags = (note?.tags || []).filter((t) => t !== tag);
    handleUpdateNoteTags(noteId, updatedTags);
  };

  const handleTagInputChange = (noteId, value) => {
    setNewTags(prev => ({ ...prev, [noteId]: value }));
  };

  const handleTagKeyDown = (e, noteId) => {
    if (e.key === 'Enter') {
      handleAddTag(e, noteId);
      // Hide tag input
      setShowTagInput(prev => ({ ...prev, [noteId]: false }));
    }
  };

  const toggleTagInput = (noteId) => {
    setShowTagInput(prev => ({ ...prev, [noteId]: !prev[noteId] }));
  };

  const toggleRemoveTags = () => {
    // Toggle the visibility of the "X" buttons on tags
    setShowRemoveTags(prev => !prev);
  };

  return (
    <div className="flex flex-col space-y-2">
      {notes.length === 0 ? (
        <div className="flex flex-col items-center mt-2 mb-3">
          <div className="text-md md:text-lg text-stone-300">
            No notes found
          </div>
          <span
            className="text-sm md:text-base text-yellow-500 hover:text-yellow-400 cursor-pointer duration-300 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onAddNote();
            }}
          >
            <Plus size={20} className="mr-0.5" /> Click to create a new note
          </span>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`flex flex-col p-2 rounded-lg border text-sm md:text-base text-zinc-300 cursor-pointer duration-300 ${
              currentNoteId === note.id
                ? 'bg-neutral-700/35 border-neutral-700/50'
                : 'bg-neutral-900 hover:bg-neutral-800/70 border-neutral-800 hover:border-neutral-700/60'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onChangeNote(note.id);
            }}
            aria-label="Note List Item"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1 truncate">
                {editingNoteId === note.id ? (
                  <input
                    type="text"
                    value={newName}
                    onChange={handleNameChange}
                    onBlur={handleSaveName}
                    onKeyDown={handleKeyDown}
                    placeholder="Note Title"
                    className="bg-transparent text-zinc-300 focus:text-stone-400 placeholder:text-stone-600 caret-amber-400 outline-none flex-grow min-w-[19rem] text-sm md:text-base duration-300"
                    autoFocus
                    data-vaul-no-drag
                  />
                ) : (
                  <span className="block truncate overflow-ellipsis text-sm md:text-base w-82">
                    {note.name || 'New Note'}
                  </span>
                )}
                <span className="block truncate overflow-ellipsis text-[11px] md:text-xs md:mt-0 -mt-0.5 text-stone-400/80 mb-1">
                  {formattedDates[note.id]}
                </span>
                <span
                  className={`block text-xs truncate overflow-ellipsis duration-300 ${
                    currentNoteId === note.id ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  {note.content ? note.content.substring(0, 55) + '...' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-0.5 ml-1" aria-label="Note Controls">
                <button
                  className="text-stone-500 hover:text-stone-400 duration-300"
                  aria-label="Edit Tags"
                  title="Edit Tags"
                  onClick={toggleRemoveTags}
                >
                  <MdOutlineTag size={20} />
                </button>
                <button
                  className="text-stone-500 hover:text-stone-400 duration-300"
                  aria-label="Rename Note"
                  title="Rename Note"
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
                  title="Download Note"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDownloadDialog(note);
                  }}
                >
                  <Download size={20} />
                </button>
                <button
                  className="text-stone-500 hover:text-stone-400 duration-300"
                  aria-label="Delete Note"
                  title="Delete Note"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveNote(note.id);
                  }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex flex-wrap items-center mt-2">
              <div className="flex items-center flex-wrap gap-1">
                {(note.tags || []).map((tag) => (
                  <div
                    key={tag}
                    className={`flex items-center border text-xs rounded-lg px-2 py-1 truncate max-w-[140px] code tracking-tighter duration-300 ${
                      currentNoteId === note.id ? 'bg-yellow-500/15 border-yellow-500/15' : 'bg-yellow-500/10 border-yellow-500/10'
                    }`}
                  >
                    <span className="truncate overflow-ellipsis duration-300 text-yellow-400">
                      {tag}
                    </span>
                    {/* Only show the X icon on the currently selected note when button is clicked */}
                    {showRemoveTags && currentNoteId === note.id && (
                      <button
                        className="ml-1 text-zinc-100 hover:text-zinc-300 duration-300"
                        aria-label="Remove Tag"
                        title="Remove Tag"
                        onClick={(e) => handleRemoveTag(e, note.id, tag)}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                ))}
                {showTagInput[note.id] ? (
                  <input
                    type="text"
                    value={newTags[note.id] || ''}
                    onChange={(e) => handleTagInputChange(note.id, e.target.value)}
                    onKeyDown={(e) => handleTagKeyDown(e, note.id)}
                    className="w-20 bg-yellow-500/15 border border-yellow-500/15 text-yellow-400 placeholder:text-yellow-400/50 caret-amber-400 outline-none rounded-lg text-xs px-2 py-[0.23rem] code tracking-tighter"
                    placeholder="Tag Name"
                    autoFocus
                  />
                ) : (
                  <button
                    className={`text-stone-400 hover:text-stone-300 text-xs rounded-lg border border-dotted border-neutral-600 px-2 py-1 duration-300 flex items-center ${
                      currentNoteId === note.id ? 'bg-neutral-900' : ''
                    }`}
                    aria-label="Add Tag"
                    title="Add Tag"
                    onClick={() => toggleTagInput(note.id)}
                  >
                    <Plus size={15} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default NoteList;