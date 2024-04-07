import React, { useState, useRef, useEffect } from 'react';
import TextFormatting from '../components/TextFormatting';
import { FaDownload } from 'react-icons/fa';
import '@fontsource/geist-mono';

export default function PlainTextEditor() {
  const [text, setText] = useState(`write down what's on your mind.`);
  const contentEditableRef = useRef(null);

  useEffect(() => {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(contentEditableRef.current);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }, [text]);

  const handleChange = () => {
    setText(contentEditableRef.current.textContent);
  };

  const handleDownload = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'text.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 selection:bg-[#E8D4B6] selection:text-black">
      <div className="max-w-xl w-full px-5 space-y-6 flex-col relative top-0 md:px-0">
        <div className="flex justify-between items-center">
          <TextFormatting
            onBoldClick={() => document.execCommand('bold')}
            onItalicClick={() => document.execCommand('italic')}
            onUnderlineClick={() => document.execCommand('underline')}
            onStrikethroughClick={() => document.execCommand('strikethrough')}
          />
          <button
            className="text-white font-semibold -mt-3 px-6 tooltip tooltip-bottom bg-transparent"
            data-tip="Save as .txt file"
            data-theme="lofi"
            onClick={handleDownload}
          >
            <FaDownload />
          </button>
        </div>
        <div
          ref={contentEditableRef}
          contentEditable
          className="bg-neutral-900 text-white focus:outline-none w-full px-3 font-mono text-lg resize-none caret-thick text"
          style={{ fontFamily: "'Geist Mono', monospace" }}
          onInput={handleChange}
        >
          {text}
        </div>
      </div>
    </div>
  );
}