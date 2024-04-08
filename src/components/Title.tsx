import React from 'react';

export default function Title({ title, setTitle }) {
  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <textarea
      value={title}
      onChange={handleChange}
      className="bg-transparent focus:bg-neutral-800 focus:bg-opacity-50 duration-500 rounded-lg text-zinc-400 placeholder-neutral-700 text-2xl outline-none w-full p-2 h-11 overflow-hidden font-bold resize-none"
      style={{ fontFamily: "'Geist Mono', monospace", border: 'none' }}
      placeholder="Give this note a title..."
    />
  );
}