import React, { useEffect, useState } from 'react';
import { Course, Lesson, Enrollment, Certificate } from '../types/index';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Play, Download, ArrowLeft, ArrowRight, Award, FileText, Check } from 'lucide-react';

interface LessonViewerPageProps {
  courseId: string;
  lessonId?: string;
  onNavigate: (route: string) => void;
}

export const LessonViewerPage: React.FC<LessonViewerPageProps> = ({ courseId, lessonId, onNavigate }) => {
  const { user, showToast } = useApp();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, boolean>>({});
  const [newCertificate, setNewCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);

  const studentId = user?.id || 'usr_student_1';

  useEffect(() => {
    const fetchProgress = async () => {
      setIsLoading(true);
      try {
        const res = await api.getCourseProgress(courseId, studentId);
        setCourse(res.course);
        setEnrollment(res.enrollment);
        setLessonProgress(res.lessonProgress);

        // Find initial active lesson
        let targetLesson: Lesson | null = null;
        if (lessonId) {
          for (const m of res.course.modules) {
            const found = m.lessons.find((l) => l.id === lessonId);
            if (found) {
              targetLesson = found;
              break;
            }
          }
        }

        if (!targetLesson && res.course.modules.length > 0) {
          targetLesson = res.course.modules[0].lessons[0] || null;
        }

        setActiveLesson(targetLesson);
      } catch (err) {
        console.warn('Failed to load lesson room', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProgress();
  }, [courseId, lessonId, studentId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-lg text-[#7A7469] animate-pulse">Entering technical atelier studio...</p>
      </div>
    );
  }

  if (!course || !activeLesson) {
    return (
      <div className="max-w-md mx-auto py-20 text-center space-y-4">
        <h2 className="font-serif text-2xl text-[#1A1A1A]">Lesson Room Not Available</h2>
        <button
          onClick={() => onNavigate('/student')}
          className="px-5 py-2.5 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider font-semibold"
        >
          Return to Student Studio
        </button>
      </div>
    );
  }

  const isCurrentLessonCompleted = !!lessonProgress[activeLesson.id];

  const handleToggleComplete = async () => {
    setIsUpdatingProgress(true);
    try {
      const nextState = !isCurrentLessonCompleted;
      const res = await api.markLessonProgress(activeLesson.id, studentId, course.id, nextState);
      setEnrollment(res.enrollment);
      setLessonProgress((prev) => ({ ...prev, [activeLesson.id]: nextState }));

      if (res.certificate) {
        setNewCertificate(res.certificate);
        showToast('🎓 Congratulations! Course 100% completed. Official diploma minted!');
      } else {
        showToast(nextState ? 'Lesson completed!' : 'Lesson marked as uncompleted', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update progress', 'error');
    } finally {
      setIsUpdatingProgress(false);
    }
  };

  // Find next lesson
  let nextLesson: Lesson | null = null;
  let allLessons: Lesson[] = [];
  course.modules.forEach((m) => {
    m.lessons.forEach((l) => allLessons.push(l));
  });
  const currentIdx = allLessons.findIndex((l) => l.id === activeLesson.id);
  if (currentIdx > -1 && currentIdx < allLessons.length - 1) {
    nextLesson = allLessons[currentIdx + 1];
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Breadcrumb Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3D8] pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/student')}
            className="p-1.5 text-[#7A7469] hover:text-[#1A1A1A] rounded hover:bg-[#EFECE4]"
            title="Back to Studio Desk"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#8C7A54] font-semibold block">
              {course.title}
            </span>
            <h1 className="font-serif text-xl sm:text-2xl text-[#1A1A1A]">
              {activeLesson.title}
            </h1>
          </div>
        </div>

        {/* Progress Header */}
        <div className="flex items-center gap-4 text-xs">
          <div>
            <span className="text-[10px] text-[#7A7469] block">Course Mastery</span>
            <span className="font-serif text-lg font-medium text-[#1A1A1A] tabular-nums">
              {enrollment?.progressPercent || 0}% Complete
            </span>
          </div>
          {enrollment?.isCompleted && (
            <span className="px-2.5 py-1 bg-[#EBF3E8] text-[#2A5920] rounded text-xs font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Graduated
            </span>
          )}
        </div>
      </div>

      {/* Graduation Certificate Alert Banner */}
      {newCertificate && (
        <div className="p-6 bg-[#FAF6EE] border border-[#C2A676] rounded flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#C2A676] text-white flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl text-[#1A1A1A]">Diploma of Mastery Minted!</h3>
              <p className="text-xs text-[#554F44]">
                You have finished all technical units in {course.title}. Your credential ID is {newCertificate.certificateCode}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate(`/certificates/${newCertificate.certificateCode}`)}
            className="px-5 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-wider font-semibold shrink-0"
          >
            View Official Credential
          </button>
        </div>
      )}

      {/* Workspace Grid: Video & Notes (8 cols) + Syllabus Navigator (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Lesson Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Video Player */}
          <div className="aspect-video w-full bg-black rounded overflow-hidden shadow-lg border border-[#333]">
            {activeLesson.videoUrl ? (
              <video
                key={activeLesson.videoUrl}
                src={activeLesson.videoUrl}
                controls
                className="w-full h-full object-contain"
                poster={course.thumbnail}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white/50 text-xs">
                Studio demonstration lecture stream
              </div>
            )}
          </div>

          {/* Action Row: Complete Toggle & Next Lesson */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-[#FAF9F5] border border-[#E8E3D8] rounded">
            <button
              onClick={handleToggleComplete}
              disabled={isUpdatingProgress}
              className={`px-5 py-2.5 rounded text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 transition-all ${
                isCurrentLessonCompleted
                  ? 'bg-[#3F7535] text-white'
                  : 'bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isCurrentLessonCompleted ? 'Unit Completed (Click to Undo)' : 'Mark Unit as Completed'}
            </button>

            {nextLesson && (
              <button
                onClick={() => setActiveLesson(nextLesson)}
                className="px-4 py-2 border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-1.5"
              >
                Next Unit: {nextLesson.title.split(':')[0]} <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Technical Lecture Notes */}
          <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 sm:p-8 space-y-6">
            <h2 className="font-serif text-2xl text-[#1A1A1A] border-b border-[#E8E3D8] pb-3">
              Technical Syllabus Notes & Formulas
            </h2>
            <div className="text-xs sm:text-sm text-[#444] space-y-4 leading-relaxed font-sans prose prose-neutral max-w-none">
              <div
                dangerouslySetInnerHTML={{
                  __html: activeLesson.contentMarkdown
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/### (.*)/g, '<h3 class="font-serif text-lg text-[#1A1A1A] font-semibold mt-4 mb-2">$1</h3>')
                    .replace(/#### (.*)/g, '<h4 class="font-sans text-xs uppercase tracking-wider text-[#888] font-bold mt-3 mb-1">$1</h4>')
                }}
              />
            </div>

            {/* Downloadable Resources */}
            {activeLesson.resources && activeLesson.resources.length > 0 && (
              <div className="pt-6 border-t border-[#E8E3D8] space-y-3">
                <h4 className="font-serif text-base text-[#1A1A1A]">Downloadable Cutting Charts & PDFs</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activeLesson.resources.map((res) => (
                    <a
                      key={res.id}
                      href={res.url}
                      onClick={(e) => {
                        e.preventDefault();
                        showToast(`Simulated download of ${res.title}`);
                      }}
                      className="p-3 bg-[#F5F2EB] border border-[#D8D2C5] rounded hover:border-[#1A1A1A] transition-colors flex items-center justify-between text-xs text-[#1A1A1A]"
                    >
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#C2A676]" />
                        <span className="font-medium line-clamp-1">{res.title}</span>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#888]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Syllabus Navigator Sidebar (4 cols) */}
        <div className="lg:col-span-4 bg-[#FAF9F5] border border-[#E8E3D8] p-5 space-y-5 rounded sticky top-28">
          <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-3">
            <h3 className="font-serif text-lg text-[#1A1A1A]">Course Units</h3>
            <span className="text-xs text-[#7A7469]">{allLessons.length} Total</span>
          </div>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            {course.modules.map((mod, modIdx) => (
              <div key={mod.id} className="space-y-1.5">
                <div className="text-[10px] uppercase tracking-wider text-[#8C7A54] font-semibold px-2">
                  Module {modIdx + 1}: {mod.title.split(':')[1] || mod.title}
                </div>

                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isSelected = activeLesson.id === les.id;
                    const isCompleted = !!lessonProgress[les.id];

                    return (
                      <button
                        key={les.id}
                        onClick={() => setActiveLesson(les)}
                        className={`w-full text-left p-2.5 rounded text-xs transition-colors flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-white'
                            : 'bg-[#F5F2EB] text-[#4A453E] hover:bg-[#EBE6DC]'
                        }`}
                      >
                        <div className="shrink-0">
                          {isCompleted ? (
                            <CheckCircle2
                              className={`w-3.5 h-3.5 ${isSelected ? 'text-[#C2A676]' : 'text-[#3F7535]'}`}
                            />
                          ) : (
                            <Play className={`w-3.5 h-3.5 opacity-60`} />
                          )}
                        </div>
                        <span className="flex-1 truncate">{les.title}</span>
                        <span className={`text-[10px] tabular-nums ${isSelected ? 'text-gray-300' : 'text-gray-500'}`}>
                          {les.durationMinutes}m
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
