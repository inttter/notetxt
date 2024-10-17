import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import NumberFlow from '@number-flow/react';

export default function NoteSummary({ text, isDialogOpen, onClose }) {
  const [wordCount, setWordCount] = useState(0);
  const [letterCount, setLetterCount] = useState(0);
  const [lineCount, setLineCount] = useState(0);
  const [paragraphCount, setParagraphCount] = useState(0);
  const [sentenceCount, setSentenceCount] = useState(0);
  const [averageReadingTime, setAverageReadingTime] = useState(0);

  const noteSummaryTitle = 'Note Summary';
  const noteSummaryDescription = 'This shows various metrics about the note which is currently selected. Click on a metric to see how it is calculated.';

  useEffect(() => {
    if (isDialogOpen) {
      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      const numWords = words.length;
      setWordCount(numWords);

      const characterCount = text.length;
      setLetterCount(characterCount);

      setLineCount(text.split(/\r\n|\r|\n/).length);
      setParagraphCount(text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length);

      const calculateAverageReadingTime = (wordCount) => {
        // Average reading speed is 200wpm
        const wordsPerMinute = 200;
        return Math.ceil(wordCount / wordsPerMinute);
      };

      setAverageReadingTime(calculateAverageReadingTime(numWords));

      const sentenceDelimiterRegex = /[.!?]+\s/;
      const sentences = text.split(sentenceDelimiterRegex).filter(sentence => sentence.trim().length > 0);
      const numSentences = sentences.length;
      setSentenceCount(numSentences);
    }
  }, [text, isDialogOpen]);

  const summaryItems = [
    { title: 'Letters', value: letterCount, description: 'The total number of letters in the note, also including any spaces.' },
    { title: 'Words', value: wordCount, description: 'The total number of words in the note, separated by at least one space.' },
    { title: 'Lines', value: lineCount, description: 'The total number of lines in the note, including empty lines.' },
    { title: 'Paragraphs', value: paragraphCount, description: 'The total number of paragraphs in the note, separated by at least one blank line.' },
    { title: 'Sentences', value: sentenceCount, description: 'The total number of sentences in the note, separated by sentence-ending punctuation.' },
    { title: 'Time to Read', value: averageReadingTime, description: 'The estimated time it takes (in minutes) to read the note at a speed of 200 words per minute.' },
  ];

  const handleShowToast = (title, description) => {
    toast(
      <div className="toast-container">
        <div className="toast-title" aria-label="Toast Title">
          {title}
        </div>
        <div className="toast-description" aria-label="Toast Description">
          {description}
        </div>
      </div>,
      {
        duration: 2000,
        position: 'bottom-center',
        closeButton: false,
        unstyled: true,
      }
    );
  };

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50 px-6 md:px-0 selection:text-zinc-300 selection:bg-neutral-700">
          {/* Prevent clicking on the background around the dialog to exit it, as this behaviour also occurs when trying to click on the toasts that show up with the label and description, see https://www.radix-ui.com/primitives/docs/components/dialog */}
          <Dialog.Content asChild onInteractOutside={(e) => e.preventDefault()}>
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
                {summaryItems.map(({ title, value, description }) => (
                  <div
                    key={title}
                    className="summary-item shadow-lg shadow-neutral-950 bg-neutral-900 hover:bg-neutral-800/70 border border-neutral-700/60 hover:border-neutral-700 p-3 rounded-lg cursor-pointer duration-300"
                    tabIndex={0}
                    onClick={() => handleShowToast(title, description)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleShowToast(title, description);
                      }
                    }}
                    aria-label={title}
                    role="button"
                  >
                    <div className="summary-item-content">
                      <div className="text-sm font-medium text-zinc-300" aria-label="Note Summary Item Title">
                        {title}
                      </div>
                      <div className="text-lg tracking-tighter text-zinc-200 code truncate" aria-label="Note Summary Item Value">
                        <NumberFlow
                          value={value}
                          format={{ notation: 'compact' }}
                          willChange={true}
                        />
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