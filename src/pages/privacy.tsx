import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';

export default function Privacy() {
  return (
    <div className="bg-[#101010] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
      <div className="max-w-2xl w-full px-4 py-8 space-y-4 flex-col">
        <div className="flex items-center justify-start">
          <Head>
            <title>Privacy • Notetxt</title>
          </Head>
          <Lock size={40} className="mr-2 text-amber-400 md:mt-0 mt-10" />
          <h1 className="text-4xl md:text-5xl text-zinc-100 opacity-90 md:mt-0 mt-10 max-w-lg tracking-tighter flex items-center">
            Privacy
          </h1>
        </div>
        <div className="text-stone-400 tracking-tight text-md max-w-lg pt-2">
          <div className="text-zinc-300 text-lg py-1">
            Data Collection & Usage
          </div>
          <p>
            Notetxt uses your browser's <code className="code">localStorage</code> solely to save and display your notes. No personal information is collected or transmitted at all, since you don't enter it anywhere here. Just be sure to not keep sensitive things inside of your notes just in case.
          </p>
        </div>
        <div className="text-stone-400 tracking-tight text-md max-w-lg pt-2">
          <div className="text-zinc-300 text-lg py-1">
            Deleting your data
          </div>
          <p>
            To remove the note stored in <code className="code">localStorage</code>, create a brand new note (which clears your <code className="code">localStorage</code> content), or follow
            <Link
              href="https://www.leadshook.com/help/how-to-clear-local-storage-in-google-chrome-browser/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-zinc-300 hover:text-zinc-100 duration-300 border-b border-dashed border-neutral-600"
            >
              this guide
            </Link>.
          </p>
        </div>
        <div className="text-stone-400 tracking-tight text-md max-w-lg pb-2">
          <div className="text-zinc-300 text-lg py-1">
            Analytics
          </div>
          <p>
            <Link
              href="https://vercel.com/analytics"
              target="_blank"
              rel="noopener noreferrer"
              className="mr-1 text-zinc-300 hover:text-zinc-100 duration-300 border-b border-dashed border-neutral-600"
            >
              ▲ Vercel Analytics
            </Link>
            is used for anonymized usage data for analytical purposes. This information includes data such as page views and device types. No personal data or note contents will be collected.
          </p>
        </div>
        <button className="btn text-sm text-zinc-300 bg-[#282828] bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 group mt-4 mr-2">
          <Link href="/" className="flex items-center">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 group-active:-translate-x-1 duration-300" /> Go back
          </Link>
        </button>
        <button className="btn text-sm text-zinc-300 bg-[#282828] bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 group mt-4" onClick={() => window.history.back()}>
          <Link href="https://github.com/inttter/notetxt" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <FaGithub size={20} className="mr-1.5" /> View Source Code
          </Link>
        </button>
      </div>
    </div>
  );
}
