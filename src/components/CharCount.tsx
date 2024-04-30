import React, { useState, useEffect } from 'react';
import { CaseSensitive } from 'lucide-react';

export default function CharCount({ text }) {
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const charCount = text.length;
    setCharacterCount(charCount);
  }, [text]);

  return (
    <div>
      <p className="absolute bottom-5 text-zinc-300 right-3 bg-neutral-800 rounded-md py-1 px-2 font-semibold flex items-center whitespace-nowrap">
        <CaseSensitive className="mr-2" /> {characterCount}
        <span className="hidden sm:inline ml-1"> characters</span>
      </p>
    </div>
  );
}