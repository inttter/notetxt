import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';

const pageTitle404 = '404';
const pageDescription404 = `Unfortunately, you won't stumble upon your notes on this page. Check the link you entered, or use the button below to go back to the Editor, where your notes actually are.`;

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 • Notetxt</title>
      </Head>

      <div className="bg-dark min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
        <div className="max-w-2xl w-full px-4 py-8 space-y-4 flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0.01, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-center text-8xl font-semibold text-zinc-100 tracking-tighter md:tracking-normal"
            aria-label="404 Page Title"
          >
            {pageTitle404}
          </motion.div>

          <motion.div
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="text-stone-400/90 text-base max-w-lg pt-1 pb-3 text-center"
            aria-label="404 Page Description"
          >
            {pageDescription404}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0.01, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
          >
            <Link 
              href="/editor" 
              className="btn text-zinc-300 bg-neutral-800/70 hover:bg-neutral-800/50 text-base border border-neutral-700/70 hover:border-neutral-600/80 active:border-neutral-500/70 duration-300 rounded-lg shadow-md shadow-neutral-950 flex items-center group"
              passHref
            >
              <ArrowLeft size={17} className="mr-1 text-stone-400 group-hover:-translate-x-0.5 duration-300" /> 
              Go back to the Editor
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  );
}