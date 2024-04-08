import React, { useState, useEffect } from 'react';

export default function CharCount({ text }) {
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const charCount = text.length;
    setCharacterCount(charCount);
  }, [text]);

  return (
    <div>
      <p
      className="absolute bottom-5 text-zinc-300 right-5 tooltip tooltip-left hover:cursor-help bg-neutral-800 rounded-lg duration-300 py-1 px-2 font-mono focus:outline-none font-semibold"
      data-tip="The amount of characters you've typed."
      data-theme="lofi"
      >
        {characterCount}
      </p>
    </div>
  );
}