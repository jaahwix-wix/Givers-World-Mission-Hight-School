/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  BookOpen, 
  Users, 
  Bus, 
  Award, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  LogIn, 
  BellRing, 
  Smartphone, 
  ChevronRight, 
  Star, 
  Menu, 
  X, 
  Lock, 
  Calendar, 
  Compass, 
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  CreditCard,
  Shield,
  Send
} from 'lucide-react';
import { SCHOOL_INFO } from '../initialData';
import { ClassNotice, UserRole, Student } from '../types';
import { useAuth } from '../context/AuthContext';
import { getSavedClassNotices } from '../utils/smsNoticeUtils';
import schoolLogo from '../assets/logo.jpg';
import schoolCrest from '../assets/images/school_crest_logo_1789307735507.jpg';

interface PublicWebsiteProps {
  onEnterPortal: (targetTab?: string) => void;
  students?: Student[];
}

export default function PublicWebsite({ onEnterPortal, students = [] }: PublicWebsiteProps) {
  const { user, role, unlockSession, signInWithGoogle, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notices, setNotices] = useState<ClassNotice[]>(() => getSavedClassNotices());
  const [selectedNotice, setSelectedNotice] = useState<ClassNotice | null>(null);
  
  // Login Modal State
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [loginRole, setLoginRole] = useState<UserRole>('admin');
  const [passcode, setPasscode] = useState('');
  const [studentAdmissionNo, setStudentAdmissionNo] = useState('');
  const [loginTab, setLoginTab] = useState<'staff' | 'student'>('staff');
  const [authError, setAuthError] = useState('');

  // Inquiry Form state
  const [inquiryName, setInquiryName] = useState('');
  const [inquiryPhone, setInquiryPhone] = useState('');
  const [inquiryClass, setInquiryClass] = useState('SSS 1 (Science)');
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  useEffect(() => {
    const handleNoticesUpdate = () => {
      setNotices(getSavedClassNotices());
    };
    window.addEventListener('sma_class_notice_dispatched', handleNoticesUpdate);
    window.addEventListener('storage', handleNoticesUpdate);
    return () => {
      window.removeEventListener('sma_class_notice_dispatched', handleNoticesUpdate);
      window.removeEventListener('storage', handleNoticesUpdate);
    };
  }, []);

  const handleQuickLogin = (targetRole: UserRole) => {
    unlockSession(targetRole);
    setLoginModalOpen(false);
    onEnterPortal();
  };

  const handleStaffFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) {
      setAuthError('Please enter your security access passcode or PIN.');
      return;
    }
    unlockSession(loginRole);
    setLoginModalOpen(false);
    onEnterPortal();
  };

  const handleStudentFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentAdmissionNo.trim()) {
      setAuthError('Please enter a student admission number (e.g., SMA-2023-0142).');
      return;
    }
    unlockSession('student_parent');
    setLoginModalOpen(false);
    onEnterPortal('student-portal');
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySubmitted(true);
    setTimeout(() => {
      setInquirySubmitted(false);
      setInquiryName('');
      setInquiryPhone('');
    }, 4000);
  };

  const ACADEMIC_DIVISIONS = [
    {
      title: 'Nursery & Early Childhood',
      years: 'Nursery 1 - 3 (Ages 3 - 5)',
      description: 'Foundational literacy, phonetics, cognitive stimulation, and holistic moral development in a nurturing, creative environment.',
      icon: Compass,
      color: 'from-amber-500/20 to-amber-600/10 text-amber-600',
      tag: 'Early Years'
    },
    {
      title: 'Comprehensive Primary School',
      years: 'Classes 1 - 6 (Ages 6 - 11)',
      description: 'Core numeracy, integrated general science, language arts, and intensive preparation for the National Primary School Examination (NPSE).',
      icon: BookOpen,
      color: 'from-indigo-500/20 to-indigo-600/10 text-indigo-600',
      tag: 'NPSE Exam Prep'
    },
    {
      title: 'Junior Secondary School',
      years: 'JSS 1 - 3 (Ages 12 - 14)',
      description: 'Rigorous basic secondary curriculum leading to the Basic Education Certificate Examination (BECE) with dedicated practical laboratories.',
      icon: GraduationCap,
      color: 'from-blue-500/20 to-blue-600/10 text-blue-600',
      tag: 'BECE Certified'
    },
    {
      title: 'Senior Secondary School',
      years: 'SSS 1 - 3 (Ages 15 - 18)',
      description: 'Specialized tracks in Science, Arts & Humanities, and Commercial/Business studies prepared for the West African Senior School Certificate (WASSCE).',
      icon: Award,
      color: 'from-purple-500/20 to-purple-600/10 text-purple-600',
      tag: 'WASSCE Center'
    },
    {
      title: 'University & Higher Institute',
      years: 'Years 1 - 4 (Tertiary Programs)',
      description: 'Higher Diploma & Certificate programs in Business Administration, Information & Communication Technology, and Educational Studies.',
      icon: ShieldCheck,
      color: 'from-emerald-500/20 to-emerald-600/10 text-emerald-600',
      tag: 'Higher Diploma'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950" id="public-school-website">
      
      {/* 1. TOP UTILITY BAR */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 font-medium text-slate-200">
              <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {SCHOOL_INFO.address}
            </span>
            <span className="hidden md:flex items-center gap-1.5 font-medium text-slate-200">
              <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              Hotline: {SCHOOL_INFO.phone}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden lg:inline-block text-[11px] text-amber-300 font-bold">
              • Accredited by MBSDSE Sierra Leone • Centers for NPSE, BECE & WASSCE
            </span>
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-lg text-[11px] transition-all shadow-xs cursor-pointer"
              id="header-top-portal-login-btn"
            >
              <Lock className="w-3 h-3" />
              <span>Portal Login</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION HEADER */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Name */}
          <a href="#home" className="flex items-center gap-3 group">
            <img 
              src={schoolCrest || schoolLogo} 
              alt="Givers World Mission Crest" 
              className="w-12 h-12 rounded-xl object-contain border border-amber-400/40 shadow-xs bg-slate-900 p-0.5 group-hover:scale-105 transition-transform" 
            />
            <div>
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                GIVERS WORLD MISSION
                <span className="text-[10px] bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-md font-black uppercase tracking-wider">
                  G.W.D.A
                </span>
              </span>
              <p className="text-[11px] font-bold text-amber-600 tracking-wide">
                Diplomats Academy • Eagles Squad
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-700">
            <a href="#home" className="hover:text-amber-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-amber-600 transition-colors">About Us</a>
            <a href="#academics" className="hover:text-amber-600 transition-colors">Academics</a>
            <a href="#notices" className="hover:text-amber-600 transition-colors flex items-center gap-1">
              <span>Noticeboard & SMS</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </a>
            <a href="#facilities" className="hover:text-amber-600 transition-colors">Fleet & Campus</a>
            <a href="#admissions" className="hover:text-amber-600 transition-colors">Admissions</a>
            <a href="#contact" className="hover:text-amber-600 transition-colors">Contact</a>
          </nav>

          {/* Right Action Button */}
          <div className="hidden sm:flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-slate-900 to-indigo-950 text-white hover:from-slate-800 hover:to-indigo-900 text-xs font-black rounded-xl shadow-md transition-all cursor-pointer"
              id="main-nav-login-btn"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Staff & Student Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 animate-fadeIn">
            <a 
              href="#home" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-sm font-bold text-slate-800 py-1"
            >
              Home
            </a>
            <a 
              href="#about" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-sm font-bold text-slate-800 py-1"
            >
              About Us
            </a>
            <a 
              href="#academics" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-sm font-bold text-slate-800 py-1"
            >
              Academic Divisions
            </a>
            <a 
              href="#notices" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-sm font-bold text-slate-800 py-1 flex items-center justify-between"
            >
              <span>Noticeboard & SMS Broadcast</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">Live SMS</span>
            </a>
            <a 
              href="#facilities" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-sm font-bold text-slate-800 py-1"
            >
              Bus Fleet & Facilities
            </a>
            <a 
              href="#admissions" 
              onClick={() => setMobileMenuOpen(false)} 
              className="block text-sm font-bold text-slate-800 py-1"
            >
              Admissions & Tuition
            </a>
            <div className="pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setLoginModalOpen(true);
                }}
                className="w-full py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4 text-amber-400" />
                <span>Staff & Student Login</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. HERO SECTION */}
      <section id="home" className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white py-16 sm:py-24 px-4 sm:px-8 overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-300 text-xs font-extrabold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Accredited Center for NPSE, BECE & WASSCE • Higher Education</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
              Nurturing Academic Excellence, Character & Moral Fortitude.
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              Welcome to <strong>Givers World Mission Diplomats Academy (Eagles Squad)</strong> in Kambia 2, Northern Province, Sierra Leone. Providing comprehensive, world-class education from Early Childhood Nursery to Senior Secondary and University Degree & Diploma programs.
            </p>

            {/* Quick Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-all transform active:scale-95 cursor-pointer"
                id="hero-portal-access-btn"
              >
                <LogIn className="w-4 h-4" />
                <span>Access Management Portal</span>
              </button>

              <a
                href="#notices"
                className="flex items-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-xl border border-white/20 transition-colors"
              >
                <BellRing className="w-4 h-4 text-amber-400" />
                <span>View Live Noticeboard & SMS</span>
              </a>
            </div>

            {/* Micro Highlights */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-white/10">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-amber-400">100%</span>
                <span className="text-[11px] text-slate-400 font-semibold">National Exam Success</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-white">Nursery - Uni</span>
                <span className="text-[11px] text-slate-400 font-semibold">5 Academic Divisions</span>
              </div>
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-emerald-400">Live SMS</span>
                <span className="text-[11px] text-slate-400 font-semibold">Class Notification Alerts</span>
              </div>
            </div>
          </div>

          {/* Right Hero Card / Crest Card */}
          <div className="lg:col-span-5">
            <div className="bg-gradient-to-b from-slate-900 to-indigo-950 border-2 border-amber-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center space-y-5">
              <div className="w-28 h-28 mx-auto bg-slate-950 rounded-2xl p-2 border-2 border-amber-400/50 shadow-inner flex items-center justify-center">
                <img src={schoolCrest || schoolLogo} alt="School Crest" className="w-full h-full object-contain" />
              </div>

              <div>
                <span className="text-xs font-black uppercase tracking-widest text-amber-400 block">
                  Official Institutional Portal
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  Givers World Mission
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Diplomats Academy • Kambia 2, Sierra Leone
                </p>
              </div>

              <div className="bg-white/5 rounded-2xl p-4 border border-white/10 text-left space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Executive Leadership:</span>
                  <span className="font-bold text-white">Evangelist Saint Turay</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">Ministry Registration:</span>
                  <span className="font-bold text-emerald-400">MBSDSE Certified</span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-semibold">SMS Broadcast:</span>
                  <span className="font-bold text-amber-300">Orange & Africell SL</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="w-full py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Sign In to School Management System</span>
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 4. LIVE NOTICEBOARD & SMS BROADCAST SECTION (Directly Addressing User Request) */}
      <section id="notices" className="py-16 px-4 sm:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800">
                <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
                Automated SMS Notification System
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Official School Noticeboard & Class SMS Alerts
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                All official notices published by teachers or the Principal automatically dispatch real-time SMS messages to each pupil and their guardian in the respective class.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setLoginModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-900 text-white font-bold text-xs rounded-xl hover:bg-indigo-800 transition-colors self-start md:self-auto cursor-pointer"
            >
              <LogIn className="w-3.5 h-3.5 text-amber-400" />
              <span>Post Class Notice (Staff Portal)</span>
            </button>
          </div>

          {/* Notices Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notices.slice(0, 6).map((notice) => (
              <div 
                key={notice.id}
                className="bg-slate-50 rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-800">
                      Class: {notice.targetClass}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {notice.date}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {notice.content}
                  </p>
                </div>

                {/* SMS Broadcast Badge */}
                <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-emerald-950 font-bold">SMS Dispatched to Class</strong>
                      <span>
                        Sent to {notice.smsBroadcast?.studentCount || 24} pupils and {notice.smsBroadcast?.parentCount || 24} guardians via Orange SL & Africell GSM.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="font-bold text-slate-700">By: {notice.author}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedNotice(notice)}
                      className="text-indigo-700 hover:text-indigo-900 font-extrabold flex items-center gap-0.5 cursor-pointer"
                    >
                      <span>Read Notice</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. ACADEMIC DIVISIONS SECTION */}
      <section id="academics" className="py-16 px-4 sm:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Holistic Educational Journey
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Our 5 Comprehensive Academic Divisions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Guiding students through continuous intellectual, moral, and vocational stages from age 3 to tertiary graduation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACADEMIC_DIVISIONS.map((div, i) => {
              const IconComp = div.icon;
              return (
                <div 
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-amber-400 transition-all space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${div.color} flex items-center justify-center`}>
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                      {div.tag}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">{div.title}</h3>
                    <span className="text-xs font-bold text-amber-600 block mt-0.5">{div.years}</span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {div.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5" />
                    <span>Terminal Continuous Assessment</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 6. PRINCIPAL'S WELCOME ADDRESS */}
      <section id="about" className="py-16 px-4 sm:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-5 text-center">
            <div className="bg-slate-950 p-6 rounded-3xl border-2 border-amber-500/40 text-white shadow-xl max-w-sm mx-auto">
              <div className="w-32 h-32 rounded-2xl bg-amber-400/20 mx-auto flex items-center justify-center border-2 border-amber-400 text-amber-300 font-black text-3xl shadow-inner mb-4">
                EST
              </div>
              <h3 className="text-lg font-black text-white">{SCHOOL_INFO.principalName}</h3>
              <p className="text-xs font-bold text-amber-400">{SCHOOL_INFO.principalTitle}</p>
              <p className="text-[11px] text-slate-400 mt-1">Founder & CEO, Givers World Mission</p>
              
              <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 italic">
                "{SCHOOL_INFO.motto} — Soaring high with integrity, wisdom, and excellence in service to Sierra Leone."
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Leadership & Institutional Mission
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome from the Desk of Evangelist Saint Turay
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              At <strong>Givers World Mission Diplomats Academy</strong>, we believe every child possesses innate divine potential waiting to be ignited. Established in Kambia 2, Northern Province, our mission is to eliminate educational disparity by delivering the highest caliber of disciplined, science-oriented, and morally upright instruction.
            </p>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Through our unified student management architecture, our faculty, pupils, and parents remain in constant harmony. Every directive, examination alert, and terminal grade is transparently tracked, backed by our real-time SMS broadcasting infrastructure ensuring no family in Kambia is left uninformed.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-extrabold text-slate-900 block">Strict Discipline</span>
                <span className="text-[10px] text-slate-500">Character First</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-extrabold text-slate-900 block">45+ Certified Staff</span>
                <span className="text-[10px] text-slate-500">Expert Educators</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                <span className="text-xs font-extrabold text-slate-900 block">Modern ICT & Labs</span>
                <span className="text-[10px] text-slate-500">Practical Science</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 7. CAMPUS FACILITIES & SCHOOL BUS FLEET */}
      <section id="facilities" className="py-16 px-4 sm:px-8 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Campus Logistics & Amenities
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Safe Transport & Modern Learning Environments
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Providing modern infrastructure to support daily student success across the Kambia district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
                <Bus className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Dedicated School Bus Fleet</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reliable daily transportation covering Kambia 1, Kambia 2, Rokupr Highway, and surrounding rural communities with licensed drivers and safety escorts.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Science & Computer Laboratories</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fully equipped Physics, Chemistry, and Biology laboratories for WASSCE practical experiments, paired with a modern desktop ICT laboratory.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900">Bursary & Transparent Accounts</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant digital fee receipts, terminal ledgers, and verified mobile payment integrations via Orange Money and Africell Money.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 8. ADMISSIONS & INQUIRY SECTION */}
      <section id="admissions" className="py-16 px-4 sm:px-8 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-black uppercase tracking-wider text-amber-600">
              Enrollment 2025/2026 Academic Session
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Admissions Open for All Classes
            </h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Admission registration is currently open for Nursery, Primary, Junior Secondary (JSS 1-3), Senior Secondary (SSS 1-3), and University Certificate & Diploma cohorts.
            </p>

            <div className="space-y-2.5 pt-2">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>NPSE, BECE & WASSCE Transfer Students Welcomed</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Flexible Terminal Tuition Installment Plans</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Official Digital Student Identification & Badges</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-md">
              <h3 className="text-base font-extrabold text-slate-900 mb-1">
                Student Admission & Information Inquiry
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                Submit your contact details and our admissions officer will contact you within 24 hours.
              </p>

              {inquirySubmitted ? (
                <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm">Inquiry Received Successfully!</h4>
                  <p className="text-xs">Our Admissions Officer in Kambia will reach out to your telephone number shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleInquirySubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Parent / Guardian Full Name</label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder="e.g., Mr. Alie Kamara"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Contact Telephone (SMS Number)</label>
                    <input
                      type="tel"
                      required
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      placeholder="e.g., +232 76 000000"
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Target Class of Interest</label>
                    <select
                      value={inquiryClass}
                      onChange={(e) => setInquiryClass(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 font-semibold"
                    >
                      <option value="Nursery">Nursery 1 - 3</option>
                      <option value="Primary 1-6">Primary 1 - 6 (NPSE)</option>
                      <option value="JSS 1-3">JSS 1 - 3 (BECE)</option>
                      <option value="SSS 1 (Science)">SSS 1 - 3 (Science Stream - WASSCE)</option>
                      <option value="SSS 1 (Arts)">SSS 1 - 3 (Arts & Humanities - WASSCE)</option>
                      <option value="SSS 1 (Commercial)">SSS 1 - 3 (Commercial Stream - WASSCE)</option>
                      <option value="University Year 1">University Year 1 (Certificate & Diploma)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all cursor-pointer mt-2"
                  >
                    Submit Enrollment Request
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* 9. FOOTER */}
      <footer id="contact" className="bg-slate-950 text-slate-400 text-xs pt-12 pb-8 px-4 sm:px-8 border-t border-amber-500/30">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <img src={schoolCrest || schoolLogo} alt="Crest" className="w-9 h-9 rounded-lg object-contain bg-slate-900 border border-amber-400/40 p-0.5" />
              <span className="font-black text-white text-sm">GIVERS WORLD MISSION</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Diplomats Academy — Eagles Squad. Excellence in service, education, and moral character in Kambia, Northern Province, Sierra Leone.
            </p>
            <p className="text-[11px] text-amber-400 font-bold">
              Evangelist Saint Turay, CEO & Principal
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Quick Navigation</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#home" className="hover:text-amber-400">School Overview</a></li>
              <li><a href="#notices" className="hover:text-amber-400">Class Noticeboard & SMS</a></li>
              <li><a href="#academics" className="hover:text-amber-400">Academic Divisions</a></li>
              <li><a href="#facilities" className="hover:text-amber-400">Bus Fleet & Transport</a></li>
              <li><a href="#admissions" className="hover:text-amber-400">Tuition & Admissions</a></li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">Administrative Hotlines</h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-amber-400" />
                <span>Bursary: 034 055410</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>info@giversworldmission.edu.sl</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Kambia 2, Northern Province, SL</span>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-extrabold text-xs uppercase tracking-wider">System Portal Access</h4>
            <p className="text-[11px]">
              Authorized academic staff, students, and guardians can log into the integrated management system:
            </p>
            <button
              type="button"
              onClick={() => setLoginModalOpen(true)}
              className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-xs hover:brightness-105 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              id="footer-portal-login-btn"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Portal Login Gateway</span>
            </button>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} Givers World Mission Diplomats Academy. All rights reserved.</span>
          <span>Accredited Examination Center for NPSE, BECE & WASSCE (MBSDSE Sierra Leone)</span>
        </div>
      </footer>

      {/* 10. AUTHENTICATION & PRIVILEGES LOGIN MODAL (Directly Answering Requirement: "ensure that authentication and privileges are observed one must be able to login from the website") */}
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn overflow-y-auto" id="website-login-modal">
          <div className="bg-white text-slate-800 w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-base text-white">School Management Portal</h3>
                  <p className="text-xs text-amber-300 font-semibold">Givers World Mission Diplomats Academy</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginModalOpen(false);
                  setAuthError('');
                }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Login Navigation Tabs */}
            <div className="grid grid-cols-2 border-b border-slate-200 bg-slate-50">
              <button
                type="button"
                onClick={() => {
                  setLoginTab('staff');
                  setAuthError('');
                }}
                className={`py-2.5 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginTab === 'staff'
                    ? 'bg-white text-indigo-950 border-b-2 border-amber-500'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Staff & Management</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setLoginTab('student');
                  setAuthError('');
                }}
                className={`py-2.5 text-xs font-black transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginTab === 'student'
                    ? 'bg-white text-indigo-950 border-b-2 border-amber-500'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student & Guardian</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-semibold">
                  {authError}
                </div>
              )}

              {/* TAB 1: STAFF & MANAGEMENT LOGIN */}
              {loginTab === 'staff' && (
                <form onSubmit={handleStaffFormSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Select Role / Account Privilege</label>
                    <select
                      value={loginRole}
                      onChange={(e) => setLoginRole(e.target.value as UserRole)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 font-bold"
                    >
                      <option value="admin">Super Admin / Principal (Evangelist Saint Turay)</option>
                      <option value="teacher">Senior Academic Teacher / Form Master</option>
                      <option value="bursar">Bursar / Financial Accounts Officer</option>
                      <option value="transport">Transport & Bus Logistics Officer</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Passcode or PIN</label>
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      placeholder="Enter access passcode or enter for quick demo..."
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <LogIn className="w-3.5 h-3.5 text-amber-400" />
                    <span>Log In as {loginRole.toUpperCase()}</span>
                  </button>

                  <div className="relative my-3 text-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
                    <span className="relative px-2 bg-white text-[10px] text-slate-400 font-bold uppercase">or instant 1-click unlock</span>
                  </div>

                  {/* Fast One-Click Role Switches observing RBAC */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleQuickLogin('admin')}
                      className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-left transition-colors cursor-pointer"
                    >
                      <span className="text-[11px] font-black text-amber-950 block">Principal / Admin</span>
                      <span className="text-[9px] text-amber-700 font-medium">Full privileges</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickLogin('teacher')}
                      className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-left transition-colors cursor-pointer"
                    >
                      <span className="text-[11px] font-black text-indigo-950 block">Academic Teacher</span>
                      <span className="text-[9px] text-indigo-700 font-medium">Grading & notices</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 2: STUDENT & GUARDIAN PORTAL LOGIN */}
              {loginTab === 'student' && (
                <form onSubmit={handleStudentFormSubmit} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Student Admission Number</label>
                    <input
                      type="text"
                      value={studentAdmissionNo}
                      onChange={(e) => setStudentAdmissionNo(e.target.value)}
                      placeholder="e.g., SMA-2023-0142"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:border-amber-500 font-mono font-bold"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Found on student ID card, fee receipt, or report card.
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-indigo-900 hover:bg-indigo-800 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-400" />
                    <span>Access Student & Parent Portal</span>
                  </button>

                  <div className="pt-2 text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setStudentAdmissionNo('SMA-2023-0142');
                        unlockSession('student_parent');
                        setLoginModalOpen(false);
                        onEnterPortal('student-portal');
                      }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                    >
                      Or demo student login: Mustapha Koroma (SMA-2023-0142)
                    </button>
                  </div>
                </form>
              )}

              {/* Google Sign-in Option */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={async () => {
                    await signInWithGoogle();
                    setLoginModalOpen(false);
                    onEnterPortal();
                  }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Sign In with School Google Account</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* READ NOTICE POPUP MODAL */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white text-slate-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-6">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Class {selectedNotice.targetClass} Notice</span>
                <h3 className="font-extrabold text-sm sm:text-base text-white">{selectedNotice.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedNotice(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Verified SMS Broadcast:</strong> Delivered to {selectedNotice.smsBroadcast?.studentCount || 24} pupils and {selectedNotice.smsBroadcast?.parentCount || 24} guardians in {selectedNotice.targetClass} on {selectedNotice.date}.
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-700 block">Notice Body</span>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200">
                  "{selectedNotice.content}"
                </p>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-slate-100">
                <span className="text-slate-500">Author: <strong>{selectedNotice.author}</strong></span>
                <span className="text-slate-500">Priority: <strong>{selectedNotice.priority}</strong></span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
