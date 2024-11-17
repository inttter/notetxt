import React, { useState, useEffect, useCallback } from 'react';
import { FaGithub, FaMarkdown } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CommandDialog, CommandInput, CommandList, CommandGroup, CommandItem, CommandEmpty, CommandShortcut } from "@/components/ui/Command";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import tips from '@/data/tips.json';
import { 
  Search, FolderOpen, Plus, Copy, Download, ScrollText, 
  Home, Lock, Heart, BookOpenText, Lightbulb, Command as CommandIcon
} from 'lucide-react';

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
      className="p-2 cursor-pointer border-2 border-transparent hover:bg-neutral-900 hover:border-neutral-800 hover:shadow-lg rounded-lg flex items-center group duration-300"
    >
      <span className="mr-2 text-stone-400/80 group-hover:text-stone-400 duration-300">
        {icon}
      </span>
      <span className="text-zinc-00 group-hover:text-zinc-100 duration-300">
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

const CommandMenu = ({ onCommandSelect, isOpen, toggleMenu }) => {
  const controls = [
    { id: 'open', name: 'Open Note', icon: <FolderOpen size={20} />, keybind: 'Ctrl+O', url: '' },
    { id: 'new', name: 'New Note', icon: <Plus size={20} />, keybind: 'Ctrl+Alt+N' },
    { id: 'copy', name: 'Copy Note', icon: <Copy size={20} />, keybind: 'Ctrl+Shift+C' },
    { id: 'save', name: 'Download Note', icon: <Download size={20} />, keybind: 'Ctrl+S' },
    { id: 'preview', name: 'View In Markdown', icon: <FaMarkdown size={20} />, keybind: 'Ctrl+M' },
    { id: 'summary', name: 'Note Summary', icon: <ScrollText size={20} />, keybind: 'Ctrl+I' },
  ];

  const links = [
    { id: 'landing', name: 'Landing Page', icon: <Home size={20} />, url: '/', keybind: '' },
    { id: 'docs', name: 'Documentation', icon: <BookOpenText size={20} />, url: 'https://docs.notetxt.xyz' },
    { id: 'privacy', name: 'Privacy', icon: <Lock size={20} />, url: '/privacy' },
    { id: 'github', name: 'GitHub', icon: <FaGithub size={20} />, url: 'https://github.com/inttter/notetxt' },
    { id: 'donate', name: 'Donate', icon: <Heart size={20} />, url: 'https://github.com/sponsors/inttter' },
  ];

  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const pickRandomTip = () => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setRandomTip(tips[randomIndex]);
    };

    pickRandomTip();

    const intervalId = setInterval(pickRandomTip, 20000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <CommandDialog open={isOpen} onOpenChange={toggleMenu}>
        <div className="relative bg-dark">
          <CommandInput
            autoFocus
            placeholder="Search for commands..."
            className="w-full bg-dark placeholder:text-stone-600 text-zinc-100 outline-none tracking-tight border-b-2 border-neutral-800 rounded-t-xl"
          />
          <div className="absolute inset-y-0 left-0.5 pl-2 flex items-center pointer-events-none">
            <Search size={20} className="text-stone-500 ml-1 mb-0.5" />
          </div>
        </div>
        <div className="max-h-[520px] overflow-y-auto textarea-custom-scroll rounded-b-xl bg-dark">
          <CommandList className="p-2 rounded-b-xl pb-14">
            <CommandGroup heading="Controls">
              {controls.map((command) => (
                <MenuItem
                  key={command.id}
                  id={command.id}
                  icon={command.icon}
                  name={command.name}
                  keybind={command.keybind}
                  url={command.url}
                  onSelect={() => {
                    onCommandSelect(command.id);
                    toggleMenu(false);
                  }}
                />
              ))}
            </CommandGroup>
            <CommandGroup heading="Links">
              {links.map((link) => (
                <MenuItem
                  key={link.id}
                  id={link.id}
                  icon={link.icon}
                  name={link.name}
                  keybind={link.keybind}
                  url={link.url}
                  onSelect={() => {}}
                />
              ))}
            </CommandGroup>
            <CommandEmpty className="p-2 text-stone-400 text-center flex justify-center items-center">
              No results found
            </CommandEmpty>
          </CommandList>
        </div>
        <div className="absolute bottom-0 w-full p-3 bg-neutral-900/80 backdrop-blur-sm border-t border-neutral-700/60 text-stone-300 text-xs md:text-sm text-center rounded-b-xl flex items-center justify-center">
          <Lightbulb size={15} className="mr-1 text-amber-400" /> 
          <span className="truncate max-w-xs sm:max-w-sm">
            {randomTip}
          </span>
        </div>
      </CommandDialog>
    </div>
  );
}

const CommandMenuButton = ({ openCommandMenu }) => {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  const toggleCommandMenu = () => {
    setCommandMenuOpen(prev => !prev);
  };

  // Not using `hotkeys-js` here so that user can open it from any scenario
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
              className="bg-neutral-800/40 border border-neutral-800 hover:border-neutral-700/60 hover:bg-neutral-700/40 hover:bg-opacity-40 duration-300 p-3 rounded-lg flex items-center group"
              aria-label="Open Command Menu Button"
            >
              <CommandIcon size={20} className="text-stone-300 group-hover:text-zinc-100 duration-300" />
            </motion.button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Command Menu
          </TooltipContent>
        </Tooltip>
        
        <CommandMenu isOpen={commandMenuOpen} toggleMenu={toggleCommandMenu} onCommandSelect={openCommandMenu} />
      </div>
    </TooltipProvider>
  );
};

export default CommandMenuButton;