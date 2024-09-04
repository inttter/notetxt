import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb } from 'lucide-react';

export default function Home() {
  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const tips = [
      'Try dragging and dropping existing .txt and .md files.',
      'Make sure to save your notes.',
      'Preview notes in Markdown from the command menu.',
      'View your note\'s metrics from the command menu.',
      'Visit the command menu for different controls.',
      'Notes save when you leave.',
      'Find links in the command menu.'
    ];

    const updateTip = () => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setRandomTip(tips[randomIndex]);
    }

    updateTip();
    const intervalId = setInterval(updateTip, 10000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="absolute bottom-7 md:bottom-5 left-1/2 md:left-2 transform -translate-x-1/2 md:translate-x-0 flex items-center justify-center md:justify-start w-full md:w-auto px-4"
      >
        <span className="text-xs text-stone-400 text-center md:text-left flex items-center break-words overflow-hidden">
          <Lightbulb size={15} className="mr-1" /> {randomTip}
        </span>
      </motion.div>
    </div>
  );
}
