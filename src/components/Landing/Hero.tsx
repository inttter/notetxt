import React from 'react';
import { ArrowRight, FileText } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const heroMessage = `Write down what's on your mind.`
const heroDescription = `A minimalistic, simple note-taker app designed to help you jot down what you need with no distractions, useful features, and a minimal user interface, right at your fingertips.`

const HeroSection = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }} 
    animate={{ opacity: 1, y: 0 }} 
    transition={{ duration: 0.5, delay: 0.4 }}
    className="text-center"
  >
    <div className="text-4xl font-semibold tracking-tighter md:tracking-normal text-zinc-100 sm:text-6xl">
      {heroMessage}
    </div>
    <div className="mt-6 text-md md:text-lg leading-6 text-zinc-300">
      {heroDescription}
    </div>
    <div className="mt-8 flex items-center justify-center gap-x-6">
      <Link href="/editor" className="btn text-zinc-300 bg-neutral-800 text-base border border-neutral-600/60 hover:bg-opacity-60 hover:border-neutral-700 duration-300 rounded-lg flex items-center">
        <FileText size={17} className="mr-1" /> Go to Editor
      </Link>
      <Link href="https://github.com/inttter/notetxt" target="_blank" rel="noopener noreferrer" className="text-sm leading-6 text-zinc-300 hover:text-zinc-100 duration-300 flex items-center group">
        View on GitHub <ArrowRight size={15} className="mx-1 text-stone-500 group-hover:translate-x-0.5 duration-300" />
      </Link>
    </div>
  </motion.div>
);

export default HeroSection;