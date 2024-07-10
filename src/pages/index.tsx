import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Editor from '../components/Editor';

export default function Home() {
  const [randomSlogan, setRandomSlogan] = useState('');

  useEffect(() => {
    const slogans = [
      'start writing',
      'jot down stuff',
      'your daily log',
      'plan your day',
      'list your thoughts',
      'your to-do list',
      'organize your notes',
      'a quick draft',
      'a checklist',
      'write down what\'s on your mind',
      'a minimal note-taker app',
      'minimalistic and simple',
      'tip: ctrl+o to open a note',
      'tip: ctrl+s to save your note',
      'tip: drag in a .txt or .md file',
      'tip: notes save when you leave',
      'tip: ctrl+n for a fresh note',
      'tip: ctrl+k for the command menu'
    ];

    const randomIndex = Math.floor(Math.random() * slogans.length);
    setRandomSlogan(slogans[randomIndex]);
  }, []);

  return (
    <div className="relative">
      <Editor /> {/* the actual editor */}

      {/* footer content */}
      <div className="absolute text-sm text-neutral-700 italic bottom-7 md:bottom-5 left-5">
        <Link href="https://github.com/inttter/notetxt" target="_blank" rel="noopener noreferrer" className=" hover:text-neutral-500 duration-300">
          notetxt
        </Link>
        {' — '}
        <span className="truncate w-full sm:w-52">{randomSlogan}</span>
        {' • '}
        <Link href="/privacy" className="hover:text-neutral-400 duration-300">
          privacy
        </Link>
      </div>
    </div>
  );
}