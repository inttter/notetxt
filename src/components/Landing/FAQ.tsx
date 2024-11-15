import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, TableOfContents } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/Accordion';
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
        className="text-xl md:text-2xl font-medium text-zinc-100 pt-4 flex items-center"
        aria-label="FAQ Header"
      >
        <TableOfContents size={20} className="text-stone-400 mr-1.5 md:mr-1" /> {faqHeader}
      </motion.div>

      <Accordion type="single" collapsible>
        {faqQuestions.map((faq, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3, delay: 0.4 + index * 0.15 }}
           >
            <AccordionItem
              key={index}
              value={index.toString()}
              className={`text-stone-200 duration-300 group ${index > 0 ? 'border-t border-neutral-800' : ''}`}
            >
              <AccordionTrigger
                className="w-full py-4 text-left text-sm md:text-base cursor-pointer flex items-center justify-between"
                onClick={() => handleToggle(index)}
              >
                <span aria-label="FAQ Question Title">{faq.question}</span>
              </AccordionTrigger>
              <AccordionContent className="data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp">
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
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
