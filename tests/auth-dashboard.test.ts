import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import express from 'express';
import { createServer, Server } from 'node:http';
import { authRouter } from '../server/routes/authRoutes';
import { adminRouter } from '../server/routes/adminRoutes';
import { academyRouter } from '../server/routes/academyRoutes';

let server: Server;
let base: string;
beforeAll(async () => {
  const app = express(); app.use(express.json()); app.use('/api', authRouter); app.use('/api', adminRouter); app.use('/api', academyRouter);
  server = createServer(app);
  await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const address = server.address();
  base = `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}/api`;
});
afterAll(async () => { await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve())); });
const request = (path: string, token?: string, body?: unknown, method?: string) => fetch(base + path, { method: method || (body ? 'POST' : 'GET'), headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, ...(body ? { body: JSON.stringify(body) } : {}) });
const login = async (email: string) => { const response = await request('/login', undefined, { email, password: 'AtelierDemo26!' }); expect(response.status).toBe(200); return response.json(); };
describe('Demo login and role dashboards', () => {
  it('rejects anonymous and invalid sessions without an admin fallback', async () => {
    expect((await request('/me')).status).toBe(401);
    expect((await request('/me', 'invalid-token')).status).toBe(401);
    expect((await request('/admin/metrics')).status).toBe(401);
    expect((await request('/dashboard/admin')).status).toBe(401);
  });
  it('rejects incorrect passwords and passwordless role switching', async () => {
    expect((await request('/login', undefined, { email: 'admin@atelierofficial.com', password: 'wrong' })).status).toBe(401);
    expect((await request('/switch-persona', undefined, { userId: 'usr_admin_1' })).status).toBe(403);
    expect((await request('/register', undefined, { roles: ['ADMIN'] })).status).toBe(403);
  });
  it.each([
    ['customer@atelierofficial.com', 'customer'],
    ['student@atelierofficial.com', 'student'],
    ['folashade@atelierofficial.com', 'instructor'],
    ['admin@atelierofficial.com', 'admin']
  ])('signs in %s and loads the %s dashboard', async (email, role) => {
    const { token, user } = await login(email);
    const me = await (await request('/me', token)).json(); expect(me.user.id).toBe(user.id);
    const response = await request('/dashboard/' + role, token); expect(response.status).toBe(200);
    const data = await response.json(); expect(data.role).toBe(role.toUpperCase());
    if (role === 'customer') expect(data.orders.every((order: any) => order.userId === user.id)).toBe(true);
    if (role === 'student') { expect(data.enrollments.length).toBeGreaterThan(0); expect(data.enrollments.every((e: any) => e.userId === user.id)).toBe(true); }
    if (role === 'instructor') { expect(data.instructor.userId).toBe(user.id); expect(data.courses.every((c: any) => c.instructorId === data.instructor.id)).toBe(true); expect(data.classes.every((c: any) => c.instructorId === data.instructor.id)).toBe(true); }
  });
  it('denies cross-role access and another student records', async () => {
    const { token } = await login('customer@atelierofficial.com');
    for (const path of ['/dashboard/admin', '/dashboard/instructor', '/dashboard/student', '/admin/metrics', '/academy/student/enrollments/usr_student_1']) expect((await request(path, token)).status).toBe(403);
  });
  it('allows composite roles without sharing another account data', async () => {
    const { token } = await login('student@atelierofficial.com');
    expect((await request('/dashboard/customer', token)).status).toBe(200);
    expect((await request('/dashboard/admin', token)).status).toBe(403);
  });
  it('rejects instructor edits to a class they do not own', async () => {
    const { token } = await login('folashade@atelierofficial.com');
    expect((await request('/dashboard/classes/not-owned', token, { status: 'COMPLETED' }, 'PATCH')).status).toBe(403);
  });
  it('revokes a session at logout', async () => {
    const { token } = await login('customer@atelierofficial.com');
    expect((await request('/logout', token, {}, 'POST')).status).toBe(200);
    expect((await request('/me', token)).status).toBe(401);
    expect((await request('/dashboard/customer', token)).status).toBe(401);
  });
});
