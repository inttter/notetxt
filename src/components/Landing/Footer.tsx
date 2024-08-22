import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const Footer = () => (
  <motion.footer
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    transition={{ duration: 0.5, delay: 1.0 }}
    className="bg-dark text-stone-400 py-6 mt-auto"
  >
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center">
        <p className="text-sm text-center">
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
          </Link>
        </p>
      </div>
    </div>
  </motion.footer>
);

export default Footer;
