import React from 'react';
import { motion } from 'framer-motion';

const Badge = () => (
  <motion.div
    className="mb-8 flex justify-center"
    initial={{ opacity: 0, y: -10 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-zinc-300 bg-default/60 ring-1 ring-neutral-700/70 shadow-lg shadow-neutral-950 duration-300 overflow-hidden whitespace-nowrap text-ellipsis" role="alert" aria-label="Badge">
      📝 Markdown previews are now in the Editor!
    </div>
  </motion.div>
);

export default Badge;