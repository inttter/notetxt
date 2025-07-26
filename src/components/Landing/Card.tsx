import React from 'react';
import featureCardsData from '@/data/featureCards.json';
import { motion } from 'framer-motion';
import Image from 'next/image';

const FeatureCard = () => {
  return (
    <div className="flex flex-col gap-8 pt-5">
      {featureCardsData.map((card, index) => {
        const isReversed = index % 2 === 1;

        return (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.23 + index * 0.23 }}
            className={`flex flex-col md:flex-row ${
              isReversed ? 'md:flex-row-reverse' : ''
            } items-center gap-x-6 gap-y-3`}
          >
            <div className="w-full">
              <Image
                src={card.image}
                width={1280}
                height={720}
                alt={card.title}
                className="w-full object-cover rounded-lg border border-neutral-700/60"
              />
            </div>
            <div className="w-full">
              <div className="flex items-center gap-x-2 mb-2">
                <div className="text-zinc-100 bg-primary border border-neutral-700/60 rounded-full w-6 h-6 flex items-center justify-center text-base font-semibold">
                  {card.number}
                </div>
                <div className="md:text-2xl text-xl font-medium text-zinc-100">
                  {card.title}
                </div>
              </div>
              <div className="text-stone-300 text-sm mt-0.5">
                {card.description}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default FeatureCard;