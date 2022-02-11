import supertest from 'supertest';

import { App } from '../../src/app';
const app = new App().server;

describe('Home API Test', () => {
  it('Should return main route API (Welcome)', async () => {
    const { status, body } = await supertest(app).get('/api');
    const { row } = body;

    expect(status).toBe(200);
    expect(row).toBe('Hello TypeScript');
  });
});