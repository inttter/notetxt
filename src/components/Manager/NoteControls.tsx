import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/Dropdown';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { Plus, FolderOpen, Trash2, ChevronDown, FolderArchive } from 'lucide-react';
import { GrDocumentTxt } from "react-icons/gr";
import { FaMarkdown } from 'react-icons/fa';

const NoteActions = ({ handleFileTypeChange, handleConfirmDeleteAll, onOpenNote, onAddNote }) => {
  const fileTypes = [
    { name: 'Rich Text', value: '.txt', icon: <GrDocumentTxt size={15} className="mr-2 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={15} className="mr-2 text-stone-400" /> }
  ];

  return (
    <div className="flex space-x-2 mt-2 mb-8 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="px-2 py-1.5 border border-neutral-800 bg-neutral-900 text-zinc-300 hover:text-zinc-100 text-xs rounded-lg hover:bg-neutral-800/60 duration-300 flex items-center"
            aria-label="Export All Current Notes"
            title="Export All Current Notes"
            data-vaul-no-drag
          >
            <FolderArchive size={15} className="mr-1" /> Export Notes
            <ChevronDown size={15} className="ml-1 text-stone-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={5} className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden">
          {fileTypes.map((fileTypeItem) => (
            <DropdownMenuItem
              key={fileTypeItem.value}
              className="text-zinc-300 hover:text-zinc-100 text-sm hover:bg-neutral-800 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
              onClick={(e) => {
                e.stopPropagation();
                handleFileTypeChange(fileTypeItem.value);
              }}
              aria-label="File Type Export Option"
            >
              {fileTypeItem.icon}
              {fileTypeItem.name} ({fileTypeItem.value})
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center px-2 py-1.5 border border-neutral-800 bg-neutral-900 text-zinc-300 hover:text-zinc-100 rounded-lg hover:bg-neutral-800/60 duration-300"
              aria-label="Create New Note"
              data-vaul-no-drag
              onClick={(e) => {
                e.stopPropagation();
                onAddNote();
              }}
            >
              <Plus size={19} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Create New Note
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center px-2 py-1.5 border border-neutral-800 bg-neutral-900 text-zinc-300 hover:text-zinc-100 rounded-lg hover:bg-neutral-800/60 duration-300"
              aria-label="Open Note"
              data-vaul-no-drag
              onClick={(e) => {
                e.stopPropagation();
                onOpenNote();
              }}
            >
              <FolderOpen size={19} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Open Note
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center p-1.5 border border-neutral-800 bg-neutral-900 text-destructive hover:text-red-500 rounded-lg hover:bg-neutral-800/60 duration-300"
              aria-label="Delete All Notes"
              data-vaul-no-drag
              onClick={(e) => {
                e.stopPropagation();
                handleConfirmDeleteAll();
              }}
            >
              <Trash2 size={19} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Delete All Notes
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NoteActions;
