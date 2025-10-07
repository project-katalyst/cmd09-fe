import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';
import { createRanking } from '@/testing/data-generators';

import { db, persistDb } from '../db';
import { networkDelay } from '../utils';

export const scoresHandlers = [
  http.post(`${env.API_URL}/scores`, async ({ request }) => {
    await networkDelay();

    try {
      const data = await request.json();
      const ranking = createRanking(
        data && typeof data === 'object' ? data : {},
      );
      const result = db.ranking.create({
        ...ranking,
        createdAt: String(ranking.createdAt),
      });
      await persistDb('ranking');
      return HttpResponse.json({
        Scores: result.businesses,
        'Deal Size': result.dealSize,
      });
    } catch (error: any) {
      return HttpResponse.json(
        { message: error?.message || 'Server Error' },
        { status: 500 },
      );
    }
  }),
];
