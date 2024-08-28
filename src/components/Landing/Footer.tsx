import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { getLatestCommitHash } from '@/utils/commit';

const Footer = () => {
  const [commitHash, setCommitHash] = useState<string>('loading...');

  useEffect(() => {
    const fetchCommitHash = async () => {
      const hash = await getLatestCommitHash();
      setCommitHash(hash);
    };

    fetchCommitHash();
  }, []);

  const repoURL = 'https://github.com/inttter/notetxt';
  const commitURL = `${repoURL}/commit/${commitHash}`;

  return (
    <motion.footer
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5, delay: 1.0 }}
      className="bg-dark text-stone-400 py-6 mt-auto"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="text-sm text-center">
            © 2024 / {' '}
            <Link href="https://github.com/inttter/notetxt/blob/master/LICENSE" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-300 duration-300">
              MIT License
            </Link>{' '}
            /{' '}
            <Link href="/privacy" className="text-stone-400 hover:text-stone-300 duration-300">
              Privacy
            </Link>{' '}
            /{' '}
            <Link href="https://github.com/inttter/notetxt" target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-300 duration-300">
              GitHub
            </Link>{' '}
            /{' '}
            <Link href={commitURL} target="_blank" rel="noopener noreferrer" className="text-stone-400 hover:text-stone-300 duration-300 code" aria-label="Commit Hash">
              {commitHash}
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;