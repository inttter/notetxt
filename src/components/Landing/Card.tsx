import React from 'react';
import Image from 'next/image'
import { motion } from 'framer-motion';

const FeatureCard = ({ imageSrc, title, description, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5, delay: 0.3 + index * 0.2 }} 
      className="shadow-md rounded-md overflow-hidden mt-6"
    >
      <Image src={imageSrc} width={1280} height={720} alt={title} className="w-full object-cover border border-neutral-800 rounded-md " />
      <div className="pt-5">
        <div className="text-xl text-zinc-100">
          {title}
        </div>
        <div className="text-stone-400 text-sm mt-1">
          {description}
        </div>
      </div>
    </motion.div>
  );
};

export default FeatureCard;