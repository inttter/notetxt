import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandShortcut, CommandSeparator } from "@/components/ui/Command";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { Badge } from '@/components/ui/Badge';
import { FaGithub, FaMarkdown } from 'react-icons/fa';
import { 
  FolderOpen, Plus, Copy, FileDown, LibraryBig, ListOrdered, 
  Home, Lock, Heart, BookOpenText, Lightbulb, Command as CommandIcon
} from 'lucide-react';
import db from '@/utils/db';
import tips from '@/data/tips.json';

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
      className="p-2 cursor-pointer border-2 border-transparent hover:bg-neutral-800/50 hover:border-neutral-800 hover:shadow-lg rounded-lg flex items-center group duration-300"
    >
      {icon && (
      <span className="mr-2 text-stone-400/80 group-hover:text-stone-400 duration-300">
        {icon}
      </span>
      )}
      <span className="text-zinc-300 group-hover:text-zinc-100 truncate duration-300">
        {name}
      </span>
      {keybind && (
        <CommandShortcut className="ml-auto flex items-center">
          {keybind}
        </CommandShortcut>
      )}
    </CommandItem>
  );
};

const CommandMenu = ({ onCommandSelect, isOpen, toggleMenu, onNoteSelect, formatCreationDate }) => {
  const general = [
    { id: 'open', name: 'Open Note', icon: <FolderOpen size={20} />, keybind: 'Ctrl+O', url: '' },
    { id: 'new', name: 'New Note', icon: <Plus size={20} />, keybind: 'Ctrl+Alt+N' },
    { id: 'copy', name: 'Copy Note', icon: <Copy size={20} />, keybind: 'Ctrl+Shift+C' },
    { id: 'save', name: 'Download Note', icon: <FileDown size={20} />, keybind: 'Ctrl+S' },
    { id: 'manager', name: 'Note Manager', icon: <LibraryBig size={20} />, keybind: 'Ctrl+J' },
    { id: 'preview', name: 'Preview Markdown', icon: <FaMarkdown size={20} />, keybind: 'Ctrl+M' },
    { id: 'summary', name: 'Note Summary', icon: <ListOrdered size={20} />, keybind: 'Ctrl+I' },
  ];

  const links = [
    { id: 'landing', name: 'Home Page', icon: <Home size={20} />, url: '/', keybind: '' },
    { id: 'docs', name: 'Documentation', icon: <BookOpenText size={20} />, url: 'https://docs.notetxt.xyz' },
    { id: 'privacy', name: 'Privacy Policy', icon: <Lock size={20} />, url: '/privacy' },
    { id: 'github', name: 'GitHub', icon: <FaGithub size={20} />, url: 'https://github.com/inttter/notetxt' },
    { id: 'donate', name: 'Donate', icon: <Heart size={20} />, url: 'https://github.com/sponsors/inttter' },
  ];

  const [randomTip, setRandomTip] = useState('');
  const [recentNotes, setRecentNotes] = useState([]);

  useEffect(() => {
    const pickRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setRandomTip(tips[randomIndex]);
    };

    pickRandomTip();

    const intervalId = setInterval(pickRandomTip, 20000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchRecentNotes = async () => {
      const allNotes = await db.notes.toArray();
      const sortedNotes = allNotes
        .sort((a, b) => Number(b.id) - Number(a.id))
        .slice(0, 3)
        .map(note => ({
          ...note,
          preview: note.content,
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
          <Badge className="m-3 ml-3.5 -mb-1.5 font-medium">Editor</Badge>
          <CommandInput
            autoFocus
            placeholder="Search for something..."
            className="w-full bg-dark text-zinc-100"
          />
        </div>
        <div className="bg-dark overflow-hidden flex flex-col" style={{ maxHeight: '60vh' }}>
          <CommandList className="p-2 rounded-b-xl overflow-y-auto flex-grow">
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
                      <span className="text-sm md:text-base font-medium md:font-normal truncate overflow-hidden">
                        {note.name}
                      </span>
                      <span className="text-[11px] md:text-xs text-stone-400 truncate overflow-hidden">
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
            <CommandEmpty className="p-5 text-zinc-300 text-center flex justify-center items-center">
              No results found
            </CommandEmpty>
          </CommandList>
          <div className="p-3 bg-neutral-900 border-t border-neutral-800 text-stone-300 text-xs md:text-sm text-center rounded-b-xl flex items-center justify-center">
            <Lightbulb size={15} className="mr-1 text-amber-400" /> 
            <span className="truncate max-w-xs sm:max-w-sm">
              {randomTip}
            </span>
          </div>
        </div>
      </CommandDialog>
    </div>
  );
}

const CommandMenuButton = ({ openCommandMenu, onNoteSelect, formatCreationDate }) => {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

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
              className="bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700/60 hover:bg-neutral-700/40 duration-300 p-3 rounded-lg flex items-center group"
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
        />
      </div>
    </TooltipProvider>
  );
};

export default CommandMenuButton;