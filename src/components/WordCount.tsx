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
          className="absolute text-sm text-neutral-700 -bottom-12 -mb-1 md:mb-0 md:bottom-5 right-5 whitespace-nowrap"
        >
          {wordCount} word{wordCount !== 1 ? 's' : ''}
        </motion.div>
      )}
    </AnimatePresence>
  );
}