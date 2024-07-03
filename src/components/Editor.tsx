import React, { useState, useEffect } from 'react';
import Controls from './Controls';
import WordCount from './WordCount';
import Modal from './DownloadModal';
import { toast, Toaster } from 'sonner';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';

export default function Editor() {
  const [text, setText] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const savedText = localStorage.getItem('text');

    if (savedText) {
      setText(savedText);
      toast.info('The contents of the previous note were restored.');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('text', text);
  }, [text]);

  // 'Esc' will exit the modal as well
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setModalVisible(false); 
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleDownload = (fileName) => {
    if (!text.trim()) { // if note content is empty when saving
      toast.error('Cannot download an empty note!', {
        description: 'Please type something and then save your note.'
      });
      return;
    }

    const sanitizedText = DOMPurify.sanitize(text);
    const blob = new Blob([sanitizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName ? `${sanitizeFileName(fileName)}.txt` : 'note.txt';

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setModalVisible(false);
    toast.success('Saved to your device!', {
      description: `Check your recent files to find the note! Re-open it here at any time by pressing Ctrl+O or the 'Open File' button and selecting the correct file.`,
    });
  };

  const sanitizeFileName = (fileName) => { // sanitize file names
    return fileName.replace(/[^\w.-]/g, '-');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
  
    if (file && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) { // .txt and .md only
      reader.onload = (e) => {
        const fileContent = e.target.result as string;
        setText(fileContent);
      };
  
      reader.readAsText(file);
      toast.success('Successfully imported contents!')
    } else {
      toast.error('File not supported!', {
        description: `Please drag a '.txt' or '.md' file into the window.`
      });
    }
  };

  const openExistingFile = (fileContent) => {
    setText(fileContent);
    toast.success('Successfully imported contents!');
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event) => {
    // checks if the drag event target is the container element (or its children)
    if (event.currentTarget === event.target || !event.currentTarget.contains(event.relatedTarget)) {
      setIsDraggingOver(false);
    }
  };

  return (
    <div 
      className={`overflow-x-hidden bg-[#111111] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 selection:bg-neutral-700 selection:text-zinc-300 ${isDraggingOver ? 'bg-[#050505] opacity-70 duration-300' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="max-w-xl w-full space-y-3 flex-col relative">
        <div className="-ml-3 px-1">
          <Controls
            handleDownload={() => setModalVisible(true)}
            openExistingFile={openExistingFile}
          />
        </div>
        <motion.textarea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          value={text}
          placeholder="Start typing here..."
          onChange={(e) => setText(e.target.value)}
          className="bg-[#181818] text-neutral-200 placeholder:text-neutral-600 outline-none w-full p-4 duration-300 text-lg resize-none rounded-md border border-neutral-800 focus:border-neutral-700 max-w-screen h-96 overflow-auto"
          aria-label="Note Content"
        />
      </div>
      <Toaster richColors closeButton invert pauseWhenPageIsHidden />
      <div className="absolute bottom-20 md:bottom-0 right-1">
        <WordCount text={text} />
      </div>
      {/* download modal */}
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleDownload}
        />
      )}
    </div>
  );
}