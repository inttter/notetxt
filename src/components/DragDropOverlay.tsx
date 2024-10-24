import React from 'react';
import { FileDown, Plus } from 'lucide-react';

interface DragDropOverlayProps {
  isDraggingOver: boolean;
}

const dragDropTitle = 'Drop to import the file\'s contents';
const dragDropDescription = 'This will automatically create a new note once you drop it in. Make sure you are dropping in a supported file format.';

const DragDropOverlay: React.FC<DragDropOverlayProps> = ({ isDraggingOver }) => {
  return (
    <>
      <div
        className={`fixed top-0 left-0 w-full h-full bg-black transition-opacity duration-300 z-50 pointer-events-none
        ${isDraggingOver ? 'opacity-50' : 'opacity-0'}`}
      />
      <div
        className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-40 transition-opacity duration-300 z-50 p-8 pointer-events-none 
        ${isDraggingOver ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0'}`}
      >
        <div className="text-center bg-dark border border-neutral-700/60 shadow-2xl shadow-neutral-950 px-4 py-5 rounded-lg">
          <div 
            className="text-md md:text-2xl text-zinc-100 font-semibold tracking-tight flex items-center justify-center" 
            aria-label="Drag And Drop Overlay Title"
          >
            <FileDown size={20} className="mr-1 text-stone-400" /> 
            {dragDropTitle}
          </div>
          <div 
            className="mt-1 text-[13px] md:text-sm text-stone-400 max-w-md" 
            aria-label="Drag And Drop Overlay Description"
          >
            {dragDropDescription}
          </div>
          
          {/* Visual Drop Area */}
          {/* The file can still be dragged and dropped anywhere on-screen, but this is just
              a better visual indicator, since it is not as obvious without this area.
          */}
          <div 
            className="mt-4 w-full h-40 border-2 border-dashed border-stone-500 rounded-lg flex items-center justify-center"
            aria-label="Drag And Drop Box"
          >
            <div className="text-stone-400 text-sm flex items-center">
              <Plus size={15} className="mr-1" /> Drag and drop your file here
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DragDropOverlay;
