import React, { useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import NumberFlow from '@number-flow/react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function NoteSummary({ text, isDialogOpen, onClose }) {
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [longestWord, setLongestWord] = useState('');
  const [paragraphCount, setParagraphCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [averageReadingTime, setAverageReadingTime] = useState(0);

  const noteSummaryTitle = 'Note Summary';
  const noteSummaryDescription = 'This shows various metrics about the note which is currently selected.';

  const cleanText = (text) => {
    const cleaned = text
      .replace(/!\[.*?\]\(.*?\)/g, '')  // Remove image markdown
      .replace(/\[.*?\]\(.*?\)/g, '')   // Remove link markdown
      .replace(/<[^>]*>/g, '')          // Remove HTML tags
      .replace(/[^\w\s]|_/g, ' ')       // Replace all punctuation and symbols
  
    return cleaned;
  };

  useEffect(() => {
    if (isDialogOpen) {
      const characterCount = text.length;
      setLetterCount(characterCount);

      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const numWords = words.length;
      setWordCount(numWords);

      setParagraphCount(text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length);

      const sentenceDelimiterRegex = /[.!?]+\s/;
      const sentences = text.split(sentenceDelimiterRegex).filter(sentence => sentence.trim().length > 0);
      const numSentences = sentences.length;
      setSentenceCount(numSentences);

      const cleanedWords = cleanText(text).trim().split(/\s+/).filter(word => word.length > 0);
      const longest = cleanedWords.length > 0 
        ? cleanedWords.reduce((longest, word) => word.length > longest.length ? word : longest, '')
        : 'No words found';
      setLongestWord(longest);
      
      const calculateAverageReadingTime = (wordCount) => {
        // Average reading speed is 200wpm
        const wordsPerMinute = 200;
        return Math.ceil(wordCount / wordsPerMinute);
      };

      const readingTime = calculateAverageReadingTime(numWords);
      setAverageReadingTime(readingTime);
    }
  }, [text, isDialogOpen]);

  const summaryItems = [
    { title: 'Letters', value: letterCount, description: 'Counts every character.' },
    { title: 'Words', value: wordCount, description: 'Separated by spaces.' },
    { title: 'Paragraphs', value: paragraphCount, description: 'Separated only by blank lines.' },
    { title: 'Sentences', value: sentenceCount, description: 'Ends with ending punctuation.' },
    { title: 'Longest Word', value: longestWord, description: 'Word with the most characters.', isLongestWord: true },
    { title: 'Time To Read', value: averageReadingTime, description: 'At ~200 words per minute.', isTimeToRead: true },
  ];

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-6 md:px-0 selection:text-zinc-300 selection:bg-neutral-700">
          <Dialog.Content asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 0.5 }}
              className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-full relative"
            >
              <Dialog.Title className="text-lg truncate font-medium text-zinc-100" aria-label="Note Summary Dialog Title">
                {noteSummaryTitle}
              </Dialog.Title>
              <Dialog.Description className="text-stone-400 text-sm leading-normal mb-4" aria-label="Note Summary Dialog Description">
                {noteSummaryDescription}
              </Dialog.Description>
              <div className="grid grid-cols-2 gap-4" aria-label="Note Summary Item">
                {summaryItems.map(({ title, value, description, isLongestWord, isTimeToRead }) => (
                  <div
                    key={title}
                    className="summary-item shadow-2xl shadow-neutral-950 bg-neutral-900 border border-neutral-700/60 p-3 rounded-lg duration-300"
                    aria-label={title}
                  >
                    <div className="summary-item-content">
                      <div className="text-sm font-medium text-zinc-200" aria-label="Note Summary Item Title">
                        {title}
                      </div>
                      <div className="text-xs text-stone-400 mb-0.5" aria-label="Note Summary Item Description">
                        {description}
                      </div>
                      <div className="text-lg text-zinc-200 truncate" aria-label="Note Summary Item Value">
                        {isLongestWord ? (
                          <span>{value}</span>
                        ) : isTimeToRead ? (
                          <span>{value} {value === 1 ? 'minute' : 'minutes'}</span>
                          ) : (
                          <NumberFlow
                            value={
                              typeof value === 'string'
                                ? parseFloat(value) || 0
                                : value
                            }
                            format={{ notation: 'standard' }}
                            willChange={true}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Dialog.Close className="absolute top-4 right-2 text-sm text-zinc-300 hover:text-zinc-400 font-semibold duration-300 px-1 py-0.5 mr-1" aria-label="Close Dialog">
                <X size={20} />
              </Dialog.Close>
            </motion.div>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
