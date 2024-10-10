import React, { useState, useEffect, useRef } from 'react';
import Command from '@/components/Command';
import DragDropOverlay from '@/components/DragDropOverlay';
import NoteManager from '@/components/Manager/DrawerLayout';
import NoteSummary from '@/components/Dialogs/NoteSummary';
import Download from '@/components/Dialogs/Download';
import MarkdownPreview from '@/components/markdown/MarkdownPreview';
import commands from '@/utils/commands';
import db, { Note } from '@/utils/db';
import copy from 'copy-to-clipboard';
import hotkeys from 'hotkeys-js';
import DOMPurify from 'dompurify';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { isIOS } from 'react-device-detect';
import { FaMarkdown } from 'react-icons/fa';
import { useRouter } from 'next/router';

export default function Editor() {
  const router = useRouter();
  const [notes, setNotes] = useState<{ [key: string]: Note }>({});
  const [currentNoteId, setCurrentNoteId] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [isNoteSummaryDialogOpen, setNoteSummaryDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [formattedDate, setFormattedDate] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    // When the URL contains `?markdown=true`, the 
    // Markdown Preview will be automatically toggled to be visible
    if (router.query.markdown === 'true') {
      setIsPreviewMode(true);
    }

    const fetchNotesAndCurrentNoteId = async () => {
      try {
        // Fetch all notes
        const allNotes = await db.notes.toArray();
        const notesMap = allNotes.reduce((acc, note) => {
          acc[note.id] = note;
          return acc;
        }, {} as { [key: string]: Note });
  
        setNotes(notesMap);
  
        if (allNotes.length === 0) {
          // Create a new note if there are none in `allNotes`
          await handleAddNote();
        } else {
          const savedCurrentNoteId = await db.currentNote.get('current');
          if (savedCurrentNoteId) {
            setCurrentNoteId(savedCurrentNoteId.noteId);
          } else {
            // If there are notes but no current note is set
            // set the first note in `allNotes` as the current note
            setCurrentNoteId(allNotes[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notes or current note ID:', error);
        toast.error('Failed to load notes.');
      }
    };
  
    fetchNotesAndCurrentNoteId();
  }, [router.query]);

  useEffect(() => {
    const saveNotes = async () => {
      try {
        const notesArray = Object.entries(notes).map(([id, note]) => ({ id, ...note }));
        await db.notes.bulkPut(notesArray);
      } catch (error) {
        console.error('Failed to save notes:', error);
        toast.error('Failed to save notes.');
      }
    };
  
    saveNotes();
  }, [notes]);
  
  useEffect(() => {
    const updateCurrentNoteId = async () => {
      if (currentNoteId) {
        try {
          await db.currentNote.put({ id: 'current', noteId: currentNoteId });
        } catch (error) {
          console.error('Failed to update current note ID:', error);
          toast.error('Failed to update current note ID.');
        }
      }
    };
  
    updateCurrentNoteId();
  }, [currentNoteId]);

  useEffect(() => {
    if (currentNoteId && notes[currentNoteId]?.tags) {
      setTags(notes[currentNoteId].tags || []);
    }
  }, [currentNoteId, notes]);

  // Auto-focus the textarea when a user opens a note
  // or when the editor loads an existing note (ie. when refreshing)
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [currentNoteId]);

  const handleAddNote = async () => {
    try {
      const id = `${Date.now()}`;
      const newNote: Note = { id, name: 'New Note', content: '' };
      await db.notes.add(newNote);
      setNotes(prevNotes => ({ ...prevNotes, [id]: newNote }));
      setCurrentNoteId(newNote.id);
      setSearchQuery('');
      await db.currentNote.put({ id: 'current', noteId: id });
    } catch (error) {
      console.error('Failed to add note:', error);
      toast.error('Failed to add a new note.');
    }
  };

  const handleRemoveNote = async (id: string) => {
    try {
      const noteIds = Object.keys(notes);
      const noteIndex = noteIds.indexOf(id);
  
      // If the note isn't found, return early
      if (noteIndex === -1) return;
  
      await db.notes.delete(id);
  
      setNotes(prevNotes => {
        const noteName = prevNotes[id]?.name;
        const { [id]: _, ...remainingNotes } = prevNotes;
  
        // If there are no notes left in `remainingNotes`, 
        // create a new note to prevent `allNotes` from becoming 0
        if (Object.keys(remainingNotes).length === 0) {
          setTimeout(async () => {
            await handleAddNote();
          }, 200); // Wait 200ms before making a new note to prevent flickering
          return remainingNotes;
        }
  
        // Only change the current note the user is on 
        // if the deleted note is the one the user was on
        if (id === currentNoteId) {
          let newCurrentNoteId = '';
  
          // If a note exists below, move to that one
          if (noteIndex < noteIds.length - 1) {
            newCurrentNoteId = noteIds[noteIndex + 1];
          } 
          // If it does not exist, move to the note above
          else if (noteIndex > 0) {
            newCurrentNoteId = noteIds[noteIndex - 1];
          }
  
          setCurrentNoteId(newCurrentNoteId);
        }
  
        toast.success(`The note '${noteName}' was deleted successfully.`);
        return remainingNotes;
      });
    } catch (error) {
      console.error('Failed to remove note:', error);
      toast.error('Failed to remove note.');
    }
  };

  const handleChangeNote = (id: string) => {
    setCurrentNoteId(id);
  };

  const handleUpdateNoteName = async (id: string, newName: string) => {
    try {
      await db.notes.update(id, { name: newName });
      setNotes(prevNotes => ({
        ...prevNotes,
        [id]: { ...prevNotes[id], name: newName }
      }));
    } catch (error) {
      console.error('Failed to update note name:', error);
      toast.error('Failed to update note name.');
    }
  };
  

  const handleDeleteAllNotes = async () => {
    try {
      await db.notes.clear();
      setNotes({});
      setCurrentNoteId('');
  
      // Create a new note to prevent `allNotes` from becoming 0
      setTimeout(async () => {
        await handleAddNote();
      }, 200);
  
      toast.success('All of your current notes have been deleted.');
    } catch (error) {
      console.error('Failed to delete all notes:', error);
      toast.error('Failed to delete all notes.');
    }
  };
  

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');

    // Normal input handling
    setNotes(prevNotes => {
      const updatedNote = {
        ...prevNotes[currentNoteId],
        content: value
      };

      const commandLineIndex = lines.findIndex(line => line.startsWith('/'));

      if (commandLineIndex !== -1) {
        const command = lines[commandLineIndex].slice(1); // Get the command after the '/'
        const foundCommand = Object.entries(commands).find(([cmd, { aliases }]) =>
          cmd === command || aliases.includes(command)
        );

        if (foundCommand) {
          const commandOutput = foundCommand[1].content;
          lines[commandLineIndex] = commandOutput;
          const newContent = lines.join('\n');

          updatedNote.content = newContent;

          if (textareaRef.current) {
            textareaRef.current.value = newContent;

            // Move the cursor to the end of the inserted command's content
            const positionBeforeCommand = lines
              .slice(0, commandLineIndex)
              .join('\n').length + commandOutput.length + 1;
            textareaRef.current.setSelectionRange(positionBeforeCommand, positionBeforeCommand);
            textareaRef.current.focus();
          }
        }
      }

      return { ...prevNotes, [currentNoteId]: updatedNote };
    });
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

  const handleUpdateNoteTags = async (noteId: string, updatedTags: string[]) => {
    try {
      await db.notes.update(noteId, { tags: updatedTags });
      setNotes(prevNotes => ({
        ...prevNotes,
        [noteId]: { ...prevNotes[noteId], tags: updatedTags }
      }));
    } catch (error) {
      console.error('Failed to update tags:', error);
      toast.error('Failed to update tags.');
    }
  };

  const readFileContents = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const fileContent = e.target?.result as string;
        const fileNameWithExtension = file.name;
        const fileName = fileNameWithExtension.replace(/\.[^/.]+$/, '');
        const fileExtension = fileNameWithExtension.split('.').pop();
  
        const id = `${Date.now()}`;
        const newNote: Note = { id, name: fileName, content: fileContent };
        await db.notes.add(newNote);
        setNotes(prevNotes => ({ ...prevNotes, [id]: newNote }));
        setCurrentNoteId(id);
        setFileName(fileName);
        setFileType(`.${fileExtension}`);
        toast.success('Successfully imported contents!');
      } catch (error) {
        console.error('Failed to import file contents:', error);
        toast.error('Failed to import contents.');
      }
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

    // Warn IOS users to click on 'Download' in the alert that pops up (https://www.iinter.me/images/mobile-devices-react/ios-download-alert.png) or the note won't/did not download
    if (isIOS) {
      toast.info('Check your downloads folder.', {
        description: 'Make sure you clicked \'Download\' on the alert that appeared to download the note to your device. If you didn\'t, the note did not download.',
        duration: 5000,
      });
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
        setIsPreviewMode(prevMode => !prevMode);
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
          break;
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
  };

  const getDaySuffix = (day: number) => {
    if (day > 10 && day < 14) {
      return 'th';
    }
    switch (day % 10) {
      case 1:
        return 'st';
      case 2:
        return 'nd';
      case 3:
        return 'rd';
      default:
        return 'th';
    }
  };
  
  const formatCreationDate = (timestamp: string) => {
    const date = new Date(Number(timestamp));
  
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const dayWithSuffix = `${day}${getDaySuffix(day)}`;
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    // Returns in the format of '[DAY][suffix] [MONTH] [YEAR] at [HH:MM]'
    return `${month} ${dayWithSuffix} ${year} at ${hours}:${minutes}`;
  };

  useEffect(() => {
    setFormattedDate(formatCreationDate(currentNoteId));
  }, [currentNoteId]);

  return (
    <div
      className="overflow-x-hidden bg-dark min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth px-4 md:px-8 relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <DragDropOverlay isDraggingOver={isDraggingOver} />
      <div className="flex flex-row w-full max-w-2xl mr-10 mt-5">
        <div className="flex flex-row w-full">
          <Command openCommandMenu={handleCommandSelect} />
          <div className="-mx-3">
            <NoteManager
              notes={Object.entries(notes).map(([id, note]) => ({ id, ...note }))}
              currentNoteId={currentNoteId}
              onChangeNote={handleChangeNote}
              onAddNote={handleAddNote}
              onRemoveNote={handleRemoveNote}
              onUpdateNoteName={handleUpdateNoteName}
              onDownload={handleDownload}
              onDeleteAllNotes={handleDeleteAllNotes}
              onOpenNote={() => handleCommandSelect('open')}
              onUpdateNoteTags={handleUpdateNoteTags}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              formatCreationDate={formatCreationDate}
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
          <motion.div
            initial={{ opacity: 0.01 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="px-3 py-[0.6rem] text-stone-400 bg-neutral-900 border border-neutral-800 -mb-3 rounded-t-xl flex flex-col justify-between"
          >
            {/* Note Title */}
            <div className="flex justify-between items-center">
              <span className="text-sm truncate overflow-ellipsis">
                {notes[currentNoteId]?.name || (Object.keys(notes).length === 0 ? 'Note Name' : 'New Note')}
              </span>
              {/* Markdown Preview Mode Indicator */}
              {isPreviewMode && (
                <motion.span
                  initial={{ opacity: 0.01 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="ml-2 text-xs text-stone-400 flex items-center"
                >
                  <FaMarkdown size={15} className="mr-1" /> Markdown
                </motion.span>
              )}
            </div>
            {/* Note Creation Date */}
            <div className="text-xs truncate overflow-ellipsis text-stone-400/70 flex items-center mt-0.5">
              {/* Note ID's are stored as their time created in Unix, so we can use that here */}
              {formattedDate}            
            </div>
          </motion.div>
          {isPreviewMode ? (
            <div>
              <MarkdownPreview content={notes[currentNoteId]?.content || 'No content to preview.'} />
            </div>
          ) : (
            <div>
              <motion.textarea
                initial={{ opacity: 0.01 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                ref={textareaRef}
                value={notes[currentNoteId]?.content || ''}
                placeholder="Start typing here..."
                onChange={handleTextareaChange}
                className="bg-transparent border border-neutral-800 text-stone-200 text-opacity-90 placeholder:text-neutral-600 outline-none w-full p-4 duration-300 text-sm md:text-base rounded-b-lg rounded-t-none min-h-96 md:h-[550px] h-[520px] max-w-screen overflow-auto caret-amber-400 tracking-tight resize-none mt-3 textarea-custom-scroll editor-text"
                aria-label="Note Content"
              />
            </div>
          )}
        </div>
      </div>
      {/* `pointer-events-auto` allows toasts to be interacted with when in something like a dialog */}
      <Toaster className="pointer-events-auto" richColors closeButton pauseWhenPageIsHidden theme="dark" />
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