import React from 'react';
import Image from 'next/image';
import featureCardsData from '@/data/featureCards.json';
import { motion } from 'framer-motion';

const FeatureCard = () => {
  return (
    <>
      {featureCardsData.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.23 }}
          className="overflow-hidden mt-4 md:mt-5"
        >
          <Image
            src={card.image}
            width={1280}
            height={720}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
            alt={card.title}
            className="w-full object-cover rounded-lg"
          />
          <div className="mt-3.5">
            <div className="text-xl font-medium text-zinc-100">
              {card.title}
            </div>
            <div className="text-stone-300/85 text-sm mt-0.5">
              {card.description}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default FeatureCard;