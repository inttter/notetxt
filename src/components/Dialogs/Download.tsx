import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog';
import { X, Download } from 'lucide-react';
import { GrDocumentTxt } from 'react-icons/gr';
import { FaMarkdown } from 'react-icons/fa';
import db, { Note } from '@/utils/db';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';

const DownloadDialog = ({ isOpen, onRequestClose, onDownload, fileName, setFileName, fileType, setFileType, currentNoteId }) => {
  const downloadTitle = 'Download Note';
  const downloadDescription = 'Choose a title and file format for your note.';

  // Fetch the note name from the database to automatically put it in the input box
  useEffect(() => {
    const fetchNoteName = async () => {
      if (isOpen && currentNoteId) {
        const note: Note | undefined = await db.notes.get(currentNoteId);
        if (note && note.name.trim().toLowerCase() !== 'new note') {
          setFileName(note.name);
        } else {
          setFileName('');
        }
      }
    };
  
    fetchNoteName();
  }, [isOpen, currentNoteId, setFileName]);
  
  const handleSave = () => {
    const defaultFileName = 'note';
    const sanitizedFileName = fileName.trim() || defaultFileName;
    onDownload(sanitizedFileName, fileType);
  };

  const fileTypes = [
    { name: 'Rich Text', value: '.txt', icon: <GrDocumentTxt size={15} className="mr-1.5 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={15} className="mr-1.5 text-stone-400" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogContent className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-11/12 z-50">
        <DialogTitle className="text-lg font-medium text-zinc-100 mx-0.5 gap-1 flex items-center" aria-label="Download Dialog Title">
          <Download size={20} className="text-stone-400" />
          {downloadTitle}
        </DialogTitle>
        <DialogDescription className="text-stone-400 text-sm leading-normal mx-0.5 mb-3" aria-label="Download Dialog Description">
          {downloadDescription}
        </DialogDescription>
        <input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-neutral-900 placeholder:text-stone-400/80 text-zinc-300 outline-none border border-neutral-700/60 focus:border-neutral-700 duration-300 mb-4"
          placeholder="Note Title"
        />
        <div className="flex justify-end items-center">
          <div className="text-zinc-300 flex space-x-2">
            <button
              onClick={onRequestClose}
              className="btn-dialog bg-neutral-800/60 hover:bg-neutral-800/85 border-neutral-700/60"
              aria-label="Cancel"
            >
              Cancel
            </button>

            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger className="bg-neutral-800/60 hover:bg-neutral-800/85 border border-neutral-700/60 px-2 py-1 rounded-md text-sm duration-300 flex items-center">
                {fileTypes.find((type) => type.value === fileType)?.icon}
                <span>
                  {fileTypes.find((type) => type.value === fileType)?.name || 'Select Format'}
                </span>
              </SelectTrigger>
              <SelectContent align="start" className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden duration-300 mt-2.5">
                {fileTypes.map((type) => (
                  <SelectItem
                    className="text-zinc-300 text-sm hover:bg-neutral-800 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
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
              className="btn-dialog bg-confirm/80 border-neutral-700/60 hover:bg-confirm flex items-center"
              onClick={handleSave}
              aria-label="Download Note"
            >
              <Download size={18} className="mr-1" /> Save
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
