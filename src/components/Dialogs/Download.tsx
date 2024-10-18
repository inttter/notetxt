import React, { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { motion } from 'framer-motion';
import { X, ChevronDown, Download } from 'lucide-react';
import { GrDocumentTxt } from "react-icons/gr";
import { FaMarkdown } from 'react-icons/fa';
import db, { Note } from '@/utils/db'; // Import your Dexie database

const DownloadDialog = ({ isOpen, onRequestClose, onDownload, fileName, setFileName, fileType, setFileType, currentNoteId }) => {
  const downloadTitle = 'Download Your Note';
  const downloadDescription = 'Choose a file format and title for your note.';
  
  // Fetch the note name from the database to automatically put it in the input box
  useEffect(() => {
    const fetchNoteName = async () => {
      if (isOpen && currentNoteId) {
        const note: Note | undefined = await db.notes.get(currentNoteId);
        if (note) {
          setFileName(note.name);
        }
      }
    };

    fetchNoteName();
  }, [isOpen, currentNoteId, setFileName]);

  const handleSave = () => {
    const defaultFileName = 'note';
    const sanitizedFileName = fileName.trim() === '' ? defaultFileName : fileName.trim();
    onDownload(sanitizedFileName, fileType);
  };

  const fileTypes = [
    { name: 'Rich Text', value: '.txt', icon: <GrDocumentTxt size={13} className="mr-1.5 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={13} className="mr-1.5 text-stone-400" /> }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onRequestClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-6 md:px-0 selection:bg-neutral-700 selection:text-zinc-300 backdrop-blur-sm pointer-events-auto">
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
              className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-full relative z-50"
            >
              <Dialog.Title className="text-lg font-medium text-zinc-100 mx-0.5" aria-label="Download Dialog Title">
                {downloadTitle}
              </Dialog.Title>
              <Dialog.Description className="text-stone-400 text-sm leading-normal mx-0.5" aria-label="Download Dialog Description">
                {downloadDescription}
              </Dialog.Description>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-neutral-900 placeholder:text-stone-600 text-zinc-300 outline-none border border-neutral-700/60 focus:border-neutral-700 duration-300 mt-3 mb-3.5"
                placeholder="Note Title"
              />
              <div className="flex justify-end items-center">
                <div className="text-zinc-100 flex space-x-2">
                  <button
                    onClick={onRequestClose}
                    className="bg-default btn-dialog hover:bg-opacity-80"
                    aria-label="Cancel"
                  >
                    Cancel
                  </button>
                  <DropdownMenu.Root>
                    <DropdownMenu.Trigger asChild>
                      <button
                        className="bg-default px-2 py-1 rounded-md text-sm duration-300 hover:bg-opacity-80 flex items-center"
                        aria-label="Select File Format"
                      >
                        {fileTypes.find(type => type.value === fileType)?.icon}
                        <span>{fileTypes.find(type => type.value === fileType)?.name || 'Select Format'}</span>
                        <ChevronDown size={16} className="ml-1 text-stone-400" />
                      </button>
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Portal>
                      <DropdownMenu.Content align="end" sideOffset={5} asChild>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2, ease: 'easeInOut' }}
                          className="bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 space-y-2 shadow-2xl shadow-neutral-950 z-50 overflow-hidden"
                        >
                          {fileTypes.map((type) => (
                            <DropdownMenu.Item
                              key={type.value}
                              onSelect={() => setFileType(type.value)}
                              className={`text-zinc-100 text-sm hover:bg-neutral-700/40 border border-transparent hover:border-neutral-700/70 px-2 py-1.5 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300 flex items-center gap-x-1 ${
                                fileType === type.value ? 'bg-neutral-800 hover:bg-neutral-700/40' : ''
                              }`}
                              aria-label="File Type Option"
                            >
                              {type.icon}
                              {type.name} ({type.value})
                            </DropdownMenu.Item>
                          ))}
                        </motion.div>
                      </DropdownMenu.Content>
                    </DropdownMenu.Portal>
                  </DropdownMenu.Root>

                  <button className="bg-confirm btn-dialog hover:bg-opacity-80 flex items-center" onClick={handleSave} aria-label="Download Note">
                    <Download size={17} className="mr-1" /> Save
                  </button>
                </div>
              </div>
              <Dialog.Close className="absolute top-4 right-2 text-sm text-zinc-300 hover:text-zinc-400 font-semibold duration-300 px-1 py-0.5 mr-1" aria-label="Close Dialog">
                <X size={20} />
              </Dialog.Close>
            </motion.div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DownloadDialog;
