import React, { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { Plus, Trash2, NotebookPen, BookOpen, Pencil, Download, FolderOpen } from 'lucide-react';
import hotkeys from 'hotkeys-js';
import { motion } from 'framer-motion';
import DownloadDialog from './Dialogs/Download';
import ConfirmDeleteAll from './Dialogs/ConfirmDeleteAll'


const NoteDrawer = ({ notes, currentNoteId, onChangeNote, onAddNote, onRemoveNote, onUpdateNoteName, onDownload, onDeleteAllNotes, onOpenNote }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newName, setNewName] = useState('');
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [isConfirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState('');

  const drawerTitle = 'All Notes';
  const drawerDescription = 'Navigate to and manage each one of your notes from here.';

  useEffect(() => {
    if (isDrawerOpen) {
      hotkeys('del', (event) => {
        event.preventDefault();
        if (currentNoteId) {
          onRemoveNote(currentNoteId);
        }
      });
    } else {
      hotkeys.unbind('del');
    }

    return () => {
      hotkeys.unbind('del');
    };
  }, [isDrawerOpen, currentNoteId, onRemoveNote]);

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
          <Drawer.Content className="bg-dark border border-neutral-800 rounded-xl flex flex-col h-full max-w-xs md:max-w-md mt-24 fixed bottom-0 right-0 z-50 overflow-hidden selection:bg-neutral-700 selection:text-zinc-300" style={{ width: '450px' }}>
            <div className="p-4 flex-1 h-full overflow-y-auto">
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-medium text-lg text-zinc-100 flex items-center">
                  <BookOpen size={20} className="mr-1.5" /> 
                  {drawerTitle}
                </Drawer.Title>
                <div className="text-stone-500 text-sm mb-3">
                  {drawerDescription}
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    placeholder="Search notes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-3 py-2 rounded-md bg-neutral-900 placeholder:text-stone-500 text-zinc-300 outline-none border border-neutral-800 focus:border-neutral-700 duration-300 "
                  />
                </div>
                <div className="flex flex-col space-y-2">
                  {filteredNotes.map((note) => (
                    <div
                      key={note.id}
                      className={`flex justify-between items-center p-2 rounded-md border text-sm md:text-base text-zinc-300 cursor-pointer duration-300 ${
                        currentNoteId === note.id
                          ? 'bg-neutral-800 bg-opacity-50 border-neutral-800'
                          : 'bg-neutral-900 bg-opacity-50 border-neutral-800'
                      }`}
                      onClick={() => onChangeNote(note.id)}
                    >
                      {editingNoteId === note.id ? (
                        <input
                          type="text"
                          value={newName}
                          onChange={handleNameChange}
                          onBlur={handleSaveName}
                          onKeyDown={handleKeyDown}
                          placeholder="Note Title"
                          className="bg-transparent text-zinc-300 placeholder:text-stone-500 caret-amber-400 outline-none rounded-md flex-grow min-w-[8rem] text-base"
                          autoFocus
                        />
                      ) : (
                        <span className="truncate overflow-ellipsis w-56 md:w-80">
                          {note.name || 'New Note'}
                        </span>
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
                          className="text-red-500 hover:text-red-700 duration-300"
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
                      onClick={onAddNote}
                    >
                      <Plus size={20} className="text-zinc-300" />
                    </button>
                    <button
                      className="flex items-center p-2 border border-neutral-800 bg-neutral-950 text-zinc-100 rounded-md hover:bg-neutral-900 duration-300"
                      aria-label="Open Note"
                      onClick={onOpenNote}
                    >
                      <FolderOpen size={20} className="text-zinc-300" />
                    </button>
                    <button
                      className="flex items-center p-2 border border-neutral-800 bg-neutral-950 text-zinc-100 rounded-md hover:bg-neutral-900 duration-300"
                      aria-label="Delete All Notes"
                      onClick={handleConfirmDeleteAll}
                    >
                      <Trash2 size={20} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
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

export default NoteDrawer;