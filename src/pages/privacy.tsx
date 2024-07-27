import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import Head from 'next/head';

export default function Policy() {
  return (
    <div className="bg-[#101010] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
      <div className="max-w-2xl w-full px-4 py-8 space-y-4 flex-col">
        <div className="flex items-center justify-start">
          <Head>
            <title>Policy • Notetxt</title>
          </Head>
          <Lock size={40} className="mr-2 text-amber-400 md:mt-0 mt-10" />
          <h1 className="text-4xl md:text-5xl text-zinc-100 opacity-90 md:mt-0 mt-10 max-w-lg font-semibold tracking-tighter flex items-center">
            Your Notes Are Safe
          </h1>
        </div>
        <p className="text-neutral-400 tracking-tight text-md max-w-lg pt-2">
          All of the text you write on this site is for <strong>your eyes only</strong>. No data or contents of your notes are sent to others.
          Your browser's <code className="code">localStorage</code> is used only to handle retrieving previous note contents, but It is impossible for anyone to access the contents of your notes.
        </p>
        <p className="text-neutral-400 tracking-tight text-md max-w-lg pt-2">
          If you wish to delete the note that is currently stored in your browser storage, clear them from your <code className="code">localStorage</code> with
          <Link
            href="https://www.leadshook.com/help/how-to-clear-local-storage-in-google-chrome-browser/"
            target="_blank"
            rel="noopener noreferrer"
            className="m-1 text-zinc-300 hover:text-zinc-100 duration-300 border-b border-dashed border-neutral-600"
          >
            this
          </Link>
          tutorial.
        </p>
        <p className="text-neutral-400 tracking-tight text-md max-w-lg pb-2">
          Other than that,
          <Link
            href="https://vercel.com/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="m-1 text-zinc-300 hover:text-zinc-100 duration-300 border-b border-dashed border-neutral-600"
          >
            ▲ Vercel Analytics
          </Link>
          is used to collect anonymized usage data for analytical purposes. This includes information such as page views and user interactions.
          No personally identifiable information is collected, meaning your notes won't be included.
        </p>
        <button className="text-zinc-300 bg-[#202020] hover:bg-neutral-600 hover:bg-opacity-40 duration-300 px-4 py-2 rounded-md mr-2 group">
          <Link href="/" className="flex items-center">
            <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 group-active:-translate-x-1 duration-300" /> Back to main page
          </Link>
        </button>
        <button className="text-zinc-300 bg-[#202020] hover:bg-neutral-600 hover:bg-opacity-40 duration-300 px-4 py-2 rounded-md group">
          <Link href="https://github.com/inttter/notetxt" target="_blank" rel="noopener noreferrer" className="flex items-center">
            <FaGithub size={20} className="mr-1.5" /> Source Code
          </Link>
        </button>
      </div>
    </div>
  );
}