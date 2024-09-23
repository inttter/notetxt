import React, { useEffect, useState } from 'react';
import { Drawer } from 'vaul';
import { motion } from 'framer-motion';
import { Edit3, Search, NotebookText } from 'lucide-react';
import { toast } from 'sonner';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';
import hotkeys from 'hotkeys-js';
import NoteList from '@/components/Manager/NoteList';
import NoteControls from '@/components/Manager/NoteControls';
import DownloadDialog from '@/components/Dialogs/Download';
import ConfirmDeleteAll from '@/components/Dialogs/ConfirmDeleteAll';
import SortDropdown from '@/components/Manager/NoteSortDropdown';

const DrawerLayout = ({ notes, currentNoteId, onChangeNote, onAddNote, onRemoveNote, onUpdateNoteName, onDownload, onDeleteAllNotes, onOpenNote, searchQuery, setSearchQuery }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [newName, setNewName] = useState('');
  const [isDownloadDialogOpen, setIsDownloadDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [isConfirmDeleteAllOpen, setConfirmDeleteAllOpen] = useState(false);
  const [sortCriteria, setSortCriteria] = useState('newest');

  const drawerTitle = 'Note Manager';
  const drawerDescription = 'Access and manage every single one of your notes from here.';

  // Notes get their ID's by using Date.now() (see handleAddNotes), 
  // so for 'Oldest' and 'Newest', we can use the ID of the notes to filter by Oldest and Newest
  const sortOptions = [
    { value: 'newest', label: 'Newest', compareFn: (a, b) => parseInt(b.id) - parseInt(a.id) },
    { value: 'oldest', label: 'Oldest', compareFn: (a, b) => parseInt(a.id) - parseInt(b.id) },
    { value: 'longest', label: 'Longest', compareFn: (a, b) => b.content.length - a.content.length },
    { value: 'shortest', label: 'Shortest', compareFn: (a, b) => a.content.length - b.content.length },
  ];

  const sortNotes = (notes, criteria) => {
    const option = sortOptions.find(o => o.value === criteria);
    return option ? [...notes].sort(option.compareFn) : notes;
  };

  const sortedNotes = sortNotes(
    notes.filter(note => (note.name || '').toLowerCase().includes(searchQuery.toLowerCase())), sortCriteria
  );

  const handleSortChange = (event) => setSortCriteria(event.target.dataset.value);

  useEffect(() => {
    const currentIndex = sortedNotes.findIndex(note => note.id === currentNoteId);

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
          onChangeNote(sortedNotes[currentIndex + 1].id);
        }
      });

      hotkeys('up', (event) => {
        event.preventDefault();
        if (currentIndex > 0) {
          onChangeNote(sortedNotes[currentIndex - 1].id);
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

  const handleFileTypeChange = type => {
    setFileType(type);
    exportAllNotes(type);
  };

  const exportAllNotes = async (type) => {
    if (notes.length === 0) {
      toast.warning('No notes available to export!', {
        description: 'Please create a note first to be able to export.',
      });      
      return;
    }
  
    try {
      const zip = new JSZip();
      notes.forEach(note => {
        zip.file(`${note.name || 'Untitled'}${type}`, note.content || '');
      });
  
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, `notes-${new Date().toISOString()}.zip`);
    } catch (error) {
      console.error(`Failed to export notes: ${error.message}`);
      toast.error(`Failed to export notes: ${error.message}`);
    }
  };

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
            title="Note Manager"
          >
            <NotebookText size={20} className="text-stone-400 group-hover:text-stone-300 duration-300" />
          </motion.button>
        </Drawer.Trigger>

        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />
          <Drawer.Description />
          <Drawer.Content
            className="bg-dark border border-neutral-800 rounded-xl flex flex-col h-full max-w-xs md:max-w-md mt-24 fixed bottom-0 right-0 z-50 overflow-hidden selection:bg-neutral-700 selection:text-zinc-300"
            style={{ width: '450px', outline: 'none', boxShadow: 'none' }}
          >
            <div className="p-4 flex-1 h-full overflow-y-auto">
              <div className="max-w-md mx-auto">
                <Drawer.Title className="font-medium text-lg text-zinc-100 flex items-center">
                  <Edit3 size={20} className="mr-1.5" />
                  {drawerTitle}
                </Drawer.Title>
                <div className="text-stone-500 text-sm mb-3">
                  {drawerDescription}
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
                <NoteList
                  notes={sortedNotes}
                  currentNoteId={currentNoteId}
                  onChangeNote={onChangeNote}
                  onAddNote={onAddNote}
                  onRemoveNote={onRemoveNote}
                  handleEditClick={handleEditClick}
                  editingNoteId={editingNoteId}
                  newName={newName}
                  handleNameChange={handleNameChange}
                  handleSaveName={handleSaveName}
                  handleKeyDown={handleKeyDown}
                  openDownloadDialog={openDownloadDialog}
                />
                <NoteControls
                  handleFileTypeChange={handleFileTypeChange}
                  handleConfirmDeleteAll={handleConfirmDeleteAll}
                  onOpenNote={onOpenNote}
                  onAddNote={onAddNote}
                />
              </div>
            </div>
            <hr className="border border-neutral-800" />
            <div className="flex justify-between items-center p-3 mt-auto bg-dark text-xs text-stone-400">
              <div className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap mr-4">
                {searchQuery
                  ? sortedNotes.length === 0
                    ? `No notes found matching "${searchQuery}"`
                    : `${sortedNotes.length} note${sortedNotes.length > 1 ? 's' : ''} matching "${searchQuery}"`
                  : `${notes.length} note${notes.length > 1 ? 's' : ''} available`}
              </div>
              <SortDropdown
                sortOptions={sortOptions}
                sortCriteria={sortCriteria}
                handleSortChange={handleSortChange}
              />
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

export default DrawerLayout;