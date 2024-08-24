import React, { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { Plus, Trash2, NotebookPen, BookOpen, Pencil, Download, FolderOpen, Search } from 'lucide-react';
import hotkeys from 'hotkeys-js';
import { motion } from 'framer-motion';
import DownloadDialog from './Dialogs/Download';
import ConfirmDeleteAll from './Dialogs/ConfirmDeleteAll';

const NoteManager = ({ notes, currentNoteId, onChangeNote, onAddNote, onRemoveNote, onUpdateNoteName, onDownload, onDeleteAllNotes, onOpenNote, searchQuery, setSearchQuery }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newName, setNewName] = useState('');
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [isConfirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);

  const drawerTitle = 'All Notes';
  const drawerDescription = 'Navigate to and manage each one of your notes from here.';
  const keybindTip = 'Tip: Use ↑ and ↓ arrow keys to navigate between notes.';

  useEffect(() => {
    const currentIndex = notes.findIndex(note => note.id === currentNoteId);

    if (isDrawerOpen) {
      hotkeys('del', (event) => {
        event.preventDefault();
        if (currentNoteId) {
          onRemoveNote(currentNoteId);
        }
      });

      hotkeys('down', (event) => {
        event.preventDefault();
        if (currentIndex < notes.length - 1) {
          onChangeNote(notes[currentIndex + 1].id);
        }
      });

      hotkeys('up', (event) => {
        event.preventDefault();
        if (currentIndex > 0) {
          onChangeNote(notes[currentIndex - 1].id);
        }
      });
    } else {
      hotkeys.unbind('del');
      hotkeys.unbind('down');
      hotkeys.unbind('up');
    }

    return () => {
      hotkeys.unbind('del');
      hotkeys.unbind('down');
      hotkeys.unbind('up');
    };
  }, [isDrawerOpen, currentNoteId, notes, onChangeNote, onRemoveNote]);

  const handleEditClick = (note) => {
    setEditingNoteId(note.id);
    setNewName(note.name);
  };

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  };

  const handleSaveName = () => {
    if (editingNoteId && newName.trim() !== '') {
      onUpdateNoteName(editingNoteId, newName);
      setEditingNoteId(null);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSaveName();
    }
  };

  const openDownloadDialog = (note) => {
    setFileName(note.name || '');
    setIsDownloadDialogOpen(true);
  };

  const handleConfirmDeleteAll = () => {
    setConfirmDeleteAllOpen(true);
  };

  const handleDeleteAllNotes = () => {
    onDeleteAllNotes();
    setConfirmDeleteAllOpen(false);
  };

  const handleCancelDeleteAll = () => {
    setConfirmDeleteAllOpen(false);
  };

  const filteredNotes = notes.filter((note) =>
    (note.name || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Drawer.Root direction="right" open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <Drawer.Trigger asChild>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-neutral-500 bg-neutral-800 bg-opacity-40 border border-neutral-800 hover:bg-neutral-700 hover:bg-opacity-40 hover:cursor-pointer duration-300 p-3 rounded-lg flex items-center group"
            aria-label="Button To Open Note Drawer Menu"
          >
            <NotebookPen size={20} className="text-stone-400 group-hover:text-stone-300 duration-300" />
          </motion.button>
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Drawer.Description />
          <Drawer.Content className="bg-dark border border-neutral-800 rounded-xl flex flex-col h-full max-w-xs md:max-w-md mt-24 fixed bottom-0 right-0 z-50 overflow-hidden selection:bg-neutral-700 selection:text-zinc-300" style={{ width: '450px', outline: 'none', boxShadow: 'none' }}>
            <div className="p-4 flex-1 h-full overflow-y-auto">
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-medium text-lg text-zinc-100 flex items-center">
                  <BookOpen size={20} className="mr-1.5" />
                  {drawerTitle}
                </Drawer.Title>
                <div className="text-stone-500 text-sm mb-3">
                  {drawerDescription}
                  <span className="hidden md:block whitespace-pre-line">{keybindTip}</span>
                </div>
                <div className="mb-3 relative">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 py-2 rounded-md bg-neutral-900 placeholder:text-stone-600 text-zinc-300 outline-none border border-neutral-800 focus:border-neutral-700 duration-300"
                  />
                  <Search size={20} className="absolute top-1/2 left-3 transform -translate-y-1/2 text-stone-500" />
                </div>
                <hr className="w-full border-neutral-800 mb-3 rounded-full" />
                <div className="flex flex-col space-y-2">
                  {filteredNotes.length === 0 && (
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
                  )}
                  {filteredNotes.map((note) => (
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
                          <span className={`block text-xs truncate overflow-ellipsis duration-300 ${currentNoteId === note.id ? 'text-stone-400' : 'text-stone-500 '}`}>
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
                  ))}
                  <div className="flex space-x-2 justify-end">
                    <button
                      className="flex items-center p-2 border border-neutral-800 bg-neutral-950 text-zinc-100 rounded-md hover:bg-neutral-900 duration-300"
                      aria-label="Create New Note"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddNote();
                      }}
                    >
                      <Plus size={20} className="text-zinc-300" />
                    </button>
                    <button
                      className="flex items-center p-2 border border-neutral-800 bg-neutral-950 text-zinc-100 rounded-md hover:bg-neutral-900 duration-300"
                      aria-label="Open Note"
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenNote();
                      }}
                    >
                      <FolderOpen size={20} className="text-zinc-300" />
                    </button>
                    <button
                      className="flex items-center p-2 border border-neutral-800 bg-neutral-950 text-zinc-100 rounded-md hover:bg-neutral-900 duration-300"
                      aria-label="Delete All Notes"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConfirmDeleteAll();
                      }}
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col p-3 mt-auto bg-dark border-t text-xs text-stone-400 border-neutral-800">
              {searchQuery
                ? filteredNotes.length === 0
                  ? `No notes found matching "${searchQuery}"`
                  : `${filteredNotes.length} note${filteredNotes.length > 1 ? 's' : ''} matching "${searchQuery}"`
                : `${notes.length} note${notes.length > 1 ? 's' : ''} available`
              }
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <DownloadDialog
        isOpen={isDownloadDialogOpen}
        onRequestClose={() => setIsDownloadDialogOpen(false)}
        onDownload={(name, type) => {
          onDownload(name, type);
          setIsDownloadDialogOpen(false);
        }}
        fileName={fileName}
        setFileName={setFileName}
        fileType={fileType}
        setFileType={setFileType}
      />

      {isConfirmDeleteAllOpen && (
        <ConfirmDeleteAll
          isOpen={isConfirmDeleteAllOpen}
          onConfirm={handleDeleteAllNotes}
          onCancel={handleCancelDeleteAll}
        />
      )}
    </>
  );
};

export default NoteManager;