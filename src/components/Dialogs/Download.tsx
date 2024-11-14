import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog';
import { X, Download } from 'lucide-react';
import { GrDocumentTxt } from 'react-icons/gr';
import { FaMarkdown } from 'react-icons/fa';
import db, { Note } from '@/utils/db';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';

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
    { name: 'Rich Text', value: '.txt', icon: <GrDocumentTxt size={15} className="mr-1.5 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={15} className="mr-1.5 text-stone-400" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogContent className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-11/12 z-50">
        <DialogTitle className="text-lg font-medium text-zinc-100 mx-0.5" aria-label="Download Dialog Title">
          {downloadTitle}
        </DialogTitle>
        <DialogDescription className="text-stone-400 text-sm leading-normal mx-0.5 mb-3" aria-label="Download Dialog Description">
          {downloadDescription}
        </DialogDescription>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-neutral-900 placeholder:text-stone-600 text-zinc-300 outline-none border border-neutral-700/60 focus:border-neutral-700 duration-300 mb-4"
          placeholder="Note Title"
        />
        <div className="flex justify-end items-center">
          <div className="text-zinc-300 flex space-x-2">
            <button
              onClick={onRequestClose}
              className="btn-dialog bg-neutral-800/70 hover:bg-neutral-800 border-neutral-700/60 hover:text-zinc-100"
              aria-label="Cancel"
            >
              Cancel
            </button>

            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger className="bg-neutral-800/70 hover:bg-neutral-800 border border-neutral-700/60 px-2 py-1 rounded-md text-sm md:text-sm hover:text-zinc-100 duration-300 flex items-center">
                {fileTypes.find((type) => type.value === fileType)?.icon}
                <span>
                  {fileTypes.find((type) => type.value === fileType)?.name || 'Select Format'}
                </span>
              </SelectTrigger>
              <SelectContent align="end" className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden duration-300">
                {fileTypes.map((type) => (
                  <SelectItem
                    className="text-zinc-300 hover:text-zinc-100 text-sm hover:bg-neutral-800 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
                    key={type.value}
                    value={type.value}
                  >
                    <div className="flex items-center my-0.5">
                      {type.icon}
                      <span>{type.name} ({type.value})</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <button
              className="btn-dialog bg-confirm border-neutral-700/60 hover:text-zinc-100 hover:bg-green-700 flex items-center"
              onClick={handleSave}
              aria-label="Download Note"
            >
              <Download size={17} className="mr-1" /> Save
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

export default DownloadDialog;
