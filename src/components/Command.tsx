import React, { useState, useEffect, useRef } from 'react';
import { Command, FolderOpen, Plus, Download, Copy, Search, Github, Lock, Keyboard, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command as CmdCommand } from 'cmdk';

const CommandMenu = ({ onCommandSelect, isOpen, toggleMenu }) => {
  const controls = [
    { id: 'open', name: 'Open Note', icon: <FolderOpen size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, keybind: 'Ctrl+O' },
    { id: 'new', name: 'New Note', icon: <Plus size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, keybind: 'Ctrl+N' },
    { id: 'save', name: 'Save Note', icon: <Download size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, keybind: 'Ctrl+S' },
    { id: 'copy', name: 'Copy Note', icon: <Copy size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, keybind: 'Ctrl+Shift+C' },
  ];

  const links = [
    { id: 'privacy', name: 'Privacy', icon: <Lock size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, url: '/privacy' }, 
    { id: 'keybinds', name: 'Keybinds', icon: <Keyboard size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, url: 'https://github.com/inttter/notetxt?tab=readme-ov-file#keybinds' }, 
    { id: 'github', name: 'GitHub', icon: <Github size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, url: 'https://github.com/inttter/notetxt' },
    { id: 'donate', name: 'Donate', icon: <Heart size={20} className="mr-2 text-stone-500 group-hover:text-zinc-300 duration-300" />, url: 'https://github.com/sponsors/inttter' },
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
    <CmdCommand.Dialog open={isOpen} onOpenChange={toggleMenu} label="Command Menu" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 selection:bg-neutral-700 selection:text-zinc-300">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="rounded-md shadow-2xl shadow-neutral-950 md:w-1/3 w-full px-6 md:px-0 overflow-auto"
            ref={menuRef}
          >
            <div className="relative">
              <CmdCommand.Input autoFocus
                placeholder="Type a command or search" 
                className="w-full px-4 py-2 pl-10 rounded-xl bg-neutral-900 placeholder:text-neutral-500 text-zinc-100 outline-none tracking-tight border border-neutral-800 focus:border-neutral-700 duration-300" 
              />
              <div className="absolute inset-y-0 left-0.5 pl-2 flex items-center pointer-events-none">
                <Search size={20} className="text-stone-500 ml-1" />
              </div>
            </div>
            <CmdCommand.List className="bg-neutral-900 p-2 mt-3 rounded-xl">
              <CmdCommand.Group>
                <div className="p-2 text-md text-stone-500">
                  Controls
                </div>
                {controls.map((command) => (
                  <CmdCommand.Item
                  key={command.id}
                  onSelect={() => {
                    onCommandSelect(command.id);
                    toggleMenu(false);
                  }}
                  className="p-2 cursor-pointer text-zinc-300 hover:bg-neutral-800 border border-transparent hover:shadow-lg hover:shadow-neutral-950 rounded-lg duration-300 flex items-center group"
                >
                  {command.icon}
                  {command.name}
                  <div className="ml-auto flex items-center space-x-1 text-xs text-neutral-500">
                    {command.keybind && (
                      <>
                        <div className="px-2 py-1 duration-300 rounded-md text-stone-400 group-hover:text-zinc-300 tracking-wider code">
                          {command.keybind}
                        </div>
                      </>
                    )}
                  </div>
                </CmdCommand.Item>
                ))}
              </CmdCommand.Group>
              <CmdCommand.Group>
                <div className="p-2 text-md text-stone-500">
                  Links
                </div>
                {links.map((link) => (
                  <CmdCommand.Item
                    key={link.id}
                    onSelect={() => {
                      window.open(link.url, '_blank');
                      toggleMenu(false);
                    }}
                    className="p-2 cursor-pointer text-zinc-300 hover:bg-neutral-800 border border-transparent hover:shadow-lg hover:shadow-neutral-950 rounded-lg duration-300 flex items-center group"
                  >
                    {link.icon}
                    {link.name}
                  </CmdCommand.Item>
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
  const handleKeyDown = (event) => {
    if (event.key === 'k' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      toggleCommandMenu();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div>
      <div className="flex mb-4 px-2 py-2 rounded-lg space-x-2">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onClick={toggleCommandMenu}
          className="text-neutral-500 bg-[#202020] border border-transparent hover:border-neutral-700 hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 p-3 rounded-full flex items-center tooltip tooltip-right"
          data-tip="Menu (Ctrl/Cmd+K)"
          data-theme="black"
        >
          <Command size={20} className="text-zinc-300 cursor-pointer" />
        </motion.div>
      </div>

      <CommandMenu isOpen={commandMenuOpen} toggleMenu={toggleCommandMenu} onCommandSelect={openCommandMenu} />
    </div>
  );
};

export default CommandMenuButton;