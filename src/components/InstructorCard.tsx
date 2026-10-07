import React from 'react';
import { Instructor } from '../types/index';
import { Star, MapPin, Calendar } from 'lucide-react';

interface InstructorCardProps {
  instructor: Instructor;
  onBook: (instructor: Instructor) => void;
}

export const InstructorCard: React.FC<InstructorCardProps> = ({ instructor, onBook }) => {
  return (
    <div className="bg-[#FAF9F5] border border-[#E8E3D8] p-6 flex flex-col justify-between space-y-6 transition-all duration-300 hover:border-[#C2A676]/60 shadow-xs hover:shadow-md">
      <div className="space-y-4">
        {/* Header with Avatar and Basic Info */}
        <div className="flex items-start gap-4">
          <img
            src={instructor.avatar}
            alt={instructor.name}
            className="w-16 h-16 rounded-full object-cover border border-[#D5CEBF] shrink-0"
          />
          <div>
            <h3 className="font-serif text-lg text-[#1A1A1A] font-medium leading-snug">
              {instructor.name}
            </h3>
            <p className="text-xs text-[#C2A676] font-medium mt-0.5">{instructor.title}</p>
            <div className="flex items-center gap-2 text-xs text-[#7A7469] mt-1">
              <span className="flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-[#C2A676] text-[#C2A676]" />
                <span className="font-medium text-[#1A1A1A]">{instructor.rating.toFixed(2)}</span> ({instructor.reviewCount})
              </span>
              <span aria-hidden="true">·</span>
              <span>{instructor.experienceYears} Years Craft</span>
            </div>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-[#554F44] leading-relaxed line-clamp-3">
          {instructor.bio}
        </p>

        {/* Studio Location */}
        <div className="flex items-center gap-1.5 text-xs text-[#7A7469]">
          <MapPin className="w-3.5 h-3.5 text-[#C2A676] shrink-0" />
          <span className="truncate">{instructor.studioLocation}</span>
        </div>

        {/* Specialties: Zero-pill discipline (clean text items) */}
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#8C8476] font-medium block mb-1.5">
            Core Masteries:
          </span>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-[#4A453E]">
            {instructor.specialties.map((spec, idx) => (
              <span key={spec} className="inline-flex items-center">
                <span>{spec}</span>
                {idx < instructor.specialties.length - 1 && <span className="ml-2 text-[#C5BBA8]">/</span>}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Rate & Action */}
      <div className="pt-4 border-t border-[#EFECE4] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-wider text-[#7A7469] block">Consultation</span>
          <span className="font-serif text-xl font-medium text-[#1A1A1A] tabular-nums">
            ${instructor.hourlyRate}
          </span>
          <span className="text-xs text-[#7A7469]"> / hour</span>
        </div>

        <button
          onClick={() => onBook(instructor)}
          className="px-4 py-2.5 bg-[#1A1A1A] text-[#FAF9F5] hover:bg-[#333] transition-colors text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 shadow-sm"
        >
          <Calendar className="w-3.5 h-3.5" /> Book Session
        </button>
      </div>
    </div>
  );
};
