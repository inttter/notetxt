import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ? To make the badge link somewhere, add a link in the speech marks after `link =`.
// ? To not wrap the badge in a link, leave the text in between the speech marks blank.
const Badge = ({ link = "" }) => {
  const content = (
    <div 
      className={`rounded-lg px-3 py-1 md:py-1.5 text-xs md:text-sm leading-6 text-zinc-300 bg-default/60 ring-1 
                  ring-neutral-700/70 flex items-center min-w-0 max-w-xs md:max-w-full
                  ${link ? 'hover:ring-neutral-600/70' : 'ring-neutral-700/70'} 
                  shadow-lg shadow-neutral-950 duration-300`}
      role="alert" 
      aria-label="Badge"
    >
      <div className="text-ellipsis overflow-hidden whitespace-nowrap">
        🏷️ You can now finally add tags to your notes!
      </div>
      {link && <ArrowRight size={15} className="ml-1 text-stone-400" />}
    </div>
  );

  return (
    <motion.div
      className="mb-8 flex justify-center"
      initial={{ opacity: 0, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      {link ? (
        <Link href={link} target="_blank" rel="noopener noreferrer">
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
};

export default Badge;