import React, { useState, useEffect } from 'react';
import { Check, FileQuestion, Copy } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/Tooltip";
import hljs from 'highlight.js';
import copy from 'copy-to-clipboard';
import 'highlight.js/styles/base16/qualia.css';

// Base styles for some elements to avoid repeating same styles many times
const baseTextStyle = 'text-zinc-100 prose-invert';
const baseHeadingStyle = 'font-medium mt-5 mb-3';
const baseListStyle = 'marker:text-zinc-100';
const baseTableStyle = 'overflow-x-auto rounded-md mt-4 border border-neutral-900';

const markdownStyles = {
  h1: ({ node, ...props }) => (
    <div className={`relative text-3xl md:text-4xl ${baseHeadingStyle} ${baseTextStyle}`} {...props} />
  ),
  h2: ({ node, ...props }) => (
    <h2 className={`relative text-2xl md:text-3xl ${baseHeadingStyle} ${baseTextStyle}`} {...props} />
  ),
  h3: ({ node, ...props }) => (
    <h3 className={`relative text-xl md:text-2xl ${baseHeadingStyle} ${baseTextStyle}`} {...props} />
  ),
  h4: ({ node, ...props }) => (
    <h4 className={`relative text-lg md:text-xl ${baseHeadingStyle} ${baseTextStyle}`} {...props} />
  ),
  h5: ({ node, ...props }) => (
    <h5 className={`relative text-base md:text-lg ${baseHeadingStyle} ${baseTextStyle}`} {...props} />
  ),
  h6: ({ node, ...props }) => (
    <h6 className={`relative text-sm md:text-base ${baseHeadingStyle} ${baseTextStyle}`} {...props} />
  ),
  p: ({ node, ...props }) => (
    <p className="mb-4 prose-p:text-neutral-200/95 prose-invert" {...props} />
  ),
  ul: ({ node, ...props }) => (
    <ul className={baseListStyle} {...props} />
  ),
  ol: ({ node, ...props }) => (
    <ol className={baseListStyle} {...props} />
  ),
  li: ({ node, children, ...props }) => {
    const childArray = React.Children.toArray(children);
  
    const checkbox = childArray.find((child) =>
        React.isValidElement(child) &&
        child.type === 'input' &&
        child.props.type === 'checkbox'
    );
  
    if (checkbox) {
      const content = childArray.filter((child) => child !== checkbox);
  
      return (
        <li className="list-none">
          <label className="flex items-start gap-2 -ml-6 -mt-0.5">
            <div className="relative">
              <input
                type="checkbox"
                className="appearance-none w-4 h-4 rounded bg-dark-focus border border-neutral-700/50 checked:border-neutral-800 checked:bg-primary mt-[3px]"
                {...checkbox.props}
              />
              {checkbox.props.checked && (
                <Check className="absolute top-[3.5px] left-0.5 w-3 h-4 text-zinc-100 pointer-events-none" />
              )}
            </div>
            <div className="flex-1">
              {content}
            </div>
          </label>
        </li>
      );
    }
  
    return (
      <li className={`${baseListStyle} -mb-0.5`} {...props}>
        {children}
      </li>
    );
  },
  table: ({ node, ...props }) => (
    <div className={baseTableStyle}>
      <table className="w-full my-0" {...props} />
    </div>
  ),
  th: ({ node, ...props }) => (
    <th className="px-4 py-2 bg-dark text-zinc-200 font-medium border border-neutral-800 prose-invert text-left text-sm" {...props} />
  ),
  td: ({ node, ...props }) => (
    <td className="px-4 py-1.5 bg-dark/60 text-zinc-100 border border-neutral-800 prose-invert" {...props} />
  ),
  strong: ({ node, ...props }) => (
    <strong className="font-medium tracking-normal prose-invert" {...props} />
  ),
  em: ({ node, ...props }) => (
    <em className="italic mr-0.5 prose-invert" {...props} />
  ),
  del: ({ node, ...props }) => (
    <del className="prose-del:line-through prose-invert" {...props} />
  ),
  iframe: ({ node, ...props }) => (
    <iframe width={props.width} height={props.height} className="aspect-video mt-4 my-0 prose-invert" {...props} />
  ),
  pre: ({ node, children, ...props }) => {
    const codeElement = React.Children.toArray(children).find(
      child => React.isValidElement(child) && child.props && child.props.className
    );

    let language = 'plaintext';
    let codeString = '';

    if (codeElement && typeof codeElement.props.className === 'string') {
      const className = codeElement.props.className;
      const match = className.match(/language-(\w+)/);
      if (match) {
        language = match[1];
      }
    }

    codeString = React.Children.toArray(children)
      .map(child => {
        if (typeof child === 'string') {
          return child;
        }
        if (React.isValidElement(child) && child.props && child.props.children) {
          return child.props.children;
        }
        return '';
      })
      .join('\n');

    let highlightedCode = '';

    try {
      highlightedCode = hljs.highlight(codeString, { language }).value;
    } catch (error) {
      console.error('An error occurred while trying to highlight code:', error);
      highlightedCode = hljs.highlightAuto(codeString).value;
    }

    const [copied, setCopied] = useState(false);
    const [disabled, setDisabled] = useState(false);

    const handleCopy = () => {
      try {
        copy(codeString);
        setCopied(true);
        setDisabled(true);

        setTimeout(() => {
          setCopied(false);
          setDisabled(false);
        }, 2000);
      } catch (error) {
        console.error('Failed to copy code:', error);
      }
    };

    return (
      <div className="relative overflow-x-auto mt-4">
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={handleCopy}
                className={`absolute top-2.5 right-3 bg-dark-button border border-neutral-700/60 rounded-lg p-1.5 transition duration-300 ${disabled ? 'bg-dark-button cursor-not-allowed' : 'hover:text-zinc-100 hover:bg-neutral-800'}`}
                aria-label="Copy Code To Clipboard Button"
                disabled={disabled}
              >
                {copied ? (
                  <Check size={18} className="w-4 h-4 text-green-400 transform transition-transform duration-300" />
                ) : (
                  <Copy size={18} className="w-4 h-4 text-zinc-100 transform transition-transform duration-300" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {copied ? 'Copied!' : 'Copy'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <pre className="p-4 my-0 rounded-lg bg-dark/60 border border-neutral-800 prose-invert font-mono text-xs text-zinc-200" aria-label="Code Block">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} {...props} />
        </pre>
      </div>
    );
  },
  code: ({ node, inline, children, ...props }) => {
    return (
      <code className="px-1 py-0.5 text-zinc-200 bg-neutral-800 ring-1 ring-neutral-700/60 rounded-md code m-0.5 whitespace-pre-line" {...props}>
        {children}
      </code>
    );
  },
  a: ({ node, ...props }) => (
    <a className="underline-offset-2 text-primary-text hover:text-primary-text/80 duration-300" {...props} />
  ),
  blockquote: ({ node, ...props }) => (
    // The before/after classes prevent tailwind-typography from
    // automatically adding quotation marks at the beginning and end of the text.
    <blockquote className="border-l-4 border-neutral-800 text-zinc-300 mb-0 pl-4 prose-invert before:prose-p:content-none after:prose-p:content-none not-italic" {...props} />
  ),
  img: ({ node, ...props }) => {
    const [imgError, setImgError] = useState(false);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setImgError(false);
      }, 300);

      return () => clearTimeout(timeoutId);
    }, [props.src]);

    return (
      <div className="relative">
        {imgError ? (
          <div className="max-w-full h-40 mt-4 my-0 bg-dark border border-neutral-800 flex flex-col items-center justify-center rounded-lg duration-300">
            <FileQuestion className="text-primary-text mb-1" size={40} /> No image found!
          </div>
        ) : (
          <img
            className="max-w-full h-auto mt-4 my-0 rounded-lg border border-neutral-800 prose-invert"
            loading="lazy"
            src={props.src}
            onError={() => setImgError(true)}
            {...props}
          />
        )}
      </div>
    );
  },
  hr: ({ node, ...props }) => (
    <hr className="w-full border-t border-neutral-700/60 my-4 prose-invert" {...props} />
  ),
  video: ({ node, ...props }) => (
    <div className="relative">
      <video className="w-full h-auto mt-4 my-0 rounded-lg border border-neutral-800 prose-invert" controls {...props}>
        Your browser does not support the video tag.
      </video>
    </div>
  ),
  kbd: ({ node, ...props }) => (
    <kbd className="px-1 py-0.5 bg-neutral-800 border border-neutral-800 text-stone-200/95 rounded-md prose-invert font-mono" {...props} />
  ),
  footnoteBlock: ({ node, ...props }) => (
    <section data-footnotes="" className="footnotes mt-4" {...props}>
      <ol className="prose-ol:pl-5 prose-ol:mb-2">{props.children}</ol>
    </section>
  ),
  details: ({ node, ...props }) => (
    <details className="my-0 prose-invert" {...props} />
  ),
  summary: ({ node, ...props }) => (
    <summary className="mt-4 my-0 font-medium text-primary-text hover:text-primary-text/80 hover:underline hover:underline-offset-2 duration-300 cursor-pointer prose-invert" {...props} />
  ),
};

export default markdownStyles;
