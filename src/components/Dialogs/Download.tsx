import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const DownloadDialog = ({ isOpen, onRequestClose, onDownload, fileName, setFileName, fileType, setFileType }) => {
  const handleSave = () => {
    const defaultFileName = 'note';
    const sanitizedFileName = fileName.trim() === '' ? defaultFileName : fileName.trim();
    onDownload(sanitizedFileName, fileType);
  };

  const fileTypes = [
    { name: 'Rich Text', value: '.txt' },
    { name: 'Markdown', value: '.md' }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={onRequestClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-6 md:px-0 selection:bg-neutral-700 selection:text-zinc-300 backdrop-blur-sm">
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
              className="bg-dark border border-neutral-800 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-full relative"
            >
              <Dialog.Title className="text-lg font-medium text-zinc-100 mx-0.5">
                Download Your Note
              </Dialog.Title>
              <Dialog.Description className="text-stone-500 text-sm leading-normal mx-0.5">
                Choose a file format and create a title for your note.
              </Dialog.Description>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-neutral-900 placeholder:text-stone-600 text-zinc-300 outline-none border border-neutral-800 focus:border-neutral-700 duration-300 mt-3 mb-3.5"
                placeholder="Note Title"
              />
              <div className="flex justify-end items-center">
                <div className="text-zinc-100 flex space-x-2">
                  <button
                    onClick={onRequestClose}
                    className="bg-default btn-dialog hover:bg-opacity-80"
                  >
                    Cancel
                  </button>
                  <select
                    value={fileType}
                    onChange={(e) => setFileType(e.target.value)}
                    className="bg-default hover:bg-opacity-80 text-zinc-100 duration-300 rounded-md p-2 outline-none cursor-pointer"
                  >
                    {fileTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={handleSave}
                    className="bg-confirm btn-dialog hover:bg-opacity-80"
                  >
                    Save
                  </button>
                </div>
              </div>
              <Dialog.Close className="absolute top-4 right-2 text-sm text-zinc-300 hover:text-zinc-400 font-semibold duration-300 px-1 py-0.5 mr-1" aria-label="Close">
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