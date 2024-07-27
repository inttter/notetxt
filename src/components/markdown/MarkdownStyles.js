import React from 'react';

const markdownStyles = {
    h1: ({ node, ...props }) => (
        <div className="relative text-3xl md:text-4xl font-bold md:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
    ),
    h2: ({ node, ...props }) => (
        <h2 className="relative text-2xl md:text-3xl font-bold md:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
    ),
    h3: ({ node, ...props }) => (
        <h3 className="relative text-xl md:text-2xl font-boldmd:tracking-normal tracking-tighter mt-5 text-zinc-100 prose-invert" {...props} />
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
    li: ({ node, ...props }) => (
        <li className="mb-2 prose-li:mb-2" {...props} />
    ),
    table: ({ node, ...props }) => (
        <table className="table-auto w-full overflow-x-auto rounded-md border-collapse my-4 prose-table:my-4 prose-invert" {...props} />
    ),
    th: ({ node, ...props }) => (
        <th className="border border-neutral-800 px-4 py-2 bg-[#0D1117] text-zinc-300 prose-th:bg-neutral-800 prose-th:text-zinc-300 prose-invert text-left" {...props} />
    ),
    td: ({ node, ...props }) => (
        <td className="border border-neutral-800 px-4 py-1.5 bg-[#161B22] prose-td:bg-neutral-900 prose-invert" {...props} />
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
        <iframe className="w-full aspect-video mb-4 prose-invert" {...props} />
    ),
    code: ({ node, ...props }) => (
        <code className=" text-zinc-300 rounded-md px-1.5 py-1 bg-transparent prose-invert font-normal code" {...props} />
    ),
    pre: ({ node, ...props }) => (
        <pre className="p-4 rounded-md text-zinc-100 bg-[#161B22] prose-invert code" {...props} />
    ),
    a: ({ node, ...props }) => (
        <a className="text-blue-400 hover:underline underline-offset-2 prose-a:text-blue-400 prose-invert" {...props} />
    ),
    blockquote: ({ node, ...props }) => (
        <blockquote className="border-l-4 border-gray-500 pl-4 mb-4 italic prose-blockquote:border-l-4 prose-blockquote:border-gray-500 prose-blockquote:pl-4 prose-invert" {...props} />
    ),
    img: ({ node, ...props }) => (
        <img className="max-w-full h-auto mb-4 prose-img:max-w-full prose-img:h-auto border border-neutral-800 prose-invert" loading="lazy" {...props} />
    ),
    hr: ({ node, ...props }) => (
        <hr className="border-t-2 border-neutral-700 my-4 prose-hr:border-t prose-hr:border-neutral-700 prose-invert" {...props} />
    ),
    video: ({ node, ...props }) => (
      <div className="relative">
          <video className="w-full h-auto mb-4 rounded-lg border border-neutral-800 prose-invert" controls {...props}>
              Your browser does not support the video tag.
          </video>
      </div>
  ),
    kbd: ({ node, ...props }) => (
      <kbd className="p-1 text-sm bg-neutral-800 text-zinc-300 border-2 border-neutral-800 rounded-md prose-invert code" {...props} />
  ),
};

export default markdownStyles;