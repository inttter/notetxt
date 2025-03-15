import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog';
import { Trash2, TriangleAlert, X } from 'lucide-react';

const deleteAllTitle = 'Are you sure?';
const deleteAllDescription = 'You are about to delete all current notes. This action is not reversible, and they will be unrecoverable. Would you like to proceed?';

const ConfirmDeleteAll = ({ isOpen, onConfirm, onCancel }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-11/12 z-50">
          <DialogTitle className="text-lg font-medium text-zinc-100 mx-0.5 gap-1 pb-1 flex items-center" aria-label="Delete All Dialog Title">
            <TriangleAlert size={20} className="text-stone-300/85" />
            {deleteAllTitle}
          </DialogTitle>
          <DialogDescription className="text-stone-300/85 text-sm leading-normal mx-0.5" aria-label="Delete All Dialog Description">
            {deleteAllDescription}
          </DialogDescription>
          <div className="flex justify-end items-center">
            <div className="text-zinc-100 flex space-x-2 mt-5 md:mt-3.5">
              <button
                onClick={onCancel}
                className="btn-dialog bg-dark-button hover:bg-neutral-800/85 border-neutral-700/60"
                aria-label="Cancel"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="btn-dialog bg-destructive/80 hover:bg-destructive/65 border-destructive/80 flex items-center"
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
