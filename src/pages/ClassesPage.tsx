import React, { useEffect, useState } from 'react';
import { ClassSession } from '../types/index';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, Video, CheckCircle2, ArrowRight } from 'lucide-react';

interface ClassesPageProps {
  onNavigate: (route: string) => void;
}

export const ClassesPage: React.FC<ClassesPageProps> = ({ onNavigate }) => {
  const { user, showToast } = useApp();
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ONLINE' | 'STUDIO'>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [registeringId, setRegisteringId] = useState<string | null>(null);

  const studentId = user?.id || 'usr_student_1';

  const loadClasses = async () => {
    setIsLoading(true);
    try {
      const res = await api.getClasses();
      setClasses(res.classes);
    } catch (err) {
      console.warn('Failed to load classes', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadClasses();
  }, []);

  const handleRegister = async (cls: ClassSession) => {
    setRegisteringId(cls.id);
    try {
      const res = await api.registerForClass(cls.id, studentId);
      if (res.success) {
        showToast(`Seat reserved for "${cls.title}". Confirmation notice dispatched!`);
        await loadClasses();
      }
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setRegisteringId(null);
    }
  };

  const filtered = classes.filter((c) => {
    if (filter === 'ONLINE') return c.isOnline;
    if (filter === 'STUDIO') return !c.isOnline;
    return true;
  });

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-[#181818] text-[#FAF9F5] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C2A676] font-medium block">
            Scheduled Interactive Workshops
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF9F5] font-light leading-tight">
            Live Atelier Classes
          </h1>
          <p className="text-xs sm:text-sm text-[#BFB7A8] max-w-xl mx-auto leading-relaxed">
            Participate in interactive digital masterclasses and in-person studio workshops.
            Learn hand pad-stitching, bias draping, and pattern transformations directly from faculty fellows.
          </p>
        </div>
      </section>

      {/* Filter controls */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E3D8] pb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.2em] text-[#C2A676] font-semibold block mb-1">
              Upcoming Schedule
            </span>
            <h2 className="font-serif text-3xl text-[#1A1A1A]">
              Masterclass Sessions ({filtered.length})
            </h2>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#F0EDE6] rounded text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 font-medium rounded transition-colors ${
                filter === 'ALL' ? 'bg-[#1A1A1A] text-[#FAF9F5]' : 'text-[#555] hover:text-[#111]'
              }`}
            >
              All Formats
            </button>
            <button
              onClick={() => setFilter('ONLINE')}
              className={`px-3 py-1.5 font-medium rounded transition-colors ${
                filter === 'ONLINE' ? 'bg-[#1A1A1A] text-[#FAF9F5]' : 'text-[#555] hover:text-[#111]'
              }`}
            >
              Digital Studio
            </button>
            <button
              onClick={() => setFilter('STUDIO')}
              className={`px-3 py-1.5 font-medium rounded transition-colors ${
                filter === 'STUDIO' ? 'bg-[#1A1A1A] text-[#FAF9F5]' : 'text-[#555] hover:text-[#111]'
              }`}
            >
              Atelier In-Person
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#7A7469]">Consulting masterclass calendar...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((cls) => {
              const isEnrolled = cls.enrolledUserIds.includes(studentId);
              const seatsLeft = cls.capacity - cls.enrolledCount;

              return (
                <div
                  key={cls.id}
                  className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#C2A676]/60 transition-all shadow-xs"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-semibold text-[#1A1A1A]">
                        <Calendar className="w-4 h-4 text-[#C2A676]" /> {cls.date}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-[#8C7A54] bg-[#F2EEE4] px-2 py-0.5 rounded">
                        {cls.isOnline ? 'Online (Zoom / Meet)' : 'In-Studio Workshop'}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-serif text-2xl text-[#1A1A1A] font-medium leading-snug">{cls.title}</h3>
                      <p className="text-xs text-[#7A7469] mt-1">Instructor: {cls.instructorName}</p>
                      <p className="text-xs text-[#554F44] mt-2.5 leading-relaxed">{cls.description}</p>
                    </div>

                    <div className="space-y-1.5 pt-2 text-xs text-[#666055]">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-[#C2A676]" />
                        <span>{cls.startTime} - {cls.endTime} (Paris Time / UTC+1)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {cls.isOnline ? (
                          <Video className="w-3.5 h-3.5 text-[#C2A676]" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-[#C2A676]" />
                        )}
                        <span>{cls.location}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E3D8] flex items-center justify-between">
                    <div>
                      <span className="font-serif text-2xl text-[#1A1A1A] tabular-nums font-normal block">
                        ${cls.price}
                      </span>
                      <span className="text-[11px] text-[#7A7469]">
                        {seatsLeft > 0 ? `${seatsLeft} seats left` : 'Fully Booked'}
                      </span>
                    </div>

                    {isEnrolled ? (
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-semibold text-[#3F7535] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" /> Registered
                        </span>
                        {cls.meetingUrl && (
                          <a
                            href={cls.meetingUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 bg-[#1A1A1A] text-white text-xs uppercase font-semibold rounded hover:bg-[#333]"
                          >
                            Open Call Room
                          </a>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => handleRegister(cls)}
                        disabled={registeringId === cls.id || seatsLeft <= 0}
                        className="px-6 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-wider font-semibold shadow-xs disabled:bg-[#888]"
                      >
                        {registeringId === cls.id ? 'Reserving...' : seatsLeft > 0 ? 'Reserve Seat' : 'Sold Out'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
