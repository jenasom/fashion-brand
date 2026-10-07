import React, { useEffect, useState } from 'react';
import { Course, Enrollment } from '../types/index';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { BookOpen, Clock, Award, CheckCircle2, Play, Lock, ArrowLeft, Star, ArrowRight } from 'lucide-react';

interface CourseDetailPageProps {
  slug: string;
  onNavigate: (route: string) => void;
}

export const CourseDetailPage: React.FC<CourseDetailPageProps> = ({ slug, onNavigate }) => {
  const { user, showToast } = useApp();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [previewVideoUrl, setPreviewVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      setIsLoading(true);
      try {
        const res = await api.getCourseBySlug(slug);
        setCourse(res.course);

        // Check if student is already enrolled
        if (user) {
          const enrollmentsRes = await api.getUserEnrollments(user.id);
          const found = enrollmentsRes.enrollments.find((e) => e.courseId === res.course.id);
          if (found) setEnrollment(found);
        }
      } catch (err) {
        console.warn('Failed to load course', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [slug, user]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-lg text-[#7A7469] animate-pulse">Consulting academy syllabus...</p>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]">Course Not Found</h2>
        <p className="text-xs text-[#7A7469]">The requested academy program is unavailable.</p>
        <button
          onClick={() => onNavigate('/academy')}
          className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold"
        >
          Return to Academy Catalog
        </button>
      </div>
    );
  }

  const handleEnroll = async () => {
    if (!user) {
      showToast('Please sign in or select an active student persona', 'error');
      return;
    }

    setIsEnrolling(true);
    try {
      // Step 1: Initialize Paystack payment intent
      const paymentInit = await api.initializePayment({
        amount: course.price,
        email: user.email,
        metadata: {
          type: 'COURSE_ENROLLMENT',
          targetId: course.id,
          userId: user.id
        }
      });

      // Step 2: Verify payment on server
      await api.verifyPayment(paymentInit.reference, {
        type: 'COURSE_ENROLLMENT',
        targetId: course.id,
        userId: user.id
      });

      // Step 3: Fetch updated enrollment and enter classroom
      const { enrollment: newEnrollment } = await api.enrollInCourse(course.id, user.id);
      setEnrollment(newEnrollment);
      showToast(`Welcome to the Atelier Academy! Enrollment confirmed for ${course.title}.`);
      onNavigate(`/student/courses/${course.id}`);
    } catch (err: any) {
      showToast(err.message || 'Enrollment failed', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Back button */}
      <button
        onClick={() => onNavigate('/academy')}
        className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-[#7A7469] hover:text-[#1A1A1A] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Academy Catalog
      </button>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#C2A676] uppercase tracking-widest font-semibold">
            <span>Level: {course.level}</span>
            <span aria-hidden="true">·</span>
            <span>{course.durationHours} Hours Dedicated Study</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-5xl text-[#1A1A1A] font-light leading-tight">
            {course.title}
          </h1>

          <p className="text-sm sm:text-base text-[#554F44] leading-relaxed">
            {course.subtitle}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-3 text-xs text-[#7A7469]">
            <div className="flex items-center gap-2">
              <img
                src={course.instructorAvatar}
                alt={course.instructorName}
                className="w-8 h-8 rounded-full object-cover border border-[#D5CEBF]"
              />
              <span className="font-medium text-[#1A1A1A]">{course.instructorName}</span>
            </div>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#C2A676] text-[#C2A676]" />
              <strong className="text-[#1A1A1A]">{course.rating.toFixed(2)}</strong> ({course.enrolledCount} enrolled students)
            </span>
          </div>
        </div>

        {/* Action Card / Sticky Preview Card */}
        <div className="lg:col-span-4 bg-[#FAF9F5] border border-[#E8E3D8] p-6 space-y-5 shadow-sm">
          <div className="aspect-video w-full overflow-hidden bg-[#DDD] relative">
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
            <button
              onClick={() => {
                const firstPreview = course.modules[0]?.lessons.find((l) => l.isFreePreview);
                if (firstPreview?.videoUrl) {
                  setPreviewVideoUrl(firstPreview.videoUrl);
                } else {
                  showToast('Preview video will play in studio player');
                }
              }}
              className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 hover:bg-white text-[#1A1A1A] flex items-center justify-center transition-transform hover:scale-110 shadow-md"
              aria-label="Play Course Trailer"
            >
              <Play className="w-5 h-5 ml-0.5 fill-[#1A1A1A]" />
            </button>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#7A7469] block">Tuition & Full Access</span>
            <div className="flex items-baseline justify-between">
              <span className="font-serif text-3xl font-normal text-[#1A1A1A] tabular-nums">
                ${course.price}
              </span>
              <span className="text-xs text-[#3F7535] font-medium">Includes Verifiable Certificate</span>
            </div>
          </div>

          {enrollment ? (
            <div className="space-y-3">
              <div className="p-3 bg-[#EBF3E8] border border-[#CDE1C7] text-xs text-[#2A5920]">
                <strong>Enrolled:</strong> You hold active tuition for this course. Progress: {enrollment.progressPercent}%
              </div>
              <button
                onClick={() => onNavigate(`/student/courses/${course.id}`)}
                className="w-full py-3.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2"
              >
                Resume Learning Studio <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnroll}
              disabled={isEnrolling}
              className="w-full py-3.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-md disabled:bg-[#888]"
            >
              {isEnrolling ? 'Authorizing Enrollment...' : `Enroll Now · $${course.price}`}
            </button>
          )}

          <div className="space-y-2 pt-2 border-t border-[#E8E3D8] text-xs text-[#666055]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>{course.modules.length} Modules · {totalLessons} Technical Lessons</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>Lifetime Access to Video Lectures & Drafting Charts</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-[#C2A676]" />
              <span>Accredited Diploma upon 100% Completion</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal if trailer preview is active */}
      {previewVideoUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#1A1A1A] w-full max-w-3xl rounded overflow-hidden">
            <div className="flex justify-between items-center p-3 text-white text-xs border-b border-[#333]">
              <span>Sample Lesson Preview: {course.title}</span>
              <button onClick={() => setPreviewVideoUrl(null)} className="text-gray-400 hover:text-white">
                ✕ Close
              </button>
            </div>
            <video src={previewVideoUrl} controls autoPlay className="w-full aspect-video bg-black" />
          </div>
        </div>
      )}

      {/* Course Detailed Description & Learning Outcomes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pt-6 border-t border-[#E8E3D8]">
        <div className="lg:col-span-8 space-y-8">
          <div>
            <h3 className="font-serif text-2xl text-[#1A1A1A] mb-3">Program Description</h3>
            <p className="text-xs sm:text-sm text-[#554F44] leading-relaxed">
              {course.description}
            </p>
          </div>

          {/* Learning Outcomes */}
          <div className="p-6 bg-[#FAF9F5] border border-[#E8E3D8] space-y-4">
            <h3 className="font-serif text-xl text-[#1A1A1A]">What You Will Master</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#554F44]">
              {course.learningOutcomes.map((outcome, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#C2A676] shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Full Curriculum Breakdown */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-2xl text-[#1A1A1A]">Curriculum & Modules</h3>
              <span className="text-xs text-[#7A7469]">
                {course.modules.length} Modules · {totalLessons} Lessons
              </span>
            </div>

            <div className="space-y-4">
              {course.modules.map((mod, modIdx) => (
                <div key={mod.id} className="bg-[#FAF9F5] border border-[#E8E3D8] rounded-xs overflow-hidden">
                  <div className="p-4 bg-[#F2EEE4] font-medium text-xs text-[#1A1A1A] flex items-center justify-between">
                    <span>
                      Module {modIdx + 1}: {mod.title}
                    </span>
                    <span className="text-[#7A7469]">{mod.lessons.length} Lessons</span>
                  </div>

                  <div className="divide-y divide-[#EBE6DC]">
                    {mod.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="p-3.5 flex items-center justify-between text-xs hover:bg-[#F9F7F2] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {lesson.isFreePreview ? (
                            <Play className="w-3.5 h-3.5 text-[#C2A676]" />
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-[#A89F90]" />
                          )}
                          <span className="text-[#333] font-medium">{lesson.title}</span>
                          {lesson.isFreePreview && (
                            <span className="text-[10px] text-[#C2A676] border border-[#C2A676]/40 px-1.5 py-0.2 rounded uppercase">
                              Free Preview
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 text-[#7A7469]">
                          <span>{lesson.durationMinutes} min</span>
                          {lesson.isFreePreview && (
                            <button
                              onClick={() => {
                                if (lesson.videoUrl) setPreviewVideoUrl(lesson.videoUrl);
                              }}
                              className="text-xs text-[#1A1A1A] font-medium underline"
                            >
                              Watch
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prerequisites */}
          <div className="space-y-2 pt-4">
            <h4 className="font-serif text-lg text-[#1A1A1A]">Studio Requirements & Prerequisites</h4>
            <ul className="space-y-1 text-xs text-[#554F44]">
              {course.prerequisites.map((p, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-[#C2A676]">·</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
