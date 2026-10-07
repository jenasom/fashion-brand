import React from 'react';
import { Course } from '../types/index';
import { Clock, BookOpen, User } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onSelect: (slug: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(course.slug)}
      className="group flex flex-col bg-[#FAF9F5] border border-[#E8E3D8] hover:border-[#C2A676]/60 transition-all duration-300 cursor-pointer overflow-hidden shadow-xs hover:shadow-md"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#EBE6DC]">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Level badge rendered with clean text & subtle backing */}
        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#1A1A1A]/85 backdrop-blur-xs text-[10px] tracking-wider uppercase text-[#FAF9F5] font-medium">
          {course.level}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Metadata line (Zero-pill discipline) */}
          <div className="flex items-center gap-2 text-xs text-[#7A7469]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#C2A676]" /> {course.durationHours} Hours
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-[#C2A676]" /> {course.modules.length} Modules
            </span>
            <span aria-hidden="true">·</span>
            <span>★ {course.rating.toFixed(2)}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg text-[#1A1A1A] group-hover:text-[#8E7954] transition-colors leading-snug line-clamp-2">
            {course.title}
          </h3>

          <p className="text-xs text-[#666055] line-clamp-2 leading-relaxed">
            {course.subtitle}
          </p>
        </div>

        {/* Footer: Instructor & Price */}
        <div className="pt-3 border-t border-[#EFECE4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-[#DDD] flex items-center justify-center">
              {course.instructorAvatar ? (
                <img src={course.instructorAvatar} alt={course.instructorName} className="w-full h-full object-cover" />
              ) : (
                <User className="w-3.5 h-3.5 text-[#666]" />
              )}
            </div>
            <span className="text-xs text-[#4A453E] font-medium">{course.instructorName}</span>
          </div>

          <div className="text-right">
            <span className="font-serif text-lg font-medium text-[#1A1A1A] tabular-nums">
              ${course.price}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
