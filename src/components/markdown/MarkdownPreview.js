import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import markdownStyles from './MarkdownStyles';
import { motion } from 'framer-motion';

const MarkdownPreview = ({ content }) => {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="prose prose-invert text-zinc-300 w-full max-w-2xl mx-auto break-words"
        style={{ fontFamily: 'Geist Sans, sans-serif' }}
      >
        <ReactMarkdown
          children={content}
          components={markdownStyles}
          remarkPlugins={[remarkGfm, remarkGemoji, remarkMath]}
          rehypePlugins={[
            rehypeRaw,
            rehypeGithubAlerts,
            rehypeSlug,
            rehypeKatex,
            [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
          ]}
          className="bg-transparent border border-neutral-800 text-neutral-200 placeholder:text-neutral-600 outline-none w-full px-4 duration-300 text-base rounded-lg min-h-96 h-[550px] max-w-screen overflow-auto caret-amber-400 resize-none mt-5 textarea-custom-scroll"
        />
      </motion.div>
    </div>
  );
};

export default MarkdownPreview;