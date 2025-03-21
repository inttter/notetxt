import React from 'react';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/Dropdown';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { Plus, ChevronDown, FolderArchive, FileInput, FileText } from 'lucide-react';
import { FaMarkdown } from 'react-icons/fa';

const NoteActions = ({ handleFileTypeChange, onOpenNote, onAddNote }) => {
  const fileTypes = [
    { name: 'Rich Text', value: '.txt', icon: <FileText size={15} className="mr-1 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={15} className="mr-1 text-stone-400" /> }
  ];

  return (
    <div className="flex space-x-2 mt-2 mb-8 justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="px-2 py-1.5 border border-neutral-800 bg-dark-button text-zinc-300 text-xs rounded-lg hover:bg-neutral-800/60 hover:border-neutral-700/60 duration-300 flex items-center"
            aria-label="Export All Current Notes"
            title="Export All Current Notes"
            data-vaul-no-drag
          >
            <FolderArchive size={15} className="mr-1" /> Export Notes
            <ChevronDown size={15} className="ml-1 text-stone-400" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" sideOffset={5} className="bg-dark border border-neutral-800/60 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden">
          {fileTypes.map((fileTypeItem) => (
            <DropdownMenuItem
              key={fileTypeItem.value}
              className="text-zinc-300 text-sm hover:bg-dark-focus rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
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
              className="flex items-center px-2 py-1.5 border border-neutral-800 bg-dark-button text-zinc-300 rounded-lg hover:bg-neutral-800/60 hover:border-neutral-700/60 duration-300"
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
            New Note
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className="flex items-center px-2 py-1.5 border border-neutral-800 bg-dark-button text-zinc-300 rounded-lg hover:bg-neutral-800/60 hover:border-neutral-700/60 duration-300"
              aria-label="Open Note"
              data-vaul-no-drag
              onClick={(e) => {
                e.stopPropagation();
                onOpenNote();
              }}
            >
              <FileInput size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Import Note
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default NoteActions;
