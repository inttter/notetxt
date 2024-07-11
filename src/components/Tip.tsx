import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';

export default function Home() {
  const [randomTip, setRandomTip] = useState('');

  useEffect(() => {
    const tips = [
      'tip: ctrl+o to open a note',
      'tip: ctrl+n for a fresh note',
      'tip: ctrl+s to save your note',
      'tip: ctrl+shift+c to copy the note contents',
      'tip: ctrl+k for the command menu',
      'tip: drop in a .txt or .md file',
      'tip: notes save when you leave',
      'tip: find important links in the command menu'
    ];

    const randomIndex = Math.floor(Math.random() * tips.length);
    setRandomTip(tips[randomIndex]);
  }, []);

  return (
    <div className="relative">
      <div className="absolute text-sm text-neutral-700 bottom-7 md:bottom-5 left-5">
        <span className="truncate w-full flex items-center">
          <Lightbulb size={17} className="mr-1" /> {randomTip}
        </span>
      </div>
    </div>
  );
}