import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DOMPurify from 'dompurify';

function Modal({ isVisible, onClose, onSave }) {
  const [fileName, setFileName] = React.useState('');

  const handleSave = () => {
    const sanitizedFileName = DOMPurify.sanitize(fileName);
    onSave(sanitizedFileName);
    setFileName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <div className="bg-neutral-900 p-6 rounded-md shadow-2xl shadow-neutral-950 max-w-xl w-full">
            <div className="text-xl text-zinc-100 mb-4 ml-1">
              Enter a title for your note
            </div>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              className="w-full p-2 border-2 border-neutral-800 focus:border-neutral-600 duration-300 text-zinc-300 placeholder:text-neutral-600 rounded-md outline-none mb-4"
              placeholder="My New Note"
            />
            <div className="flex justify-between items-center">
              <div className="text-xs text-neutral-600 italic hidden md:block mb-2 md:mb-0">
                If you don't want to give it a name, leave the text field empty.
              </div>
              <div>
                <button onClick={onClose} className="bg-neutral-700 hover:bg-neutral-600 duration-300 text-zinc-100 px-4 py-1.5 rounded-md mr-2">
                  Cancel
                </button>
                <button onClick={handleSave} className="bg-green-700 hover:bg-green-600 duration-300 text-zinc-100 px-4 py-1.5 rounded-md mr-0.5">
                  Save
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;