import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkGemoji from 'remark-gemoji';
import remarkMath from 'remark-math';
import remarkFrontmatter from 'remark-frontmatter';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSlug from 'rehype-slug';
import rehypeKatex from 'rehype-katex';
import markdownStyles from '@/components/markdown/MarkdownStyles';
import { rehypeGithubAlerts } from 'rehype-github-alerts';
import { motion } from 'framer-motion';
import 'katex/dist/katex.min.css';

const MarkdownPreview = ({ content, scrollPosition, setScrollPosition, textareaRef }) => {
  const scrollRef = useRef();

  const handleScroll = () => {
    const currentScrollTop = scrollRef.current.scrollTop;
    if (currentScrollTop !== scrollPosition) {
      setScrollPosition(currentScrollTop);
      if (textareaRef && textareaRef.current) {
        textareaRef.current.scrollTop = currentScrollTop;
      }
    }
  };

  useEffect(() => {
    const currentScrollElement = scrollRef.current;
    currentScrollElement.addEventListener('scroll', handleScroll);

    return () => {
      currentScrollElement.removeEventListener('scroll', handleScroll);
    };
  }, [scrollPosition]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-full mx-auto prose prose-invert break-words"
      style={{ fontFamily: 'Geist Sans, sans-serif' }}
    >
      <div
        ref={scrollRef}
        className="h-[542px] overflow-y-auto textarea-custom-scroll border border-neutral-800 rounded-b-lg rounded-l-lg md:rounded-l-none rounded-t-lg md:rounded-t-none p-4"
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
          className="bg-transparent text-stone-200/95 placeholder:text-neutral-600 outline-none w-full -mt-4 -mb-4 text-[14.5px] caret-amber-400 font-sans duration-300"
        />
      </div>
    </motion.div>
  );
};

export default MarkdownPreview;
