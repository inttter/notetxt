import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/Dropdown';
import { Tags, Pencil, Download, Trash2, X, Plus, MoreHorizontal, Copy } from 'lucide-react';

const NoteList = ({ notes, currentNoteId, onChangeNote, onAddNote, onRemoveNote, handleEditClick, editingNoteId, newName, handleNameChange, handleSaveName, handleKeyDown, handleCopyNote, openDownloadDialog, handleUpdateNoteTags, formatCreationDate, searchQuery }) => {
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
        toast.warning('This tag already exists for the current note!');
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

  const handleEditTags = (e, note) => {
    // Don't allow tags to be edited if there are no tags attached to the note
    if (!note.tags || note.tags.length === 0) {
      toast.warning('No tags available to edit!', {
        description: 'Add at least one tag to this note to edit its tags.',
      });
      return;
    }

    // Toggle the visibility of the "X" buttons on tags
    setShowRemoveTags(prev => !prev);
  };

  const options = [
    {
      label: 'Edit Tags',
      icon: Tags,
      onClick: (e, note) => handleEditTags(e, note),
      ariaLabel: 'Edit Tags',
    },
    {
      label: 'Copy Note',
      icon: Copy,
      onClick: (e, note) => {
        e.stopPropagation();
        handleCopyNote(note);
      },
      ariaLabel: 'Copy Note',
    },
    {
      label: 'Rename Note',
      icon: Pencil,
      onClick: (e, note) => {
        e.stopPropagation();
        handleEditClick(note);
      },
      ariaLabel: 'Rename Note',
    },
    {
      label: 'Download Note',
      icon: Download,
      onClick: (e, note) => {
        e.stopPropagation();
        openDownloadDialog(note);
      },
      ariaLabel: 'Download Note',
    },
    {
      label: 'Delete Note',
      icon: Trash2,
      onClick: (e, note) => {
        e.stopPropagation();
        onRemoveNote(note.id);
      },
      ariaLabel: 'Delete Note',
    },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {notes.length === 0 ? (
        <div className="flex flex-col items-center mt-2 mb-3">
          <div className="text-md md:text-lg text-stone-300">No notes found</div>
          <span
            className="text-sm md:text-base text-yellow-500 hover:text-yellow-400 cursor-pointer duration-300 flex items-center"
            onClick={(e) => {
              e.stopPropagation();
              onAddNote();
            }}
          >
            <Plus size={18} className="mr-0.5" /> Create a new note
          </span>
        </div>
      ) : (
        notes.map((note) => (
          <div
            key={note.id}
            className={`flex flex-col relative p-2 rounded-lg border text-sm md:text-base text-zinc-300 cursor-pointer duration-300 ${
              currentNoteId === note.id
                ? 'bg-neutral-800/60 border-neutral-700/60'
                : 'bg-neutral-900 hover:bg-neutral-800/60 border-neutral-800 hover:border-neutral-700/60'
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
                    className="bg-neutral-800 border border-neutral-700/60 px-1 md:px-0 p-[1px] rounded-md text-zinc-300 placeholder:text-stone-400/80 placeholder:font-normal font-medium caret-amber-400 outline-none flex-grow min-w-[14rem] sm:min-w-[20rem] md:min-w-[23rem] text-sm md:text-base duration-300"
                    data-vaul-no-drag
                  />
                ) : (
                  <span className="block truncate overflow-ellipsis font-medium text-sm md:text-base w-60 md:w-96 sm:w-10/12 duration-300 text-zinc-300">
                    {note.name || 'New Note'}
                  </span>
                )}
                <span className="block truncate overflow-ellipsis text-[11px] text-zinc-300/85 md:text-xs md:mt-0 -mt-0.5 mb-0.5 md:mb-1 duration-300">
                  {formattedDates[note.id]}
                </span>
                <span
                  className={`block text-xs truncate overflow-ellipsis duration-300 ${
                    currentNoteId === note.id ? 'text-stone-300/70' : 'text-stone-400/80'
                  }`}
                >
                  {note.content || ''}
                </span>
              </div>
              <DropdownMenu aria-label="Note Options">
                <TooltipProvider delayDuration={50}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="text-zinc-300 hover:text-zinc-100 duration-300 absolute top-0 right-0 mt-2 mr-2"  
                          aria-label="Show Note Options Dropdown"
                        >
                          <MoreHorizontal size={20} />
                        </button>
                      </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>Note Options</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <DropdownMenuContent
                  align="center"
                  sideOffset={5}
                  className="bg-neutral-900 border border-neutral-800 text-zinc-300 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden mr-3"
                  onCloseAutoFocus={(e) => e.preventDefault()}
                >
                  {options.map(({ label, icon: Icon, onClick, ariaLabel }) => (
                    <DropdownMenuItem
                      className={`hover:bg-neutral-800 hover:cursor-pointer rounded-md duration-300 ${
                        label === 'Delete Note' ? 'text-destructive' : ''
                      }`}
                      key={label}
                      onClick={(e) => onClick(e, note)}
                      aria-label={ariaLabel}
                    >
                      <Icon size={16} className="mr-1.5" />
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex flex-wrap items-center mt-2">
              <div className="flex items-center flex-wrap gap-1">
              {(note.tags || []).map((tag) => (
                  <div
                    key={tag}
                    className={`flex items-center border border-neutral-700/60 px-2 py-1 max-w-[140px] rounded-lg text-yellow-400 text-xs truncate overflow-ellipsis tracking-tight duration-300 font-ia-quattro ${
                      currentNoteId === note.id ? 'bg-yellow-500/15 border-yellow-500/15' : 'bg-yellow-500/10 border-yellow-500/10'
                    } ${searchQuery && tag === searchQuery ? 'bg-yellow-500/30 border-yellow-500/30 text-yellow-300' : ''}`}
                  >
                    <span className="truncate overflow-ellipsis duration-300">
                      {tag}
                    </span>
                    {/* Only show the X icon on the currently selected note when button is clicked */}
                    {showRemoveTags && currentNoteId === note.id && (
                      <button
                        className="text-zinc-100 hover:text-red-400 duration-300"
                        aria-label="Remove Tag"
                        title="Remove Tag"
                        onClick={(e) => handleRemoveTag(e, note.id, tag)}
                      >
                        <X size={14} className="ml-[0.2rem] -mr-[0.1rem]" />
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
                    className="w-20 bg-yellow-500/15 border border-yellow-500/15 text-yellow-400 placeholder:text-yellow-400/60 caret-amber-400 outline-none rounded-lg text-xs px-2 py-[0.25rem] font-ia-quattro tracking-tight"
                    placeholder="Tag Name"
                    autoFocus
                  />
                ) : (
                  <TooltipProvider delayDuration={50}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          className={`text-yellow-400 hover:bg-yellow-500/25 hover:border-yellow-500/40 text-xs rounded-lg border px-2 py-[0.28rem] md:py-[0.26rem] flex items-center duration-300 ${
                            currentNoteId === note.id
                              ? 'bg-yellow-500/15 border-yellow-500/15'
                              : 'bg-yellow-500/10 border-yellow-500/10'
                          }`}
                          aria-label="Add Tag"
                          onClick={() => toggleTagInput(note.id)}
                        >
                          <Plus size={15} />
                          {(!note.tags || note.tags.length === 0) && <span className="ml-1">Add tag</span>}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>Add Tag</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
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
