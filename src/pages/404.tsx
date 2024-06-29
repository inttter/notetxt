import React from 'react';
import { CircleX, ArrowLeft } from 'lucide-react';
import '@fontsource/geist-mono';
import '@fontsource/geist-sans';
import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 • notetxt</title>
      </Head>
      <div className="bg-[#101010] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
        <div className="max-w-2xl w-full px-4 py-8 space-y-4 flex-col">
          <div className="flex items-center justify-start">
            <CircleX size={40} className="mr-2 text-red-400 md:mt-0 mt-10" />
            <h1 className="text-4xl md:text-5xl text-zinc-100 opacity-90 md:mt-0 mt-10 max-w-md font-semibold tracking-tighter border-b-2 border-dotted border-neutral-700 flex items-center">
              Page Not Found
            </h1>
          </div>
          <p className="text-neutral-500 text-lg max-w-lg py-2">
            Sorry, the page you tried to navigate to couldn't be found. The link may have been moved or deleted.
          </p>
          <button className="text-zinc-300 bg-[#202020] hover:bg-neutral-600 hover:bg-opacity-40 duration-300 px-4 py-2 rounded-md group">
            <Link href="/" className="flex items-center">
              <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 duration-300" /> Back
            </Link>
          </button>
        </div>
      </div>
    </>
  );
}