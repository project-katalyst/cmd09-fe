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

import { useGetTags } from '../api/get-tags';

export function InputForm() {
  const navigate = useNavigate();

  const getTagsMutation = useGetTags({
    mutationConfig: {
      onSuccess: (data) => {
        const formData = form.getValues();
        const rankingInput = {
          tags: data.tags,
          ebitda: formData.ebitda,
        };

        sessionStorage.setItem('rankingInput', JSON.stringify(rankingInput));
        sessionStorage.removeItem('rankingResult');

        navigate('/ranking');
      },
      onError: (error) => {
        console.error('Error getting tags:', error);
      },
    },
  });

  const formInputSchema = z.object({
    url: z.url({ message: 'URL inválida' }),
    ebitda: z
      .number({ message: 'EBITDA inválido' })
      .min(-10000000000, { message: 'Valor muito baixo' })
      .max(100000000000, { message: 'Valor muito alto' }),
  });

  const form = useForm<z.infer<typeof formInputSchema>>({
    resolver: zodResolver(formInputSchema),
    defaultValues: {
      url: '',
      ebitda: undefined,
    },
  });

  function onSubmit(data: z.infer<typeof formInputSchema>) {
    getTagsMutation.mutate({
      url: data.url,
    });
  }

  function onError(errors: FieldErrors<z.infer<typeof formInputSchema>>) {
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
          isLoading={getTagsMutation.isPending}
          isAnimated
        >
          Enviar
        </Button>
      </form>
    </Form>
  );
}
