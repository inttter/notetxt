import React, { useRef } from 'react';
import commands from '@/utils/commands';
import * as chrono from 'chrono-node';

export const useSlashCommands = (content: string, setContent: (content: string) => void, externalRef?: React.RefObject<HTMLTextAreaElement>, additionalProcessing?: (e: React.ChangeEvent<HTMLTextAreaElement>, value: string) => string | null,
) => {
  const internalRef = useRef<HTMLTextAreaElement | null>(null);
  const textareaRef = externalRef || internalRef;

  const generateTOC = (content: string) => {
    const lines = content.split('\n');
    const toc: string[] = [];
    const headerRegex = /^(#{1,6})\s+(.+)$/; // Matches H1 to H6

    let inTOCSection = false;
    let inCodeBlock = false;

    lines.forEach((line) => {
      if (line.trim().startsWith('```')) {
        inCodeBlock = !inCodeBlock; // Toggle code block state
        return;
      }

      // Check for command line input (both /toc and /contents)
      if (inCodeBlock || line.trim() === `/${commands.toc.aliases[0]}` || line.trim() === '/toc') {
        if (line.trim() === '/toc' || line.trim() === `/${commands.toc.aliases[0]}`) {
          inTOCSection = true;
        }
        return;
      }

      const match = line.match(headerRegex);
      if (match && inTOCSection) {
        const [, hashes, title] = match;
        const indent = '  '.repeat(hashes.length - 1); // Indentation based on header level
        const cleanedTitle = title
          .replace(/`([^`]+)`/g, '$1') // Keep content of inline code
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]+/g, '') // Remove punctuation
          .replace(/\s+/g, '-'); // Replace spaces with hypens

        toc.push(`${indent}- [${title}](#${cleanedTitle})`);
      }
    });

    return toc.join('\n');
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const lines = value.split('\n');

    const cursorPosition = e.target.selectionStart;
    let caretOffset = 0;

    // Match and parse dates when it matches regex (where [[...]] contains dates in various formats)
    const parsedLines = lines.map((line) =>
      line.replace(/\[\[(.*?)\]\]/g, (_, match) => {
        const parsedDate = chrono.parseDate(match);

        if (parsedDate) {
          const day = parsedDate.getDate().toString();
          const month = parsedDate.toLocaleString('en-US', { month: 'long' });
          const year = parsedDate.getFullYear();
          
          // eg. February 2, 2025
          const replacement = `${month} ${day}, ${year}`;
          
          caretOffset += replacement.length - match.length - 4;
          return replacement;
        }

        return `[[${match}]]`;
      }),
    );

    const parsedContent = parsedLines.join('\n');

    // Check for commands
    const commandLineIndex = parsedLines.findIndex((line) => line.startsWith('/'));
    if (commandLineIndex !== -1) {
      const command = parsedLines[commandLineIndex].slice(1).toLowerCase(); // Get command without the slash
      const foundCommand = Object.entries(commands).find(([cmd, { aliases }]) => 
        cmd === command || aliases.includes(command) // Check both command and aliases
      );

      if (foundCommand) {
        let commandOutput = foundCommand[1].content;

        // Use the command key from the foundCommand for TOC logic
        if (foundCommand[0] === 'toc' || foundCommand[1].aliases.includes('contents')) {
          const toc = generateTOC(parsedContent);
          commandOutput = '## Table of Contents\n\n' + toc;
        }

        parsedLines[commandLineIndex] = commandOutput;
        const newContent = parsedLines.join('\n');
        setContent(newContent);

        if (textareaRef.current) {
          textareaRef.current.value = newContent;

          const positionBeforeCommand = parsedLines
            .slice(0, commandLineIndex)
            .join('\n').length + commandOutput.length + (commandLineIndex === 0 ? 0 : 1);
          
          textareaRef.current.setSelectionRange(positionBeforeCommand, positionBeforeCommand);
          textareaRef.current.focus();
        }
        return;
      }
    }

    // Move caret to the end of replacement for parced placeholders
    if (textareaRef.current && commandLineIndex === -1) {
      textareaRef.current.value = parsedContent;

      // Move caret position to the end of the last replaced string
      const newCaretPosition = cursorPosition + caretOffset;
      textareaRef.current.setSelectionRange(newCaretPosition, newCaretPosition);
      textareaRef.current.focus();
    }

    setContent(parsedContent);
  }

  return { textareaRef, handleChange };
};
