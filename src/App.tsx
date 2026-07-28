/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Award, 
  CreditCard, 
  Database,
  Menu,
  X,
  FileText,
  GraduationCap,
  Bus,
  Briefcase,
  BookOpen,
  Sun,
  Moon
} from 'lucide-react';
import { Student, StudentAcademicRecord, NationalExamPrep, StudentFeeLedger, FeeTransaction } from './types';
import { 
  INITIAL_STUDENTS, 
  INITIAL_ACADEMIC_RECORDS, 
  INITIAL_NATIONAL_EXAMS, 
  INITIAL_FEE_LEDGERS,
  SCHOOL_INFO 
} from './initialData';

// Component Imports
import Dashboard from './components/Dashboard';
import StudentList from './components/StudentList';
import AcademicPortal from './components/AcademicPortal';
import ReportCardView from './components/ReportCardView';
import Financials from './components/Financials';
import DataBackup from './components/DataBackup';
import StudentPortal from './components/StudentPortal';
import BusManagement from './components/BusManagement';
import StaffManagement from './components/StaffManagement';
import Library from './components/Library';
import GlobalHeader from './components/GlobalHeader';
import { AnimatePresence } from 'motion/react';

import schoolLogo from './assets/logo.jpg';

export interface PendingFeeStudent {
  student: Student;
  feeLedger: StudentFeeLedger;
  term: number;
  totalDue: number;
  paidAmount: number;
  balance: number;
  status: 'Unpaid' | 'Partial';
}

/**
 * Identifies students with 'Unpaid' or 'Partial' fee status for the given term (defaults to current term 3)
 */
export function getPendingFeeStudents(
  students: Student[],
  fees: StudentFeeLedger[],
  term: number = 3
): PendingFeeStudent[] {
  const pendingList: PendingFeeStudent[] = [];

  students.forEach(student => {
    if (student.status !== 'Active') return;
    const ledger = fees.find(f => f.studentId === student.id);
    if (!ledger || !ledger.terms || !ledger.terms[term]) return;

    const termFee = ledger.terms[term];
    if (termFee.status === 'Unpaid' || termFee.status === 'Partial') {
      pendingList.push({
        student,
        feeLedger: ledger,
        term,
        totalDue: termFee.totalDue,
        paidAmount: termFee.paidAmount,
        balance: termFee.balance,
        status: termFee.status as 'Unpaid' | 'Partial'
      });
    }
  });

  return pendingList;
}

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const cached = localStorage.getItem('sma_theme');
    if (cached === 'dark' || cached === 'light') return cached;
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('sma_theme', theme);
  }, [theme]);

  // Navigation State
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [navigationArgs, setNavigationArgs] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Core Database States
  const [students, setStudents] = useState<Student[]>([]);
  const [records, setRecords] = useState<StudentAcademicRecord[]>([]);
  const [examPreps, setExamPreps] = useState<NationalExamPrep[]>([]);
  const [fees, setFees] = useState<StudentFeeLedger[]>([]);

  // 1. Initial Load: Sync with LocalStorage or set mocks
  useEffect(() => {
    const cachedStudents = localStorage.getItem('sma_students');
    const cachedRecords = localStorage.getItem('sma_academic_records');
    const cachedExamPreps = localStorage.getItem('sma_exam_preps');
    const cachedFees = localStorage.getItem('sma_fee_ledgers');

    if (cachedStudents && cachedRecords && cachedExamPreps && cachedFees) {
      setStudents(JSON.parse(cachedStudents));
      setRecords(JSON.parse(cachedRecords));
      setExamPreps(JSON.parse(cachedExamPreps));
      setFees(JSON.parse(cachedFees));
    } else {
      // Seed Database
      setStudents(INITIAL_STUDENTS);
      setRecords(INITIAL_ACADEMIC_RECORDS);
      setExamPreps(INITIAL_NATIONAL_EXAMS);
      setFees(INITIAL_FEE_LEDGERS);
      
      localStorage.setItem('sma_students', JSON.stringify(INITIAL_STUDENTS));
      localStorage.setItem('sma_academic_records', JSON.stringify(INITIAL_ACADEMIC_RECORDS));
      localStorage.setItem('sma_exam_preps', JSON.stringify(INITIAL_NATIONAL_EXAMS));
      localStorage.setItem('sma_fee_ledgers', JSON.stringify(INITIAL_FEE_LEDGERS));
    }
  }, []);

  // Helpers to persist state modifications
  const saveStateToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  // 2. Student CRUD Triggers & Referential Consistency
  const handleAddStudent = (newStudent: Student) => {
    const updatedStuds = [newStudent, ...students];
    setStudents(updatedStuds);
    saveStateToStorage('sma_students', updatedStuds);

    // Initialize blank terminal grades record
    const newRecord: StudentAcademicRecord = {
      studentId: newStudent.id,
      academicYear: '2025/2026',
      terms: {
        1: { grades: [], teacherRemarks: '', principalRemarks: '', conduct: 'Excellent', attendance: { totalDays: 70, presentDays: 70 } },
        2: { grades: [], teacherRemarks: '', principalRemarks: '', conduct: 'Excellent', attendance: { totalDays: 70, presentDays: 70 } },
        3: { grades: [], teacherRemarks: '', principalRemarks: '', conduct: 'Excellent', attendance: { totalDays: 70, presentDays: 70 } }
      }
    };
    const updatedRecs = [newRecord, ...records];
    setRecords(updatedRecs);
    saveStateToStorage('sma_academic_records', updatedRecs);

    // Initialize tuition fee ledger depending on class levels
    let termFee = 2500;
    if (newStudent.currentClass.startsWith('JSS')) termFee = 3500;
    if (newStudent.currentClass.startsWith('SSS')) termFee = 4500;

    const newLedger: StudentFeeLedger = {
      studentId: newStudent.id,
      academicYear: '2025/2026',
      terms: {
        1: { totalDue: termFee, paidAmount: 0, balance: termFee, status: 'Unpaid', transactions: [] },
        2: { totalDue: termFee, paidAmount: 0, balance: termFee, status: 'Unpaid', transactions: [] },
        3: { totalDue: termFee, paidAmount: 0, balance: termFee, status: 'Unpaid', transactions: [] }
      }
    };
    const updatedFees = [newLedger, ...fees];
    setFees(updatedFees);
    saveStateToStorage('sma_fee_ledgers', updatedFees);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    const updatedStuds = students.map(s => s.id === updatedStudent.id ? updatedStudent : s);
    setStudents(updatedStuds);
    saveStateToStorage('sma_students', updatedStuds);

    // Adjust fee ledgers if class tier changed (Prep/Primary to JSS or SSS)
    const original = students.find(s => s.id === updatedStudent.id);
    if (original && original.currentClass !== updatedStudent.currentClass) {
      let termFee = 2500;
      if (updatedStudent.currentClass.startsWith('JSS')) termFee = 3500;
      if (updatedStudent.currentClass.startsWith('SSS')) termFee = 4500;

      const updatedFees = fees.map(f => {
        if (f.studentId === updatedStudent.id) {
          const updatedTerms = { ...f.terms };
          [1, 2, 3].forEach(t => {
            updatedTerms[t].totalDue = termFee;
            updatedTerms[t].balance = Math.max(0, termFee - updatedTerms[t].paidAmount);
            updatedTerms[t].status = updatedTerms[t].balance <= 0 
              ? 'Paid' 
              : (updatedTerms[t].paidAmount > 0 ? 'Partial' : 'Unpaid');
          });
          return { ...f, terms: updatedTerms };
        }
        return f;
      });
      setFees(updatedFees);
      saveStateToStorage('sma_fee_ledgers', updatedFees);
    }
  };

  const handleDeleteStudent = (id: string) => {
    const updatedStuds = students.filter(s => s.id !== id);
    setStudents(updatedStuds);
    saveStateToStorage('sma_students', updatedStuds);

    // Cascade deletion of secondary records
    const updatedRecs = records.filter(r => r.studentId !== id);
    setRecords(updatedRecs);
    saveStateToStorage('sma_academic_records', updatedRecs);

    const updatedPreps = examPreps.filter(ep => ep.studentId !== id);
    setExamPreps(updatedPreps);
    saveStateToStorage('sma_exam_preps', updatedPreps);

    const updatedFees = fees.filter(f => f.studentId !== id);
    setFees(updatedFees);
    saveStateToStorage('sma_fee_ledgers', updatedFees);
  };

  // 3. Academic & Exams Updators
  const handleUpdateRecord = (updatedRecord: StudentAcademicRecord) => {
    const updated = records.map(r => r.studentId === updatedRecord.studentId ? updatedRecord : r);
    setRecords(updated);
    saveStateToStorage('sma_academic_records', updated);
  };

  const handleUpdateExamPrep = (updatedExamPrep: NationalExamPrep) => {
    const exists = examPreps.some(ep => ep.studentId === updatedExamPrep.studentId);
    let updated;
    if (exists) {
      updated = examPreps.map(ep => ep.studentId === updatedExamPrep.studentId ? updatedExamPrep : ep);
    } else {
      updated = [updatedExamPrep, ...examPreps];
    }
    setExamPreps(updated);
    saveStateToStorage('sma_exam_preps', updated);
  };

  // 4. Financial Updators (Adding transaction receipts)
  const handleAddTransaction = (studentId: string, term: number, tx: Omit<FeeTransaction, 'id'>) => {
    const newTx: FeeTransaction = {
      ...tx,
      id: `tx-${Date.now()}`
    };

    const updatedFees = fees.map(ledger => {
      if (ledger.studentId === studentId) {
        const termData = ledger.terms[term];
        const newPaid = termData.paidAmount + tx.amount;
        const newBalance = Math.max(0, termData.totalDue - newPaid);
        const newStatus = newBalance <= 0 ? 'Paid' : (newPaid > 0 ? 'Partial' : 'Unpaid');

        return {
          ...ledger,
          terms: {
            ...ledger.terms,
            [term]: {
              ...termData,
              paidAmount: newPaid,
              balance: newBalance,
              status: newStatus,
              transactions: [newTx, ...termData.transactions]
            }
          }
        };
      }
      return ledger;
    });

    setFees(updatedFees);
    saveStateToStorage('sma_fee_ledgers', updatedFees);
  };

  // 5. Restore Database from custom center
  const handleRestoreData = (data: {
    students: Student[];
    records: StudentAcademicRecord[];
    examPreps: NationalExamPrep[];
    fees: StudentFeeLedger[];
  }) => {
    setStudents(data.students);
    setRecords(data.records);
    setExamPreps(data.examPreps);
    setFees(data.fees);

    saveStateToStorage('sma_students', data.students);
    saveStateToStorage('sma_academic_records', data.records);
    saveStateToStorage('sma_exam_preps', data.examPreps);
    saveStateToStorage('sma_fee_ledgers', data.fees);
  };

  const handleResetData = () => {
    setStudents(INITIAL_STUDENTS);
    setRecords(INITIAL_ACADEMIC_RECORDS);
    setExamPreps(INITIAL_NATIONAL_EXAMS);
    setFees(INITIAL_FEE_LEDGERS);

    saveStateToStorage('sma_students', INITIAL_STUDENTS);
    saveStateToStorage('sma_academic_records', INITIAL_ACADEMIC_RECORDS);
    saveStateToStorage('sma_exam_preps', INITIAL_NATIONAL_EXAMS);
    saveStateToStorage('sma_fee_ledgers', INITIAL_FEE_LEDGERS);
  };

  // Helper to deep route tabs and clear/set navigation params
  const handleNavigate = (tab: string, arg?: any) => {
    setNavigationArgs(arg || null);
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  // Navigation Links definition
  const NAV_LINKS = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'students', label: 'Student Files', icon: Users },
    { id: 'performance', label: 'Academic Portal', icon: Award },
    { id: 'fees', label: 'Tuition Accounts', icon: CreditCard },
    { id: 'staff-management', label: 'Staff Management', icon: Briefcase },
    { id: 'library', label: 'School Library', icon: BookOpen },
    { id: 'student-portal', label: 'Student Portal', icon: GraduationCap },
    { id: 'bus-service', label: 'School Bus', icon: Bus },
    { id: 'backup', label: 'Data Center', icon: Database }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200" id="main-app-container">
      
      {/* 1. Sidebar Navigation (Desktop) - Hidden when printing report cards */}
      <aside className="w-64 bg-slate-900 text-white flex-col shrink-0 border-r border-slate-800 hidden md:flex print:hidden" id="desktop-sidebar">
        {/* Sidebar Header with SL Flag */}
        <div className="p-5 border-b border-slate-800 relative">
          <div className="flex h-1 w-full overflow-hidden rounded-full absolute top-0 left-0">
            <div className="bg-emerald-500 w-1/3"></div>
            <div className="bg-white w-1/3"></div>
            <div className="bg-blue-500 w-1/3"></div>
          </div>
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-2.5">
              <img 
                src={schoolLogo} 
                alt={`${SCHOOL_INFO.name} Logo`} 
                className="w-9 h-9 rounded-xl object-contain bg-white p-0.5 shadow-xs border border-slate-700"
                referrerPolicy="no-referrer"
              />
              <div>
                <h2 className="font-extrabold text-xs tracking-tight leading-tight uppercase">{SCHOOL_INFO.name}</h2>
                <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">Management System</span>
              </div>
            </div>
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700 shadow-xs flex items-center justify-center"
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className="flex-1 p-4 space-y-1.5" id="desktop-nav-panel">
          {NAV_LINKS.map(link => {
            const Icon = link.icon;
            const isTabActive = activeTab === link.id || (link.id === 'performance' && activeTab === 'report-card');
            return (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`w-full flex items-center gap-3 py-2.5 px-4 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isTabActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/40' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800 text-[10px] text-slate-500 font-medium">
          <p>© 2026 {SCHOOL_INFO.name}</p>
          <p className="mt-0.5">Free Quality Education Standard</p>
        </div>
      </aside>

      {/* 2. Top Header Navigation (Mobile) - Hidden when printing */}
      <header className="bg-slate-900 text-white p-4 flex justify-between items-center md:hidden print:hidden" id="mobile-header">
        <div className="flex items-center gap-2">
          <img 
            src={schoolLogo} 
            alt={`${SCHOOL_INFO.name} Logo`} 
            className="w-7 h-7 rounded-lg object-contain bg-white p-0.5 border border-slate-700"
            referrerPolicy="no-referrer"
          />
          <h2 className="font-bold text-xs uppercase">{SCHOOL_INFO.systemName}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer border border-slate-700 flex items-center justify-center"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-40 md:hidden flex justify-end" id="mobile-drawer">
            <div className="w-64 bg-slate-900 text-white h-full p-5 flex flex-col space-y-6">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <span className="font-bold text-xs tracking-wider text-indigo-400">NS RECORDER</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2">
                {NAV_LINKS.map(link => {
                  const Icon = link.icon;
                  const isTabActive = activeTab === link.id;
                  return (
                    <button
                      key={link.id}
                      onClick={() => handleNavigate(link.id)}
                      className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                        isTabActive 
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/20' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {link.label}
                    </button>
                  );
                })}
              </nav>

              <div className="text-[10px] text-slate-500 border-t border-slate-800 pt-4">
                <p>{SCHOOL_INFO.name}</p>
                <p className="text-indigo-500 font-bold mt-1">Free Quality School Education</p>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Layout Header with Search Bar */}
        <GlobalHeader 
          students={students}
          fees={fees}
          activeTab={activeTab}
          onNavigate={handleNavigate}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-8" id="workspace-viewport">
          {activeTab === 'dashboard' && (
            <Dashboard 
              students={students} 
              records={records} 
              examPreps={examPreps} 
              fees={fees} 
              onNavigate={handleNavigate}
            />
          )}

          {activeTab === 'students' && (
            <StudentList 
              students={students} 
              onAddStudent={handleAddStudent}
              onUpdateStudent={handleUpdateStudent}
              onDeleteStudent={handleDeleteStudent}
              onNavigate={handleNavigate}
              initialSearch={navigationArgs?.search}
              initialSelectedStudentId={navigationArgs?.studentId}
            />
          )}

          {activeTab === 'performance' && (
            <AcademicPortal 
              students={students} 
              records={records} 
              examPreps={examPreps} 
              onUpdateRecord={handleUpdateRecord}
              onUpdateExamPrep={handleUpdateExamPrep}
              initialSelectedStudentId={navigationArgs?.studentId}
              initialTab={navigationArgs?.tab}
            />
          )}

          {activeTab === 'report-card' && (
            <ReportCardView 
              students={students} 
              records={records} 
              onNavigateBack={() => handleNavigate('students')}
              initialStudentId={navigationArgs?.studentId}
            />
          )}

          {activeTab === 'fees' && (
            <Financials 
              students={students} 
              fees={fees} 
              onAddTransaction={handleAddTransaction}
              initialStudentId={navigationArgs?.studentId}
              initialTerm={navigationArgs?.term}
            />
          )}

          {activeTab === 'staff-management' && (
            <StaffManagement 
              students={students} 
            />
          )}

          {activeTab === 'library' && (
            <Library 
              students={students} 
            />
          )}

          {activeTab === 'student-portal' && (
            <StudentPortal 
              students={students} 
              records={records} 
              fees={fees} 
            />
          )}

          {activeTab === 'bus-service' && (
            <BusManagement 
              students={students} 
            />
          )}

          {activeTab === 'backup' && (
            <DataBackup 
              students={students} 
              records={records} 
              examPreps={examPreps} 
              fees={fees} 
              onRestoreData={handleRestoreData}
              onResetData={handleResetData}
            />
          )}
        </main>
      </div>

    </div>
  );
}
