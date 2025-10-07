import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { XIcon } from '@/components/ui/badge/x-icon';
import { Button } from '@/components/ui/button';

interface BusinessCategorizationPromptProps {
  tagList: string[];
  onConfirm: (tags: string[]) => void;
}

export const BusinessCategorizationPrompt = ({
  tagList,
  onConfirm,
}: BusinessCategorizationPromptProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tags, setTags] = useState(tagList);

  const handleRemoveTag = (tagToRemove: string) => {
    if (tags.length > 1) {
      setTags(tags.filter((tag) => tag !== tagToRemove));
    }
  };

  return (
    <div className="bg-glass mx-auto flex max-w-4xl flex-col items-center gap-4 rounded-3xl p-8 text-center shadow-sm backdrop-blur-[30px]">
      <div className="flex flex-col items-center gap-8">
        <h2 className="text-h1 text-center font-bold tracking-tight">
          Confirme o ramo da sua empresa
        </h2>
        <p className="text-title2 text-balance text-center text-muted-foreground">
          Avaliamos a sua empresa baseado na URL fornecida. Por favor, revise e
          confirme para ver o ranking completo
        </p>
      </div>
      <div className="my-8 flex min-h-[60px] flex-wrap justify-center gap-4">
        <AnimatePresence>
          {tags.map((tag: string) => (
            <motion.div
              key={tag}
              layout
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 25,
              }}
            >
              <Badge
                variant="secondary"
                className="relative px-6 py-3 text-base"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  disabled={tags.length === 1}
                  aria-label={`Remove ${tag}`}
                  className={`absolute -right-2 -top-2 transition-all duration-300 ease-in-out disabled:cursor-not-allowed disabled:opacity-50 ${
                    isEditing ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
                  }`}
                >
                  <XIcon />
                </button>
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex space-x-8">
        <Button onClick={() => onConfirm(tags)}>Accept</Button>
        <Button variant="secondary" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Done' : 'Modify Categories'}
        </Button>
      </div>
    </div>
  );
};
