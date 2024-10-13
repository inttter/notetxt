import React from 'react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';
import { ChevronUp, ArrowDownWideNarrow } from 'lucide-react';
import { motion } from 'framer-motion';

const SortDropdown = ({ sortOptions, sortCriteria, handleSortChange }) => {

  return (
    <Dropdown.Root>
      <Dropdown.Trigger asChild>
        <button 
          className="px-2 py-1.5 border border-neutral-700/70 bg-neutral-900 text-zinc-100 text-xs rounded-md hover:bg-neutral-800/60 hover:border-neutral-700 duration-300 flex items-center"
          data-vaul-no-drag
        >
          <ArrowDownWideNarrow size={15} className="mr-1 text-stone-400" /> 
          Sort by: {sortOptions.find(o => o.value === sortCriteria)?.label || 'N/A'}
          <ChevronUp size={15} className="ml-1 text-stone-500" />
        </button>
      </Dropdown.Trigger>
      <Dropdown.Portal>
        <Dropdown.Content align="end" sideOffset={5} asChild>
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="bg-neutral-900 border border-neutral-800 rounded-lg p-1.5 space-y-2 shadow-2xl shadow-neutral-950 z-50 overflow-hidden"
            data-vaul-no-drag
          >
            {sortOptions.map(({ value, label }) => (
              <Dropdown.Item
                key={value}
                data-value={value}
                onClick={handleSortChange}
                className="text-zinc-100 text-sm hover:bg-neutral-700/40 border border-transparent hover:border-neutral-700/70 px-2 py-1.5 rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
              >
                {label}
              </Dropdown.Item>
            ))}
          </motion.div>
        </Dropdown.Content>
      </Dropdown.Portal>
    </Dropdown.Root>
  );
};

export default SortDropdown;