import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { Trash2, X } from 'lucide-react';

const ConfirmDeleteAll = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onCancel}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-6 md:px-0 selection:bg-neutral-700 selection:text-zinc-300 backdrop-blur-sm">
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
              className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-full relative"
            >
              <Dialog.Title className="text-lg font-medium text-zinc-100 mx-0.5 pb-1">
                Delete All Notes
              </Dialog.Title>
              <Dialog.Description className="text-stone-400 text-sm leading-normal mx-0.5">
                This action cannot be undone and all of your notes will be unrecoverable. 
                Would you like to proceed anyway?
              </Dialog.Description>
              <div className="flex justify-end items-center">
                <div className="text-zinc-100 flex space-x-2 mt-5 md:mt-3.5">
                  <button
                    onClick={onCancel}
                    className="bg-[#282828] btn-dialog hover:bg-opacity-80"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="bg-destructive btn-dialog hover:bg-opacity-80 flex items-center"
                  >
                    <Trash2 size={15} className="mr-1" /> Delete
                  </button>
                </div>
              </div>
              <Dialog.Close className="absolute top-4 right-2 text-sm text-zinc-300 hover:text-zinc-400 font-semibold duration-300 px-1 py-0.5 mr-1" aria-label="Button To Close Out Of Dialog">
                <X size={20} />
              </Dialog.Close>
            </motion.div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default ConfirmDeleteAll;