import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const getFinancialsInputSchema = z.object({
  ticker: z.string().min(1),
  data: z.string().min(1),
});

export type GetFinancialsInput = z.infer<typeof getFinancialsInputSchema>;

export const getFinancials = ({
  data,
}: {
  data: GetFinancialsInput;
}): Promise<{
  financials: Record<string, (string | number)[]>;
}> => {
  return api.post('/financials', data);
};

type UseGetFinancialsOptions = {
  mutationConfig?: MutationConfig<typeof getFinancials>;
};

export const useGetFinancials = ({
  mutationConfig,
}: UseGetFinancialsOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: getFinancials,
  });
};
