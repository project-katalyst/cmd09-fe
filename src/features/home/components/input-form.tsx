'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
        navigate('/ranking', { state: data.businesses });
      },
    },
  });

  const form = useForm<z.infer<typeof createRankingInputSchema>>({
    resolver: zodResolver(createRankingInputSchema),
    defaultValues: {
      url: '',
    },
  });

  function onSubmit(data: z.infer<typeof createRankingInputSchema>) {
    createRankingMutation.mutate({ data });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
        <Button type="submit" isLoading={createRankingMutation.isPending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
