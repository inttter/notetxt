import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter'
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import markdownStyles from './MarkdownStyles';
import 'katex/dist/katex.min.css';
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
          remarkPlugins={[
            remarkGfm,
            remarkGemoji,
            remarkMath,
            [remarkFrontmatter, { type: 'yaml', marker: '-' }],
          ]}
          rehypePlugins={[
            rehypeRaw,
            rehypeGithubAlerts,
            rehypeSlug,
            rehypeKatex,
            [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
          ]}
          className="bg-transparent border border-neutral-800 text-stone-200/95 placeholder:text-neutral-600 outline-none w-full px-4 duration-300 text-base rounded-b-lg min-h-96 h-[557px] max-w-screen overflow-auto caret-amber-400 resize-none overflow-x-hidden mt-3 textarea-custom-scroll font-sans"
        />
      </motion.div>
    </div>
  );
};

export default MarkdownPreview;