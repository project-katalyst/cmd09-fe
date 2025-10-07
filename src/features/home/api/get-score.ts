// src/features/home/api/get-scores.ts

import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Business } from '@/types/api';

export const getScoresInputSchema = z.object({
  tags: z.record(z.string(), z.array(z.string())),
  ebitda: z.number(),
});

export type GetScoresInput = z.infer<typeof getScoresInputSchema>;

export const getScores = ({
  data,
}: {
  data: GetScoresInput;
}): Promise<{
  Scores: Business[];
  'Deal Size': number;
}> => {
  return api.post('/scores', data);
};

type UseGetScoresOptions = {
  mutationConfig?: MutationConfig<typeof getScores>;
};

export const useGetScores = ({ mutationConfig }: UseGetScoresOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: getScores,
  });
};
