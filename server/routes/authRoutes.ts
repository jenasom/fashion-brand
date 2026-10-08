import { createDemoSessions } from '../services/demoSessions.js';
﻿import { Router, Request, Response, NextFunction } from 'express';
import { scryptSync, timingSafeEqual } from 'node:crypto';
import { z } from 'zod';
import { store } from '../db/store.js';
import { UserRole } from '../../src/types/index.js';

export const authRouter = Router();

// Public demonstration credentials, not production accounts.
const demoIds = new Set(['usr_customer_1', 'usr_student_1', 'usr_instructor_1', 'usr_instructor_2', 'usr_instructor_3', 'usr_admin_1']);
const demoHash = scryptSync('AtelierDemo26!', 'atelier-local-demo', 64);
const sessions = createDemoSessions(process.env.SESSION_SECRET || demoHash.toString('hex'));
export function sessionUser(req: Request) {
  const token = req.headers.authorization?.replace(/^Bearer /, '') || '';
  const session = sessions.read(token);
  if (!session || !demoIds.has(session.userId)) return undefined;
  return store.getUserById(session.userId);
}
export function requireRole(role: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = sessionUser(req);
    if (!user) { res.status(401).json({ error: 'Please sign in.' }); return; }
    if (!user.roles.includes(role)) { res.status(403).json({ error: 'This area is not available for your role.' }); return; }
    next();
  };
}
const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1).max(128) });
authRouter.post('/login', (req, res): void => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Enter a valid email and password.' }); return; }
  const user = store.getUserByEmail(parsed.data.email.trim().toLowerCase());
  const valid = timingSafeEqual(scryptSync(parsed.data.password, 'atelier-local-demo', 64), demoHash);
  if (!user || !demoIds.has(user.id) || !valid) { res.status(401).json({ error: 'The email or password is incorrect.' }); return; }
  const token = sessions.issue(user.id);
  res.json({ user, token });
});
authRouter.get('/me', (req, res): void => {
  const user = sessionUser(req);
  if (!user) { res.status(401).json({ error: 'Please sign in.' }); return; }
  res.json({ user });
});
authRouter.post('/logout', (req, res) => {
  sessions.revoke(req.headers.authorization?.replace(/^Bearer /, '') || '');
  res.json({ success: true });
});
// The former passwordless persona switch and public role registration are disabled.
authRouter.post(['/switch-persona', '/register'], (_req, res) => { res.status(403).json({ error: 'Use a demo account on the sign-in page.' }); });
authRouter.post('/update-profile', (req, res): void => {
  const user = sessionUser(req);
  if (!user) { res.status(401).json({ error: 'Please sign in.' }); return; }
  const parsed = z.object({ name: z.string().min(2).max(100), phone: z.string().max(40).optional(), bio: z.string().max(1000).optional() }).safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: 'Please check your profile details.' }); return; }
  res.json({ user: store.updateUser(user.id, parsed.data) });
});
authRouter.get('/dashboard/:role', (req, res): void => {
  const user = sessionUser(req);
  if (!user) { res.status(401).json({ error: 'Please sign in.' }); return; }
  const parsed = z.enum(['CUSTOMER', 'STUDENT', 'INSTRUCTOR', 'ADMIN']).safeParse(req.params.role.toUpperCase());
  if (!parsed.success || !user.roles.includes(parsed.data)) { res.status(403).json({ error: 'This dashboard is not available for your role.' }); return; }
  const role = parsed.data;
  const instructor = store.getInstructors().find(i => i.userId === user.id);
  const courses = role === 'INSTRUCTOR' ? store.getAllCoursesAdmin().filter(c => c.instructorId === instructor?.id) : [];
  const classes = store.getUpcomingClasses().filter(c => role === 'INSTRUCTOR' ? c.instructorId === instructor?.id : c.enrolledUserIds.includes(user.id));
  res.json({
    role,
    orders: role === 'ADMIN' ? store.getAllOrdersAdmin() : role === 'CUSTOMER' ? store.getOrdersByUser(user.id) : [],
    enrollments: role === 'STUDENT' ? store.getUserEnrollments(user.id) : [],
    certificates: role === 'STUDENT' ? store.getUserCertificates(user.id) : [],
    bookings: role === 'INSTRUCTOR' ? instructor ? store.getBookingsByInstructor(instructor.id) : [] : role === 'STUDENT' || role === 'CUSTOMER' ? store.getBookingsByStudent(user.id) : [],
    courses, classes: role === 'STUDENT' || role === 'INSTRUCTOR' ? classes : [],
    notifications: store.getUserNotifications(user.id),
    metrics: role === 'ADMIN' ? store.getAdminMetrics() : null,
    instructor: role === 'INSTRUCTOR' ? instructor || null : null
  });
});
authRouter.patch('/dashboard/classes/:id', requireRole('INSTRUCTOR'), (req, res): void => {
  const user = sessionUser(req)!;
  const instructor = store.getInstructors().find(i => i.userId === user.id);
  const session = store.getClassById(req.params.id);
  if (!session || session.instructorId !== instructor?.id) { res.status(403).json({ error: 'You can only manage your own classes.' }); return; }
  const parsed = z.object({ status: z.enum(['COMPLETED', 'CANCELLED']) }).safeParse(req.body);
  if (!parsed.success || session.status === 'COMPLETED' || session.status === 'CANCELLED') { res.status(400).json({ error: 'This class cannot be updated.' }); return; }
  const updated = store.saveClass({ ...session, status: parsed.data.status });
  res.json({ session: updated });
});

export function requireOwner(param: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = sessionUser(req);
    if (!user) { res.status(401).json({ error: 'Please sign in.' }); return; }
    const target = req.params[param] || req.body?.[param];
    if (target !== user.id && !user.roles.includes('ADMIN')) { res.status(403).json({ error: 'This record belongs to another account.' }); return; }
    next();
  };
}
