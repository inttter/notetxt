import React from 'react';
import { Bold, Italic, Underline, Strikethrough, Undo, Redo, Download } from 'lucide-react';

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
    <div className="flex mb-4 bg-neutral-800 ml-2 px-3 py-2 rounded-lg space-x-2">
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Bold (CTRL+B)"
        data-theme="lofi"
        onClick={handleClick(onBoldClick)}
      >
        <Bold size={20} />
      </button>
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Italic (CTRL+I)"
        data-theme="lofi"
        onClick={handleClick(onItalicClick)}
      >
        <Italic size={20} />
      </button>
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Underline (CTRL+U)"
        data-theme="lofi"
        onClick={handleClick(onUnderlineClick)}
      >
        <Underline size={20} />
      </button>
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Strikethrough"
        data-theme="lofi"
        onClick={handleClick(onStrikethroughClick)}
      >
        <Strikethrough size={20} />
      </button>
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Undo (CTRL+Z)"
        data-theme="lofi"
        onClick={handleClick(handleUndo)}
      >
        <Undo size={20} />
      </button>
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Redo (CTRL+Y)"
        data-theme="lofi"
        onClick={handleClick(handleRedo)}
      >
        <Redo size={20} />
      </button>
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Save as .txt file"
        data-theme="lofi"
        onClick={handleClick(handleDownload)}
      >
        <Download size={20} />
      </button>
    </div>
  );
}

export default EditorControls;