"use client"

import { Settings2 } from 'lucide-react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

export function SettingsButton() {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-dark-button/80 border border-neutral-800 hover:border-neutral-700/60 hover:bg-neutral-800/70 duration-300 p-3 rounded-lg flex items-center group"
            aria-label="Open Settings Page Button"
            onClick={() => router.push("/settings")}
          >
            <Settings2 size={20} className="text-stone-300 group-hover:text-zinc-100 duration-300" />
          </motion.button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Settings
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
