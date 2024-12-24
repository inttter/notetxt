import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog';
import { Trash2, X } from 'lucide-react';

const deleteAllTitle = 'Delete All Notes';
const deleteAllDescription = 'This action is not reversible and all of your notes will be unrecoverable. Would you like to proceed anyway?';

const ConfirmDeleteAll = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-11/12 z-50">
          <DialogTitle className="text-lg font-medium text-zinc-100 mx-0.5 pb-1" aria-label="Delete All Dialog Title">
            {deleteAllTitle}
          </DialogTitle>
          <DialogDescription className="text-stone-400 text-sm leading-normal mx-0.5" aria-label="Delete All Dialog Description">
            {deleteAllDescription}
          </DialogDescription>
          <div className="flex justify-end items-center">
            <div className="text-zinc-300 flex space-x-2 mt-5 md:mt-3.5">
              <button
                onClick={onCancel}
                className="btn-dialog bg-neutral-800/60 hover:bg-neutral-800/85 border-neutral-700/60"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="btn-dialog bg-destructive hover:bg-destructive/80 hover:text-zinc-200 border-neutral-700/60 text-zinc-100 flex items-center"
              >
                <Trash2 size={15} className="mr-1" /> Delete
              </button>
            </div>
          </div>
          <DialogClose className="absolute top-4 right-2 text-sm text-zinc-300 hover:text-zinc-400 font-semibold duration-300 px-1 py-0.5 mr-1" aria-label="Close Dialog">
            <X size={20} />
          </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDeleteAll;
