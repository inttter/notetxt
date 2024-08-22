import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'sonner';
import Command from './Command';
import DragDropOverlay from './DragDropOverlay';
import NoteDrawer from './NoteDrawer';
import NoteSummary from './Dialogs/NoteSummary';
import Download from './Dialogs/Download';
import copy from 'copy-to-clipboard';
import hotkeys from 'hotkeys-js';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { isIOS } from 'react-device-detect';

export default function Editor() {
  const router = useRouter();
  const [notes, setNotes] = useState<{ [key: string]: { name: string; content: string } }>({});
  const [currentNoteId, setCurrentNoteId] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [isNoteSummaryDialogOpen, setNoteSummaryDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    
    // Get the current note ID to display the last note the user was on.
    const savedCurrentNoteId = localStorage.getItem('currentNoteId');
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);

      if (savedCurrentNoteId && parsedNotes[savedCurrentNoteId]) {
        setCurrentNoteId(savedCurrentNoteId);
      } else {
        const firstNoteId = Object.keys(parsedNotes)[0];
        if (firstNoteId) {
          setCurrentNoteId(firstNoteId);
        }
      }
    } else {
      // If no notes exist, automatically create a new one.
      handleAddNote();
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
    localStorage.setItem('currentNoteId', currentNoteId);
  }, [notes, currentNoteId]);

  const handleAddNote = () => {
    const id = `${Date.now()}`;
    setNotes((prevNotes) => ({
      ...prevNotes,
      [id]: { name: 'New Note', content: '' }
    }));
    setCurrentNoteId(id);
    toast.info('Started a brand new note.')
  };

  const handleRemoveNote = (id: string) => {
    setNotes((prevNotes) => {
      const noteName = prevNotes[id]?.name;
      const { [id]: _, ...remainingNotes } = prevNotes;

      // If the deleted note was the current ID, 
      // then update the current ID to a different ID.
      if (id === currentNoteId) {
        const remainingNoteIds = Object.keys(remainingNotes);
        const newCurrentNoteId = remainingNoteIds.length > 0 ? remainingNoteIds[0] : '';
        setCurrentNoteId(newCurrentNoteId);
      }
  
      toast.success(`The note named '${noteName}' was deleted successfully.`);
      
      return remainingNotes;
    });
  };

  const handleChangeNote = (id: string) => {
    setCurrentNoteId(id);
  };

  const handleUpdateNoteName = (id, newName) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [id]: {
        ...prevNotes[id],
        name: newName
      }
    }));
  };

  const handleDeleteAllNotes = () => {
    setNotes({});
    setCurrentNoteId('');
    toast.success('All notes have been deleted.');
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && /\.(txt|md)$/i.test(file.name)) {
      readFileContents(file);
      event.target.value = ''; // Clear the file input value
    } else {
      toast.error('File not supported!', {
        description: 'Please select a \'.txt\' or \'.md\' file.'
      });
    }
  };

  const readFileContents = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      const fileNameWithExtension = file.name;
      const fileName = fileNameWithExtension.replace(/\.[^/.]+$/, '');
      const fileExtension = fileNameWithExtension.split('.').pop();

      const id = `${Date.now()}`;
      setNotes((prevNotes) => ({
        ...prevNotes,
        [id]: { name: fileName, content: fileContent }
      }));
      setCurrentNoteId(id);
      setFileName(fileName);
      setFileType(`.${fileExtension}`);
      toast.success('Successfully imported contents!');
    };
    reader.readAsText(file);
  };

  const handleDownload = (fileName, fileType) => {
    const note = notes[currentNoteId];
    if (!note || !note.content.trim()) {
      toast.warning('Cannot download an empty note!', {
        description: 'Please type something and then save your note.',
      });
      return;
    }

    const validFileTypes = ['.txt', '.md'];
    const extension = validFileTypes.includes(fileType) ? fileType : '.txt';
    const sanitizedText = DOMPurify.sanitize(note.content);
    const blob = new Blob([sanitizedText], { type: 'text/plain' });

    const defaultFileName = 'note';
    const sanitizedFileName = sanitizeFileName(fileName || defaultFileName);

    let finalFileName = sanitizedFileName;
    if (!finalFileName.toLowerCase().endsWith(extension.toLowerCase())) {
      finalFileName += extension;
    }

    saveAs(blob, finalFileName);

    if (isIOS) {
      toast.info('Check your downloads folder.', {
        description: 'Make sure you clicked \'Download\' on the alert that appeared to download the note to your device. If you didn\'t, the note did not download.',
        duration: 5000,
      });
    } else {
      setTimeout(() => {
        toast.success('Saved to your device!', {
          description: 'Check your recent files to find the note! Re-open it here at any time by pressing Ctrl+O or the \'Open Note\' option in the command menu and selecting the correct file.',
        });
      }, 400);
    }

    setModalVisible(false);
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[<>:"\/\\|?*]/g, '-');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      const fileName = file.name;
      const extension = fileName.split('.').pop();

      if (extension && (extension.toLowerCase() === 'txt' || extension.toLowerCase() === 'md')) {
        readFileContents(file);
      } else {
        toast.error('File not supported!', {
          description: 'Please drag in a \'.txt\' or \'.md\' file.'
        });
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target || !event.currentTarget.contains(event.relatedTarget as Node)) {
      setIsDraggingOver(false);
    }
  };

  const handleCopy = async () => {
    const note = notes[currentNoteId];
    if (!note) {
      toast.warning('No notes to copy!', {
        description: 'Create a note with text first to be able to copy it.',
      });
      return;
    }
    if (note.content.trim() === '') {
      toast.warning('There is no content to copy!');
      return;
    }
    try {
      copy(note.content);
      toast.success('Note copied to your clipboard!');
    } catch (error) {
      toast.error('Failed to copy note to your clipboard.');
    }
  };

  const handleCommandSelect = (commandId: string) => {
    switch (commandId) {
      case 'new':
        handleAddNote();
        break;
      case 'open':
        fileInputRef.current.value = '';
        fileInputRef.current?.click();
        break;
      case 'save':
        setModalVisible(true);
        break;
      case 'copy':
        handleCopy();
        break;
      case 'preview':
        toast.promise(
          router.push('/preview'),
          {
            loading: 'Loading Markdown preview...',
            success: 'Markdown preview ready!',
            error: 'Failed to load Markdown preview.',
            closeButton: false,
            className: 'toast-container',
          }
        );
        break;
      case 'summary':
        setNoteSummaryDialogOpen(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const hotkeyList = 'ctrl+n, ctrl+o, ctrl+s, ctrl+shift+c, ctrl+m, ctrl+i, command+n, command+o, command+s, command+shift+c, command+m, command+i';

    const handler = (event: KeyboardEvent, handler: any) => {
      event.preventDefault();
      switch (handler.key) {
        case 'ctrl+n':
        case 'command+n':
          handleCommandSelect('new');
          break;
        case 'ctrl+o':
        case 'command+o':
          handleCommandSelect('open');
          break;
        case 'ctrl+s':
        case 'command+s':
          handleCommandSelect('save');
          break;
        case 'ctrl+shift+c':
        case 'command+shift+c':
          handleCommandSelect('copy');
          break;
        case 'ctrl+m':
        case 'command+m':
          handleCommandSelect('preview');
          break;
        case 'ctrl+i':
        case 'command+i':
          handleCommandSelect('summary');
        default:
          break;
      }
    };

    hotkeys(hotkeyList, handler);

    return () => {
      hotkeys.unbind(hotkeyList);
    };
  }, [notes, currentNoteId]);

  // Needed for keybinds to work when the `textarea` is focused.
  // https://github.com/jaywcjlove/hotkeys-js/issues/51
  hotkeys.filter = function(event) {
    return true;
  }

  return (
    <div
      className="overflow-x-hidden bg-[#111111] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <DragDropOverlay isDraggingOver={isDraggingOver} />
      <div className="flex flex-row w-full max-w-2xl mr-4">
        <div className="flex flex-row w-full">
          <Command openCommandMenu={handleCommandSelect} />
          <div className="-mx-3">
            <NoteDrawer
              notes={Object.entries(notes).map(([id, note]) => ({ id, ...note }))}
              currentNoteId={currentNoteId}
              onChangeNote={handleChangeNote}
              onAddNote={handleAddNote}
              onRemoveNote={handleRemoveNote}
              onUpdateNoteName={handleUpdateNoteName}
              onDownload={handleDownload}
              onDeleteAllNotes={handleDeleteAllNotes}
              onOpenNote={() => handleCommandSelect('open')}
            />
          </div>
        </div>
      </div>
      <div className="max-w-2xl w-full space-y-3 flex-col relative z-10 mb-10">
        <div className="relative">
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".txt,.md"
            onChange={handleFileInputChange}
          />
          <motion.textarea
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            value={notes[currentNoteId]?.content || ''}
            placeholder="Start typing here..."
            onChange={(e) => setNotes((prevNotes) => ({
              ...prevNotes,
              [currentNoteId]: { ...prevNotes[currentNoteId], content: e.target.value }
            }))}
            className="bg-transparent text-neutral-200 placeholder:text-neutral-600 outline-none w-full p-4 duration-300 text-lg rounded-md min-h-96 h-[550px] max-w-screen overflow-auto caret-amber-400 tracking-tight md:tracking-normal resize-none mt-3 textarea-custom-scroll"
            aria-label="Note Content"
          />
        </div>
      </div>
      <Toaster richColors closeButton pauseWhenPageIsHidden theme="dark" />
      {isNoteSummaryDialogOpen && (
        <NoteSummary
          text={notes[currentNoteId]?.content || ''}
          isDialogOpen={isNoteSummaryDialogOpen}
          onClose={() => setNoteSummaryDialogOpen(false)}
        />
      )}
      {isModalVisible && (
        <Download
          isOpen={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
          onDownload={handleDownload}
          fileName={fileName}
          setFileName={setFileName}
          fileType={fileType}
          setFileType={setFileType}
        />
      )}
    </div>
  );
}