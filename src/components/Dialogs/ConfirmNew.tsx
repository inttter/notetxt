import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const ConfirmNew = ({ isOpen, onConfirm, onCancel }) => {
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
              className="bg-dark border border-neutral-800 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-full relative"
            >
              <Dialog.Title className="text-lg font-medium text-zinc-100 mx-0.5 pb-1">
                Clear Current Note
              </Dialog.Title>
              <Dialog.Description className="text-stone-500 text-sm leading-normal mx-0.5">
                If you start a new note, your current note will be lost if you haven't saved it.
                Are you sure you want to start a new one anyway?
              </Dialog.Description>
              <div className="flex justify-end items-center">
                <div className="text-zinc-100 flex space-x-2 mt-5 md:mt-3">
                  <button
                    onClick={onCancel}
                    className="bg-[#282828] btn-dialog hover:bg-opacity-80"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={onConfirm}
                    className="bg-destructive btn-dialog hover:bg-opacity-80"
                  >
                    Clear
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

export default ConfirmNew;