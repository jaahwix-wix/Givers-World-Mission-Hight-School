/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  GraduationCap, 
  BookOpen, 
  Monitor, 
  Bus, 
  Award, 
  ShieldCheck, 
  BellRing, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  Calendar,
  Smartphone,
  ChevronRight,
  MapPin,
  FileText
} from 'lucide-react';
import HomeSlideshow from '../HomeSlideshow';
import { SCHOOL_INFO } from '../../../initialData';
import { ClassNotice } from '../../../types';
import schoolLogo from '../../../assets/logo.jpg';
import computerLabImg from '../../../assets/images/students_computer_lab_1789727321474.jpg';
import classroomImg from '../../../assets/images/pupils_in_classroom_1789727304279.jpg';
import pupilsAssemblyImg from '../../../assets/images/school_pupils_assembly_1789727285450.jpg';

interface HomePageProps {
  onNavigate: (page: string, args?: any) => void;
  notices: ClassNotice[];
}

export default function HomePage({ onNavigate, notices }: HomePageProps) {
  const latestNotices = notices.slice(0, 3);

  return (
    <div className="space-y-12 pb-8" id="website-home-page">
      {/* 1. HERO SLIDESHOW OF PUPILS & STUDENTS, CLASSROOM, & COMPUTER LAB */}
      <section className="relative">
        <HomeSlideshow onNavigate={onNavigate} />
      </section>

      {/* 2. LIVE ANNOUNCEMENTS & SMS DISPATCH TICKER */}
      <section className="bg-amber-50 border border-amber-200 rounded-2xl p-4 sm:p-5 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-amber-400 text-slate-950 flex-shrink-0 shadow-xs">
              <BellRing className="w-5 h-5 animate-bounce" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-amber-900 uppercase tracking-wide">
                  Latest School & College Notice
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-600 text-white flex items-center gap-1">
                  <Smartphone className="w-2.5 h-2.5" />
                  Live SMS Dispatched
                </span>
              </div>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                {latestNotices[0]?.title || "Welcome to the 2026/2027 Academic Session at Kambia 1"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-auto">
            <button
              type="button"
              onClick={() => onNavigate('notices')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-black flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Noticeboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. FOUR CORE PILLARS / HIGHLIGHTS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          onClick={() => onNavigate('academics')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-emerald-700 transition-colors">
            Academics & College
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            From Nursery 1-3, Primary 1-6, JSS 1-3, SSS 1-3 (Arts, Sciences, Commerce) to Higher Diploma College courses.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-extrabold text-emerald-700">
            <span>Learn More</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('facilities')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Monitor className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
            Modern Computer Lab
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            45+ high-speed workstations, solar power backup, high-speed internet, and foundational programming for students.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-extrabold text-blue-700">
            <span>Tour Lab</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('notices')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-amber-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-amber-700 transition-colors">
            Class SMS Broadcasting
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Instant telecom delivery over Orange, Africell, and QCell to parents and students for all class announcements.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-extrabold text-amber-700">
            <span>Audit SMS Logs</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        <div 
          onClick={() => onNavigate('facilities')}
          className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-purple-500 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
            <Bus className="w-6 h-6" />
          </div>
          <h3 className="text-base font-black text-slate-900 mb-1 group-hover:text-purple-700 transition-colors">
            School Bus Fleet
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Dedicated school transport covering Kambia 1, Kambia 2, and border communities with digital passenger check-in.
          </p>
          <div className="mt-4 flex items-center gap-1 text-xs font-extrabold text-purple-700">
            <span>Fleet Routes</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </section>

      {/* 4. PRINCIPAL'S WELCOME & FOUNDER PROFILE */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center">
            <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-3xl p-1 bg-white border-4 border-emerald-500 shadow-2xl overflow-hidden mb-4">
              <img 
                src={schoolLogo} 
                alt="Givers World Mission Crest Logo" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <h4 className="text-lg font-black text-white">
              {SCHOOL_INFO.principalName}
            </h4>
            <p className="text-emerald-400 font-extrabold text-xs">
              Founder, CEO & Principal
            </p>
            <p className="text-slate-400 text-[11px] mt-1">
              Givers World Mission Diplomats Academy & College
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700 text-xs text-emerald-300 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Eagles Squad Leadership</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Message from the CEO & Principal</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              "Raising Christian Leaders, Academic Giants, and World-Class Diplomats in Kambia 1"
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Welcome to the official web portal of Givers World Mission Diplomats Academy & College. Situated proudly in Kambia 1, Northern Province, Sierra Leone, our mission is to empower every boy and girl through holistic academic training, spiritual grounding in God's Holy Word, and cutting-edge technological readiness.
            </p>

            <p className="text-sm text-slate-300 leading-relaxed font-normal">
              Whether your child is entering our vibrant Nursery program, preparing for the National Primary School Examination (NPSE), sitting the BECE or WASSCE in our accredited exam centers, or pursuing tertiary qualifications in our College Division, they will soar as part of the Eagles Squad!
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => onNavigate('about')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors flex items-center gap-2 shadow-md cursor-pointer"
              >
                <span>Read Full Academy History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('admissions')}
                className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors cursor-pointer"
              >
                Enroll Your Child for 2026/2027
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. VISUAL GALLERY OF STUDENTS, CLASSROOM, & COMPUTER LAB */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">
              Campus Life & Learning
            </span>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              Excellence Inside & Outside the Classroom
            </h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('facilities')}
            className="text-xs font-black text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <span>View all campus facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Assembly */}
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-52 w-full overflow-hidden relative">
              <img 
                src={pupilsAssemblyImg} 
                alt="Pupils and students in assembly in school uniform in Kambia 1" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-md">
                Pupils in Assembly
              </span>
            </div>
            <div className="p-5">
              <h4 className="font-black text-slate-900 text-sm mb-1">
                Morning Assembly & Moral Devotion
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Daily devotions, national anthem, and character-building sermons instilling discipline and purpose in every student.
              </p>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                Character & Leadership
              </span>
            </div>
          </div>

          {/* Card 2: Classroom */}
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-52 w-full overflow-hidden relative">
              <img 
                src={classroomImg} 
                alt="Pupils in interactive classroom learning in Kambia 1" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-md">
                Interactive Classrooms
              </span>
            </div>
            <div className="p-5">
              <h4 className="font-black text-slate-900 text-sm mb-1">
                Rigorous Academic Instruction
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Dedicated subject teachers coaching students in small groups for national examination distinction in Kambia 1.
              </p>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                NPSE, BECE & WASSCE Centers
              </span>
            </div>
          </div>

          {/* Card 3: Computer Lab */}
          <div className="rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow">
            <div className="h-52 w-full overflow-hidden relative">
              <img 
                src={computerLabImg} 
                alt="Students in modern computer ICT lab in Kambia 1" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[11px] font-bold backdrop-blur-md">
                Modern Computer Lab
              </span>
            </div>
            <div className="p-5">
              <h4 className="font-black text-slate-900 text-sm mb-1">
                Practical ICT & Computer Literacy
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                Fully equipped with desktop computers, internet research, office applications, and digital diploma programs.
              </p>
              <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                45+ Computer Workstations
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 6. KEY METRICS OF EXCELLENCE */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
              1,450+
            </div>
            <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wide">
              Pupils & Students
            </p>
            <p className="text-[11px] text-slate-400">Nursery to College in Kambia 1</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-blue-700 tracking-tight">
              100%
            </div>
            <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wide">
              Exam Pass Rate
            </p>
            <p className="text-[11px] text-slate-400">NPSE & BECE Distinctions</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-purple-700 tracking-tight">
              32+
            </div>
            <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wide">
              Modern Classrooms
            </p>
            <p className="text-[11px] text-slate-400">Ventilated & Fully Equipped</p>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
              4
            </div>
            <p className="text-xs font-bold text-slate-600 mt-1 uppercase tracking-wide">
              Dedicated Buses
            </p>
            <p className="text-[11px] text-slate-400">Safe Daily Student Commute</p>
          </div>
        </div>
      </section>

      {/* 7. CALL TO ACTION: ADMISSIONS & PORTAL ACCESS */}
      <section className="bg-emerald-800 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-emerald-900/80 text-emerald-200 text-xs font-black uppercase tracking-wider border border-emerald-700">
            Admissions Open • 2026/2027 Academic Year
          </span>
          <h3 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            Give Your Child the Foundation to Soar with the Eagles Squad
          </h3>
          <p className="text-sm sm:text-base text-emerald-100 font-normal leading-relaxed">
            Enroll today at Givers World Mission Diplomats Academy & College in Kambia 1, Northern Province, Sierra Leone. Applications are available online or at the campus bursary.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('admissions')}
              className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg transition-all cursor-pointer"
            >
              Apply Online Now
            </button>
            <button
              type="button"
              onClick={() => onNavigate('contact')}
              className="px-6 py-3 rounded-xl bg-emerald-950 hover:bg-emerald-900 text-white font-bold text-sm border border-emerald-700 transition-colors cursor-pointer"
            >
              Visit Campus in Kambia 1
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
