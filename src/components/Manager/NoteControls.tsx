import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/Dropdown';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/Tooltip';
import { Plus, ChevronDown, FolderArchive, FileInput, FileText, Layout, Trash2 } from 'lucide-react';
import CreateTemplateDialog from '@/components/Dialogs/CreateNoteTemplate';
import db, { type Template } from '@/utils/db';
import { FaMarkdown } from 'react-icons/fa';
import { toast } from 'sonner';

const NoteActions = ({ handleFileTypeChange, onOpenNote, onAddNote }) => {
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<Template[]>([]);

  const fileTypes = [
    { name: 'Rich Text', value: '.txt', icon: <FileText size={15} className="mr-1 text-stone-400" /> },
    { name: 'Markdown', value: '.md', icon: <FaMarkdown size={15} className="mr-1 text-stone-400" /> }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  // Load templates from database to show in dropdown (sorted by newest)
  const loadTemplates = async () => {
    try {
      const allTemplates = await db.templates.orderBy('createdAt').reverse().toArray();
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleCreateTemplate = async (templateData) => {
    try {
      const newTemplate = {
        // Add 'template-' prefix to differentiate between note ID's and template ID's
        id: `template-${Date.now()}`,
        name: templateData.name,
        content: templateData.content,
        createdAt: new Date(),
      };

      await db.templates.add(newTemplate);
      toast.success(`Template '${templateData.name}' created successfully!`);
      await loadTemplates();
      setIsTemplateDialogOpen(false);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleDeleteTemplate = async (templateId: string, templateData: Template) => {
    try {
      await db.templates.delete(templateId);
      await loadTemplates();
      toast.success(`Template '${templateData.name}' deleted successfully!`);
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Failed to delete template.');
    }
  };

  const handleUseTemplate = (template) => {
    onAddNote(template.content);
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2 mb-8 justify-end">
        {/* Export Notes */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              // h-8 here so buttons are correct size on mobile
              className="text-zinc-300 text-xs h-8"
              aria-label="Export All Current Notes"
              title="Export All Current Notes"
              data-vaul-no-drag
            >
              <FolderArchive size={15} /> Export Notes
              <ChevronDown size={15} className="text-stone-300/80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={5} className="bg-dark border border-neutral-800/60 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden">
            {fileTypes.map((fileTypeItem) => (
              <DropdownMenuItem
                key={fileTypeItem.value}
                className="text-zinc-300 text-sm hover:bg-dark-focus rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
                onClick={(e) => {
                  e.stopPropagation();
                  handleFileTypeChange(fileTypeItem.value);
                }}
                aria-label="File Type Export Option"
              >
                {fileTypeItem.icon}
                {fileTypeItem.name} ({fileTypeItem.value})
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Templates */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              className="text-zinc-300 text-xs"
              aria-label="Note Templates"
              title="Note Templates"
              data-vaul-no-drag
            >
              <Layout size={15} /> Templates
              <ChevronDown size={15} className="text-stone-300/80" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" side="top" sideOffset={5} className="bg-dark border border-neutral-800/60 rounded-lg shadow-2xl shadow-neutral-950 z-50 overflow-hidden min-w-64 max-w-xs md:max-w-sm">
            <DropdownMenuItem
              className="text-zinc-300 text-sm hover:bg-dark-focus rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300"
              onClick={(e) => {
                e.stopPropagation();
                setIsTemplateDialogOpen(true);
              }}
              aria-label="Create New Template"
            >
              <Plus size={15} className="mr-2 text-stone-400" />
              Create Template
            </DropdownMenuItem>

            {/* Actual template items within dropdown */}
            {templates.length > 0 && (
              <>
                <DropdownMenuSeparator className="bg-neutral-700/60" />
                {templates.map((template) => (
                  <DropdownMenuItem
                    key={template.id}
                    className="text-zinc-300 text-sm hover:bg-dark-focus rounded-md cursor-pointer duration-300 selection:bg-neutral-700 selection:text-zinc-300 py-3 relative"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(template);
                    }}
                    aria-label={`Use template: ${template.name}`}
                  >
                    <div className="flex items-start w-full max-w-sm pr-8">
                      <div className="flex-1 min-w-0">
                        {/* Template Name */}
                        <div className="font-medium truncate">
                          {template.name}
                        </div>
                        {/* Template Content */}
                        <div className="text-xs text-stone-400 mt-0.5 truncate">
                          {template.content ? template.content.slice(0, 150) : ''}
                        </div>
                      </div>
                    </div>
                    <TooltipProvider delayDuration={50}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTemplate(template.id, template);
                            }}
                            className="absolute top-2 right-1.5 p-1 text-stone-400 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-colors duration-200"
                            aria-label={`Delete template: ${template.name}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </TooltipTrigger>
                        <TooltipContent side="left" align="center" className="z-[9999]">
                          Delete Template
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* New Note */}
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="text-zinc-300 py-0"
                aria-label="Create New Note"
                data-vaul-no-drag
                onClick={(e) => {
                  e.stopPropagation();
                  onAddNote();
                }}
              >
                <Plus size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              New Note
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Import Note */}
        <TooltipProvider delayDuration={50}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                className="text-zinc-300"
                aria-label="Open Note"
                data-vaul-no-drag
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenNote();
                }}
              >
                <FileInput size={18} />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Import Note
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <CreateTemplateDialog
        isOpen={isTemplateDialogOpen}
        onConfirm={handleCreateTemplate}
        onCancel={() => setIsTemplateDialogOpen(false)}
      />
    </>
  );
};

export default NoteActions;
