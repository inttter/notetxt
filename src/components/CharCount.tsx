import React, { useState, useEffect } from 'react';
import { Keyboard } from 'lucide-react';

export default function CharCount({ text }) {
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const charCount = text.length;
    setCharacterCount(charCount);
  }, [text]);

  return (
    <div>
      <p className="absolute bottom-5 text-zinc-300 right-5 bg-neutral-800 rounded-md py-1 px-2 font-semibold flex items-center">
        <Keyboard className="mr-2" /> {characterCount}
      </p>
    </div>
  );
}