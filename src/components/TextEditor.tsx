import React, { useState, useRef, useEffect } from 'react';
import NoteTitle from '../components/Title';
import TextFormatting from '../components/TextFormatting';
import UndoRedo from '../components/UndoRedo';
import CharCount from '../components/CharCount';
import { FaDownload } from 'react-icons/fa';
import '@fontsource/geist-mono';

export default function PlainTextEditor() {
  const [text, setText] = useState(`A simple text editor to write down what's on your mind. Delete this text and start writing something.`);
  const [title, setTitle] = useState('');
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
    a.download = title ? `${title}.txt` : 'note.txt';

    document.body.appendChild(a);
    a.click();
  };

  const handleUndo = () => {
    document.execCommand('undo');
  };
  
  const handleRedo = () => {
    document.execCommand('redo');
  };

  return (
    <div className="bg-neutral-900 min-h-screen flex flex-col justify-center items-center antialiased scroll-smooth p-4 md:p-8 selection:bg-[#E8D4B6] selection:text-black">
      <div className="max-w-xl w-full px-5 space-y-4 flex-col relative top-0 md:px-0">
        <NoteTitle title={title} setTitle={setTitle} />
        <div className="flex justify-between items-center">
          <TextFormatting
            onBoldClick={() => document.execCommand('bold')}
            onItalicClick={() => document.execCommand('italic')}
            onUnderlineClick={() => document.execCommand('underline')}
            onStrikethroughClick={() => document.execCommand('strikethrough')}
          />
          <UndoRedo handleUndo={handleUndo} handleRedo={handleRedo} />
          <div className="flex mb-4 bg-neutral-800 ml-2 p-1 rounded-lg">
          <button
            className="text-white bg-transparent hover:bg-neutral-700 hover:bg-opacity-40 duration-300 py-2 px-4 rounded focus:outline-none tooltip tooltip-bottom font-semibold"
            data-tip="Save as .txt file"
            data-theme="lofi"
            onClick={handleDownload}
          >
            <FaDownload />
          </button>
          </div>
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
      <CharCount text={text} />
    </div>
  );
}