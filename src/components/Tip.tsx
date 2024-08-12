import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

export default function Home() {
  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const tips = [
      'tip: ctrl+o to open a note',
      'tip: ctrl+n for a brand new note',
      'tip: ctrl+s to save your note',
      'tip: ctrl+c to copy the note contents',
      'tip: ctrl+m to preview your note in markdown',
      'tip: ctrl+i to view note metrics',
      'tip: ctrl+k for the command menu',
      'tip: drop in a .txt or .md file',
      'tip: notes save when you leave',
      'tip: find links in the command menu'
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
      <div className="absolute bottom-7 md:bottom-5 left-1/2 md:left-5 transform -translate-x-1/2 md:translate-x-0 flex items-center justify-center md:justify-start w-full md:w-auto px-4">
        <span className="text-sm text-neutral-700 text-center md:text-left flex items-center break-words overflow-hidden">
          <Lightbulb size={17} className="mr-1" /> {randomTip}
        </span>
      </div>
    </div>
  );
}
