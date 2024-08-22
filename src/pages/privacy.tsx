import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Privacy() {
  return (
    <div className="bg-[#101010] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
      <Head>
        <title>Privacy • Notetxt</title>
      </Head>

      <motion.div
        className="max-w-2xl w-full px-4 py-8 space-y-4 flex-col"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="flex items-center justify-start" variants={fadeInUp}>
          <Lock size={40} className="mr-2 text-amber-400 md:mt-0 mt-10" />
          <h1 className="text-4xl md:text-5xl text-zinc-100 opacity-90 md:mt-0 mt-10 max-w-lg tracking-tighter flex items-center">
            Privacy
          </h1>
        </motion.div>

        <motion.div className="text-stone-400 tracking-tight text-md max-w-lg pt-2" variants={fadeInUp}>
          <div className="text-zinc-300 text-lg py-1">
            Data Collection & Usage
          </div>
          <p>
            Notetxt uses your browser's <code className="code">localStorage</code> solely to store notes in your browser and display them. No information is collected or transmitted at all, since you don't enter your info anywhere on this website. 
            <br />
            <br />
            As a security measure for yourself, try not to store sensitive information in notes, as Notetxt is not responsible should your notes be exposed by other, external means or individuals.
          </p>
        </motion.div>

        <motion.div className="text-stone-400 tracking-tight text-md max-w-lg pt-2" variants={fadeInUp}>
          <div className="text-zinc-300 text-lg py-1">
            Deleting your data
          </div>
          <p>
            To remove notes stored in <code className="code">localStorage</code>, you can navigate to the note drawer and click on the 'Delete All Notes' button (trash icon in the bottom right), which permanently deletes your notes from the browser. If you want to clear <code className="code">localStorage</code> manually, follow
            <Link
              href="https://www.leadshook.com/help/how-to-clear-local-storage-in-google-chrome-browser/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-zinc-300 hover:text-zinc-100 duration-300 border-b border-neutral-600"
            >
              this guide
            </Link>.
          </p>
        </motion.div>

        <motion.div className="text-stone-400 tracking-tight text-md max-w-lg pb-2" variants={fadeInUp}>
          <div className="text-zinc-300 text-lg py-1">Analytics</div>
          <p>
            <Link
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-1 text-zinc-300 hover:text-zinc-100 duration-300 border-b border-neutral-600"
            >
              ▲ Vercel Analytics
            </Link>
            is used for anonymized usage data for analytical purposes. This information includes data such as page views, device types, and page referrals. No personal data or notes are collected.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}  
          className="btn text-sm text-zinc-300 bg-[#282828] bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 group mt-4 mr-2"
        >
          <Link href="/" className="flex items-center">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 group-active:-translate-x-1 duration-300" /> Go back
          </Link>
        </motion.button>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }} 
          className="btn text-sm text-zinc-300 bg-[#282828] bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 group mt-4" 
          onClick={() => window.history.back()}
        >
          <Link href="https://github.com/inttter/notetxt" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <FaGithub size={20} className="mr-1.5" /> View Source Code
          </Link>
        </motion.button>
      </motion.div>
    </div>
  );
}