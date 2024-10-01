import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa';
import tips from '@/data/tips.json';

export default function Tips() {
  const [randomTip, setRandomTip] = useState('');
  const [isTipVisible, setIsTipVisible] = useState(true);

  useEffect(() => {
    const updateTip = () => {
      const randomIndex = Math.floor(Math.random() * tips.length);
      setRandomTip(tips[randomIndex]);
    };

    updateTip();
    const intervalId = setInterval(updateTip, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleHideTip = () => {
    // Stop rendering the tip when clicked 
    // (only in the current session/until the page reloads)
    setIsTipVisible(false);
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {isTipVisible && (
          <motion.div
            key={randomTip}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={handleHideTip}
            className="absolute bottom-7 md:bottom-5 left-1/2 md:left-2 transform -translate-x-1/2 md:translate-x-0 flex items-center justify-center md:justify-start w-full md:w-auto px-4 cursor-pointer -mb-2 md:mb-0"
            title="Click to hide these tips for this session (until you exit or reload)"
            aria-label="Tip Content"
          >
            <span className="text-xs text-stone-400 hover:text-opacity-80 text-center md:text-left flex items-center break-words overflow-hidden duration-300" aria-label="Tip Text">
              <FaLightbulb size={13} className="mr-1" /> {randomTip}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}