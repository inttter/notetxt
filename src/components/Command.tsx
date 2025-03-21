import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandShortcut, CommandSeparator } from "@/components/ui/Command";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { isMobile } from 'react-device-detect';
import { FaGithub, FaMarkdown } from 'react-icons/fa';
import { 
  FileInput, Plus, Copy, Download, LibraryBig, ListOrdered, 
  BookOpenText, Lock, Heart, 
  Command as CommandIcon
} from 'lucide-react';
import db from '@/utils/db';

const MenuItem = ({ id, icon, name, keybind, onSelect, url }) => {
  const handleSelect = () => {
    if (url) {
      window.open(url, '_blank');
    } else if (onSelect) {
      onSelect();
    }
  };

  return (
    <CommandItem
      key={id}
      onSelect={handleSelect}
      className="p-2.5 my-0.5 hover:cursor-pointer hover:bg-dark-button hover:border-neutral-800 rounded-lg flex items-center group duration-300"
    >
      {icon && (
      <span className="mr-2 text-stone-400 duration-300">
        {icon}
      </span>
      )}
      <span className="text-zinc-300 truncate duration-300">
        {name}
      </span>
      {!isMobile && keybind && (
        <CommandShortcut className="ml-autoflex items-center">
          {keybind}
        </CommandShortcut>
      )}
    </CommandItem>
  );
};

const CommandMenu = ({ onCommandSelect, isOpen, toggleMenu, onNoteSelect, formatCreationDate, showRecentNotes }) => {
  const general = [
    { id: 'open', name: 'Import Note', icon: <FileInput size={20} />, keybind: 'Ctrl+O', url: '' },
    { id: 'new', name: 'New Note', icon: <Plus size={20} />, keybind: 'Ctrl+Alt+N' },
    { id: 'copy', name: 'Copy Note', icon: <Copy size={20} />, keybind: 'Ctrl+Shift+C' },
    { id: 'save', name: 'Download Note', icon: <Download size={20} />, keybind: 'Ctrl+S' },
    { id: 'summary', name: 'Note Summary', icon: <ListOrdered size={20} />, keybind: 'Ctrl+I' },
    { id: 'manager', name: 'Note Manager', icon: <LibraryBig size={20} />, keybind: 'Ctrl+J' },
    { id: 'preview', name: 'Preview Markdown', icon: <FaMarkdown size={20} />, keybind: 'Ctrl+M' },
  ];

  const links = [
    { id: 'docs', name: 'Documentation', icon: <BookOpenText size={20} />, url: 'https://docs.notetxt.xyz' },
    { id: 'privacy', name: 'Privacy Policy', icon: <Lock size={20} />, url: '/privacy' },
    { id: 'github', name: 'GitHub', icon: <FaGithub size={20} />, url: 'https://github.com/inttter/notetxt' },
    { id: 'donate', name: 'Donate', icon: <Heart size={20} />, url: 'https://github.com/sponsors/inttter' },
  ];

  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      const allNotes = await db.notes.toArray();
      const sortedNotes = allNotes
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 3) // Fetch the 3 most recent notes
        .map(note => ({
          ...note,
          date: formatCreationDate(note.id)
        }));
      setRecentNotes(sortedNotes);
    };

    if (isOpen) {
      fetchRecentNotes();
    }
  }, [isOpen]);

  return (
    <div>
      <CommandDialog open={isOpen} onOpenChange={toggleMenu}>
        <div className="bg-dark">
          <CommandInput
            autoFocus
            placeholder="Search for something..."
            className="w-full bg-dark text-zinc-100"
          />
        </div>
        <div className="bg-dark overflow-hidden flex flex-col" style={{ maxHeight: '65vh' }}>
          <CommandList className="p-2 rounded-b-xl overflow-y-auto flex-grow">
            {showRecentNotes && recentNotes.length > 0 && (
              <>
                <CommandGroup heading="Recent Notes">
                  {recentNotes.map((note) => (
                    // @ts-ignore
                    <MenuItem
                      key={note.id}
                      id={note.id}
                      // To override the default naming styling from the MenuItem
                      // component, which allows showing the note name and date
                      name={
                        <div className="flex flex-col flex-grow overflow-hidden">
                          <span className="text-sm md:text-base font-medium truncate overflow-hidden">
                            {note.name}
                          </span>
                          <span className="text-[11px] md:text-xs text-zinc-300/85 truncate overflow-hidden">
                            {note.date}
                          </span>
                        </div>
                      }
                      onSelect={() => {
                        onNoteSelect(note.id);
                        toggleMenu(false);
                      }}
                    />
                  ))}
                </CommandGroup>
                <CommandSeparator />
              </>
            )}
            <CommandGroup heading="General">
              {general.map((command) => (
                // @ts-ignore
                <MenuItem
                  key={command.id}
                  id={command.id}
                  icon={command.icon}
                  name={command.name}
                  keybind={command.keybind}
                  onSelect={() => {
                    onCommandSelect(command.id);
                    toggleMenu(false);
                  }}
                />
              ))}
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Links">
              {links.map((link) => (
                // @ts-ignore
                <MenuItem
                  key={link.id}
                  id={link.id}
                  icon={link.icon}
                  name={link.name}
                  url={link.url}
                  onSelect={() => {}}
                />
              ))}
            </CommandGroup>
            <CommandEmpty>
              No results found
            </CommandEmpty>
          </CommandList>
        </div>
      </CommandDialog>
    </div>
  );
};

const CommandMenuButton = ({ openCommandMenu, onNoteSelect, formatCreationDate }) => {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);
  const [showRecentNotes, setShowRecentNotes] = useState(true);

  const toggleCommandMenu = () => {
    setCommandMenuOpen(prev => !prev);
  };

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      toggleCommandMenu();
    }
  }, [toggleCommandMenu]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  useEffect(() => {
    const fetchSettings = async () => {
      const setting = await db.settings.get('user-settings');
      if (setting) {
        setShowRecentNotes(setting.editor.showRecentNotes);
      }
    };

    fetchSettings();
  }, []);

  return (
    <TooltipProvider delayDuration={50}>
      <div className="flex mb-4 px-5 mx-0.5 rounded-lg">
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={toggleCommandMenu}
              className="bg-dark-button/80 border border-neutral-800 hover:border-neutral-700/60 hover:bg-neutral-800/70 duration-300 p-3 rounded-lg flex items-center group"
              aria-label="Open Command Menu Button"
            >
              <CommandIcon size={20} className="text-stone-300 group-hover:text-zinc-100 duration-300" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Command Menu
          </TooltipContent>
        </Tooltip>
        
        <CommandMenu 
          onNoteSelect={onNoteSelect} 
          isOpen={commandMenuOpen} 
          toggleMenu={toggleCommandMenu} 
          onCommandSelect={openCommandMenu}
          formatCreationDate={formatCreationDate} 
          showRecentNotes={showRecentNotes}
        />
      </div>
    </TooltipProvider>
  );
};

export default CommandMenuButton;
