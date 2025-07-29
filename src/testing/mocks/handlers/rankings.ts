import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';
import { createRanking } from '@/testing/data-generators';

import { db, persistDb } from '../db';
import { networkDelay } from '../utils';

export const rankingsHandlers = [
  http.post(`${env.API_URL}/home`, async ({ request }) => {
    await networkDelay();

    try {
      const url = await request.json();
      const ranking = createRanking(url && typeof url === 'object' ? url : {});
      const result = db.ranking.create({
        ...ranking,
        createdAt: String(ranking.createdAt),
      });
      await persistDb('ranking');
      return HttpResponse.json(result);
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
