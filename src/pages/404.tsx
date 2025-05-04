import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const pageTitle404 = 'Page not found?!';
const pageDescription404 = `Unfortunately, yes, there's no page here. Check the link you entered again, or use the button below to go to the Editor.`;

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found • Notetxt</title>
      </Head>

      <div className="bg-dark min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
        <div className="max-w-2xl w-full px-4 py-8 space-y-4 flex flex-col items-center">
          
          <motion.div
            initial={{ opacity: 0.01, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="flex items-center justify-center text-6xl font-semibold text-zinc-100 tracking-tighter md:tracking-normal -mb-1"
            aria-label="404 Page Title"
          >
            {pageTitle404}
          </motion.div>

          <motion.div
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="text-zinc-300 text-sm md:text-base max-w-lg text-left md:text-center pb-2"
            aria-label="404 Page Description"
          >
            {pageDescription404}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0.01, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
            className="w-full max-w-lg"
          >
            <Link href="/editor" passHref>
              <Button
                asChild
                className="w-full flex justify-center items-center"
              >
                <motion.span
                  initial={{ x: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center text-zinc-100"
                >
                  <ArrowLeft size={17} />
                  Go to the Editor
                </motion.span>
              </Button>
            </Link>
          </motion.div>

        </div>
      </div>
    </>
  );
}
