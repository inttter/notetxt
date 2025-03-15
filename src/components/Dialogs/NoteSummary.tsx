import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog';
import { ListOrdered, X } from 'lucide-react';
import { toast } from 'sonner';
import NumberFlow from '@number-flow/react';

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
    return text
      .replace(/!\[.*?\]\(.*?\)/g, '')  // Remove image markdown
      .replace(/\[.*?\]\(.*?\)/g, '')   // Remove link markdown
      .replace(/<[^>]*>/g, '')          // Remove HTML tags
      .replace(/[^\w\s]|_/g, ' ');      // Replace all punctuation and symbols
  };

  useEffect(() => {
    if (isDialogOpen) {

      // Don't allow dialog to open if there is no content in the note
      if (text.trim().length === 0) {
        toast.warning('No content available for a summary!', {
          description: 'Add some content to the note before attempting to view its summary.',
        });        
        onClose();
        return;
      }

      setLetterCount(text.length);

      const words = text.trim().split(/\s+/).filter(word => word.length > 0);
      setWordCount(words.length);

      setParagraphCount(text.split(/\n\s*\n/).filter(paragraph => paragraph.trim().length > 0).length);

      const sentences = text.split(/[.!?]+\s/).filter(sentence => sentence.trim().length > 0);
      setSentenceCount(sentences.length);

      const cleanedWords = cleanText(text).trim().split(/\s+/).filter(word => word.length > 0);
      setLongestWord(cleanedWords.reduce((longest, word) => word.length > longest.length ? word : longest, ''));

      setAverageReadingTime(Math.ceil(words.length / 200)); // Average reading speed is 200wpm
    }
  }, [text, isDialogOpen]);

  const summaryItems = [
    { title: 'Letters', value: letterCount, description: 'Counts every character.' },
    { title: 'Words', value: wordCount, description: 'Separated by empty spaces.' },
    { title: 'Paragraphs', value: paragraphCount, description: 'Separated only by blank lines.' },
    { title: 'Sentences', value: sentenceCount, description: 'Ends with ending punctuation.' },
    { title: 'Longest Word', value: longestWord, description: 'Word with the most characters.', isLongestWord: true },
    { title: 'Time To Read', value: averageReadingTime, description: 'At ~200 words per minute.', isTimeToRead: true },
  ];

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-lg w-11/12 z-50">
        <DialogTitle className="text-lg truncate font-medium text-zinc-100 gap-1 flex items-center" aria-label="Note Summary Dialog Title">
          <ListOrdered size={20} className="text-stone-300/85" />
          {noteSummaryTitle}
        </DialogTitle>
        <DialogDescription className="text-stone-300/85 text-sm leading-normal mb-4" aria-label="Note Summary Dialog Description">
          {noteSummaryDescription}
        </DialogDescription>
        <div className="grid grid-cols-2 gap-4" aria-label="Note Summary Item">
          {summaryItems.map(({ title, value, description, isLongestWord, isTimeToRead }) => (
            <div
              key={title}
              className="summary-item shadow-2xl shadow-neutral-950 bg-dark-secondary border border-neutral-700/60 p-3 rounded-lg duration-300"
              aria-label={title}
            >
              <div className="summary-item-content">
                <div className="text-sm font-medium text-zinc-200" aria-label="Note Summary Item Title">
                  {title}
                </div>
                <div className="text-xs text-stone-300/85 mb-0.5" aria-label="Note Summary Item Description">
                  {description}
                </div>
                <div className="text-lg text-zinc-200 truncate" aria-label="Note Summary Item Value">
                  {isLongestWord ? (
                    <span>{value}</span>
                  ) : isTimeToRead ? (
                    <span>{value} {value === 1 ? 'minute' : 'minutes'}</span>
                  ) : (
                    <NumberFlow
                      value={typeof value === 'string' ? parseFloat(value) || 0 : value}
                      format={{ notation: 'standard' }}
                       willChange={true}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
          </div>
          <DialogClose className="absolute top-4 right-2 text-sm text-zinc-300 hover:text-zinc-400 font-semibold duration-300 px-1 py-0.5 mr-1" aria-label="Close Dialog">
            <X size={20} />
          </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
