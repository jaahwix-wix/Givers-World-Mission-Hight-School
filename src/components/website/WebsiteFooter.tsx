/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  GraduationCap, 
  ShieldCheck, 
  ChevronRight, 
  Heart,
  Globe,
  Clock,
  BookOpen,
  Award
} from 'lucide-react';
import schoolLogo from '../../assets/logo.jpg';
import { SCHOOL_INFO } from '../../initialData';

interface WebsiteFooterProps {
  onNavigate: (page: string) => void;
}

export default function WebsiteFooter({ onNavigate }: WebsiteFooterProps) {
  const currentYear = new Date().getFullYear();

  const handleLink = (page: string) => {
    onNavigate(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 font-sans" id="public-website-footer">
      {/* Sierra Leone National Colors Stripe */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-emerald-600" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-blue-600" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Crest Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl overflow-hidden p-1 bg-white border border-emerald-500 shadow-md flex-shrink-0">
                <img 
                  src={schoolLogo} 
                  alt="Givers World Mission Diplomats Academy & College Crest" 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h3 className="text-white font-black text-base tracking-tight leading-tight">
                  GIVERS WORLD MISSION
                </h3>
                <p className="text-emerald-400 font-extrabold text-xs">
                  Diplomats Academy & College
                </p>
                <p className="text-amber-400 font-bold text-[11px]">
                  Eagles Squad • Kambia 1
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Dedicated to academic rigor, Christian morals, character building, and technological innovation. Providing premier education from early childhood through college diplomas in Kambia 1, Northern Province, Sierra Leone.
            </p>

            <div className="pt-1 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 text-[11px] font-bold inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                MBSDSE Accredited
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-semibold inline-flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                WAEC Center
              </span>
            </div>
          </div>

          {/* Academic Divisions */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider border-l-2 border-emerald-500 pl-2.5">
              Academic Divisions
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('academics')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  Nursery & Kindergarten (Ages 3-5)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('academics')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  Primary School (Class 1-6 • NPSE Prep)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('academics')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  Junior Secondary School (JSS 1-3 • BECE)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('academics')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  Senior Secondary (SSS 1-3 • Arts, Science, Commerce)
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('academics')}
                  className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  College Division (Higher Diplomas & Degrees)
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider border-l-2 border-emerald-500 pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('home')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  Home & Slideshow
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('about')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  About Evangelist Saint Turay & History
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('notices')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  Live Noticeboard & Class SMS Gateway
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('facilities')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  Computer Lab, Science Lab & School Buses
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('admissions')}
                  className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-emerald-500" />
                  2026/2027 Admissions & Fee Schedules
                </button>
              </li>
              <li>
                <button 
                  type="button" 
                  onClick={() => handleLink('login')}
                  className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ChevronRight className="w-3 h-3 text-amber-400" />
                  Staff, Teacher & Student Management Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Location & Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-black text-sm uppercase tracking-wider border-l-2 border-emerald-500 pl-2.5">
              Campus Location
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>Kambia 1</strong>, Northern Province,<br />
                  Sierra Leone, West Africa
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{SCHOOL_INFO.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{SCHOOL_INFO.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Mon – Fri: 7:30 AM – 4:30 PM</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => handleLink('contact')}
                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Directions & Inquiries
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Mission */}
        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>
            © {currentYear} Givers World Mission Diplomats Academy & College (Eagles Squad), Kambia 1, Sierra Leone.
          </p>
          <p className="flex items-center gap-1.5 text-slate-400">
            <span>Founded by {SCHOOL_INFO.principalName}</span>
            <span>•</span>
            <span className="text-emerald-400 font-semibold">Excellence in Christian Education</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
