import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { useSlashCommands } from '@/hooks/use-slash-commands';
import { Plus, Layout, X, Info } from 'lucide-react';
import Link from 'next/link';

const CreateTemplateDialog = ({ isOpen, onConfirm, onCancel }) => {
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const { textareaRef, handleChange } = useSlashCommands(templateContent, setTemplateContent);

  const templateDialogTitle = 'Create Note Template';
  const templateDialogDescription = `Create a reusable template to use as a starting point for your notes.`;

  const templateNameTitle = 'Template Name';
  const templateContentTitle = 'Template Content';

  const slashHintText = 'Slash commands are also supported here.';
  const slashHintLink = { href: 'https://docs.notetxt.xyz/main/slash-commands', label: 'View commands' };

  const handleConfirm = () => {
    if (templateName.trim() && templateContent.trim()) {
      onConfirm({
        name: templateName.trim(),
        content: templateContent.trim(),
      });
      setTemplateName('');
      setTemplateContent('');
    }
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="bg-dark border border-neutral-700/60 p-6 rounded-lg shadow-2xl shadow-neutral-950 max-w-2xl w-11/12 z-50">
        <DialogTitle
          className="text-lg font-medium text-zinc-100 mx-0.5 gap-1 pb-1 flex items-center"
          aria-label="Create Template Dialog Title"
        >
          <Layout size={20} className="text-stone-300/85" />
          {templateDialogTitle}
        </DialogTitle>
        <DialogDescription
          className="text-stone-300/85 text-sm leading-normal mx-0.5 -mt-0.5"
          aria-label="Create Template Dialog Description"
        >
          {templateDialogDescription}
        </DialogDescription>

        <div className="space-y-4 mt-4">
          {/* Template Name Input */}
          <div className="space-y-2">
            <Label htmlFor="template-name" className="text-zinc-200 text-sm font-medium" aria-label="Template Name Title">
              {templateNameTitle}
            </Label>
            <Input
              id="template-name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Enter template name..."
              className="text-base w-full px-3 py-3 rounded-lg bg-dark-secondary placeholder:text-stone-400/80 text-zinc-300 outline-none border border-neutral-700/60 focus:border-neutral-700 duration-300 mb-4"
              aria-label="Template Name"
            />
          </div>

          {/* Template Content Input */}
          <div className="space-y-2">
            <Label htmlFor="template-content" className="text-zinc-200 text-sm font-medium" aria-label="Template Content Title">
              {templateContentTitle}
            </Label>
            <textarea
              id="template-content"
              value={templateContent}
              placeholder="Start typing here..."
              rows={10}
              ref={textareaRef}
              onChange={handleChange}
              className="w-full bg-dark-secondary rounded-md px-3 py-2 text-stone-200/90 placeholder:text-stone-400 border border-neutral-700/60 focus:border-neutral-700 outline-none font-mono text-sm resize-none duration-300"
              aria-label="Template Content"
            />
            <Link
              href={slashHintLink.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary-text hover:text-primary-text/80 duration-300 flex items-center decoration-1 decoration-primary-text underline underline-offset-2"
            >
              <Info size={14} className="mr-1" /> {slashHintText}
            </Link>
          </div>
        </div>

        <div className="flex justify-end items-center">
          <div className="text-zinc-100 flex space-x-2 mt-5 md:mt-3.5">
            <Button 
              size="sm" 
              onClick={handleCancel} 
              className="px-4 border-neutral-700/60" 
              aria-label="Cancel"
            >
              Cancel
            </Button>

            <Button
              size="sm"
              variant="primary"
              className="px-3 md:px-4 text-sm md:text-base"
              onClick={handleConfirm}
              disabled={!templateName.trim() || !templateContent.trim()}
              aria-label="Create Template"
            >
              <Plus size={15} /> Create Template
            </Button>
          </div>
        </div>
        <DialogClose className="absolute top-4 right-2 text-sm text-zinc-300 hover:text-zinc-400 font-semibold duration-300 px-1 py-0.5 mr-1" aria-label="Close Dialog">
          <X size={20} />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;
