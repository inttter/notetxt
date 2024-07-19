import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

// markdown styling
// note: uses github markdown styling + my own custom styling from markdownStyles
import markdownStyles from '../../components/markdown/MarkdownStyles';
import 'github-markdown-css';

const Preview = () => {
  const router = useRouter();
  const { id } = router.query;
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    if (id) {
      // Retrieve and set the markdown content
      const savedMarkdown = localStorage.getItem(`markdown_${id}`);
      if (savedMarkdown) {
        setMarkdown(savedMarkdown);
      } else {
        setMarkdown('Sorry, there was no content found for this preview. Please go back and try again.');
      }

      // on component mount, clears previous preview data (aka the text)
      const clearOldPreviews = () => {
        const keys = Object.keys(localStorage).filter(key => key.startsWith('markdown_'));
        keys.forEach(key => {
          // removes only those that are not the current preview ID
          if (key !== `markdown_${id}`) {
            localStorage.removeItem(key);
          }
        });
      };

      clearOldPreviews();

      return () => {
        localStorage.removeItem(`markdown_${id}`);
      };
    }
  }, [id]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#0D1117] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="w-full max-w-2xl">
        <div className="flex justify-start mb-4 md:pt-0 pt-5">
          <button className="text-sm text-zinc-300 hover:text-zinc-400 duration-300 rounded-md group">
            <Link href="/" className="flex items-center">
              <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 text-zinc-300 group-hover:text-zinc-400 duration-300" /> Back to main page
            </Link>
          </button>
        </div>
      </div>

      <div
        className="prose prose-invert text-zinc-300 max-w-full md:max-w-2xl mx-auto"
        style={{ fontFamily: 'Geist Sans, sans-serif' }}
      >
        <ReactMarkdown
          className="text-left"
          children={markdown}
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={markdownStyles}
        />
      </div>
    </div>
  );
};

export default Preview;