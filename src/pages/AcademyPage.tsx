import React, { useEffect, useState } from 'react';
import { Course, ClassSession } from '../types/index';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';
import { BookOpen, Award, Users, Compass, Calendar, ArrowRight } from 'lucide-react';

interface AcademyPageProps {
  onNavigate: (route: string) => void;
}

export const AcademyPage: React.FC<AcademyPageProps> = ({ onNavigate }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [selectedLevel, setSelectedLevel] = useState<string>('All');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, classRes] = await Promise.all([
          api.getCourses(),
          api.getClasses()
        ]);
        setCourses(courseRes.courses);
        setClasses(classRes.classes);
      } catch (err) {
        console.warn('Failed to load academy data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredCourses = selectedLevel === 'All'
    ? courses
    : courses.filter((c) => c.level === selectedLevel);

  return (
    <div className="space-y-16 pb-20">
      {/* Academy Hero */}
      <section className="bg-[#181818] text-[#FAF9F5] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C2A676] font-medium block">
            Haute Couture & Patternmaking Curriculum
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF9F5] font-light leading-tight">
            The Fashion Design Academy
          </h1>
          <p className="text-xs sm:text-sm text-[#BFB7A8] max-w-xl mx-auto leading-relaxed">
            Rigorous technical training designed for serious apparel artisans. Master anatomical block drafting,
            Parisian stand draping, Savile Row canvas tailoring, and earning accredited certificates.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#C2A676]">
            <span className="flex items-center gap-1.5">
              <Award className="w-4 h-4" /> Verifiable Diplomas
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <Users className="w-4 h-4" /> Savile Row & Parisian Fellows
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" /> Lifetime Technical Syllabus
            </span>
          </div>
        </div>
      </section>

      {/* Main Course Catalog */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E8E3D8] pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C2A676] font-semibold block mb-1">
              Curriculum Catalog
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
              Masterclasses & Technical Programs
            </h2>
          </div>

          {/* Level Filter Controls (Zero-pill discipline, clean segmented buttons) */}
          <div className="flex items-center gap-1 p-1 bg-[#F0EDE6] rounded">
            {['All', 'Beginner', 'Intermediate', 'Masterclass'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLevel(lvl)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-[#1A1A1A] text-[#FAF9F5] shadow-xs'
                    : 'text-[#4A453E] hover:text-[#1A1A1A]'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#7A7469]">Loading curriculum...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onSelect={(slug) => onNavigate(`/courses/${slug}`)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Studio Classes Schedule */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-8 sm:p-12 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3D8] pb-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#C2A676] font-semibold">
                Live Interactive Learning
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] mt-0.5">
                Scheduled Studio & Online Workshops
              </h3>
            </div>
            <button
              onClick={() => onNavigate('/classes')}
              className="text-xs uppercase tracking-wider text-[#1A1A1A] font-semibold hover:text-[#C2A676] flex items-center gap-1"
            >
              Browse All Classes <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <div
                key={cls.id}
                className="p-6 bg-[#F5F2EB] border border-[#E5DFD3] space-y-4"
              >
                <div className="flex items-center justify-between text-xs text-[#7A7469]">
                  <span className="flex items-center gap-1.5 font-medium text-[#1A1A1A]">
                    <Calendar className="w-3.5 h-3.5 text-[#C2A676]" /> {cls.date} · {cls.startTime} - {cls.endTime}
                  </span>
                  <span className="text-[10px] tracking-wider uppercase font-semibold text-[#8E7954]">
                    {cls.isOnline ? 'Digital Studio' : 'London Atelier'}
                  </span>
                </div>

                <div>
                  <h4 className="font-serif text-xl text-[#1A1A1A] font-medium leading-snug">{cls.title}</h4>
                  <p className="text-xs text-[#554F44] mt-1.5 leading-relaxed">{cls.description}</p>
                </div>

                <div className="pt-3 border-t border-[#E5DFD3] flex items-center justify-between">
                  <div>
                    <span className="text-xs text-[#7A7469]">
                      Seats Remaining: <strong>{cls.capacity - cls.enrolledCount}</strong>
                    </span>
                    <span className="block font-serif text-lg text-[#1A1A1A] tabular-nums">
                      ${cls.price}
                    </span>
                  </div>

                  <button
                    onClick={() => onNavigate('/classes')}
                    className="px-5 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-wider font-semibold"
                  >
                    Reserve Seat
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Diploma Certification Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 bg-[#EDE7DB] border border-[#DDD5C5] flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs uppercase tracking-[0.2em] text-[#8C7A54] font-semibold">
              Official Credential Verification
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A] font-light">
              Are you verifying an applicant's certificate of mastery?
            </h3>
            <p className="text-xs text-[#554F44] leading-relaxed">
              Every ATELIER & ACADÉMIE diploma features a cryptographic serial number verifiable by luxury houses,
              bespoke fashion ateliers, and university evaluators.
            </p>
          </div>

          <button
            onClick={() => onNavigate('/certificates/verify')}
            className="px-7 py-3.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold shrink-0"
          >
            Enter Verification Code
          </button>
        </div>
      </section>
    </div>
  );
};
