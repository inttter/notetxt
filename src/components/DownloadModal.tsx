import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Modal = ({ isOpen, onRequestClose, onDownload, fileName, setFileName, fileType, setFileType }) => {
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
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1.0 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-6 md:px-0"
        >
          <div className="bg-neutral-900 p-5 rounded-lg shadow-2xl shadow-neutral-950 max-w-xl w-full relative">
            <div className="text-xl text-zinc-300 mx-0.5">
              Enter a title for your note:
            </div>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-neutral-900 focus:bg-neutral-800 focus:bg-opacity-60 placeholder:text-neutral-500 text-zinc-100 outline-none tracking-tight border border-neutral-700 focus:border-neutral-600 duration-300 mt-3 mb-3.5"
              placeholder="Note Title"
            />
            <div className="flex justify-end items-center">
              <div className="text-zinc-100 flex space-x-2">
                <button
                  onClick={onRequestClose}
                  className="bg-[#282828] border border-transparent hover:border-neutral-700 hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-1 rounded-md"
                >
                  Cancel
                </button>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value)}
                  className="bg-[#282828] text-zinc-100 border border-transparent hover:border-neutral-700 rounded-md p-2 outline-none"
                >
                  {fileTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.name}
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleSave}
                  className="bg-[#282828] border border-transparent hover:border-neutral-700 hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-1 rounded-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
