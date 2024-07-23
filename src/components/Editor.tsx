import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, Toaster } from 'sonner';
import Command from './Command';
import WordCount from './WordCount';
import Modal from './DownloadModal';
import copy from 'copy-to-clipboard';
import hotkeys from 'hotkeys-js';
import DOMPurify from 'dompurify';
import { motion } from 'framer-motion';
import { useText } from './markdown/TextContent';

export default function Editor() {
  const router = useRouter();
  const { text, setText } = useText();
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('.txt');
  const [previewId, setPreviewId] = useState<number | null>(null);

  useEffect(() => {
    const savedText = localStorage.getItem('text');
    if (savedText) {
      setText(savedText);
      toast.info('Restored the contents of the previous note.');
    }
  }, [setText]);

  useEffect(() => {
    localStorage.setItem('text', text);
  }, [text]);

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
      readFileContents(file);
    } else {
      toast.error('File not supported!', {
        description: `Please select a '.txt' or '.md' file.`
      });
    }
  };

  const readFileContents = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target?.result as string;
      const fileNameWithExtension = file.name;
      const fileName = fileNameWithExtension.replace(/\.[^/.]+$/, '');
      const fileExtension = fileNameWithExtension.split('.').pop();
  
      setText(fileContent);
      setFileName(fileName);
      setFileType(`.${fileExtension}`);
      toast.success('Successfully imported contents!');
    };
    reader.readAsText(file);
  };

  // Check if the user is on an iOS device
  const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  const handleDownload = (fileName, fileType) => {
    if (!text.trim()) {
      toast.error('Cannot download an empty note!', {
        description: 'Please type something and then save your note.',
      });
      return;
    }
  
    const sanitizedText = DOMPurify.sanitize(text);
    const blob = new Blob([sanitizedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
  
    const defaultFileName = 'untitled-note';
    const sanitizedFileName = sanitizeFileName(fileName || defaultFileName);
  
    const extension = fileType.startsWith('.') ? fileType : `.${fileType}`;
  
    let finalFileName = sanitizedFileName;
    if (!finalFileName.toLowerCase().endsWith(extension)) {
      finalFileName += extension;
    }
  
    const a = document.createElement('a');
    a.href = url;
    a.download = finalFileName;

    document.body.appendChild(a);
    a.click();
  
    // On iOS, if the user dismisses the download prompt, the success toast might still show.
    // To handle this, show a different toast.
    if (isIOS()) {
      toast.info('Check your downloads folder.', {
        description: `Make sure you clicked 'Download' on the alert that appeared to download the note to your device. If you didn't, the note did not download.`,
      });
    } else {
      setTimeout(() => {
        toast.success('Saved to your device!', {
          description: `Check your recent files to find the note! Re-open it here at any time by pressing Ctrl+O or the 'Open Note' option in the command menu and selecting the correct file.`,
        });
      }, 400);
    }
  
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setModalVisible(false);
  };
  
  const sanitizeFileName = (fileName) => {
    return fileName.replace(/[<>:"\/\\|?*]/g, '-');
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDraggingOver(false);

    const file = event.dataTransfer.files[0];
    if (file && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
      readFileContents(file);
    } else {
      toast.error('File not supported!', {
        description: `Please drag in a '.TXT' or '.MD' file.`
      });
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

  const handleCommandSelect = (commandId: string) => {
    switch (commandId) {
      case 'new':
        setText('');
        toast.info('Started a new note.');
        break;
      case 'open':
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        fileInput.click();
        break;
      case 'save':
        setModalVisible(true);
        break;
      case 'copy':
        handleCopy();
        break;
      case 'preview':
        const id = Date.now();
        setPreviewId(id);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (previewId !== null) {
      localStorage.setItem(`markdown_${previewId}`, text);

      toast.promise(
        router.push(`/preview/${previewId}`),
        {
          loading: 'Loading preview...',
          success: 'Preview loaded successfully!',
          error: 'Failed to load preview.',
        }
      );
    }
  }, [previewId]);

  useEffect(() => {
    const hotkeyList = 'ctrl+n, ctrl+o, ctrl+s, ctrl+shift+c, ctrl+m, command+n, command+o, command+s, command+shift+c, command+m';
    
    const handler = (event: KeyboardEvent, handler: any) => {
      event.preventDefault();
      switch (handler.key) {
        case 'ctrl+n':
        case 'command+n':
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
        default:
          break;
      }
    };

    hotkeys(hotkeyList, handler);

    return () => {
      hotkeys.unbind(hotkeyList);
    };
  }, []);

  return (
    <div
      className={`overflow-x-hidden bg-[#111111] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 ${isDraggingOver ? 'bg-[#050505] opacity-70 duration-300' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="max-w-xl w-full space-y-3 flex-col relative">
        <div className="-ml-3 px-1">
          <Command openCommandMenu={handleCommandSelect} />
          <input
            type="file"
            id="fileInput"
            style={{ display: 'none' }}
            accept=".txt,.md"
            onChange={handleFileInputChange}
          />
        </div>
        <motion.textarea
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          value={text}
          placeholder="Start typing here..."
          onChange={(e) => setText(e.target.value)}
          className="bg-[#181818] text-neutral-200 placeholder:text-neutral-600 outline-none w-full p-4 duration-300 text-lg rounded-md border border-neutral-800 focus:border-neutral-700 min-h-96 max-w-screen h-96 overflow-auto"
          aria-label="Note Content"
        />
      </div>
      <Toaster richColors closeButton invert pauseWhenPageIsHidden />
      <div className="absolute bottom-20 md:bottom-0 right-1">
        <WordCount text={text} />
      </div>
      {/* Download Modal */}
      {isModalVisible && (
        <Modal
          isVisible={isModalVisible}
          onClose={() => setModalVisible(false)}
          onSave={(fileName) => handleDownload(fileName, fileType)}
          initialFileName={fileName}
          selectedFileType={fileType}
          onFileTypeChange={(type) => setFileType(type)}
        />
      )}
    </div>
  );
}