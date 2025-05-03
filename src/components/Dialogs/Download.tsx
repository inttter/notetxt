import React, { useEffect } from 'react';
import db, { Note } from '@/utils/db';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/Select';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { X, Download, FileText } from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';

const DownloadDialog = ({ isOpen, onRequestClose, onDownload, fileName, setFileName, fileType, setFileType, currentNoteId, settings }) => {
  const downloadTitle = 'Download Note';
  const downloadDescription = 'Choose a name and file format for your note.';

  // Set default file type from settings when the dialog opens
  useEffect(() => {
    if (isOpen) {
      if (settings && settings.defaultFileType) {
        setFileType(settings.defaultFileType);
      } else {
        setFileType('.txt');
      }
    }
  }, [isOpen, setFileType, settings]);

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
    { name: 'Rich Text', value: '.txt', icon: <FileText size={15} className="mr-1 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={15} className="mr-1 text-stone-400" /> },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onRequestClose}>
      <DialogContent className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-11/12 z-50">
        <DialogTitle className="text-lg font-medium text-zinc-100 mx-0.5 gap-1 flex items-center" aria-label="Download Dialog Title">
          <Download size={20} className="text-stone-300/85" />
          {downloadTitle}
        </DialogTitle>
        <DialogDescription className="text-stone-300/85 text-sm leading-normal mx-0.5 mb-3" aria-label="Download Dialog Description">
          {downloadDescription}
        </DialogDescription>
        <Input
          type="text"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="text-base w-full px-3 py-3 rounded-lg bg-dark-secondary placeholder:text-stone-400/80 text-zinc-300 outline-none border border-neutral-700/60 focus:border-neutral-700 duration-300 mb-4"
          placeholder="Note Name"
        />
        <div className="flex justify-end items-center">
          <div className="text-zinc-300 flex space-x-2">
            <Button
              size="sm"
              onClick={onRequestClose}
              className="px-4 border-neutral-700/60 text-sm md:text-base"
              aria-label="Cancel"
            >
              Cancel
            </Button>

            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger className="bg-dark-button hover:bg-dark-button-hover border border-neutral-700/60 px-2 py-1 rounded-md text-sm duration-300 flex items-center">
                {fileTypes.find((type) => type.value === fileType)?.icon}
                <span>
                  {fileTypes.find((type) => type.value === fileType)?.name || 'Select Format'}
                </span>
              </SelectTrigger>
              <SelectContent align="start" className="bg-dark border border-neutral-800 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden duration-300 mt-2.5">
                {fileTypes.map((type) => (
                  <SelectItem
                    className="text-zinc-300 text-sm hover:bg-dark-focus rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
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

            <Button
              size="sm"
              variant="primary"
              className="px-3 md:px-4 text-sm md:text-base"
              onClick={handleSave}
              aria-label="Download Note"
            >
              <Download size={16} /> Save
            </Button>
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
