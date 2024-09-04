import React from 'react';
import { Check } from 'lucide-react';

const markdownStyles = {
    h1: ({ node, ...props }) => (
        <div className="relative text-3xl md:text-4xl font-bold md:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
    ),
    h2: ({ node, ...props }) => (
        <h2 className="relative text-2xl md:text-3xl font-bold md:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
    ),
    h3: ({ node, ...props }) => (
        <h3 className="relative text-xl md:text-2xl font-bold md:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
    ),
    h4: ({ node, ...props }) => (
        <h4 className="relative text-lg md:text-xl font-bold md:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
    ),
    h5: ({ node, ...props }) => (
        <h5 className="relative text-base md:text-lg font-bold md:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
    ),
    h6: ({ node, ...props }) => (
        <h6 className="relative text-sm md:text-base font-bold md:tracking-normal tracking-tighter mt-5 text-neutral-500 prose-invert" {...props} />
    ),
    p: ({ node, ...props }) => (
        <p className="mb-4 prose-p:text-zinc-300 prose-invert" {...props} />
    ),
    ul: ({ node, ...props }) => (
        <ul className="prose-ul:pl-5 prose-ul:mb-4" {...props} />
    ),
    ol: ({ node, ...props }) => (
        <ol className="prose-ol:pl-5 prose-ol:mb-4" {...props} />
    ),
    li: ({ node, children, ...props }) => (
        <li className="mb-2 prose-li:mb-2 marker:text-stone-600" {...props}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child) && child.type === 'input' && child.props.type === 'checkbox') {
                    return (
                        <div key={index} className="relative inline-block">
                            <input
                                type="checkbox"
                                className="appearance-none w-4 h-4 mr-1 -mb-0.5 rounded bg-neutral-800 border border-neutral-700 checked:border-neutral-800 accent-neutral-800"
                                {...child.props}
                            />
                            {child.props.checked && (
                                <Check className="absolute top-[4px] left-0 w-4 h-4 text-stone-400 pointer-events-none" />
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
        <th className="border border-neutral-800 px-4 py-2 bg-neutral-800 text-zinc-300 prose-th:bg-neutral-800 prose-th:text-zinc-300 prose-invert text-left code" {...props} />
    ),
    td: ({ node, ...props }) => (
        <td className="border border-neutral-800 px-4 py-1.5 bg-neutral-900 prose-td:bg-neutral-900 prose-invert" {...props} />
    ),
    strong: ({ node, ...props }) => (
        <strong className="prose-strong:font-bold md:tracking-normal tracking-tighter prose-invert" {...props} />
    ),
    em: ({ node, ...props }) => (
        <em className="italic m-0.5 prose-invert" {...props} />
    ),
    del: ({ node, ...props }) => (
        <del className="prose-del:line-through prose-invert" {...props} />
    ),
    iframe: ({ node, ...props }) => (
        <iframe width={props.width} height={props.height} className="aspect-video mb-4 prose-invert" {...props} />
    ),
    code: ({ node, inline, className, children, ...props }) => (
        // * WARNING: These styles affect both code blocks with and 
        // * without languages and also affects inline code.
        <code className={`text-zinc-200 code ${className}`} {...props}>
          {children}
        </code>
    ),
    pre: ({ node, children, className, ...props }) => (
        // * WARNING: These styles affect both code blocks with and without languages
        <pre className="px-4 rounded-md text-zinc-300 bg-neutral-900 border border-neutral-800 prose-invert font-medium code" {...props}>
            {children}
        </pre>
    ),
    a: ({ node, ...props }) => (
        <a className="no-underline text-zinc-100 hover:opacity-80 border-b-2 border-neutral-600 duration-300" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
        <blockquote className="border-l-4 border-neutral-700 pl-4 mb-4 italic prose-blockquote:border-l-4 prose-blockquote:border-neutral-700 prose-blockquote:pl-4 prose-invert" {...props} />
    ),
    img: ({ node, ...props }) => (
        <img className="max-w-full h-auto mb-4 prose-img:max-w-full prose-img:h-auto border border-neutral-800 prose-invert" loading="lazy" {...props} />
    ),
    hr: ({ node, ...props }) => (
        <hr className="border-t-2 border-neutral-800 my-4 prose-hr:border-t prose-hr:border-neutral-800 prose-invert" {...props} />
    ),
    video: ({ node, ...props }) => (
        <div className="relative">
            <video className="w-full h-auto mb-4 rounded-lg border border-neutral-800 prose-invert" controls {...props}>
                Your browser does not support the video tag.
            </video>
        </div>
    ),
    kbd: ({ node, ...props }) => (
        <kbd className="px-1 py-0.5 text-sm bg-neutral-800 text-zinc-300 border border-neutral-700 rounded-md prose-invert code" {...props} />
    ),
};

export default markdownStyles;