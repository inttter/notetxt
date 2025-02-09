import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import { Button } from '@/components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const pageTitle404 = '404';
const pageDescription404 = `Unfortunately, you won't come across your notes on this page. Check the link you entered, or use the button below to go to the Editor, where your notes actually are.`;

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
            className="flex items-center justify-center text-8xl font-semibold text-primary tracking-tighter md:tracking-normal"
            aria-label="404 Page Title"
          >
            {pageTitle404}
          </motion.div>

          <motion.div
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="text-zinc-100 text-base max-w-lg pt-1 pb-3 text-center"
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
                className="w-full text-base flex justify-center items-center"
              >
                <motion.span
                  initial={{ x: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="flex items-center"
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
