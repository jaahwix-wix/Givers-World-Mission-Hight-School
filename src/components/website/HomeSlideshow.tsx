/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Sparkles, 
  Monitor, 
  GraduationCap, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';

import pupilsAssemblyImg from '../../assets/images/school_pupils_assembly_1789727285450.jpg';
import classroomImg from '../../assets/images/pupils_in_classroom_1789727304279.jpg';
import computerLabImg from '../../assets/images/students_computer_lab_1789727321474.jpg';

interface Slide {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  icon: any;
  image: string;
  alt: string;
  ctaText: string;
  ctaAction: string;
  stats: { label: string; value: string };
}

const SLIDES: Slide[] = [
  {
    id: 'assembly',
    title: 'Nurturing Academic & Moral Champions in Kambia 1',
    subtitle: 'From Nursery to College Diplomas, our pupils and students thrive in a disciplined, Christian-principled environment with 100% NPSE, BECE & WASSCE pass rates.',
    category: 'Pupils & Students in Assembly',
    icon: GraduationCap,
    image: pupilsAssemblyImg,
    alt: 'Givers World Mission Diplomats Academy pupils and students gathered in assembly in school uniforms in Kambia 1',
    ctaText: 'Explore Academics & College',
    ctaAction: 'academics',
    stats: { label: 'Accreditation', value: 'MBSDSE Approved' }
  },
  {
    id: 'classroom',
    title: 'Interactive Classrooms with Passionate Educators',
    subtitle: 'Small student-teacher ratios ensure individualized coaching in Sciences, Arts, Commerce, and College degree courses with modern textbooks and curriculum.',
    category: 'Classroom Instruction',
    icon: BookOpen,
    image: classroomImg,
    alt: 'Engaged pupils in modern classroom at Givers World Mission Diplomats Academy in Kambia 1',
    ctaText: 'View Class Noticeboard & SMS',
    ctaAction: 'notices',
    stats: { label: 'Examination Center', value: 'WAEC / NPSE / BECE' }
  },
  {
    id: 'computer-lab',
    title: 'State-of-the-Art Computer & ICT Laboratory',
    subtitle: 'Hands-on digital literacy, computer coding, internet research, and professional software training for pupils from primary school through college level.',
    category: 'Modern Computer ICT Lab',
    icon: Monitor,
    image: computerLabImg,
    alt: 'Students actively working in the modern computer lab at Givers World Mission in Kambia 1',
    ctaText: 'Tour Campus Facilities',
    ctaAction: 'facilities',
    stats: { label: 'Workstations', value: '45+ Desktop PCs' }
  }
];

interface HomeSlideshowProps {
  onNavigate: (page: string) => void;
}

export default function HomeSlideshow({ onNavigate }: HomeSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [direction, setDirection] = useState<number>(1);

  // Auto-play timer
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  };

  const currentSlide = SLIDES[currentIndex];
  const IconComponent = currentSlide.icon;

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 1.05
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.5 },
        scale: { duration: 0.7 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 }
      }
    })
  };

  return (
    <div 
      className="relative w-full overflow-hidden bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 my-4"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      id="home-hero-slideshow"
    >
      {/* Slideshow Canvas */}
      <div className="relative h-[480px] sm:h-[540px] md:h-[600px] w-full overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            {/* Background Image with Ken-Burns Subtle Scale */}
            <img 
              src={currentSlide.image} 
              alt={currentSlide.alt}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-7000 ease-out"
            />
            
            {/* Cinematic Gradients for Optimal Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

            {/* Slide Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 md:p-14 max-w-4xl">
              {/* Category Pill & Location Badge */}
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black tracking-wide uppercase bg-emerald-600/90 text-white shadow-md backdrop-blur-md">
                  <IconComponent className="w-3.5 h-3.5" />
                  {currentSlide.category}
                </span>
                
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900/80 text-amber-300 border border-slate-700/60 backdrop-blur-md">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  Kambia 1, Northern Province
                </span>

                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/10 text-white/90 backdrop-blur-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Eagles Squad
                </span>
              </div>

              {/* Slide Heading */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3 drop-shadow-sm"
              >
                {currentSlide.title}
              </motion.h2>

              {/* Subtitle */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-sm sm:text-base md:text-lg text-slate-200 max-w-2xl leading-relaxed mb-6 font-normal drop-shadow-xs"
              >
                {currentSlide.subtitle}
              </motion.p>

              {/* Slide Actions */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3"
              >
                <button
                  type="button"
                  onClick={() => onNavigate(currentSlide.ctaAction)}
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center gap-2 shadow-lg shadow-emerald-950/40 transition-all hover:translate-x-0.5 cursor-pointer"
                  id={`slideshow-btn-${currentSlide.id}`}
                >
                  <span>{currentSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('admissions')}
                  className="px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-100 font-bold text-sm border border-slate-700/80 backdrop-blur-md transition-colors cursor-pointer"
                >
                  Enroll for 2026/2027
                </button>

                <div className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900/70 border border-slate-800/80 text-xs text-slate-300 backdrop-blur-md ml-auto">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-white">{currentSlide.stats.label}:</span>
                  <span>{currentSlide.stats.value}</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/60 backdrop-blur-md transition-all hover:scale-110 cursor-pointer z-10 shadow-lg"
          aria-label="Previous Slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center border border-slate-700/60 backdrop-blur-md transition-all hover:scale-110 cursor-pointer z-10 shadow-lg"
          aria-label="Next Slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Top Right Auto-play Status Indicator */}
        <button
          type="button"
          onClick={() => setIsPaused(!isPaused)}
          className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 backdrop-blur-md transition-colors z-10 cursor-pointer"
          title={isPaused ? "Play slideshow" : "Pause slideshow"}
        >
          {isPaused ? (
            <>
              <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>Paused</span>
            </>
          ) : (
            <>
              <Pause className="w-3 h-3 text-emerald-400" />
              <span>Auto-playing</span>
            </>
          )}
        </button>
      </div>

      {/* Slide Thumbnails & Progress Navigation Bar */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Progress Dots */}
        <div className="flex items-center gap-2">
          {SLIDES.map((slide, idx) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                idx === currentIndex 
                  ? 'w-8 bg-emerald-400 shadow-xs shadow-emerald-400/50' 
                  : 'w-2.5 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Go to slide ${idx + 1}: ${slide.category}`}
            />
          ))}
          <span className="text-xs text-slate-400 font-medium ml-2">
            0{currentIndex + 1} / 0{SLIDES.length}
          </span>
        </div>

        {/* Mini Scene Switchers */}
        <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0">
          {SLIDES.map((slide, idx) => {
            const isSelected = idx === currentIndex;
            const MiniIcon = slide.icon;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <MiniIcon className="w-3.5 h-3.5" />
                <span>{slide.category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
