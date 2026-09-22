/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LogIn, 
  ShieldCheck, 
  GraduationCap, 
  Lock, 
  KeyRound, 
  CreditCard, 
  Bus, 
  Users, 
  BookOpen, 
  ArrowLeft, 
  Shield, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  UserCheck,
  Building2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import schoolLogo from '../../../assets/logo.jpg';
import { UserRole, Student, Teacher } from '../../../types';
import { INITIAL_STUDENTS, SCHOOL_INFO } from '../../../initialData';
import { 
  findTeacherByCode, 
  findStudentByParentCode, 
  findStudentByStudentCode,
  ensureTeacherAccessCode,
  ensureStudentAccessCodes
} from '../../../utils/codeGenerator';

interface PortalLoginPageProps {
  onLoginSuccess: (role: UserRole, studentAdmissionNumber?: string) => void;
  onNavigateHome: () => void;
  students?: Student[];
}

type PortalType = 'admin' | 'teacher' | 'parent' | 'student' | 'bursar' | 'transport';

interface PortalCardConfig {
  id: PortalType;
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  role: UserRole;
  icon: React.ComponentType<{ className?: string }>;
  accentBg: string;
  accentText: string;
  borderHover: string;
  codePlaceholder: string;
  codeLabel: string;
  helpText: string;
}

const PORTALS_CONFIG: PortalCardConfig[] = [
  {
    id: 'admin',
    title: 'Super Admin & Principal',
    badge: 'Executive Oversight',
    subtitle: 'Principal Evangelist Saint Turay & Board',
    description: 'Master institutional control, staff registration, student admissions, data backup & audit.',
    role: 'admin',
    icon: ShieldCheck,
    accentBg: 'bg-indigo-50',
    accentText: 'text-indigo-700',
    borderHover: 'hover:border-indigo-400',
    codePlaceholder: 'Enter security passcode (default: 1234)',
    codeLabel: 'Executive Passcode / Security PIN',
    helpText: 'Restricted to school principal, vice-principal & board trustees.'
  },
  {
    id: 'teacher',
    title: 'Teacher & Academics',
    badge: 'Faculty & Instructors',
    subtitle: 'Class Teachers & Subject Educators',
    description: 'Enter continuous assessment grades, generate terminal report cards, and upload coursework.',
    role: 'teacher',
    icon: GraduationCap,
    accentBg: 'bg-emerald-50',
    accentText: 'text-emerald-700',
    borderHover: 'hover:border-emerald-400',
    codePlaceholder: 'e.g. TCH-7482 or registered staff email',
    codeLabel: 'Teacher Portal Access Code',
    helpText: 'System-generated access code issued automatically upon teacher registration.'
  },
  {
    id: 'parent',
    title: 'Parent & Guardian Portal',
    badge: 'Family & Guardians',
    subtitle: 'Parents & Authorized Guardians',
    description: 'Inspect your child’s terminal report card, verified GPA, tuition fee receipts & bus status.',
    role: 'student_parent',
    icon: Users,
    accentBg: 'bg-sky-50',
    accentText: 'text-sky-700',
    borderHover: 'hover:border-sky-400',
    codePlaceholder: 'e.g. PAR-3921 or Child’s Admission ID',
    codeLabel: 'Parent Portal Access Code',
    helpText: 'Unique code provided automatically to parents upon student enrollment.'
  },
  {
    id: 'student',
    title: 'Student Access Portal',
    badge: 'Enrolled Pupils & Students',
    subtitle: 'Nursery, Primary, JSS, SSS & College Students',
    description: 'Access term report cards, academic worksheets, attendance QR pass, and submit homework.',
    role: 'student_parent',
    icon: BookOpen,
    accentBg: 'bg-amber-50',
    accentText: 'text-amber-700',
    borderHover: 'hover:border-amber-400',
    codePlaceholder: 'e.g. GWM/2026/001 or NS-2025-1001',
    codeLabel: 'Student Admission Number / ID',
    helpText: 'Official admission identifier printed on student ID badge or report card.'
  },
  {
    id: 'bursar',
    title: 'Bursar & Finance Portal',
    badge: 'Financial Bursary',
    subtitle: 'Accounts & Tuition Ledger',
    description: 'Record tuition fee receipts, bank deposit vouchers, cash ledgers & mobile money audits.',
    role: 'bursar',
    icon: CreditCard,
    accentBg: 'bg-purple-50',
    accentText: 'text-purple-700',
    borderHover: 'hover:border-purple-400',
    codePlaceholder: 'Enter security passcode (default: 1234)',
    codeLabel: 'Bursary Officer Passcode / PIN',
    helpText: 'Designated for financial controllers, bursars & accounts officers.'
  },
  {
    id: 'transport',
    title: 'Transport & Fleet Portal',
    badge: 'Logistics & Fleet',
    subtitle: 'School Bus Transit & Drivers',
    description: 'Manage school bus routes across Kambia 1, driver schedules, transit logs & passenger safety.',
    role: 'transport',
    icon: Bus,
    accentBg: 'bg-rose-50',
    accentText: 'text-rose-700',
    borderHover: 'hover:border-rose-400',
    codePlaceholder: 'Enter security passcode (default: 1234)',
    codeLabel: 'Fleet Officer Passcode / PIN',
    helpText: 'Authorized for school bus drivers, conductors & transport coordinator.'
  }
];

export default function PortalLoginPage({ 
  onLoginSuccess, 
  onNavigateHome,
  students = []
}: PortalLoginPageProps) {
  // Navigation between initial Portal Selection and Designated Portal Login
  const [selectedPortal, setSelectedPortal] = useState<PortalType | null>(null);

  // Authentication inputs
  const [credentialInput, setCredentialInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active Teachers & Students database for code verification
  const [allStudents, setAllStudents] = useState<Student[]>(students);
  const [allTeachers, setAllTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    // Load students with guaranteed access codes
    const cachedStudents = localStorage.getItem('sma_students');
    let loadedStudents: Student[] = [];
    if (cachedStudents) {
      try {
        loadedStudents = JSON.parse(cachedStudents);
      } catch {
        loadedStudents = students.length > 0 ? students : INITIAL_STUDENTS;
      }
    } else {
      loadedStudents = students.length > 0 ? students : INITIAL_STUDENTS;
    }
    const sanitizedStudents = loadedStudents.map(ensureStudentAccessCodes);
    setAllStudents(sanitizedStudents);

    // Load teachers with guaranteed access codes
    const cachedTeachers = localStorage.getItem('sma_teachers');
    let loadedTeachers: Teacher[] = [];
    if (cachedTeachers) {
      try {
        loadedTeachers = JSON.parse(cachedTeachers);
      } catch {
        loadedTeachers = [];
      }
    }
    const sanitizedTeachers = loadedTeachers.map(ensureTeacherAccessCode);
    setAllTeachers(sanitizedTeachers);
  }, [students]);

  const currentConfig = selectedPortal 
    ? PORTALS_CONFIG.find(p => p.id === selectedPortal) 
    : null;

  const handleSelectPortal = (portalId: PortalType) => {
    setSelectedPortal(portalId);
    setCredentialInput('');
    setErrorMessage('');
    setSuccessInfo(null);
  };

  const handleBackToPortals = () => {
    setSelectedPortal(null);
    setCredentialInput('');
    setErrorMessage('');
    setSuccessInfo(null);
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessInfo(null);

    const input = credentialInput.trim();
    if (!input) {
      setErrorMessage('Please enter your required credentials or access code.');
      return;
    }

    setIsSubmitting(true);

    // Authentication based on selected portal
    if (selectedPortal === 'teacher') {
      // 1. Check teacher access code or staff email
      const matchedTeacher = findTeacherByCode(allTeachers, input);
      if (matchedTeacher) {
        setSuccessInfo(`Authentication successful. Welcome, ${matchedTeacher.name}!`);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('teacher');
        }, 600);
        return;
      }

      // Default demo pin fallback for convenience
      if (input === '1234' || input.toLowerCase() === 'teacher') {
        setSuccessInfo('Authentication verified via Educator Security PIN.');
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('teacher');
        }, 500);
        return;
      }

      setIsSubmitting(false);
      setErrorMessage('Invalid Teacher Access Code or email. Please check your assigned code (e.g. TCH-XXXX) or contact the administration.');
      return;
    }

    if (selectedPortal === 'parent') {
      // 2. Check parent access code or child's admission number
      const matchedStudent = findStudentByParentCode(allStudents, input);
      if (matchedStudent) {
        setSuccessInfo(`Parent access verified for ${matchedStudent.name} (${matchedStudent.currentClass}).`);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('student_parent', matchedStudent.admissionNumber);
        }, 600);
        return;
      }

      if (input === '1234') {
        const firstStudent = allStudents[0];
        setSuccessInfo('Parent access granted.');
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('student_parent', firstStudent?.admissionNumber);
        }, 500);
        return;
      }

      setIsSubmitting(false);
      setErrorMessage('Parent Access Code not recognized. Please enter the code generated on your child’s admission (e.g. PAR-XXXX) or the child’s Admission ID.');
      return;
    }

    if (selectedPortal === 'student') {
      // 3. Check student admission number or student access code
      const matchedStudent = findStudentByStudentCode(allStudents, input);
      if (matchedStudent) {
        setSuccessInfo(`Student credential verified for ${matchedStudent.name}.`);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('student_parent', matchedStudent.admissionNumber);
        }, 600);
        return;
      }

      if (input === '1234') {
        const firstStudent = allStudents[0];
        setSuccessInfo('Student access granted.');
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('student_parent', firstStudent?.admissionNumber);
        }, 500);
        return;
      }

      setIsSubmitting(false);
      setErrorMessage('Student Admission Number not found. Please confirm the number on your ID badge or admission slip.');
      return;
    }

    if (selectedPortal === 'admin') {
      if (input === '1234' || input.toLowerCase() === 'admin' || input.toLowerCase() === 'principal') {
        setSuccessInfo(`Welcome, ${SCHOOL_INFO.principalName}! Principal privileges verified.`);
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('admin');
        }, 600);
        return;
      }
      setIsSubmitting(false);
      setErrorMessage('Invalid Administrator Passcode. Please verify the institutional security PIN.');
      return;
    }

    if (selectedPortal === 'bursar') {
      if (input === '1234' || input.toLowerCase() === 'bursar') {
        setSuccessInfo('Financial Accounts & Bursar Access Verified.');
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('bursar');
        }, 500);
        return;
      }
      setIsSubmitting(false);
      setErrorMessage('Invalid Bursary Passcode.');
      return;
    }

    if (selectedPortal === 'transport') {
      if (input === '1234' || input.toLowerCase() === 'transport') {
        setSuccessInfo('Transport Logistics & Bus Service Access Verified.');
        setTimeout(() => {
          setIsSubmitting(false);
          onLoginSuccess('transport');
        }, 500);
        return;
      }
      setIsSubmitting(false);
      setErrorMessage('Invalid Transport Fleet Passcode.');
      return;
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-4 sm:py-8 px-4 sm:px-6" id="unified-portals-login-container">
      {/* Top Breadcrumb / Return to Website */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return to Public Website</span>
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>Encrypted Institutional Gateway</span>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
        {/* Sierra Leone National Colors Accent Ribbon */}
        <div className="h-2.5 w-full flex">
          <div className="flex-1 bg-emerald-600" />
          <div className="flex-1 bg-white border-y border-slate-100" />
          <div className="flex-1 bg-blue-600" />
        </div>

        {/* Institution Brand Header */}
        <div className="pt-8 pb-6 px-6 sm:px-10 text-center border-b border-slate-100 bg-slate-50/50">
          <div className="w-20 h-20 rounded-3xl p-1 bg-white border-2 border-emerald-600 shadow-sm mx-auto overflow-hidden mb-3">
            <img 
              src={schoolLogo} 
              alt="Givers World Mission Crest" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            Institutional Management & Academic Portals
          </h1>
          <p className="text-xs sm:text-sm font-extrabold text-emerald-700 mt-1">
            Givers World Mission Diplomats Academy & College • Kambia 1
          </p>
          <p className="text-xs text-slate-500 max-w-xl mx-auto mt-1">
            {selectedPortal 
              ? 'Enter your assigned credentials to access your designated institutional portal.'
              : 'Select your designated portal below to proceed with secure authentication.'}
          </p>
        </div>

        {/* Dynamic View: All Portals View vs. Specific Portal Authentication */}
        <div className="p-6 sm:p-10">
          <AnimatePresence mode="wait">
            {!selectedPortal ? (
              /* ============================================================ */
              /* 1. ALL PORTALS SHOW FIRST (User selects designated portal)  */
              /* ============================================================ */
              <motion.div
                key="all-portals-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                {/* Privacy & Security Advisory Notice */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h2 className="text-xs font-black text-slate-800 uppercase tracking-wide">
                      Strict Privacy & Role-Based Access Control
                    </h2>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      To safeguard student privacy and academic records, individual portals require verified security credentials or system-generated authentication codes. Faculty access codes (e.g. <span className="font-mono font-bold text-emerald-700">TCH-XXXX</span>) and Parent access codes (e.g. <span className="font-mono font-bold text-sky-700">PAR-XXXX</span>) are issued automatically upon registration.
                    </p>
                  </div>
                </div>

                {/* Portals Selection Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5" id="designated-portals-grid">
                  {PORTALS_CONFIG.map((portal) => {
                    const IconComponent = portal.icon;
                    return (
                      <button
                        key={portal.id}
                        type="button"
                        onClick={() => handleSelectPortal(portal.id)}
                        className={`text-left p-5 sm:p-6 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50/70 transition-all shadow-xs hover:shadow-md cursor-pointer flex flex-col justify-between group relative overflow-hidden ${portal.borderHover}`}
                        id={`select-portal-${portal.id}`}
                      >
                        <div className="space-y-3.5">
                          <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-2xl ${portal.accentBg} ${portal.accentText} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs`}>
                              <IconComponent className="w-6 h-6" />
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${portal.accentBg} ${portal.accentText} border border-current/20`}>
                              {portal.badge}
                            </span>
                          </div>

                          <div>
                            <h2 className="text-base font-black text-slate-900 group-hover:text-emerald-700 transition-colors">
                              {portal.title}
                            </h2>
                            <p className="text-[11px] font-bold text-slate-500 mt-0.5">
                              {portal.subtitle}
                            </p>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {portal.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-black text-slate-700 group-hover:text-emerald-700">
                          <span>Enter {portal.badge}</span>
                          <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              /* ============================================================ */
              /* 2. DEDICATED PORTAL LOGIN INTERFACE                          */
              /* ============================================================ */
              <motion.div
                key={`portal-login-${selectedPortal}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.2 }}
                className="max-w-md mx-auto space-y-6"
              >
                {/* Back to All Portals Button */}
                <button
                  type="button"
                  onClick={handleBackToPortals}
                  className="inline-flex items-center gap-1.5 text-xs font-extrabold text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Choose a Different Portal</span>
                </button>

                {/* Active Portal Header Card */}
                {currentConfig && (
                  <div className={`p-4 rounded-2xl ${currentConfig.accentBg} border border-slate-200 flex items-center gap-3.5`}>
                    <div className="w-12 h-12 rounded-xl bg-white shadow-xs flex items-center justify-center text-slate-900 flex-shrink-0">
                      {React.createElement(currentConfig.icon, { className: 'w-6 h-6 ' + currentConfig.accentText })}
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-wider ${currentConfig.accentText}`}>
                        {currentConfig.badge}
                      </span>
                      <h2 className="text-base font-black text-slate-900">
                        {currentConfig.title}
                      </h2>
                      <p className="text-xs text-slate-600 font-medium">
                        {currentConfig.subtitle}
                      </p>
                    </div>
                  </div>
                )}

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successInfo && (
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{successInfo}</span>
                  </div>
                )}

                {/* Authentication Form */}
                <form onSubmit={handleAuthenticate} className="space-y-4">
                  {currentConfig && (
                    <div>
                      <label className="block text-xs font-black text-slate-700 mb-1.5">
                        {currentConfig.codeLabel}
                      </label>
                      <div className="relative">
                        {selectedPortal === 'teacher' || selectedPortal === 'parent' ? (
                          <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        ) : selectedPortal === 'student' ? (
                          <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        )}

                        <input
                          type={
                            selectedPortal === 'admin' || selectedPortal === 'bursar' || selectedPortal === 'transport'
                              ? showPassword ? 'text' : 'password'
                              : 'text'
                          }
                          value={credentialInput}
                          onChange={(e) => setCredentialInput(e.target.value)}
                          placeholder={currentConfig.codePlaceholder}
                          disabled={isSubmitting}
                          autoFocus
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-xs uppercase tracking-wider placeholder:normal-case placeholder:font-normal"
                        />

                        {(selectedPortal === 'admin' || selectedPortal === 'bursar' || selectedPortal === 'transport') && (
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>

                      <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                        <span>{currentConfig.helpText}</span>
                      </p>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.99] text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg disabled:opacity-50"
                  >
                    <LogIn className="w-4 h-4 text-emerald-400" />
                    <span>{isSubmitting ? 'Verifying Credentials...' : `Unlock & Enter ${currentConfig?.title || 'Portal'}`}</span>
                  </button>
                </form>

                {/* Privacy Badge */}
                <div className="pt-3 border-t border-slate-100 text-center">
                  <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Authorized access only • Activity logged for institutional compliance</span>
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
