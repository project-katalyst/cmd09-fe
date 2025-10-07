import { useMutation } from '@tanstack/react-query';
import z from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';

export const getTagsInputSchema = z.object({
  url: z.url(),
});

export type GetTagsInput = z.infer<typeof getTagsInputSchema>;

export const getTags = ({
  url,
}: GetTagsInput): Promise<{
  tags: Record<string, string[]>;
  summary: string;
}> => {
  return api.post('/tags', { url });
};
type UseGetTagsOptions = {
  mutationConfig?: MutationConfig<typeof getTags>;
};

export const useGetTags = ({ mutationConfig }: UseGetTagsOptions = {}) => {
  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation({
    onSuccess: (...args) => {
      onSuccess?.(...args);
    },
    ...restConfig,
    mutationFn: getTags,
  });
};
