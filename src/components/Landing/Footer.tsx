import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Logo from '@/../public/landing/logo.png';
import { motion } from 'framer-motion';
import { GitCommit } from 'lucide-react';
import { getLatestCommitHash } from '@/utils/commit';

const Footer = () => {
  const [commitHash, setCommitHash] = useState<string>('...');

  useEffect(() => {
    const fetchCommitHash = async () => {
      const hash = await getLatestCommitHash();
      setCommitHash(hash);
    };

    fetchCommitHash();
  }, []);

  const projectName = 'Notetxt';
  const projectSlogan = `Write down what's on your mind.`;
  const repoURL = 'https://github.com/inttter/notetxt';
  const commitURL = `${repoURL}/commit/${commitHash}`;

  const quickLinks = [
    { href: '/', text: 'Home' },
    { href: 'https://docs.notetxt.xyz', text: 'Docs', external: true },
    { href: '/privacy', text: 'Privacy Policy' },
    { href: 'https://github.com/inttter/notetxt', text: 'GitHub', external: true },
    { href: 'https://github.com/sponsors/inttter', text: 'Donate', external: true },
    { href: commitURL, text: commitHash, external: true },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 1.0 }}
      className="w-full max-w-3xl text-stone-400 py-4 mb-5 md:mb-0 mt-auto mx-auto flex items-center justify-center"
    >
      <div className="w-full max-w-[735px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between items-center text-center md:text-left gap-4">

          {/* Project Logo/Name/Slogan */}
          <div className="flex items-center gap-x-2">
            <Image src={Logo} alt="Logo" width={35} height={35} className="rounded-lg" />
            <div className="text-base text-stone-100" aria-label="Project Name">
              {projectName}
              <span className="hidden md:block text-xs text-stone-400" aria-label="Project Slogan">
                {projectSlogan}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="text-sm flex flex-wrap justify-center md:justify-start gap-x-3 gap-y-2 max-w-md px-4 md:px-0" aria-label="Quick Links">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noopener noreferrer' : undefined}
                className="text-stone-400 hover:text-stone-300 duration-300 flex items-center"
                aria-label={link.text}
              >
                {link.text}
                {link.text === commitHash && (
                  <GitCommit size={20} className="ml-1" />
                )}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;