"use client"

import { Settings } from 'lucide-react';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip';

export function SettingsButton() {
  const router = useRouter();

  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>
          <Button
            size="icon"
            className="bg-dark-button/80 border border-neutral-800 hover:border-neutral-700/60 hover:bg-dark-button-hover duration-300 p-3 rounded-lg flex items-center group"
            aria-label="Open Settings Page Button"
            onClick={() => router.push("/settings")}
          >
            <Settings size={20} className="text-stone-300 group-hover:text-zinc-100 duration-300" />
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          Settings
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
