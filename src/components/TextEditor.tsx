import React, { useState, useRef, useEffect } from 'react';
import NoteTitle from '../components/Title';
import EditorControls from '../components/EditorControls';
import CharCount from '../components/CharCount';
import Navbar from './Navbar';
import { CgDanger } from 'react-icons/cg';
import '@fontsource/geist-mono';

export default function PlainTextEditor() {
  const [text, setText] = useState(`A simple text editor to write down what's on your mind. Delete this text and start writing something.`);
  const [title, setTitle] = useState('');
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
        setText(fileContent);
        setUnsupportedFile(null);
      };
      
      reader.readAsText(file);
    } else {
      setUnsupportedFile("This is not a supported file format. Only .txt and .md files are supported.");
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

  return (
    <div 
      className={`overflow-x-hidden bg-neutral-900 min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 selection:bg-[#E8D4B6] selection:text-black ${isDraggingOver ? 'bg-neutral-950 opacity-50 duration-300' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      <div className="flex flex-col justify-start items-start md:w-[600px]">
        <Navbar />
      </div>
      {unsupportedFile && (
        <div className="absolute flex items-center bottom-10 md:bottom-5 w-1/2 py-2 pl-4 bg-red-500 bg-opacity-40 rounded-md text-zinc-300 text-md">
          <CgDanger className="mr-1 text-xl" />
          {unsupportedFile}
        </div>
      )}
      <div className="max-w-xl w-full space-y-4 flex-col relative">
        <NoteTitle title={title} setTitle={setTitle} />
        <div className="-ml-2">
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
          contentEditable
          className="bg-neutral-800 bg-opacity-80 focus:bg-opacity-50 text-neutral-200 outline-none w-full p-3 border-neutral-700 border-transparent border duration-300 font-mono text-lg resize-none caret-thick text rounded-lg"
          style={{ fontFamily: "'Geist Mono', monospace" }}
          onInput={handleChange}
        >
          {text}
        </div>
      </div>
      <div className="fixed bottom-0 right-1">
        <CharCount text={text} />
      </div>
    </div>
  );
}