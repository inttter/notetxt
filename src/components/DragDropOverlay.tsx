import React from "react";
import { FileDown, Plus } from "lucide-react";

const DragDropOverlay = ({ isDraggingOver }) => {
  const dragDropTitle = "Drop to import contents of file(s)";
  const dragDropDescription =
    "This will automatically create a new note once you drop it in, one per file. Make sure you are dropping in a supported file format.";

  return (
    <div
      className={`fixed top-0 left-0 w-full h-full transition-opacity z-[100] ${
        isDraggingOver ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div className="absolute inset-0 z-50" />
      <div className="absolute inset-0 transition-opacity opacity-50 duration-300" />
      <div className="flex items-center justify-center h-full p-8 bg-black/40 backdrop-blur-sm transition-opacity duration-300 z-50">
        <div className="text-center bg-dark border border-neutral-700/60 shadow-2xl shadow-neutral-950 px-4 py-5 rounded-lg">
          <div
            className="text-md md:text-2xl text-primary-text font-medium tracking-tight flex items-center justify-center"
            aria-label="Drag And Drop Overlay Title"
          >
            <FileDown size={20} className="mr-1 text-zinc-100" />
            {dragDropTitle}
          </div>
          <div
            className="mt-1 text-[13px] md:text-sm text-zinc-300/90 max-w-md"
            aria-label="Drag And Drop Overlay Description"
          >
            {dragDropDescription}
          </div>
          <div
            className="mt-4 w-full h-40 border-2 border-dashed border-stone-600 rounded-md flex items-center justify-center"
            aria-label="Drag And Drop Box"
          >
            <div className="text-zinc-300 text-sm flex items-center">
              <Plus size={15} className="mr-1" /> Drag and drop your file here
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragDropOverlay;
