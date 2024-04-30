import React, { useState, useRef, useEffect } from 'react';
import NoteTitle from '../components/Title';
import EditorControls from '../components/EditorControls';
import CharCount from '../components/CharCount';
import Navbar from './Navbar';
import { CircleX } from 'lucide-react';
import '@fontsource/geist-mono';
import '@fontsource/geist-sans';

export default function PlainTextEditor() {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('A simple text editor to write down anything on your mind. Delete this text and start writing something');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [unsupportedFile, setUnsupportedFile] = useState(null);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(contentEditableRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [text]);

  const handleChange = () => {
    setText(contentEditableRef.current.textContent);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title ? `${title}.txt` : 'note.txt';

    document.body.appendChild(a);
    a.click();
  };

  const handleUndo = () => {
    document.execCommand('undo');
  };
  
  const handleRedo = () => {
    document.execCommand('redo');
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  
    const file = event.dataTransfer.files[0];
    const reader = new FileReader();
  
    // Check file type by extension
    if (file && (file.name.endsWith('.txt') || file.name.endsWith('.md'))) {
      reader.onload = (e) => {
        const fileContent = e.target.result as string;
        contentEditableRef.current.innerText = fileContent; // Set innerText instead of textContent
        setUnsupportedFile(null);
      };
      
      reader.readAsText(file);
    } else {
      setUnsupportedFile("Sorry, this type of file is not supported.");
      setTimeout(() => {
        setUnsupportedFile("");
      }, 3000);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = (event) => {
    // checks if the drag event target is the container element or its children
    if (event.currentTarget === event.target || !event.currentTarget.contains(event.relatedTarget)) {
      setIsDraggingOver(false);
      setUnsupportedFile(null);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div 
      className={`overflow-x-hidden bg-neutral-900 min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 selection:bg-neutral-700 selection:text-zinc-300 ${isDraggingOver ? 'bg-neutral-80 opacity-50 duration-300' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <Navbar />
      {unsupportedFile && (
        <div className="absolute bottom-10 flex justify-center items-center bg-red-500 bg-opacity-40 text-zinc-200 p-3 rounded-md">
          <CircleX className="mr-2" size={20} />
          {unsupportedFile}
        </div>
      )}
      <div className="max-w-xl w-full space-y-3 flex-col relative">
        <NoteTitle title={title} setTitle={setTitle} />
        <div className="-ml-2 px-1">
          <EditorControls
            onBoldClick={() => document.execCommand('bold')}
            onItalicClick={() => document.execCommand('italic')}
            onUnderlineClick={() => document.execCommand('underline')}
            onStrikethroughClick={() => document.execCommand('strikethrough')}
            handleUndo={handleUndo}
            handleRedo={handleRedo}
            handleDownload={handleDownload}
          />
        </div>
        <div
          ref={contentEditableRef}
          contentEditable={true}
          className="focus:bg-[#222222] focus:bg-opacity-50 text-neutral-200 outline-none w-full p-4 duration-300 text-lg resize-none rounded-md border-neutral-800 border max-w-screen overflow-auto"
          onInput={handleChange}
          onPaste={handlePaste}
        />
      </div>
      <div className="fixed bottom-0 right-1">
        <CharCount text={text} />
      </div>
    </div>
  );
}