import React from 'react';
import { ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/Select";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/Tooltip";

const SortDropdown = ({ sortOptions, sortCriteria, handleSortChange }) => {
  return (
    <div className="flex items-center">
      <Select value={sortCriteria} onValueChange={handleSortChange}>
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger asChild>
              <SelectTrigger
                className="border border-transparent text-zinc-300 hover:text-zinc-100 text-xs duration-300 flex items-center focus:outline-none outline-none"
                aria-label="Note Sort Options"
                hideDefaultIcon
              >
                {sortOptions.find(o => o.value === sortCriteria)?.label || 'N/A'}
                <ChevronUp size={15} className="ml-1 text-stone-400" />
              </SelectTrigger>
            </TooltipTrigger>
            <TooltipContent side="top" align="start">
              Sort by
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <SelectContent className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden duration-300">
          {sortOptions.map(({ value, label }) => (
            <SelectItem
              key={value}
              value={value}
              className="text-zinc-300 text-sm hover:bg-neutral-800 px-2 py-1.5 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SortDropdown;
