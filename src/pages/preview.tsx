import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Head from 'next/head';

// Markdown Styling
import markdownStyles from '../components/markdown/MarkdownStyles';
import 'github-markdown-css';

const Preview = () => {
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    const savedCurrentNoteId = localStorage.getItem('currentNoteId');
    const savedNotes = localStorage.getItem('notes');
    
    if (savedNotes && savedCurrentNoteId) {
      const parsedNotes = JSON.parse(savedNotes);
      const note = parsedNotes[savedCurrentNoteId];
      
      if (note && note.content.trim()) {
        setMarkdown(note.content);
      } else {
        setMarkdown(
          '<div align="center"><img src="https://us-east-1.tixte.net/uploads/files.iinter.me/no-content-ntxt-black.png" width="450">\n\nSorry! There was **no content** found for this preview. Please [go back](/editor) and try again.'
        );
      }
    }
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111111] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <Head>
        <title>Markdown Preview • Notetxt</title>
      </Head>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-2xl"
      >
        <div className="flex justify-start mb-4 md:pt-0 pt-3">
        <Link href="/editor" className="flex items-center">
          <button className="btn text-sm text-zinc-300 bg-[#282828] bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 group flex items-center">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 duration-300" /> 
            Return to Editor
          </button>
        </Link>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="prose prose-invert text-zinc-300 w-full max-w-2xl mx-auto break-words"
        style={{ fontFamily: 'Geist Sans, sans-serif' }}
      >
        <ReactMarkdown
          children={markdown}
          remarkPlugins={[remarkGfm, remarkGemoji, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeGithubAlerts, rehypeSlug, rehypeKatex, [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],]}
          components={markdownStyles}
        />
      </motion.div>
    </div>
  );
};

export default Preview;