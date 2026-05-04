import { http, HttpResponse, delay } from 'msw';
import { SEED_LOGS } from '../data/seed';

let logs = [...SEED_LOGS];

export const handlers = [
  // Logs
  http.get('/api/logs', async () => {
    await delay(100);
    return HttpResponse.json({ data: logs });
  }),
];