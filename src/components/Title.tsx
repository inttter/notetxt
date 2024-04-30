import React from 'react';

export default function Title({ title, setTitle }) {
  const handleChange = (event) => {
    setTitle(event.target.value);
  };

  return (
    <textarea
      value={title}
      onChange={handleChange}
      className="bg-transparent focus:bg-neutral-800 focus:bg-opacity-50 duration-300 rounded-md text-zinc-300 placeholder-neutral-600 placeholder:font-normal md:text-2xl text-3xl font-bold outline-none w-full p-3 max-w-auto"
      placeholder="Enter the title you'd like to give your note."
    />
  );
}