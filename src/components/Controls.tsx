import React, { useEffect } from 'react';
import { Download, FolderOpen, Copy } from 'lucide-react';
import { toast } from 'sonner';
import copy from 'copy-to-clipboard';

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

  const handleCopy = async () => { // for 'Copy Note' button
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

  // keybinds
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'o') { // open file
        event.preventDefault();
        document.getElementById('fileInput').click();
      } else if (event.ctrlKey && event.key === 's' ) { // download
        handleDownload();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <>
      <div className="flex mb-4 px-3 py-2 rounded-lg space-x-2">
      <label htmlFor="fileInput" className="text-zinc-300 bg-[#202020] hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-2 rounded-md flex items-center">
          <FolderOpen size={20} className="mr-0 md:mr-2" /> <span className="text-zinc-300 md:inline hidden">Open File</span>
          <input
            id="fileInput"
            type="file"
            accept=".txt,.md" // notetxt only supports .txt and .md
            className="hidden"
            onChange={handleFileInputChange}
          />
        </label>
        <button className="text-zinc-300 bg-[#202020] hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-2 rounded-md flex items-center" onClick={handleClick(handleDownload)}>
          <Download size={20} className="mr-0 md:mr-2" /> <span className="text-zinc-300 md:inline hidden">Download</span>
        </button>
        <button className="text-zinc-300 bg-[#202020] hover:bg-neutral-600 hover:bg-opacity-40 hover:cursor-pointer duration-300 px-4 py-2 rounded-md flex items-center" onClick={handleCopy}>
          <Copy size={20} className="mr-0 md:mr-2" /> <span className="text-zinc-300 md:inline hidden">Copy Note</span>
        </button>
      </div>
    </>
  );
}

export default Controls;