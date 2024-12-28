import React, { useState, useEffect, useRef } from 'react';
import { Check, FileQuestion, Copy } from 'lucide-react';
import hljs from 'highlight.js';
import copy from 'copy-to-clipboard';
import 'highlight.js/styles/github-dark-dimmed.css';

const markdownStyles = {
    h1: ({ node, ...props }) => (
        <div className="relative text-3xl md:text-4xl font-semibold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h2: ({ node, ...props }) => (
        <h2 className="relative text-2xl md:text-3xl font-semibold md:tracking-normal tracking-tighter mt-5 mb-4 text-zinc-100 prose-invert" {...props} />
    ),
    h3: ({ node, ...props }) => (
        <h3 className="relative text-xl md:text-2xl font-semibold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h4: ({ node, ...props }) => (
        <h4 className="relative text-lg md:text-xl font-semibold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h5: ({ node, ...props }) => (
        <h5 className="relative text-base md:text-lg font-semibold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h6: ({ node, ...props }) => (
        <h6 className="relative text-sm md:text-base font-semibold md:tracking-normal tracking-tighter mt-5 mb-3 text-neutral-500 prose-invert" {...props} />
    ),
    p: ({ node, ...props }) => (
        <p className="mb-4 prose-p:text-neutral-200 opacity-95 prose-invert" {...props} />
    ),
    ul: ({ node, ...props }) => (
        <ul className="prose-ul:pl-5 prose-ul:mb-2 marker:text-stone-600" {...props} />
    ),
    ol: ({ node, ...props }) => (
        <ol className="prose-ol:pl-5 prose-ol:mb-2 marker:text-stone-600" {...props} />
    ),
    li: ({ node, children, ...props }) => (
        <li className="mb-2 prose-li:mb-2 marker:text-stone-600" {...props}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === 'input' && child.props.type === 'checkbox') {
                    return (
                        <div key={index} className="relative inline-block">
                            <input
                                type="checkbox"
                                className="appearance-none w-4 h-4 mr-1 -mb-0.5 rounded bg-neutral-800 border border-neutral-700 checked:border-neutral-800 checked:bg-yellow-400 accent-neutral-800"
                                {...child.props}
                            />
                            {child.props.checked && (
                                <Check className="absolute top-[4px] left-0.5 w-3 h-4 text-neutral-950 pointer-events-none" />
                            )}
                        </div>
                    );
                }
                return child;
            })}
        </li>
    ),
    table: ({ node, ...props }) => (
        <div className="overflow-x-auto rounded-md mt-4 border border-neutral-900">
            <table className="w-full my-0" {...props} />
        </div>
    ),
    th: ({ node, ...props }) => (
        <th className="px-4 py-2 bg-neutral-900 text-zinc-200 font-normal border border-neutral-800 prose-invert text-left" {...props} />
    ),
    td: ({ node, ...props }) => (
        <td className="px-4 py-1.5 bg-neutral-900/40 text-zinc-100 border border-neutral-800 prose-invert" {...props} />
    ),
    strong: ({ node, ...props }) => (
        <strong className="prose-strong:font-bold md:tracking-normal tracking-tighter prose-invert" {...props} />
    ),
    em: ({ node, ...props }) => (
        <em className="italic mr-0.5 prose-invert" {...props} />
    ),
    del: ({ node, ...props }) => (
        <del className="prose-del:line-through prose-invert" {...props} />
    ),
    iframe: ({ node, ...props }) => (
        <iframe width={props.width} height={props.height} className="aspect-video mb-4 prose-invert" {...props} />
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
            <div className="relative overflow-x-auto mt-4 rounded-lg">
                <button
                    onClick={handleCopy}
                    className={`absolute top-2 right-2.5 bg-neutral-800 border border-neutral-700/60 text-zinc-300 rounded-lg p-1.5 transition duration-300 ${
                        disabled ? 'bg-neutral-800 cursor-not-allowed' : 'hover:text-zinc-100 hover:border-neutral-600'
                    }`}
                    aria-label="Copy Code to Clipboard"
                    title="Copy Code to Clipboard"
                    disabled={disabled}
                >
                    {copied ? (
                        <Check size={20} className="w-4 h-4 transform transition-transform duration-300" />
                    ) : (
                        <Copy size={20} className="w-4 h-4 transform transition-transform duration-300" />
                    )}
                </button>
                <pre className="px-4 my-0 rounded-lg text-zinc-300 bg-neutral-900/80 border border-neutral-800 prose-invert font-medium code text-xs md:text-sm leading-5" aria-label="Code Block">
                    <code dangerouslySetInnerHTML={{ __html: highlightedCode }} {...props} />
                </pre>
            </div>
        );
    },
    code: ({ node, inline, children, ...props }) => {
        return (
            <code className="px-1 py-[1px] text-stone-200/95 bg-neutral-800 border border-neutral-700/40 rounded-md code m-0.5 whitespace-pre-line" {...props}>
                {children}
            </code>
        );
    },
    a: ({ node, ...props }) => (
        <a className="no-underline text-sky-400 hover:text-sky-400/80 duration-300" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
        <blockquote className="border-l-4 border-neutral-800 text-zinc-300 mb-0 pl-4 prose-invert" {...props} />
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
                    <div className="max-w-full h-40 mt-4 my-0 bg-neutral-800/50 border border-neutral-800 flex flex-col items-center justify-center rounded-lg duration-300">
                        <FileQuestion className="text-stone-400 mb-1" size={40} /> No image found
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
        <hr className="w-full border-t border-neutral-800 my-4 prose-invert" {...props} />
    ),
    video: ({ node, ...props }) => (
        <div className="relative">
            <video className="w-full h-auto mb-0 mt-4 rounded-lg border border-neutral-800 prose-invert" controls {...props}>
                Your browser does not support the video tag.
            </video>
        </div>
    ),
    kbd: ({ node, ...props }) => (
        <kbd className="px-1 py-[1px] bg-neutral-800 border border-neutral-900 text-zinc-300 rounded-lg prose-invert font-mono" {...props} />
    ),
};

export default markdownStyles;