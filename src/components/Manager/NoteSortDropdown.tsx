import React from 'react';
import { ArrowDownWideNarrow } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";

const SortDropdown = ({ sortOptions, sortCriteria, handleSortChange }) => {
  return (
    <div className="flex items-center">
      <Select value={sortCriteria} onValueChange={handleSortChange}>
        <SelectTrigger
          className="px-2 py-1.5 border border-neutral-700/70 bg-neutral-900 text-zinc-300 hover:text-zinc-100 text-xs rounded-md hover:bg-neutral-800/60 hover:border-neutral-700 duration-300 flex items-center focus:outline-none outline-none"
          aria-label="Note Sort Options"
          title="Note Sort Options"
        >
          <ArrowDownWideNarrow size={15} className="mr-1 text-stone-400" />
          Sort by: {sortOptions.find(o => o.value === sortCriteria)?.label || 'N/A'}
        </SelectTrigger>
        <SelectContent className="bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden duration-300">
          {sortOptions.map(({ value, label }) => (
            <SelectItem
              key={value}
              value={value}
              className="text-zinc-300 hover:text-zinc-100 text-sm hover:bg-neutral-800 px-2 py-1.5 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
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
