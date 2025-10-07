import { HttpResponse, http } from 'msw';

import { env } from '@/config/env';

import { networkDelay } from '../utils';

import { scoresHandlers } from './scores';
import { tagsHandlers } from './tags';

export const handlers = [
  ...scoresHandlers,
  ...tagsHandlers,
  http.get(`${env.API_URL}/healthcheck`, async () => {
    await networkDelay();
    return HttpResponse.json({ ok: true });
  }),
];
