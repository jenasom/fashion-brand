import { requireOwner } from './authRoutes';
import { Router, Request, Response } from 'express';
import { store } from '../db/store';

export const academyRouter = Router();

academyRouter.get('/academy/courses', (_req: Request, res: Response): void => {
  const courses = store.getAllCourses();
  res.json({ courses });
});

academyRouter.get('/academy/courses/:slug', (req: Request, res: Response): void => {
  const { slug } = req.params;
  const course = store.getCourseBySlug(slug);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }
  const reviews = store.getReviewsByCourse(course.id);
  res.json({ course, reviews });
});

academyRouter.get('/academy/student/enrollments/:userId', requireOwner('userId'), (req: Request, res: Response): void => {
  const { userId } = req.params;
  const enrollments = store.getUserEnrollments(userId);
  res.json({ enrollments });
});

academyRouter.get('/academy/student/courses/:courseId/progress/:userId', requireOwner('userId'), (req: Request, res: Response): void => {
  const { courseId, userId } = req.params;
  const course = store.getCourseById(courseId);
  if (!course) {
    res.status(404).json({ error: 'Course not found' });
    return;
  }

  const enrollment = store.getEnrollment(userId, courseId);
  const lessonProgressMap: Record<string, boolean> = {};

  course.modules.forEach((mod) => {
    mod.lessons.forEach((les) => {
      lessonProgressMap[les.id] = store.isLessonCompleted(userId, les.id);
    });
  });

  res.json({
    course,
    enrollment,
    lessonProgress: lessonProgressMap
  });
});

academyRouter.post('/academy/student/lessons/:lessonId/progress', requireOwner('userId'), (req: Request, res: Response): void => {
  const { lessonId } = req.params;
  const { userId, courseId, isCompleted } = req.body;

  if (!userId || !courseId) {
    res.status(400).json({ error: 'userId and courseId required' });
    return;
  }

  try {
    const result = store.recordLessonProgress(userId, courseId, lessonId, isCompleted ?? true);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

academyRouter.post('/academy/courses/:id/enroll', requireOwner('userId'), (req: Request, res: Response): void => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'userId required' });
    return;
  }

  try {
    const enrollment = store.enrollUser(userId, id);
    res.json({ enrollment });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Classes
academyRouter.get('/academy/classes', (_req: Request, res: Response): void => {
  const classes = store.getUpcomingClasses();
  res.json({ classes });
});

academyRouter.post('/academy/classes/:id/register', requireOwner('userId'), (req: Request, res: Response): void => {
  const { id } = req.params;
  const { userId } = req.body;

  if (!userId) {
    res.status(400).json({ error: 'userId required' });
    return;
  }

  const result = store.registerForClass(userId, id);
  if (!result.success) {
    res.status(400).json({ error: result.error });
    return;
  }

  res.json(result);
});
