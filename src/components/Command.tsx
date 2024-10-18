import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Command, FolderOpen, Plus, Download, Copy, ScrollText, View, Search, Home, Lock, Heart, BookOpenText } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Command as CmdCommand } from 'cmdk';

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
      className="p-2 cursor-pointer border-2 border-transparent hover:bg-neutral-900 hover:border-neutral-800 hover:shadow-lg rounded-lg flex items-center group duration-300"
    >
      <span className="mr-2 text-stone-500 group-hover:text-stone-400 duration-300">
        {icon}
      </span>
      <span className="text-zinc-300 group-hover:text-zinc-100 duration-300">
        {name}
      </span>
      {keybind && (
        <div className="ml-auto flex items-center">
          <div className="px-2 py-1 text-xs text-stone-500 group-hover:text-stone-400 duration-300 code">
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
    { id: 'copy', name: 'Copy Note', icon: <Copy size={20} />, keybind: 'Ctrl+Shift+C' },
    { id: 'save', name: 'Download Note', icon: <Download size={20} />, keybind: 'Ctrl+S' },
    { id: 'preview', name: 'Preview Markdown', icon: <View size={20} />, keybind: 'Ctrl+M' },
    { id: 'summary', name: 'Note Summary', icon: <ScrollText size={20} />, keybind: 'Ctrl+I' },
  ];

  const links = [
    { id: 'landing', name: 'Landing Page', icon: <Home size={20} />, url: '/', keybind: '' },
    { id: 'docs', name: 'Documentation', icon: <BookOpenText size={20} />, url: 'https://docs.notetxt.xyz' },
    { id: 'privacy', name: 'Privacy', icon: <Lock size={20} />, url: '/privacy' },
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
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
            transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
            className="bg-dark border border-neutral-800 mx-5 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-full relative"
            ref={menuRef}
          >
            <div className="relative">
              <CmdCommand.Input
                autoFocus
                placeholder="Search for commands..."
                className="w-full p-3 pl-10 bg-dark placeholder:text-stone-600 text-zinc-100 outline-none tracking-tight border-b-2 border-neutral-800 rounded-t-xl"
              />
              <div className="absolute inset-y-0 left-0.5 pl-2 flex items-center pointer-events-none">
                <Search size={20} className="text-stone-500 ml-1 mb-0.5" />
              </div>
            </div>
            <div className="max-h-[520px] overflow-y-auto textarea-custom-scroll">
              <CmdCommand.List className="p-2 rounded-b-xl">
                <CmdCommand.Group>
                  <MenuHeader title="Controls" />
                  {controls.map((command) => (
                    <MenuItem
                      key={command.id}
                      id={command.id}
                      icon={command.icon}
                      name={command.name}
                      keybind={command.keybind}
                      url={command.url}  // DON'T REMOVE
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
            </div>
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
    <div className="flex mb-4 px-5 mx-0.5 rounded-lg">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        onClick={toggleCommandMenu}
        className="text-neutral-500 bg-neutral-800 bg-opacity-40 border border-neutral-800 hover:bg-neutral-700 hover:bg-opacity-40 hover:cursor-pointer duration-300 p-3 rounded-lg flex items-center group"
        aria-label="Button To Open Command Menu"
        title="Command Menu"
      >
        <Command size={20} className="text-stone-400 group-hover:text-stone-300 duration-300" />
      </motion.button>

      <CommandMenu isOpen={commandMenuOpen} toggleMenu={toggleCommandMenu} onCommandSelect={openCommandMenu} />
    </div>
  );
};

export default CommandMenuButton;