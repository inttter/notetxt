import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// ? To make the badge link somewhere, add a link in the speech marks after `link =`.
// ? To not wrap the badge in a link, leave the text in between the speech marks blank.
const LandingBadge = ({ link = '/settings' }) => {
  const isExternalLink = link.startsWith('http');
  
  const content = (
    <div 
      className={`
        rounded-lg px-3 py-1 md:py-1.5 text-zinc-200 text-xs md:text-sm leading-6 bg-primary/15 ring-1 ring-primary/30 flex items-center min-w-0 max-w-xs md:max-w-full shadow-lg shadow-neutral-950 duration-300 group
        ${link ? 'hover:ring-primary/40 hover:bg-primary/20' : 'ring-primary/25'}
      `}
      role="alert"
      aria-label="Badge"
    >
      <div className="text-ellipsis overflow-hidden whitespace-nowrap">
        ✨ Notetxt now has customizable settings!
      </div>
      {link && 
        <ArrowRight size={15} className="ml-1 text-primary-text group-hover:translate-x-0.5 duration-300" />
      }
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
        <Link 
          href={link} 
          {...(isExternalLink && { target: "_blank", rel: "noopener noreferrer" })}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </motion.div>
  );
};

export default LandingBadge;
