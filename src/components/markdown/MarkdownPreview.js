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
        className="bg-dark-secondary h-[542px] overflow-y-auto textarea-custom-scroll border border-neutral-800/70 rounded-b-lg rounded-l-lg md:rounded-l-none rounded-t-lg md:rounded-t-none p-4"
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
            rehypeSlug,
            rehypeKatex,
            [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
            [rehypeGithubAlerts,
              {
                alerts: [
                  // The icons below use the Tabler icon set (https://tabler.io/icons)
                  {
                    keyword: 'NOTE',
                    icon: '<svg  xmlns="http://www.w3.org/2000/svg" width="16"  height="16" viewBox="0 0 24 24"  fill="none"  stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-info-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0" /><path d="M12 9h.01" /><path d="M11 12h1v4h1" /></svg>',
                    title: 'Note',
                  },
                  {
                    keyword: 'TIP',
                    icon: '<svg  xmlns="http://www.w3.org/2000/svg" width="16"  height="16" viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-sparkles"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M16 18a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm0 -12a2 2 0 0 1 2 2a2 2 0 0 1 2 -2a2 2 0 0 1 -2 -2a2 2 0 0 1 -2 2zm-7 12a6 6 0 0 1 6 -6a6 6 0 0 1 -6 -6a6 6 0 0 1 -6 6a6 6 0 0 1 6 6z" /></svg>',
                    title: 'Tip',
                  },
                  {
                    keyword: 'IMPORTANT',
                    icon: '<svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-star"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" /></svg>',
                    title: 'Important',
                  },
                  {
                    keyword: 'WARNING',
                    icon: '<svg  xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v4" /><path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0z" /><path d="M12 16h.01" /></svg>',
                    title: 'Warning',
                  },
                  {
                    keyword: 'CAUTION',
                    icon: '<svg  xmlns="http://www.w3.org/2000/svg" width="16"  height="16" viewBox="0 0 24 24"  fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"  stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-exclamation-circle"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 9v4" /><path d="M12 16v.01" /></svg>',
                    title: 'Caution',
                  },
                ],
              },
            ],
          ]}
          className="text-stone-200/95 placeholder:text-neutral-600 outline-none w-full -mt-4 text-[14.5px] caret-amber-400 font-sans duration-300"
        />
      </div>
    </motion.div>
  );
};

export default MarkdownPreview;
