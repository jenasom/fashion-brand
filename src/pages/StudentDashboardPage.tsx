import React, { useEffect, useState } from 'react';
import { Enrollment, ClassSession, TutoringBooking, Certificate } from '../types/index';
import { api } from '../services/api';
import { useApp } from '../context/AppContext';
import { BookOpen, Calendar, Clock, Award, Video, ArrowRight, CheckCircle2 } from 'lucide-react';

interface StudentDashboardPageProps {
  onNavigate: (route: string) => void;
}

export const StudentDashboardPage: React.FC<StudentDashboardPageProps> = ({ onNavigate }) => {
  const { user } = useApp();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [classes, setClasses] = useState<ClassSession[]>([]);
  const [bookings, setBookings] = useState<TutoringBooking[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const studentId = user?.id || 'usr_student_1';

  useEffect(() => {
    const fetchStudentData = async () => {
      setIsLoading(true);
      try {
        const [enrRes, clsRes, bookRes, certRes] = await Promise.all([
          api.getUserEnrollments(studentId),
          api.getClasses(),
          api.getStudentBookings(studentId),
          api.getUserCertificates(studentId)
        ]);

        setEnrollments(enrRes.enrollments);
        // Classes student is registered in
        const userClasses = clsRes.classes.filter((c) => c.enrolledUserIds.includes(studentId));
        setClasses(userClasses);
        setBookings(bookRes.bookings);
        setCertificates(certRes.certificates);
      } catch (err) {
        console.warn('Failed to load student dashboard', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
  }, [studentId]);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-serif text-lg text-[#7A7469] animate-pulse">Opening student studio desk...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header Profile Banner */}
      <div className="bg-[#EDE7DB] border border-[#DDD5C5] p-6 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'}
            alt={user?.name || 'Student'}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#FAF9F5] shadow-xs"
          />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#8C7A54] font-semibold block">
              Atelier Apprentice Studio Desk
            </span>
            <h1 className="font-serif text-2xl sm:text-3xl text-[#1A1A1A]">
              Welcome back, {user?.name || 'Claire Chen'}
            </h1>
            <p className="text-xs text-[#554F44] mt-0.5">
              Active Member · {enrollments.length} Enrolled Programs · {certificates.length} Earned Diplomas
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigate('/academy')}
          className="px-5 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#333] transition-colors"
        >
          Browse New Masterclasses
        </button>
      </div>

      {/* Grid: Enrolled Courses */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-3">
          <h2 className="font-serif text-2xl text-[#1A1A1A]">Enrolled Masterclass Programs</h2>
          <span className="text-xs text-[#7A7469]">{enrollments.length} Courses in Progress</span>
        </div>

        {enrollments.length === 0 ? (
          <div className="p-8 bg-[#FAF9F5] border border-dashed border-[#D5CEBF] text-center space-y-2">
            <BookOpen className="w-8 h-8 text-[#A89F90] mx-auto" />
            <p className="font-serif text-lg text-[#1A1A1A]">No active enrollments</p>
            <p className="text-xs text-[#7A7469]">Explore our Pattern Drafting and Parisian Draping programs.</p>
            <button
              onClick={() => onNavigate('/academy')}
              className="mt-3 px-4 py-2 bg-[#1A1A1A] text-white text-xs uppercase tracking-wider"
            >
              View Academy
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map((enr) => (
              <div
                key={enr.id}
                className="bg-[#FAF9F5] border border-[#E8E3D8] p-5 flex flex-col justify-between space-y-4 hover:border-[#C2A676]/60 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  <div className="aspect-video w-full overflow-hidden bg-[#DDD]">
                    <img src={enr.courseThumbnail} alt={enr.courseTitle} className="w-full h-full object-cover" />
                  </div>

                  <div>
                    <h3 className="font-serif text-lg text-[#1A1A1A] leading-snug line-clamp-1">{enr.courseTitle}</h3>
                    <p className="text-[11px] text-[#7A7469] mt-0.5">
                      Enrolled: {new Date(enr.enrolledAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-[#554F44]">Syllabus Progress</span>
                      <span className="font-semibold text-[#1A1A1A] tabular-nums">{enr.progressPercent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#E8E2D5] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#1A1A1A] transition-all duration-500"
                        style={{ width: `${enr.progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EFECE4] flex items-center justify-between">
                  {enr.isCompleted && enr.certificateId ? (
                    <button
                      onClick={() => onNavigate(`/certificates/${enr.certificateId}`)}
                      className="text-xs text-[#C2A676] font-semibold hover:underline flex items-center gap-1"
                    >
                      <Award className="w-3.5 h-3.5" /> View Diploma
                    </button>
                  ) : (
                    <span className="text-xs text-[#7A7469]">In Progress</span>
                  )}

                  <button
                    onClick={() => onNavigate(`/student/courses/${enr.courseId}`)}
                    className="px-4 py-2 bg-[#1A1A1A] text-[#FAF9F5] text-xs uppercase tracking-wider font-semibold hover:bg-[#333] transition-colors flex items-center gap-1.5"
                  >
                    Enter Classroom <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid: Upcoming Live Classes & Tutoring Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scheduled Studio Workshops */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-2">
            <h3 className="font-serif text-xl text-[#1A1A1A]">Registered Live Workshops</h3>
            <span className="text-xs text-[#7A7469]">{classes.length} Sessions</span>
          </div>

          {classes.length === 0 ? (
            <p className="text-xs text-[#7A7469] py-4 bg-[#FAF9F5] border border-[#E8E3D8] p-4">
              You are not registered for any upcoming live workshops.{' '}
              <button onClick={() => onNavigate('/classes')} className="underline text-[#1A1A1A]">
                Browse workshops schedule
              </button>
            </p>
          ) : (
            <div className="space-y-3">
              {classes.map((cls) => (
                <div key={cls.id} className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-medium text-xs text-[#1A1A1A]">{cls.title}</h4>
                    <span className="text-[10px] font-semibold text-[#8C7A54] uppercase tracking-wider">
                      {cls.isOnline ? 'Online Meet' : 'In-Studio'}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#7A7469]">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#C2A676]" /> {cls.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#C2A676]" /> {cls.startTime} - {cls.endTime}
                    </span>
                  </div>
                  {cls.meetingUrl && (
                    <a
                      href={cls.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#1A1A1A] font-medium underline pt-1"
                    >
                      <Video className="w-3.5 h-3.5 text-[#C2A676]" /> Open Workshop Video Room
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Private Mentoring Bookings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E3D8] pb-2">
            <h3 className="font-serif text-xl text-[#1A1A1A]">Private Mentorship Appointments</h3>
            <span className="text-xs text-[#7A7469]">{bookings.length} Confirmed</span>
          </div>

          {bookings.length === 0 ? (
            <p className="text-xs text-[#7A7469] py-4 bg-[#FAF9F5] border border-[#E8E3D8] p-4">
              No private consultations scheduled.{' '}
              <button onClick={() => onNavigate('/tutoring')} className="underline text-[#1A1A1A]">
                Book a 1-on-1 session with a mentor
              </button>
            </p>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div key={b.id} className="p-4 bg-[#FAF9F5] border border-[#E8E3D8] space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-xs text-[#1A1A1A]">{b.instructorName}</h4>
                      <p className="text-[11px] text-[#7A7469]">Topic: {b.topic}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-[#3F7535] bg-[#EBF3E8] px-2 py-0.5 rounded">
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#7A7469]">
                    <span>{b.date}</span>
                    <span>{b.startTime} - {b.endTime}</span>
                  </div>
                  <a
                    href={b.meetingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[#1A1A1A] font-medium underline pt-1"
                  >
                    <Video className="w-3.5 h-3.5 text-[#C2A676]" /> Enter Private Consultation Call
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Earned Diplomas & Certificates Section */}
      <div className="space-y-4 pt-4 border-t border-[#E8E3D8]">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl text-[#1A1A1A]">Official Certificates of Mastery</h2>
          <span className="text-xs text-[#7A7469]">{certificates.length} Credentials Minted</span>
        </div>

        {certificates.length === 0 ? (
          <p className="text-xs text-[#7A7469]">Complete 100% of your course lessons to unlock your verified diploma.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                onClick={() => onNavigate(`/certificates/${cert.certificateCode}`)}
                className="p-6 bg-[#FAF9F5] border border-[#C2A676]/50 rounded cursor-pointer hover:shadow-md transition-all space-y-3 relative overflow-hidden"
              >
                <div className="w-8 h-8 rounded-full bg-[#FAF5EB] text-[#C2A676] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-serif text-lg text-[#1A1A1A] font-medium leading-snug">{cert.courseTitle}</h4>
                  <p className="text-xs text-[#7A7469] mt-0.5">Recipient: {cert.studentName}</p>
                  <p className="text-[11px] text-[#C2A676] font-semibold mt-1">
                    Credential ID: {cert.certificateCode}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#EFECE4] flex justify-between text-[11px] text-[#8C8476]">
                  <span>Issued: {cert.issueDate}</span>
                  <span className="font-semibold text-[#1A1A1A]">Grade: {cert.grade}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
