import React, { useEffect } from 'react';
import { Download, FolderOpen, Copy } from 'lucide-react';
import { toast } from 'sonner';
import copy from 'copy-to-clipboard';
import { motion } from 'framer-motion';
import keybind from 'hotkeys-js';

function Controls({ 
  handleDownload,
  openExistingFile
}) {
  
  const handleClick = (callback) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    callback();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        openExistingFile(fileContent);
      };
      reader.readAsText(file);
    }
  };

  // for 'Copy Note' button
  const handleCopy = async () => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      if (textarea.value.trim() === '') {
        toast.warning('There is no content to copy!');
        return;
      }
      try {
        copy(textarea.value);
        toast.success('Note copied to your clipboard!');
      } catch (error) {
        toast.error('Failed to copy note to your clipboard.');
      }
    }
  };

  // Keybinds
  useEffect(() => {
    // Open File
    keybind('ctrl+o, command+o', (event) => {
      event.preventDefault();
      document.getElementById('fileInput').click();
    });

    // Download
    keybind('ctrl+s, command+s', (event) => {
      event.preventDefault();
      handleDownload();
    });

    // Copy Note
    keybind('ctrl+shift+c, command+shift+c', (event) => {
      event.preventDefault();
      handleCopy();
    });

    // unbind all of them on component unmount for cleanup (so no mem leaks?)
    return () => {
      keybind.unbind('ctrl+o, command+o');
      keybind.unbind('ctrl+s, command+s');
      keybind.unbind('ctrl+shift+c, command+shift+c');
    };
  }, [handleDownload, handleCopy]);

  return (
    <>
      <div className="flex mb-4 px-3 py-2 rounded-lg space-x-2">
        <motion.label 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          htmlFor="fileInput" 
          className="text-neutral-500 bg-[#202020] border border-transparent hover:border-neutral-700 hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-2 rounded-md flex items-center"
        >
          <FolderOpen size={20} className="mr-0 md:mr-2" /> <span className="text-zinc-200 md:inline hidden">Open File</span>
          <input
            id="fileInput"
            type="file"
            accept=".txt,.md" // Notetxt only supports .txt and .md
            className="hidden"
            onChange={handleFileInputChange}
          />
        </motion.label>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-neutral-500 bg-[#202020] border border-transparent hover:border-neutral-700 hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-2 rounded-md flex items-center" 
          onClick={handleClick(handleDownload)}
        >
          <Download size={20} className="mr-0 md:mr-2" /> <span className="text-zinc-200 md:inline hidden">Download</span>
        </motion.button>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-neutral-500 bg-[#202020] border border-transparent hover:border-neutral-700 hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-2 rounded-md flex items-center"
          onClick={handleCopy}
        >
          <Copy size={20} className="mr-0 md:mr-2" /> <span className="text-zinc-200 md:inline hidden">Copy Note</span>
        </motion.button>
      </div>
    </>
  );
}

export default Controls;