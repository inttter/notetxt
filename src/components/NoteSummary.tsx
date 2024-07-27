import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { isMobile } from 'react-device-detect';
import { LetterText } from 'lucide-react';

export default function NoteSummary({ text }) {
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [averageReadingTime, setAverageReadingTime] = useState(0);

  useEffect(() => {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const numWords = words.length;
    setWordCount(numWords);
    
    // Excludes spaces from the letter count
    const letterCountWithoutSpaces = text.replace(/\s+/g, '').length;
    setLetterCount(letterCountWithoutSpaces);

    setLineCount(text.split(/\r\n|\r|\n/).length);
    setParagraphCount(text.split(/\n\s*\n/).length);

    const calculateAverageReadingTime = (wordCount) => {
      const wordsPerMinute = 200; // Avg. reading speed is 200wpm
      return Math.ceil(wordCount / wordsPerMinute);
    };

    setAverageReadingTime(calculateAverageReadingTime(numWords));
  }, [text]);

  const handleShowInfoToast = () => {
    const infoItems = [
      { label: 'Letters', value: letterCount },
      { label: 'Words', value: wordCount },
      { label: 'Lines', value: lineCount },
      { label: 'Paragraphs', value: paragraphCount },
      { label: 'Time to Read', value: `${averageReadingTime} min` },
    ];

    toast.info(
      <div>
        <div className="text-xl font-semibold text-zinc-100">
          Summary
        </div>
        <div className="text-xs text-zinc-300 mb-2">
          This is a summary of various metrics about your note. Click on the button again to refresh these metrics.
        </div>
        {infoItems.map(({ label, value }) => (
          <div key={label}>
            <strong className="text-zinc-200 font-semibold">{label}:</strong> 
            <span className="font-semibold text-pink-300 ml-1">{value}</span>
          </div>
        ))}
      </div>,
      {
        duration: 5000,
        position: isMobile ? 'top-left' : 'bottom-right',
        className: isMobile ? '' : 'move-desktop-toast-up',
      }
    );
  };

  return (
    <div className="relative">
      <AnimatePresence>
        {wordCount > 0 && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleShowInfoToast}
            className="absolute text-sm text-neutral-500 hover:text-neutral-400 duration-300 -bottom-12 md:-top-12 -mb-1 md:mb-0 md:bottom-5 right-5 whitespace-nowrap flex items-center"
          >
            <LetterText size={15} className="mr-1" /> Note Summary
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}