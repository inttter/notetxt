import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import privacyData from '@/data/privacyData.json';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, FileLock } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const privacyTitle = 'Privacy Policy';

export default function Privacy() {
  const router = useRouter();

  return (
    <div className="bg-dark min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
      <Head>
        <title>{`${privacyTitle} • Notetxt`}</title>
      </Head>

      <motion.div
        className="max-w-2xl w-full px-4 py-8 space-y-4 flex-col"
        initial={{ opacity: 0.01 }}
        animate={{ opacity: 1, transition: { staggerChildren: 0.2 } }}
      >
        <motion.div
          className="flex items-center justify-start"
          initial={{ opacity: 0.01, y: 20 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.1 } }}
        >
          <FileLock size={40} className="mr-2 text-primary md:mt-0 mt-10" />
          <div className="text-4xl md:text-5xl text-zinc-100 font-semibold opacity-90 md:mt-0 mt-10 max-w-lg tracking-tight flex items-center" aria-label="Privacy Policy Title">
            {privacyTitle}
          </div>
        </motion.div>

        {/* Privacy Policy Content */}
        {privacyData.map((item, index) => (
          <motion.div
            key={index}
            className="max-w-xl pt-2"
            initial={{ opacity: 0.01, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } }}
            aria-label="Privacy Policy Content"
          >
            <div className="text-zinc-100 text-xl my-1">
              {item.header}
            </div>
            {item.content.split('\n').map((line, lineIndex) => (
              <span key={lineIndex} className="text-stone-300/85 text-base">
                {line}
                <br />
              </span>
            ))}
          </motion.div>
        ))}

        <motion.div 
          initial={{ opacity: 0.01 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }} 
          className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-2 mt-6 max-w-xl"
        >
          <Button
            className="w-full md:w-1/2 text-zinc-100 text-sm"
            aria-label="Go Back To Last Page Button"
            onClick={() => {
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push("/editor");
              }
            }}            
          >
            <ArrowLeft size={17} />
            Go back
          </Button>

          {/* View Source Code */}
          <Link href="https://github.com/inttter/notetxt" target="_blank" rel="noopener noreferrer" className="w-full md:w-1/2">
            <Button
              className="w-full text-zinc-100 text-sm"
              aria-label="View Source Code Button"
            >
              <FaGithub size={17} />
              View Source Code
            </Button>
          </Link>
        </motion.div>

      </motion.div>
    </div>
  );
}