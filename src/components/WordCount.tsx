import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WordCount({ text }) {
  const [wordCount, setWordCount] = useState(0);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [text]);

  return (
    <AnimatePresence>
      {wordCount > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute text-sm bottom-5 text-neutral-700 right-3 rounded-md py-1 px-2 italic sm:not-italic flex items-center whitespace-nowrap"
        >
          {wordCount} word{wordCount !== 1 && 's'}
          <span className="hidden sm:inline ml-1"></span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}