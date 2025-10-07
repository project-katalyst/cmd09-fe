import { randProductCategory, randSentence } from '@ngneat/falso';
import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { networkDelay } from '../utils';

export const tagsHandlers = [
  http.post(`${env.API_URL}/tags`, async () => {
    await networkDelay();

    try {
      const tags: Record<string, string[]> = {};
      const numTags = 5;
      for (let i = 1; i <= numTags; i++) {
        const numCategories = 5;
        tags[`tag${i}`] = Array.from({ length: numCategories }, () =>
          randProductCategory(),
        );
      }
      return HttpResponse.json({
        tags: tags,
        summary: randSentence(),
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
