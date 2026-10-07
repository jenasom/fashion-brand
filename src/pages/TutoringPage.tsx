import React, { useEffect, useState } from 'react';
import { Instructor } from '../types/index';
import { api } from '../services/api';
import { InstructorCard } from '../components/InstructorCard';
import { BookingModal } from '../components/BookingModal';
import { ShieldCheck, Video, Scissors, Clock } from 'lucide-react';

interface TutoringPageProps {
  onNavigate: (route: string) => void;
}

export const TutoringPage: React.FC<TutoringPageProps> = ({ onNavigate }) => {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [selectedInstructor, setSelectedInstructor] = useState<Instructor | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await api.getInstructors();
        setInstructors(res.instructors);
      } catch (err) {
        console.warn('Failed to load instructors', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInstructors();
  }, []);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero */}
      <section className="bg-[#181818] text-[#FAF9F5] py-20 px-4 sm:px-6 lg:px-8 border-b border-[#2A2A2A]">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C2A676] font-medium block">
            1-on-1 Studio Mentorship & Portfolio Reviews
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl text-[#FAF9F5] font-light leading-tight">
            Private Atelier Consultations
          </h1>
          <p className="text-xs sm:text-sm text-[#BFB7A8] max-w-xl mx-auto leading-relaxed">
            Reserve private working hours with former head patternmakers from Paris couture houses and Savile Row master tailors.
            Receive bespoke fitting critiques, portfolio reviews, and garment construction troubleshooting.
          </p>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4 border-b border-[#E8E3D8] text-xs text-[#554F44]">
          <div className="flex items-start gap-3">
            <Video className="w-5 h-5 text-[#C2A676] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#1A1A1A] text-sm">Ultra High-Definition Video</strong>
              <span>Close-up cameras on seam allowances, iron curves, and draping lines.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Scissors className="w-5 h-5 text-[#C2A676] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#1A1A1A] text-sm">Live Pattern Markup</strong>
              <span>Screen-share your digital CAD flats or hold your physical toiles up to the camera.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#C2A676] shrink-0 mt-0.5" />
            <div>
              <strong className="block text-[#1A1A1A] text-sm">Paystack Protected Guarantee</strong>
              <span>Full reschedule flexibility up to 24 hours prior to appointment.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Instructors Roster */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-[#E8E3D8] pb-4">
          <span className="text-[11px] uppercase tracking-[0.2em] text-[#C2A676] font-semibold block mb-1">
            Faculty & Master Tailors
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#1A1A1A]">
            Select Your Mentor
          </h2>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-sm text-[#7A7469]">Consulting master roster...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {instructors.map((inst) => (
              <InstructorCard
                key={inst.id}
                instructor={inst}
                onBook={(mentor) => setSelectedInstructor(mentor)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Booking Modal */}
      {selectedInstructor && (
        <BookingModal
          instructor={selectedInstructor}
          onClose={() => setSelectedInstructor(null)}
          onSuccess={() => onNavigate('/student')}
        />
      )}
    </div>
  );
};
