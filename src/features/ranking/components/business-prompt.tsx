import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface BusinessCategorizationPromptProps {
  tagList: string[];
  onConfirm: () => void;
}

export const BusinessCategorizationPrompt = ({
  tagList,
  onConfirm,
}: BusinessCategorizationPromptProps) => {
  return (
    <div className="bg-glass mx-auto flex max-w-6xl flex-col items-center gap-4 rounded-3xl p-8 text-center shadow-sm backdrop-blur-[30px]">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8">
        <h2 className="text-h1 text-center font-bold tracking-tight">
          Confirme o ramo da sua empresa
        </h2>
        <p className="text-title2 text-balance text-center text-muted-foreground">
          Avaliamos a sua empresa baseado na URL fornecida. Por favor, revise e
          confirme para ver o ranking completo
        </p>
      </div>
      <div className="m-8 flex flex-nowrap justify-center space-x-3">
        {tagList.map((tag: string) => (
          <Badge key={tag} variant="secondary" className="px-6 py-3 text-base">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="flex space-x-8">
        <Button onClick={onConfirm}>Accept</Button>
        <Button variant="secondary">Modify Categories</Button>
      </div>
    </div>
  );
};
