import React from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Plus, FolderOpen, Trash2, ChevronDown, FolderArchive } from 'lucide-react';
import { motion } from 'framer-motion';

const NoteActions = ({ handleFileTypeChange, handleConfirmDeleteAll, onOpenNote, onAddNote }) => {
  const fileTypes = [
    { name: 'Rich Text', value: '.txt' },
    { name: 'Markdown', value: '.md' }
  ];

  return (
    <div className="flex space-x-2 mt-2 justify-end">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button
            className="px-2 py-1.5 border border-neutral-800 bg-neutral-900 text-zinc-300 text-xs rounded-md hover:bg-neutral-800/60 duration-300 flex items-center"
            aria-label="Export All Current Notes"
            title="Export All Current Notes"
          >
            <FolderArchive size={15} className="mr-1" /> Export Notes
            <ChevronDown size={15} className="ml-1 text-stone-500" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            align="end"
            sideOffset={5}
            asChild
          >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1.0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-dark border border-neutral-800 rounded-md space-y-2 p-1.5 shadow-2xl shadow-neutral-950 z-50"
              >
              {fileTypes.map(fileTypeItem => (
                <DropdownMenu.Item
                  key={fileTypeItem.value}
                  className="text-zinc-100 text-sm hover:bg-neutral-800/70 border border-transparent hover:border-neutral-700/70 px-2 py-1 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFileTypeChange(fileTypeItem.value);
                  }}
                  aria-label="File Type Export Option"
                >
                  {fileTypeItem.name} ({fileTypeItem.value})
                </DropdownMenu.Item>
              ))}
              </motion.div>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
      <button
        className="flex items-center px-2 py-1.5 border border-neutral-800 bg-neutral-900 text-zinc-100 rounded-md hover:bg-neutral-800/60 duration-300"
        aria-label="Create New Note"
        title="Create A New Note"
        onClick={(e) => {
          e.stopPropagation();
          onAddNote();
        }}
      >
        <Plus size={19} className="text-zinc-300" />
      </button>
      <button
        className="flex items-center px-2 py-1.5 border border-neutral-800 bg-neutral-900 text-zinc-100 rounded-md hover:bg-neutral-800/60 duration-300"
        aria-label="Open Note"
        title="Open Note"
        onClick={(e) => {
          e.stopPropagation();
          onOpenNote();
        }}
      >
        <FolderOpen size={19} className="text-zinc-300" />
      </button>
      <button
        className="flex items-center p-1.5 border border-neutral-800 bg-neutral-900 text-zinc-100 rounded-md hover:bg-neutral-800/60 duration-300"
        aria-label="Delete All Notes"
        title="Delete All Notes"
        onClick={(e) => {
          e.stopPropagation();
          handleConfirmDeleteAll();
        }}
      >
        <Trash2 size={19} className="text-destructive" />
      </button>
    </div>
  );
};

export default NoteActions;