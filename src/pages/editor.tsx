import React from 'react';
import Editor from '@/components/Editor';
import Tip from '@/components/Tip';
import Head from 'next/head';

export default function EditorPage() {
  return (
    <div className="relative">
      <Head>
        <title>Editor • Notetxt</title>
      </Head>
      <Editor />
      <Tip />
    </div>
  );
}