import React, { useState } from 'react';
import { Instructor } from '../types/index';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { X, Calendar, Clock, Check, AlertCircle } from 'lucide-react';

interface BookingModalProps {
  instructor: Instructor | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AVAILABLE_SLOTS = [
  { start: '10:00', end: '11:00' },
  { start: '11:30', end: '12:30' },
  { start: '14:00', end: '15:00' },
  { start: '15:30', end: '16:30' },
  { start: '17:00', end: '18:00' }
];

export const BookingModal: React.FC<BookingModalProps> = ({ instructor, onClose, onSuccess }) => {
  const { user, showToast } = useApp();

  const [date, setDate] = useState(() => {
    // Tomorrow by default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(AVAILABLE_SLOTS[0]);
  const [topic, setTopic] = useState('Anatomical Pattern Fitting & Bodice Sloper Critique');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!instructor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast('Please sign in or select an active student persona', 'error');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      // Step 1: Concurrency-checked booking
      const { booking } = await api.bookTutoring({
        studentId: user.id,
        instructorId: instructor.id,
        date,
        startTime: selectedSlot.start,
        endTime: selectedSlot.end,
        topic,
        notes
      });

      // Step 2: Initialize & verify payment via Paystack abstraction
      await api.verifyPayment(`pstk_booking_${booking.id}`, {
        type: 'TUTORING_BOOKING',
        targetId: booking.id,
        userId: user.id
      });

      setIsSuccess(true);
      showToast('Mentorship session confirmed and reserved!', 'success');
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to book slot');
      showToast(err.message || 'Booking conflict', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-[#FAF9F5] border border-[#E5E0D5] w-full max-w-lg rounded-md shadow-2xl p-6 relative animate-in fade-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#8C8476] hover:text-[#1A1A1A] p-1"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#EBF3E8] text-[#3F7535] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl text-[#1A1A1A]">Session Confirmed</h3>
            <p className="text-xs text-[#666055] max-w-sm mx-auto leading-relaxed">
              Your private atelier consultation with {instructor.name} on {date} at {selectedSlot.start} has been registered.
              A Google Meet link has been generated and dispatched to your email.
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 pb-4 border-b border-[#EBE6DC] mb-5">
              <img
                src={instructor.avatar}
                alt={instructor.name}
                className="w-12 h-12 rounded-full object-cover border border-[#D5CEBF]"
              />
              <div>
                <h3 className="font-serif text-xl text-[#1A1A1A] leading-tight">{instructor.name}</h3>
                <p className="text-xs text-[#7A7469]">{instructor.title}</p>
                <p className="text-xs font-semibold text-[#C2A676] mt-0.5">
                  ${instructor.hourlyRate} / 60-Minute Session
                </p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 p-3 bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Date selection */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Session Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full bg-[#F5F2EB] border border-[#D8D2C5] px-3 py-2 text-xs text-[#1A1A1A] rounded focus:outline-hidden focus:border-[#1A1A1A]"
                    required
                  />
                  <Calendar className="w-4 h-4 text-[#8C8476] absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1.5">
                  Available Studio Slot (Paris Time / UTC+1)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AVAILABLE_SLOTS.map((slot) => {
                    const isSelected = selectedSlot.start === slot.start;
                    return (
                      <button
                        key={slot.start}
                        type="button"
                        onClick={() => setSelectedSlot(slot)}
                        className={`p-2 rounded text-center border text-xs font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#1A1A1A] text-[#FAF9F5] border-[#1A1A1A]'
                            : 'bg-[#F5F2EB] text-[#4A453E] border-[#D8D2C5] hover:bg-[#EBE6DC]'
                        }`}
                      >
                        <Clock className="w-3 h-3 inline-block mr-1 opacity-70" />
                        {slot.start} - {slot.end}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Focus Topic */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Atelier Consultation Focus / Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Sloper fitting, Savile Row pad-stitching, or Portfolio review"
                  className="w-full bg-[#F5F2EB] border border-[#D8D2C5] px-3 py-2 text-xs text-[#1A1A1A] rounded focus:outline-hidden focus:border-[#1A1A1A]"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#666] font-medium mb-1">
                  Preparation Notes / Measurements / Questions (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Provide any advance context, fabric weight, or measurement doubts..."
                  className="w-full bg-[#F5F2EB] border border-[#D8D2C5] px-3 py-2 text-xs text-[#1A1A1A] rounded focus:outline-hidden focus:border-[#1A1A1A]"
                />
              </div>

              {/* Price summary & Paystack Notice */}
              <div className="p-3 bg-[#EFECE4] rounded text-xs space-y-1">
                <div className="flex justify-between font-medium text-[#1A1A1A]">
                  <span>Total Consultation Fee:</span>
                  <span className="font-serif text-sm">${instructor.hourlyRate}</span>
                </div>
                <p className="text-[10px] text-[#7A7469]">
                  Secured with Paystack payment guarantee. Includes 1-on-1 recording and annotated pattern review.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 shadow-sm disabled:bg-[#888]"
              >
                {isSubmitting ? 'Verifying Availability...' : `Confirm & Pay $${instructor.hourlyRate}`}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
