import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@radix-ui/react-accordion';
import faqQuestions from '@/data/faqQuestions.json';

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
        {faqQuestions.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.2 }}
          >
            <AccordionItem
              value={index.toString()}
              className={`text-stone-200 duration-300 group ${index > 0 ? 'border-t border-neutral-800' : ''}`}
            >
              <AccordionTrigger
                className="w-full py-4 text-left text-sm md:text-base cursor-pointer flex items-center justify-between"
                onClick={() => handleToggle(index)}
              >
                <span aria-label="FAQ Question Title">
                  {faq.question}
                </span>
                <div
                  className={`transform transition-transform duration-200 group-data-[state=open]:rotate-180 ${openIndex === index ? 'text-yellow-400' : 'text-stone-400 group-hover:text-stone-100'}`}
                >
                  <ChevronDown size={18} />
                </div>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="text-stone-400 text-sm pb-5"
                      aria-label="FAQ Item Content"
                    >
                      {faq.answer}
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