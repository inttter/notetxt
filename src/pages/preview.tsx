import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Head from 'next/head';

// Markdown Styling
import markdownStyles from '../components/Markdown/MarkdownStyles';
import 'github-markdown-css';

const Preview = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const savedMarkdown = localStorage.getItem('text');
    if (savedMarkdown) {
      setMarkdown(savedMarkdown);
    } else {
      setMarkdown(
        '<div align="center"><img src="https://us-east-1.tixte.net/uploads/files.iinter.me/no-content-ntxt-black.png" width="450">\n\nSorry! There was **no content** found for this preview. Please [go back](/) and try again.'
      );
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <Head>
        <title>Preview • Notetxt</title>
      </Head>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        <div className="flex justify-start mb-4 md:pt-0 pt-5">
          <button className="text-sm text-zinc-300 hover:text-zinc-400 duration-300 rounded-md group">
            <Link href="/editor" className="flex items-center">
              <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 text-zinc-100 group-hover:text-zinc-400 duration-300" /> Return to note
            </Link>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="prose prose-invert text-zinc-300 w-full max-w-2xl mx-auto"
        style={{ fontFamily: 'Geist Sans, sans-serif' }}
      >
        <ReactMarkdown
          children={markdown}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownStyles}
        />
      </motion.div>
    </div>
  );
};

export default Preview;