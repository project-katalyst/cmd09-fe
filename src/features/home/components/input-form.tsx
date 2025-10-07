import { zodResolver } from '@hookform/resolvers/zod';
import { FieldErrors, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@/components/ui/form/form';
import { Input } from '@/components/ui/input';

import {
  createRankingInputSchema,
  useCreateRanking,
} from '../api/create-ranking';

export function InputForm() {
  const navigate = useNavigate();

  const createRankingMutation = useCreateRanking({
    mutationConfig: {
      onSuccess: (data) => {
        navigate('/ranking', { state: data });
      },
    },
  });

  const form = useForm<z.infer<typeof createRankingInputSchema>>({
    resolver: zodResolver(createRankingInputSchema),
    defaultValues: {
      url: '',
      ebitda: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof createRankingInputSchema>) {
    createRankingMutation.mutate({ data });
  }

  function onError(
    errors: FieldErrors<z.infer<typeof createRankingInputSchema>>,
  ) {
    if (errors.url) {
      toast.error(errors.url.message || 'URL inválida', {
        id: 'url-error',
      });
    } else if (errors.ebitda) {
      toast.error(errors.ebitda.message || 'EBITDA inválido', {
        id: 'ebitda-error',
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, onError)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder="Digite a URL da sua empresa" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ebitda"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Digite o EBITDA da sua empresa"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? undefined : Number(value));
                  }}
                  value={field.value ?? ''}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="w-full rounded-full"
          isLoading={createRankingMutation.isPending}
          isAnimated
        >
          Enviar
        </Button>
      </form>
    </Form>
  );
}
