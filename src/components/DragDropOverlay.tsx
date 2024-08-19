import React from 'react';

interface DragDropOverlayProps {
  isDraggingOver: boolean;
}

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isDraggingOver }) => {
  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black transition-opacity duration-300 z-50 pointer-events-none ${isDraggingOver ? 'opacity-50' : 'opacity-0'}`}
      />
      <div
        className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 z-50 p-8 pointer-events-none ${isDraggingOver ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="text-center bg-dark border border-neutral-800 px-4 py-4 rounded-md">
          <div className="text-2xl text-zinc-300 tracking-tight">
            Drop to import the file's content
          </div>
          <div className="mt-2 text-sm text-stone-400">
            Please note that this will override all current content once you drop it in.
          </div>
        </div>
      </div>
    </>
  );
};

export default DragDropOverlay;