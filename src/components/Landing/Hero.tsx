import React, { useState } from 'react';
import Link from 'next/link';
import { BookOpenText, NotepadText, Loader2, CircleHelp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

const heroMessage = `Write down what's on your mind.`;
const heroDescription = `A minimalistic note-taker app designed to let you jot down what you need with ease, without distractions — <strong>no accounts, no subscriptions</strong>, just you and your notes.`;

// Starts with opacity 0.01 to make Lighthouse work: https://stackoverflow.com/questions/55826735/how-to-fix-lighthouse-returned-error-no-fcp-when-running-google-page-speed-t
const HeroSection = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0.01, y: -20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5, delay: 0.4 }}
      className="text-center"
    >
      <div 
        className="text-4xl sm:text-7xl font-semibold tracking-tighter md:tracking-normal text-zinc-100" 
        aria-label="Hero Message"
      >
        {heroMessage}
      </div>
      <div 
        className="mt-6 text-md md:text-lg leading-6 text-stone-300" 
        aria-label="Hero Description"
      >
        {/* Uses dangerouslySetInnerHTML to parse the <strong> tags */}
        {/* Since this is static, it should be fine to use */}
        <div dangerouslySetInnerHTML={{ __html: heroDescription }} />
      </div>
      <div className="mt-8 flex items-center justify-center gap-x-4">
        {/* Primary Button */}
        <Link 
          href="/editor" 
          onClick={() => setIsLoading(true)}
          className={`px-3 py-2 text-zinc-100 hover:text-zinc-200 bg-primary/50 hover:bg-primary/40 ring-1 ring-primary/60 text-base font-medium ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:ring-primary/55'} duration-300 rounded-lg shadow-md shadow-neutral-950 flex items-center group`}
          aria-label="Open Editor Button"
        >
          {isLoading ? (
            <Loader2 size={17} className={`mr-1 animate-spin`} />
          ) : (
            <NotepadText size={17} className="mr-1 rotate-6" />
          )}
          {isLoading ? 'Loading...' : 'Open Editor'}
        </Link>
        {/* Secondary Button */}
        <Button asChild variant="default" size="lg">
          <Link 
            href="https://docs.notetxt.xyz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-zinc-200 hover:text-zinc-100 duration-300 flex items-center group"
            aria-label="Visit Documentation Button"
          >
            <CircleHelp size={17} className="mr-[1px]" /> 
            Get Started
          </Link>
        </Button>
      </div>
    </motion.div>
  );
};

export default HeroSection;