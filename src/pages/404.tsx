import React from 'react';
import { X, ArrowLeft } from 'lucide-react';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 • Notetxt</title>
      </Head>
      <div className="bg-[#101010] min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8">
        <div className="max-w-2xl w-full px-4 py-8 space-y-4 flex flex-col items-center">
          <div className="flex items-center justify-center">
            <X size={40} className="mr-2 text-red-400" />
            <h1 className="text-4xl md:text-5xl text-zinc-100 opacity-90 max-w-md tracking-tighter">
              Page Not Found
            </h1>
          </div>
          <p className="text-stone-400 text-base max-w-md py-2 text-center">
            Sorry, the page you were looking for does not exist or was moved elsewhere.
            Click on the button below to go back to the previous page you were on.
          </p>
          <button className="btn text-sm text-zinc-300 bg-[#282828] bg-opacity-80 border-2 border-neutral-700 border-opacity-40 hover:bg-opacity-60 flex items-center group mt-4">
            <div className="flex items-center" onClick={() => window.history.back()}>
              <ArrowLeft size={20} className="mr-1 group-hover:-translate-x-0.5 duration-300" /> 
              Go back
            </div>
          </button>
        </div>
      </div>
    </>
  );
}