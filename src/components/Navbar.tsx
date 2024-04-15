import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="absolute top-0 left-0 p-4 flex items-center space-x-2">
      <Image src="/favicon/apple-touch-icon.png" alt="Logo" width={20} height={20} className="rounded-md" />
      <Link href="https://github.com/inttter/notetxt" className="border-b-2 border-gray-500 hover:border-gray-400 hover:text-zinc-200 duration-300">
      <span className="text-zinc-200 font-semibold text-lg flex items-center w-full">notetxt</span>
      </Link>
    </div>
  );
};

export default Navbar;