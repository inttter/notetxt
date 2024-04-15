import React from 'react';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough, FaUndo, FaRedo, FaDownload } from 'react-icons/fa';

function EditorControls({ 
  onBoldClick, 
  onItalicClick, 
  onUnderlineClick, 
  onStrikethroughClick, 
  handleUndo, 
  handleRedo, 
  handleDownload 
}) {
  const handleClick = (callback) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    callback();
  };

  return (
    <div className="flex mb-4 bg-neutral-800 ml-2 p-1 rounded-lg">
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded hover:border-neutral-700 border-transparent border-2 outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Bold (CTRL+B)"
        data-theme="lofi"
        onClick={handleClick(onBoldClick)}
      >
        <FaBold />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded hover:border-neutral-700 border-transparent border-2 outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Italic (CTRL+I)"
        data-theme="lofi"
        onClick={handleClick(onItalicClick)}
      >
        <FaItalic />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded hover:border-neutral-700 border-transparent border-2 outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Underline (CTRL+U)"
        data-theme="lofi"
        onClick={handleClick(onUnderlineClick)}
      >
        <FaUnderline />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded hover:border-neutral-700 border-transparent border-2 outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Strikethrough"
        data-theme="lofi"
        onClick={handleClick(onStrikethroughClick)}
      >
        <FaStrikethrough />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded hover:border-neutral-700 border-transparent border-2 outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Undo (CTRL+Z)"
        data-theme="lofi"
        onClick={handleClick(handleUndo)}
      >
        <FaUndo />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded hover:border-neutral-700 border-transparent border-2 outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Redo (CTRL+Y)"
        data-theme="lofi"
        onClick={handleClick(handleRedo)}
      >
        <FaRedo />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded hover:border-neutral-700 border-transparent border-2 outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Save as .txt file"
        data-theme="lofi"
        onClick={handleClick(handleDownload)}
      >
        <FaDownload />
      </button>
    </div>
  );
}

export default EditorControls;