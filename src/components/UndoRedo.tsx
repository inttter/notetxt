import React from 'react';
import { FaUndo, FaRedo } from "react-icons/fa";

function UndoRedo({ handleUndo, handleRedo }) {

  const handleClickUndo = () => {
    document.execCommand('undo');
  };

  const handleClickRedo = () => {
    document.execCommand('redo');
  };

  return (
    <div className="flex mb-4 bg-neutral-800 ml-2 p-1 rounded-lg">
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
        onClick={handleClickUndo}
        data-tip="Undo (CTRL+Z)"
        data-theme="lofi"
      >
        <FaUndo />
      </button>
      <button
        className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
        data-tip="Redo (CTRL+Y)"
        data-theme="lofi"
        onClick={handleClickRedo}
      >
        <FaRedo />
      </button>
    </div>
  );
}

export default UndoRedo;