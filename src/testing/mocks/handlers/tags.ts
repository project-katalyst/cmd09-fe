import { randProductCategory, randSentence } from '@ngneat/falso';
import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { networkDelay } from '../utils';

export const tagsHandlers = [
  http.post(`${env.API_URL}/tags`, async () => {
    await networkDelay();

    try {
      return HttpResponse.json({
        tags: {
          categories: Array.from({ length: 5 }, () => randProductCategory()),
        },
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
