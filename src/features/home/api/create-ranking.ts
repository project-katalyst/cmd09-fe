import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Ranking } from '@/types/api';

export const createRankingInputSchema = z.object({
  url: z.url({ message: 'URL inválida' }),
  ebitda: z
    .number({ message: 'EBITDA inválido' })
    .min(-10000000000, { message: 'Valor muito baixo' })
    .max(100000000000, { message: 'Valor muito alto' }),
});

export type CreateRankingInput = z.infer<typeof createRankingInputSchema>;

export const createRanking = ({
  data,
}: {
  data: CreateRankingInput;
}): Promise<Ranking> => {
  return api.post('/home', data);
};

type UseCreateRankingOptions = {
  mutationConfig?: MutationConfig<typeof createRanking>;
};

export const useCreateRanking = ({
  mutationConfig,
}: UseCreateRankingOptions) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: createRanking,
  });
};
