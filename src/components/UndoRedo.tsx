import React from 'react';
import { FaUndo, FaRedo } from 'react-icons/fa';

export default function UndoRedo({ handleUndo, handleRedo }) {
  const handleClickUndo = () => {
    document.execCommand('undo');
  };

  const handleClickRedo = () => {
    document.execCommand('redo');
  };

  return (
    <>
      <button
        className="text-white font-semibold -mt-3 tooltip tooltip-bottom bg-transparent"
        data-tip="Undo (Ctrl+Z)"
        data-theme="lofi"
        onClick={handleClickUndo}
      >
        <FaUndo />
      </button>
      <button
        className="text-white font-semibold -mt-3 px-6 tooltip tooltip-bottom bg-transparent"
        data-tip="Redo (Ctrl+Y)"
        data-theme="lofi"
        onClick={handleClickRedo}
      >
        <FaRedo />
      </button>
    </>
  );
}