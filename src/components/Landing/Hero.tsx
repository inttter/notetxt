import React from 'react';
import { ArrowRight, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const heroMessage = `Write down what's on your mind.`
const heroDescription = `A minimalistic, simple note-taker app designed to help you jot down what you need with minimal distractions and useful features right at your fingertips.`

const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ duration: 0.5, delay: 0.4 }}
    className="text-center"
  >
    <h1 className="text-4xl font-semibold tracking-tighter md:tracking-normal text-zinc-100 sm:text-6xl">
      {heroMessage}
    </h1>
    <p className="mt-6 text-md md:text-lg leading-6 text-zinc-300">
      {heroDescription}
    </p>
    <div className="mt-10 flex items-center justify-center gap-x-6">
      <Link href="/editor" className="btn text-sm text-zinc-100 bg-default bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 flex items-center">
        <NotebookPen size={15} className="mr-1 text-stone-400" /> Go to Editor
      </Link>
      <Link href="https://github.com/inttter/notetxt" className="text-sm leading-6 text-zinc-300 hover:text-zinc-100 duration-300 flex items-center group">
        View on GitHub <ArrowRight size={15} className="mx-1 text-stone-600 group-hover:translate-x-0.5 duration-300" />
      </Link>
    </div>
  </motion.div>
);

export default HeroSection;