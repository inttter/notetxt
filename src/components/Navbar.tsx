import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  return (
    <div className="fixed top-5 left-5 flex items-center space-x-2 hover:bg-neutral-700 hover:bg-opacity-30 duration-300 px-4 py-2 rounded-md">
      <Link href="/" target="_blank" rel="noopener noreferrer">
        <div className="flex items-center space-x-2">
          <Image src="/favicon/apple-touch-icon.png" alt="Logo" width={20} height={20} className="rounded-md" />
          <span className="text-zinc-200 hover:text-zinc-300 duration-300 font-semibold text-lg tracking-tighter">notetxt</span>
        </div>
      </Link>
    </div>
  );
};

export default Navbar;