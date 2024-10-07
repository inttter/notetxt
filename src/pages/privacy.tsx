import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';
import { motion } from 'framer-motion';
import privacyData from '@/data/privacyData.json';

const fadeInUp = {
  hidden: { opacity: 0.01, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: { opacity: 0.01 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function Privacy() {
  return (
    <div className="bg-dark min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
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

        {privacyData.map((item, index) => (
          <motion.div key={index} className="text-stone-400 tracking-tight text-md max-w-lg pt-2" variants={fadeInUp}>
            <div className="text-zinc-300 text-lg py-1">{item.header}</div>
            {item.content.split('\n').map((line, lineIndex) => (
              <React.Fragment key={lineIndex}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </motion.div>
        ))}

        <motion.button
          initial={{ opacity: 0.01 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}  
          className="btn text-sm text-zinc-300 bg-[#282828] bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 group mt-4 mr-2"
        >
          <Link href="/" className="flex items-center">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 group-active:-translate-x-1 duration-300" /> Go back
          </Link>
        </motion.button>

        <motion.button
          initial={{ opacity: 0.01 }}
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