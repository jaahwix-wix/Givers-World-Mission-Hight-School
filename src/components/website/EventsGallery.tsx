/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Eye, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  Tag, 
  Sparkles,
  Maximize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ScrollFadeIn from './ScrollFadeIn';

import classroomImg from '../../assets/images/pupils_in_classroom_1789727304279.jpg';
import pupilsAssemblyImg from '../../assets/images/school_pupils_assembly_1789727285450.jpg';
import computerLabImg from '../../assets/images/students_computer_lab_1789727321474.jpg';
import scienceLabImg from '../../assets/images/students_science_lab_1789728886690.jpg';
import sportsDayImg from '../../assets/images/students_sports_day_1789728906203.jpg';
import graduationDayImg from '../../assets/images/college_graduation_day_1789728923856.jpg';

export interface GalleryPhoto {
  id: string;
  title: string;
  category: 'Classrooms' | 'Computer Lab' | 'Science Lab' | 'Assembly & Worship' | 'Sports & Gala' | 'College Division';
  image: string;
  date: string;
  caption: string;
  aspect: 'portrait' | 'landscape' | 'square';
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-1',
    title: 'Interactive Classroom Coaching',
    category: 'Classrooms',
    image: classroomImg,
    date: 'Academic Term 2026',
    caption: 'Pupils engaged in collaborative coursework and syllabus mastery in ventilated primary classrooms at Kambia 1 campus.',
    aspect: 'landscape'
  },
  {
    id: 'photo-2',
    title: 'Morning Assembly & Moral Devotion',
    category: 'Assembly & Worship',
    image: pupilsAssemblyImg,
    date: 'Weekly Convocation',
    caption: 'Pupils gathered in full school uniforms for morning Christian devotions, national anthem, and character-building sermons.',
    aspect: 'portrait'
  },
  {
    id: 'photo-3',
    title: 'Practical ICT & Computer Laboratory Session',
    category: 'Computer Lab',
    image: computerLabImg,
    date: 'Bi-Weekly Lab Sessions',
    caption: 'Students acquiring digital literacy, coding, and software proficiency on 45+ solar-backed workstation terminals.',
    aspect: 'landscape'
  },
  {
    id: 'photo-4',
    title: 'Hands-On Science Laboratory Experiments',
    category: 'Science Lab',
    image: scienceLabImg,
    date: 'Practical Science Workshop',
    caption: 'Senior Secondary Science pupils conducting practical chemistry and biology titration experiments in safety lab coats.',
    aspect: 'square'
  },
  {
    id: 'photo-5',
    title: 'Annual Inter-House Sports & Field Athletics',
    category: 'Sports & Gala',
    image: sportsDayImg,
    date: 'Annual Sports Gala',
    caption: 'Pupils competing in track and field athletics representing Eagles Squad houses with enthusiasm and sportsmanship.',
    aspect: 'landscape'
  },
  {
    id: 'photo-6',
    title: 'College Division Commencement & Graduation',
    category: 'College Division',
    image: graduationDayImg,
    date: 'Convocation Ceremony',
    caption: 'Higher Diploma graduates celebrating their academic achievements and entering the professional workforce in Sierra Leone.',
    aspect: 'square'
  }
];

export default function EventsGallery() {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

  const categories = ['All', 'Classrooms', 'Computer Lab', 'Science Lab', 'Assembly & Worship', 'Sports & Gala', 'College Division'];

  const filteredPhotos = activeCategory === 'All'
    ? GALLERY_PHOTOS
    : GALLERY_PHOTOS.filter(p => p.category === activeCategory);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') setSelectedPhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev + 1) % filteredPhotos.length : null));
      }
      if (e.key === 'ArrowLeft') {
        setSelectedPhotoIndex((prev) => (prev !== null ? (prev - 1 + filteredPhotos.length) % filteredPhotos.length : null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, filteredPhotos.length]);

  const currentPhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  return (
    <section className="space-y-8" id="events-gallery-section">
      <ScrollFadeIn direction="up">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black uppercase tracking-wider mb-2">
              <Camera className="w-3.5 h-3.5 text-emerald-700" />
              <span>Campus Life & Moments</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Events & Campus Life Gallery
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed font-normal">
              Explore authentic moments from daily life at Givers World Mission Diplomats Academy & College—from computer lab sessions and interactive classrooms to science experiments and graduation in Kambia 1.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200 self-start md:self-auto">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </ScrollFadeIn>

      {/* Responsive Masonry Grid using Tailwind multi-column layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {filteredPhotos.map((photo, idx) => (
          <ScrollFadeIn
            key={photo.id}
            direction="up"
            delay={idx * 0.07}
            className="break-inside-avoid"
          >
            <div
              onClick={() => setSelectedPhotoIndex(idx)}
              className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
            >
              <div className="relative overflow-hidden bg-slate-100">
                <img
                  src={photo.image}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                />

                {/* Gradient overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5 text-white">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider self-start mb-2">
                    {photo.category}
                  </span>
                  <h4 className="font-black text-sm text-white leading-tight">
                    {photo.title}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2">
                    {photo.caption}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-[10px] text-emerald-300 font-bold border-t border-white/20 pt-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      Kambia 1 Campus
                    </span>
                    <span className="flex items-center gap-1 text-white">
                      <Maximize2 className="w-3 h-3" />
                      View Photo
                    </span>
                  </div>
                </div>

                {/* Category Badge Visible by default on top-left */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white font-bold text-[10px] tracking-wide group-hover:opacity-0 transition-opacity">
                  {photo.category}
                </span>
              </div>

              {/* Static Card Caption for Mobile and Scannability */}
              <div className="p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2 text-[11px] text-slate-400 mb-1">
                  <span className="font-bold text-emerald-700">{photo.category}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {photo.date}
                  </span>
                </div>
                <h4 className="font-black text-slate-900 text-sm leading-snug group-hover:text-emerald-700 transition-colors">
                  {photo.title}
                </h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-normal">
                  {photo.caption}
                </p>
              </div>
            </div>
          </ScrollFadeIn>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {currentPhoto && selectedPhotoIndex !== null && (
          <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              className="relative max-w-4xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col max-h-[92vh]"
            >
              {/* Lightbox Header */}
              <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between gap-4 text-white">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-black text-xs uppercase tracking-wider">
                    {currentPhoto.category}
                  </span>
                  <h3 className="font-black text-sm sm:text-base text-white truncate max-w-md">
                    {currentPhoto.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Photo Area with Nav Arrows */}
              <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[300px]">
                <img
                  src={currentPhoto.image}
                  alt={currentPhoto.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[60vh] sm:max-h-[65vh] w-auto max-w-full object-contain mx-auto"
                />

                {/* Left arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((selectedPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-lg"
                  title="Previous Photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {/* Right arrow */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedPhotoIndex((selectedPhotoIndex + 1) % filteredPhotos.length);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-slate-900/80 hover:bg-emerald-600 text-white transition-all cursor-pointer shadow-lg"
                  title="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {/* Lightbox Footer Info */}
              <div className="p-4 sm:p-5 bg-slate-950 border-t border-slate-800 text-slate-300 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-white font-medium">{currentPhoto.caption}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-emerald-400">
                      <MapPin className="w-3.5 h-3.5" />
                      Kambia 1, Northern Province, Sierra Leone
                    </span>
                    <span>•</span>
                    <span>Photo {selectedPhotoIndex + 1} of {filteredPhotos.length}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setSelectedPhotoIndex(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
