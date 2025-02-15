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
import Link from 'next/link';
import * as chrono from 'chrono-node';
import { toast, Toaster } from 'sonner';
import { motion } from 'framer-motion';
import { saveAs } from 'file-saver';
import { isIOS } from 'react-device-detect';
import { FaMarkdown } from 'react-icons/fa';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/router';

export default function Editor() {
  const router = useRouter();
  const mdDocsLink = 'https://docs.notetxt.xyz/main/markdown';
  const [notes, setNotes] = useState<{ [key: string]: Note }>({});
  const [currentNoteId, setCurrentNoteId] = useState<string>('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isDownloadDialogVisible, setIsDownloadDialogVisible] = useState(false);
  const [isNoteSummaryDialogOpen, setNoteSummaryDialogOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [formattedDate, setFormattedDate] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const markdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // When the URL contains `?markdown=true`, the 
    // Markdown Preview will be automatically toggled to be visible
    if (router.query.markdown === 'true') {
      setIsPreviewMode(true);
    };

    const fetchWelcomeNote = async () => {
      try {
        const response = await fetch('/intro.md');
        if (!response.ok) {
          toast.error('Failed to fetch welcome note content.');
          console.error('Failed to fetch welcome note content:', response.status);
          return '';
        }
        const content = await response.text();
        return content;
      } catch (error) {
        toast.error('Failed to load welcome message.');
        console.error('Failed to fetch welcome note:', error);
        return '';
      }
    };

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
          // Check if this is the first time opening the editor using the database
          const appState = await db.appState.get('flags');
          const hasSeenWelcome = appState?.hasSeenWelcome ?? false;

          // If the user is visiting for the first time,
          // then display a welcome/gettting started note.
          if (!hasSeenWelcome) {
            const id = `${Date.now()}`;
            const welcomeContent = await fetchWelcomeNote();
            const welcomeNote: Note = {
              id,
              name: 'Getting Started',
              content: welcomeContent
            };
            await db.notes.add(welcomeNote);
            await db.appState.put({
              id: 'flags',
              hasSeenWelcome: true
            });
            setNotes({ [id]: welcomeNote });
            setCurrentNoteId(id);
            // For this welcome note ONLY, automatically enable the Markdown preview mode
            setIsPreviewMode(true);
          } else {
            // Create a blank note if they've seen the intro
            await handleAddNote();
          }
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

  // Sync scrollbars
  const syncScroll = (e) => {
    if (textareaRef.current && markdownRef.current) {
      const textareaHeight = textareaRef.current.scrollHeight - textareaRef.current.clientHeight;
      const markdownHeight = markdownRef.current.scrollHeight - markdownRef.current.clientHeight;
      const scrollRatio = markdownHeight / textareaHeight;

      const newScrollPosition = e.target.scrollTop * scrollRatio;
      markdownRef.current.scrollTop = newScrollPosition; // Sync markdown scroll
      textareaRef.current.scrollTop = e.target.scrollTop; // Sync textarea scroll
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      // Update textarea scroll position
      textareaRef.current.scrollTop = scrollPosition;
    }
  }, [scrollPosition]);

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

  const handleNoteSelect = (noteId: string) => {
    setCurrentNoteId(noteId);
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
  
      toast.success('Successfully deleted all current notes.');
    } catch (error) {
      console.error('Failed to delete all notes:', error);
      toast.error('Failed to delete all notes.');
    }
  };
  
  const generateTOC = (content: string) => {
    const lines = content.split('\n');
    const toc: string[] = [];
    const headerRegex = /^(#{1,6})\s+(.+)$/; // Matches H1 to H6
    let inTOCSection = false;
    let inCodeBlock = false;
  
    lines.forEach((line) => {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock; // Toggle code block state
        return;
      }
  
      // Check for command line input (both /toc and /contents)
      if (inCodeBlock || line.trim() === `/${commands.toc.aliases[0]}` || line.trim() === '/toc') {
        if (line.trim() === '/toc' || line.trim() === `/${commands.toc.aliases[0]}`) {
          inTOCSection = true;
        }
        return;
      }
  
      const match = line.match(headerRegex);
      if (match && inTOCSection) {
        const [, hashes, title] = match;
        const indent = '  '.repeat(hashes.length - 1); // Indentation based on header level
        const cleanedTitle = title
          .replace(/`([^`]+)`/g, '$1') // Keep content of inline code
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]+/g, '') // Remove punctuation except spaces and hyphens
          .replace(/\s+/g, '-'); // Replace spaces with hyphens
  
        toc.push(`${indent}- [${title}](#${cleanedTitle})`);
      }
    });
  
    return toc.join('\n');
  };
  
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');
  
    const cursorPosition = e.target.selectionStart;
  
    let caretOffset = 0;
  
    // Match and parse dates when it matches regex (where [[...]] contains dates)
    const parsedLines = lines.map((line) =>
      line.replace(/\[\[(.*?)\]\]/g, (_, match) => {
        const parsedDate = chrono.parseDate(match);
  
        if (parsedDate) {
          const day = parsedDate.getDate().toString();
          const month = parsedDate.toLocaleString('en-US', { month: 'long' });
          const year = parsedDate.getFullYear();
  
          // eg. February 2, 2025
          const replacement = `${month} ${day}, ${year}`;
          
          caretOffset += replacement.length - match.length - 4;
          return replacement;
        }
  
        return `[[${match}]]`;
      })
    );
  
    const parsedContent = parsedLines.join('\n');
  
    setNotes((prevNotes) => {
      const updatedNote = {
        ...prevNotes[currentNoteId],
        content: parsedContent,
      };
  
      // Check for commands
      const commandLineIndex = parsedLines.findIndex((line) => line.startsWith('/'));
      if (commandLineIndex !== -1) {
        const command = parsedLines[commandLineIndex].slice(1).toLowerCase(); // Get command without the slash
        const foundCommand = Object.entries(commands).find(([cmd, { aliases }]) =>
          cmd === command || aliases.includes(command) // Check both command and aliases
        );
  
        if (foundCommand) {
          let commandOutput = foundCommand[1].content;
  
          // Use the command key from the foundCommand for TOC logic
          if (foundCommand[0] === 'toc' || foundCommand[1].aliases.includes('contents')) {
            const toc = generateTOC(parsedContent);
            commandOutput = '## Table of Contents\n\n' + toc;
          }
  
          parsedLines[commandLineIndex] = commandOutput;
          const newContent = parsedLines.join('\n');
          updatedNote.content = newContent;
  
          if (textareaRef.current) {
            textareaRef.current.value = newContent;
  
            const positionBeforeCommand = parsedLines
            .slice(0, commandLineIndex)
            .join('\n').length + commandOutput.length + (commandLineIndex === 0 ? 0 : 1);
  
            textareaRef.current.setSelectionRange(positionBeforeCommand, positionBeforeCommand);
            textareaRef.current.focus();
          }
        }
      }
  
      // Move caret to the end of replacement for parsed placeholders (ie. wikilink syntax dates)
      if (textareaRef.current && commandLineIndex === -1) {
        textareaRef.current.value = parsedContent;
  
        // Move caret position to the end of the last replaced string
        const newCaretPosition = cursorPosition + caretOffset;
        textareaRef.current.setSelectionRange(newCaretPosition, newCaretPosition);
        textareaRef.current.focus();
      }
  
      return { ...prevNotes, [currentNoteId]: updatedNote };
    });
  };

  const handleFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;
  
    for (const file of files) {
      if (/\.(txt|md)$/i.test(file.name)) {
        await readFileContents(file);
        await delay(150);
      } else {
        toast.error('File not supported!', {
          description: 'Please select a \'.txt\' or \'.md\' file.',
        });
      }
    }

    event.target.value = ''; // Clear the file input value
    setSearchQuery('');
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

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const readFileContents = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        await delay(150);
  
        const fileContent = e.target?.result as string;
        const fileNameWithExtension = file.name;
        const fileName = fileNameWithExtension.replace(/\.[^/.]+$/, '');
        const fileExtension = fileNameWithExtension.split('.').pop();
  
        const currentTimestamp = Date.now();
        const id = `${currentTimestamp}`;
        const newNote: Note = { id, name: fileName, content: fileContent };
        await db.notes.add(newNote);
        setNotes(prevNotes => ({ ...prevNotes, [id]: newNote }));
        setCurrentNoteId(id);
        setFileName(fileName);
        setFileType(`.${fileExtension}`);
        toast.success(`Successfully imported '${file.name}'!`);
      } catch (error) {
        console.error('Failed to import file contents:', error);
        toast.error('Failed to import file contents.');
      }
    };
    reader.readAsText(file);
    setSearchQuery('');
  };

  const handleDownload = (fileName, fileType) => {
    const note = notes[currentNoteId];

    // Don't allow downloading notes with no content insidfe of them
    if (!note || !note.content.trim()) {
      toast.warning('Cannot download an empty note!', {
        description: 'Type something and then download your note.',
      });
      return;
    }

    // Don't allow downloading notes which have a name >255 characters
    if ((fileName || '').length > 255) {
      toast.warning('File name is too long!', {
        description: 'The file name must be 255 characters or fewer.',
      });
      return;
    }

    const validFileTypes = ['.txt', '.md'];
    const extension = validFileTypes.includes(fileType) ? fileType : '.txt';
  
    const sanitizedText = DOMPurify.sanitize(note.content);
  
    // Set MIME type based on file type
    const mimeType = extension === '.md' ? 'text/markdown' : 'text/plain';
    const blob = new Blob([sanitizedText], { type: mimeType });

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
        duration: 4000,
      });
    }

    setIsDownloadDialogVisible(false);
  };

  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[<>:"\/\\|?*]/g, '-');
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);
  
    const files = Array.from(event.dataTransfer.files);
    for (const file of files) {
      if (/\.(txt|md)$/i.test(file.name)) {
        await readFileContents(file);
        await delay(150);
      } else {
        toast.error(`File '${file.name}' not supported!`, {
          description: 'Please drag in a \'.txt\' or \'.md\' file.',
        });
      }
      setSearchQuery('');
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
        description: 'Create a note with text and try again.',
      });
      return;
    }
    if (note.content.trim() === '') {
      toast.warning('No content available to copy!');
      return;
    }
    try {
      copy(note.content);
      toast.success('Copied note content to the clipboard!');
    } catch (error) {
      console.error('Failed to copy note content to the clipboard:', error)
      toast.error('Failed to copy note content to the clipboard.');
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
        setIsDownloadDialogVisible(true);
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
      case 'manager':
        setIsDrawerOpen(true);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const hotkeyList = 'ctrl+alt+n, ctrl+o, ctrl+s, ctrl+shift+c, ctrl+m, ctrl+i, ctrl+j, command+alt+n, command+o, command+s, command+shift+c, command+m, command+i, command+j';

    const handler = (event: KeyboardEvent, handler: any) => {
      event.preventDefault();
      switch (handler.key) {
        case 'ctrl+alt+n':
        case 'command+alt+n':
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
        case 'ctrl+j':
        case 'command+j':
          handleCommandSelect('manager');
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
    return `${month} ${dayWithSuffix} ${year}, ${hours}:${minutes}`;
  };

  useEffect(() => {
    if (currentNoteId && Number(currentNoteId) > 0) {
      const date = formatCreationDate(currentNoteId);
      setFormattedDate(date);
    } else {
      setFormattedDate(null);
    }
  }, [currentNoteId]);

  return (
    <div
      className="overflow-x-hidden bg-dark min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth px-4 md:px-8 relative"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <DragDropOverlay isDraggingOver={isDraggingOver} />
      <div className={`flex flex-row w-full mt-5 duration-300 ${isPreviewMode ? 'max-w-5xl mr-10' : 'max-w-[710px] md:mr-0 mr-10'}`}>
        <div className={`flex flex-row w-full ${isPreviewMode ? 'mt-4 md:mt-0' : 'mt-0'}`}>
          <Command formatCreationDate={formatCreationDate} onNoteSelect={handleNoteSelect} openCommandMenu={handleCommandSelect} />
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
              onCopyNote={handleCopy}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              formatCreationDate={formatCreationDate}
              isDrawerOpen={isDrawerOpen}
              setIsDrawerOpen={setIsDrawerOpen}
            />
          </div>
        </div>
      </div>
      <div className="max-w-5xl w-full space-y-3 flex-col relative z-10 mb-10">
        <div className="relative">
          <input
            type="file"
            id="fileInput"
            ref={fileInputRef}
            style={{ display: 'none' }}
            accept=".txt,.md"
            onChange={handleFileInputChange}
          />
          <div className={`w-full mx-auto flex flex-col duration-300 ${isPreviewMode ? 'max-w-5xl' : 'max-w-2xl'}`}>
            <motion.div
              initial={{ opacity: 0.01 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="px-3 py-[0.6rem] text-stone-400 bg-dark-secondary border border-neutral-800/70 -mb-3 rounded-t-xl flex flex-col justify-between"
            >
              {/* Note Name */}
              <div className="flex justify-between items-center">
                <span className="text-sm text-stone-200 truncate overflow-ellipsis" aria-label="Note Name">
                  {notes[currentNoteId]?.name || (Object.keys(notes).length === 0 ? <Loader2 size={15} className={`text-stone-200 animate-spin mb-1`} /> : 'New Note')}
                </span>
                {/* Markdown Preview Mode Indicator */}
                {isPreviewMode && (
                  <Link
                    href={mdDocsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-1 text-xs hover:text-stone-300 border-b border-neutral-700 hover:border-neutral-500 duration-300 flex items-center"
                    title="Visit Markdown Documentation"
                    aria-label="Markdown Documentation Link"
                  >
                    <FaMarkdown size={15} className="mr-1" /> Markdown
                  </Link>
                )}
              </div>
              {/* Note Creation Date */}
              <div className="text-xs truncate overflow-ellipsis text-stone-400 flex items-center mt-0.5" aria-label="Note Creation Date">
                {/* Note ID's are stored as their time created in Unix, so we can use that here */}
                {formattedDate || <Loader2 size={12} className={`mr-1 text-stone-00 animate-spin`} />}
              </div>
            </motion.div>
            {/* Editor/Textarea */}
            <div className="flex flex-col md:flex-row justify-center mt-3 max-w-5xl">
              <motion.textarea
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                ref={textareaRef}
                value={notes[currentNoteId]?.content || ''}
                placeholder="Start typing here..."
                onChange={handleTextareaChange}
                onScroll={syncScroll}
                className={`bg-dark-secondary border border-neutral-800/70 text-stone-200/90 placeholder:text-stone-400/90 outline-none leading-[21.5px]
                  ${isPreviewMode ? 'md:block max-w-full md:max-w-lg text-sm md:text-[15.5px] md:w-1/2 rounded-r-lg md:rounded-r-none' : 'max-w-full w-full text-sm md:text-base mx-auto'} 
                p-4 rounded-b-lg rounded-t-none min-h-[542px] max-h-[552px] overflow-auto resize-none textarea-custom-scroll font-ia-quattro tracking-tight`}
                aria-label="Note Content"
              />
              {isPreviewMode && (
                <div 
                  ref={markdownRef} 
                  className={`md:block w-full md:w-1/2 mt-0 ${isPreviewMode ? 'mt-3 max-w-full w-full md:mt-0' : 'mt-0'}`}
                >
                  <MarkdownPreview 
                    scrollPosition={scrollPosition} 
                    setScrollPosition={setScrollPosition} 
                    textareaRef={textareaRef} 
                    content={notes[currentNoteId]?.content || 'No content to preview.'} 
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* `pointer-events-auto` allows toasts to be interacted with when in something like a dialog */}
      <Toaster className="pointer-events-auto" richColors closeButton theme="dark" />
      {isNoteSummaryDialogOpen && (
        <NoteSummary
          text={notes[currentNoteId]?.content || ''}
          isDialogOpen={isNoteSummaryDialogOpen}
          onClose={() => setNoteSummaryDialogOpen(false)}
        />
      )}
      {isDownloadDialogVisible && (
        <Download
          isOpen={isDownloadDialogVisible}
          onRequestClose={() => setIsDownloadDialogVisible(false)}
          onDownload={handleDownload}
          fileName={fileName}
          setFileName={setFileName}
          fileType={fileType}
          setFileType={setFileType}
          currentNoteId={currentNoteId}
        />
      )}
    </div>
  );
}