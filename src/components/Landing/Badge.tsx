import React from 'react';
import { motion } from 'framer-motion';

const Badge = () => (
  <motion.div
    className="mb-8 flex justify-center"
    initial={{ opacity: 0, y: -10 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay: 0.4 }}
  >
    <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-zinc-300 ring-1 ring-zinc-300/20 duration-300 overflow-hidden whitespace-nowrap text-ellipsis">
      🚀 Notetxt now supports multiple notes!
    </div>
  </motion.div>
);

export default Badge;