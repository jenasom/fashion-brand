import { requireOwner } from './authRoutes.js';
import { Router, Request, Response } from 'express';
import { store } from '../db/store.js';

export const tutoringRouter = Router();

tutoringRouter.get('/tutoring/instructors', (_req: Request, res: Response): void => {
  const instructors = store.getInstructors();
  res.json({ instructors });
});

tutoringRouter.get('/tutoring/instructors/:id', (req: Request, res: Response): void => {
  const { id } = req.params;
  const instructor = store.getInstructorById(id);
  if (!instructor) {
    res.status(404).json({ error: 'Instructor not found' });
    return;
  }
  res.json({ instructor });
});

tutoringRouter.get('/tutoring/bookings/student/:studentId', requireOwner('studentId'), (req: Request, res: Response): void => {
  const { studentId } = req.params;
  const bookings = store.getBookingsByStudent(studentId);
  res.json({ bookings });
});

tutoringRouter.get('/tutoring/bookings/instructor/:instructorId', (req: Request, res: Response): void => {
  const { instructorId } = req.params;
  const bookings = store.getBookingsByInstructor(instructorId);
  res.json({ bookings });
});

tutoringRouter.post('/tutoring/bookings', requireOwner('studentId'), async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, instructorId, date, startTime, endTime, topic, notes } = req.body;

    if (!studentId || !instructorId || !date || !startTime || !endTime || !topic) {
      res.status(400).json({ error: 'Missing mandatory booking parameters' });
      return;
    }

    const result = await store.createTutoringBooking({
      studentId,
      instructorId,
      date,
      startTime,
      endTime,
      topic,
      notes
    });

    if (!result.success) {
      res.status(409).json({ error: result.error });
      return;
    }

    res.json({ booking: result.booking });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
