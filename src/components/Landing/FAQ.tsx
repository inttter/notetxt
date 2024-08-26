import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import accordionData from '@/data/accordionData.json';

const faqHeader = 'Frequently Asked Questions';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex(prevIndex => (prevIndex === index ? null : index));
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-2xl text-zinc-100 pt-4" 
        aria-label="FAQ Header"
      >
        {faqHeader}
      </motion.div>

      <Accordion type="single" collapsible>
        {accordionData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.2 }}
          >
            <AccordionItem
              value={index.toString()}
              className={`p-2 bg-default/20 border border-neutral-800 hover:border-neutral-700 text-zinc-300 rounded-lg duration-300  ${index < accordionData.length - 1 ? 'mb-4' : ''}`}
            >
              <AccordionTrigger
                className="w-full p-2 text-left cursor-pointer flex items-center justify-between"
                onClick={() => handleToggle(index)}
              >
                <span aria-label="FAQ Question Title">
                  {item.title}
                </span>
                <div
                  className={`transform transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-emerald-300' : 'rotate-0 text-stone-600'}`}
                >
                  <ChevronDown />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-stone-400 p-2"
                      aria-label="FAQ Item Content"
                    >
                      {item.content}
                    </motion.div>
                  )}
                </AnimatePresence>
              </AccordionContent>
            </AccordionItem>
          </motion.div>
        ))}
      </Accordion>
    </>
  );
};

export default FAQ;