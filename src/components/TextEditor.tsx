import React, { useState, useRef } from 'react';
import NoteTitle from '../components/Title';
import TextFormatting from '../components/TextFormatting';
import UndoRedo from '../components/UndoRedo';
import CharCount from '../components/CharCount';
import { FaDownload } from 'react-icons/fa';
import { CgDanger } from 'react-icons/cg';
import '@fontsource/geist-mono';

export default function PlainTextEditor() {
  const [text, setText] = useState(`A simple text editor to write down what's on your mind. Delete this text and start writing something.`);
  const [title, setTitle] = useState('');
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [unsupportedFile, setUnsupportedFile] = useState(null);
  const textareaRef = useRef(null);

  const handleChange = (event) => {
    setText(event.target.value);
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
        setUnsupportedFile(null); // Reset the message if it was previously displayed
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
    // Check if the drag event target is the container element or its children
    if (event.currentTarget === event.target || !event.currentTarget.contains(event.relatedTarget)) {
      setIsDraggingOver(false);
      setUnsupportedFile(null); // Reset the message when dragging leaves
    }
  };

  return (
    <div 
      className={`bg-neutral-900 min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 selection:bg-[#E8D4B6] selection:text-black ${isDraggingOver ? 'bg-neutral-950 opacity-50 duration-300' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {unsupportedFile && (
        <div className="absolute flex items-center bottom-10 md:bottom-5 w-1/2 py-2 pl-4 bg-red-500 bg-opacity-40 rounded-md text-zinc-300 text-md">
          <CgDanger className="mr-1 text-xl" />
          {unsupportedFile}
        </div>
      )}
      <div className="max-w-xl w-full px-5 space-y-4 flex-col relative top-0 md:px-0">
        <NoteTitle title={title} setTitle={setTitle} />
        <div className="flex justify-between items-center">
          <TextFormatting
            onBoldClick={() => document.execCommand('bold')}
            onItalicClick={() => document.execCommand('italic')}
            onUnderlineClick={() => document.execCommand('underline')}
            onStrikethroughClick={() => document.execCommand('strikethrough')}
          />
          <UndoRedo handleUndo={handleUndo} handleRedo={handleRedo} />
          <div className="flex mb-4 bg-neutral-800 ml-2 p-1 rounded-lg">
            <button
              className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
              data-tip="Save as .txt file"
              data-theme="lofi"
              onClick={handleDownload}
            >
              <FaDownload />
            </button>
          </div>
        </div>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          className="bg-neutral-900 text-white focus:outline-none w-full px-3 font-mono text-lg resize-none caret-thick text"
          style={{ fontFamily: "'Geist Mono', monospace", minHeight: '200px' }}
        />
      </div>
      <CharCount text={text} />
    </div>
  );
}