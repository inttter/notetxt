import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Command, FolderOpen, Plus, Download, Copy, ScrollText, View, Search, Lock, Heart } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Command as CmdCommand } from 'cmdk';
import * as Tooltip from '@radix-ui/react-tooltip';

const MenuHeader = ({ title }) => (
  <div className="p-2 text-base text-stone-500 ml-0.5">
    {title}
  </div>
);

const MenuItem = ({ id, icon, name, keybind, onSelect, url }) => {
  const handleSelect = () => {
    if (url) {
      window.open(url, '_blank');
    } else if (onSelect) {
      onSelect();
    }
  };

  return (
    <CmdCommand.Item
      key={id}
      onSelect={handleSelect}
      className="p-2 cursor-pointer border-2 border-transparent hover:bg-neutral-800 hover:bg-opacity-70 hover:border-neutral-800 hover:shadow-lg rounded-xl flex items-center group duration-300"
    >
      <span className="mr-2 text-stone-500">
        {icon}
      </span>
      <span className="text-zinc-300">
        {name}
      </span>
      {keybind && (
        <div className="ml-auto flex items-center">
          <div className="px-2 py-1 rounded-md text-xs text-stone-500 group-hover:text-stone-400 duration-300 code">
            {keybind}
          </div>
        </div>
      )}
    </CmdCommand.Item>
  );
};

const CommandMenu = ({ onCommandSelect, isOpen, toggleMenu }) => {
  const controls = [
    { id: 'open', name: 'Open Note', icon: <FolderOpen size={20} />, keybind: 'Ctrl+O', url: '' },
    { id: 'new', name: 'New Note', icon: <Plus size={20} />, keybind: 'Ctrl+N' },
    { id: 'save', name: 'Save Note', icon: <Download size={20} />, keybind: 'Ctrl+S' },
    { id: 'copy', name: 'Copy Note', icon: <Copy size={20} />, keybind: 'Ctrl+C' },
    { id: 'preview', name: 'Preview Markdown', icon: <View size={20} />, keybind: 'Ctrl+M' },
    { id: 'summary', name: 'Note Summary', icon: <ScrollText size={20} />, keybind: 'Ctrl+I' },
  ];

  const links = [
    { id: 'privacy', name: 'Privacy', icon: <Lock size={20} />, url: '/privacy', keybind: '' },
    { id: 'github', name: 'GitHub', icon: <FaGithub size={20} />, url: 'https://github.com/inttter/notetxt' },
    { id: 'donate', name: 'Donate', icon: <Heart size={20} />, url: 'https://github.com/sponsors/inttter' },
  ];

  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        toggleMenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggleMenu]);

  return (
    <CmdCommand.Dialog open={isOpen} onOpenChange={toggleMenu} label="Command Menu" className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 selection:bg-neutral-700 selection:text-zinc-300">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="shadow-2xl shadow-neutral-950 md:w-1/3 w-full sm:w-11/12 xs:w-3/4 px-4 sm:px-6 md:px-0 overflow-auto"
            ref={menuRef}
          >
            <div className="relative">
              <CmdCommand.Input
                autoFocus
                placeholder="Search for commands..."
                className="w-full p-3 pl-10 bg-neutral-900 placeholder:text-stone-500 text-zinc-100 outline-none tracking-tight border-b-2 border-neutral-800 rounded-t-xl"
              />
              <div className="absolute inset-y-0 left-0.5 pl-2 flex items-center pointer-events-none">
                <Search size={20} className="text-stone-500 ml-1 mb-0.5" />
              </div>
            </div>
            <CmdCommand.List className="bg-neutral-900 p-2 rounded-b-xl">
              <CmdCommand.Group>
                <MenuHeader title="Controls" />
                {controls.map((command) => (
                  <MenuItem
                    key={command.id}
                    id={command.id}
                    icon={command.icon}
                    name={command.name}
                    keybind={command.keybind}
                    url={command.url} // DON'T REMOVE
                    onSelect={() => {
                      onCommandSelect(command.id);
                      toggleMenu(false);
                    }}
                  />
                ))}
              </CmdCommand.Group>
              <CmdCommand.Group>
                <MenuHeader title="Links" />
                {links.map((link) => (
                  <MenuItem
                    key={link.id}
                    id={link.id}
                    icon={link.icon}
                    name={link.name}
                    keybind={link.keybind}
                    url={link.url}
                    onSelect={() => {}} // DON'T REMOVE
                  />
                ))}
              </CmdCommand.Group>
              <CmdCommand.Empty className="p-2 text-stone-400 text-center flex justify-center items-center">
                No results found
              </CmdCommand.Empty>
            </CmdCommand.List>
          </motion.div>
        )}
      </AnimatePresence>
    </CmdCommand.Dialog>
  );
};

const CommandMenuButton = ({ openCommandMenu }) => {
  const [commandMenuOpen, setCommandMenuOpen] = useState(false);

  const toggleCommandMenu = () => {
    setCommandMenuOpen(prev => !prev);
  };

  // not using `hotkeys-js` here so that they can open it from any scenario
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
    <div>
      <Tooltip.Provider>
        <Tooltip.Root delayDuration={0}>
          <Tooltip.Trigger>
            <div className="flex mb-4 px-2 py-2 rounded-lg space-x-2">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                onClick={toggleCommandMenu}
                className="text-neutral-500 bg-[#202020] border border-transparent hover:border-neutral-700 hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 p-3 rounded-full flex items-center"
              >
                <Command size={20} className="text-zinc-300 cursor-pointer" />
              </motion.div>
            </div>
          </Tooltip.Trigger>
          <Tooltip.Portal>
            <Tooltip.Content side="right">
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20, duration: 0.3 }}
                  className="bg-neutral-700 bg-opacity-40 text-zinc-300 text-sm px-2 py-1 rounded-md shadow-xl shadow-neutral-950"
                >
                  <span className="text-base text-zinc-100">
                    Menu (Ctrl/⌘ + K)
                  </span>
                  <br />
                  <span className="text-stone-400">
                    Access controls and links from here.
                  </span>
                  <Tooltip.Arrow className="fill-neutral-700 opacity-40 mr-1" />
                </motion.div>
              </AnimatePresence>
            </Tooltip.Content>
          </Tooltip.Portal>
        </Tooltip.Root>
      </Tooltip.Provider>

      <CommandMenu isOpen={commandMenuOpen} toggleMenu={toggleCommandMenu} onCommandSelect={openCommandMenu} />
    </div>
  );
};

export default CommandMenuButton;