import React from 'react';
import Editor from '../components/Editor';
import Tip from '../components/Tip';

export default function Home() {
  return (
    <div className="relative">
      <Editor />
      <Tip />
    </div>
  );
}