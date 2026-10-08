import { afterAll, beforeAll, expect, it } from 'vitest';
import { createServer, Server } from 'node:http';
import app from '../api/index';
let server: Server;
let base: string;
beforeAll(async () => {
  server = createServer(app);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address() as { port: number };
  base = `http://127.0.0.1:${address.port}`;
});
afterAll(async () => { await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve())); });
it('serves health, login, session restoration, and each dashboard from the deployed handler', async () => {
  expect((await fetch(base+'/api/health')).status).toBe(200);
  for (const [email, role] of [['customer@atelierofficial.com','customer'],['student@atelierofficial.com','student'],['folashade@atelierofficial.com','instructor'],['admin@atelierofficial.com','admin']]) {
    const response = await fetch(base+'/api/login', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({email,password:'AtelierDemo26!'}) });
    expect(response.status).toBe(200);
    const { token } = await response.json();
    const headers = { Authorization:'Bearer '+token };
    expect((await fetch(base+'/api/me',{headers})).status).toBe(200);
    expect((await fetch(base+'/api/dashboard/'+role,{headers})).status).toBe(200);
  }
});
it('returns JSON for unknown API endpoints rather than frontend HTML', async () => {
  const response = await fetch(base+'/api/missing');
  expect(response.status).toBe(404);
  expect(response.headers.get('content-type')).toContain('application/json');
});
