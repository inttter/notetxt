import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import featureCardsData from '@/data/featureCards.json';

const FeatureCard = () => {
  return (
    <>
      {featureCardsData.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }}
          className="shadow-md rounded-md overflow-hidden mt-6"
        >
          <Image
            src={card.image}
            width={1280}
            height={720}
            alt={card.title}
            className="w-full object-cover border border-neutral-800 rounded-md"
          />
          <div className="pt-5">
            <div className="text-xl text-zinc-100">
              {card.title}
            </div>
            <div className="text-stone-400 text-sm mt-1">
              {card.description}
            </div>
          </div>
        </motion.div>
      ))}
    </>
  );
};

export default FeatureCard;