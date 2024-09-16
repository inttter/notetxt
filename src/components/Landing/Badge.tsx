import React from 'react';
import { motion } from 'framer-motion';

const Badge = () => (
  <motion.div
    className="mb-8 flex justify-center"
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <div 
      className="relative rounded-lg px-3 py-1 text-sm leading-6 text-zinc-300 bg-default/60 ring-1 ring-neutral-700/70 shadow-lg shadow-neutral-950 duration-300 overflow-hidden whitespace-nowrap text-ellipsis" 
      role="alert" 
      aria-label="Badge"
    >
      💡 Use keyboard shortcuts to get around faster!
    </div>
  </motion.div>
);

export default Badge;