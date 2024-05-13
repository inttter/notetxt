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
    <div className="flex mb-4 bg-[#191919] ml-2 px-3 py-2 rounded-lg space-x-2">
      <button
        className="text-zinc-300 bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Bold"
        data-theme="lofi"
        onClick={handleClick(onBoldClick)}
      >
        <Bold size={20} />
      </button>
      <button
        className="text-zinc-300 bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Italic"
        data-theme="lofi"
        onClick={handleClick(onItalicClick)}
      >
        <Italic size={20} />
      </button>
      <button
        className="text-zinc-300 bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Underline"
        data-theme="lofi"
        onClick={handleClick(onUnderlineClick)}
      >
        <Underline size={20} />
      </button>
      <button
        className="text-zinc-300 bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Strikethrough"
        data-theme="lofi"
        onClick={handleClick(onStrikethroughClick)}
      >
        <Strikethrough size={20} />
      </button>
      <button
        className="text-zinc-300 bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Undo"
        data-theme="lofi"
        onClick={handleClick(handleUndo)}
      >
        <Undo size={20} />
      </button>
      <button
        className="text-zinc-300 bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Redo"
        data-theme="lofi"
        onClick={handleClick(handleRedo)}
      >
        <Redo size={20} />
      </button>
      <button
        className="text-white bg-transparent outline-none tooltip tooltip-bottom font-semibold hover:bg-neutral-700 hover:bg-opacity-40 duration-300 hover:border-neutral-700 border-transparent border-2 p-2 rounded-lg"
        data-tip="Download"
        data-theme="lofi"
        onClick={handleClick(handleDownload)}
      >
        <Download size={20} />
      </button>
    </div>
  );
}

export default EditorControls;