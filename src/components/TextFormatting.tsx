import React from 'react';
import { FaBold, FaItalic, FaUnderline, FaStrikethrough } from "react-icons/fa6";

function TextFormatting({ onBoldClick, onItalicClick, onUnderlineClick, onStrikethroughClick }) {
  return (
    <div className="flex mb-4">
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Bold (CTRL+B)"
        data-theme="lofi"
        onClick={onBoldClick}
      >
        <FaBold />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Italic (CTRL+I)"
        data-theme="lofi"
        onClick={onItalicClick}
      >
        <FaItalic />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
        onClick={onUnderlineClick}
        data-tip="Underline (CTRL+U)"
        data-theme="lofi"
      >
        <FaUnderline />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Strikethrough"
        data-theme="lofi"
        onClick={onStrikethroughClick}
      >
        <FaStrikethrough />
      </button>
    </div>
  );
}

export default TextFormatting;