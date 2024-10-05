import React from 'react';
import { Check } from 'lucide-react';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.css';

const markdownStyles = {
    h1: ({ node, ...props }) => (
        <div className="relative text-3xl md:text-4xl font-bold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h2: ({ node, ...props }) => (
        <h2 className="relative text-2xl md:text-3xl font-bold md:tracking-normal tracking-tighter mt-5 mb-4 text-zinc-100 prose-invert" {...props} />
    ),
    h3: ({ node, ...props }) => (
        <h3 className="relative text-xl md:text-2xl font-bold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h4: ({ node, ...props }) => (
        <h4 className="relative text-lg md:text-xl font-bold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h5: ({ node, ...props }) => (
        <h5 className="relative text-base md:text-lg font-bold md:tracking-normal tracking-tighter mt-5 mb-3 text-zinc-100 prose-invert" {...props} />
    ),
    h6: ({ node, ...props }) => (
        <h6 className="relative text-sm md:text-base font-bold md:tracking-normal tracking-tighter mt-5 mb-3 text-neutral-500 prose-invert" {...props} />
    ),
    p: ({ node, ...props }) => (
        <p className="mb-4 prose-p:text-neutral-200 opacity-95 prose-invert" {...props} />
    ),
    ul: ({ node, ...props }) => (
        <ul className="prose-ul:pl-5 prose-ul:mb-4 marker:text-stone-600" {...props} />
    ),
    ol: ({ node, ...props }) => (
        <ol className="prose-ol:pl-5 prose-ol:mb-4 marker:text-stone-600" {...props} />
    ),
    li: ({ node, children, ...props }) => (
        <li className="mb-2 prose-li:mb-2 marker:text-stone-600" {...props}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === 'input' && child.props.type === 'checkbox') {
                    return (
                        <div key={index} className="relative inline-block">
                            <input
                                type="checkbox"
                                className="appearance-none w-4 h-4 mr-1 -mb-0.5 rounded bg-neutral-800 border border-neutral-800 checked:border-neutral-800 checked:bg-yellow-400 accent-neutral-800"
                                {...child.props}
                            />
                            {child.props.checked && (
                                <Check className="absolute top-[4px] left-0.5 w-3 h-4 text-neutral-950  pointer-events-none" />
                            )}
                        </div>
                    );
                }
                return child;
            })}
        </li>
    ),
    table: ({ node, ...props }) => (
        <table className="table-auto w-full overflow-x-auto rounded-md border-collapse my-4 prose-table:my-4 prose-invert" {...props} />
    ),
    th: ({ node, ...props }) => (
        <th className="px-4 py-2 bg-neutral-900 text-zinc-300 border border-neutral-800 prose-invert text-left" {...props} />
    ),
    td: ({ node, ...props }) => (
        <td className="px-4 py-1.5 bg-neutral-900/60 border border-neutral-800 prose-invert" {...props} />
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
    
        // Default language to plaintext when one isn't specified/does not work
        let language = 'plaintext';
        let codeString = '';
    
        if (codeElement && typeof codeElement.props.className === 'string') {
            const className = codeElement.props.className;
            const match = className.match(/language-(\w+)/);
            if (match) {
                // Extract language name from `className`
                language = match[1];
            }
        }
    
        // Extract code string from the children
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
    
        return (
            <div className="overflow-x-auto mt-4 rounded-md">
                <pre className="px-4 my-0 rounded-md text-zinc-300 bg-neutral-900/80 border border-neutral-800 prose-invert font-medium code text-sm leading-6">
                    <code dangerouslySetInnerHTML={{ __html: highlightedCode }} {...props} />
                </pre>
            </div>
        );
    },
    code: ({ node, inline, children, ...props }) => {
        return (
            <code className="px-1 py-0.5 bg-neutral-800 border border-neutral-700/40 rounded-md code m-0.5 whitespace-pre-line" {...props}>
                {children}
            </code>
        );
    },
    a: ({ node, ...props }) => (
        <a className="no-underline text-sky-300 hover:text-opacity-80 underline-offset-2 duration-300" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
        <blockquote className="border-l-4 border-neutral-800 text-zinc-300 mb-0 pl-4 prose-invert" {...props} />
    ),
    img: ({ node, ...props }) => (
        <img className="max-w-full h-auto my-0 rounded-md border border-neutral-800 prose-invert" loading="lazy" {...props} />
    ),
    hr: ({ node, ...props }) => (
        <hr className="w-full border-t border-neutral-800 my-4 prose-invert" {...props} />
    ),
    video: ({ node, ...props }) => (
        <div className="relative">
            <video className="w-full h-auto mb-0 mt-4 rounded-md border border-neutral-800 prose-invert" controls {...props}>
                Your browser does not support the video tag.
            </video>
        </div>
    ),
    kbd: ({ node, ...props }) => (
        <kbd className="px-1 py-0.5 bg-neutral-800 border border-neutral-900 text-zinc-300 rounded-md prose-invert code" {...props} />
    ),
};

export default markdownStyles;