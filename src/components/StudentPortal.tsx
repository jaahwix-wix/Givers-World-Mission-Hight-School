/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  User, 
  Award, 
  CreditCard, 
  LogOut, 
  Phone, 
  MapPin, 
  Calendar, 
  Heart, 
  ShieldAlert, 
  Printer, 
  FileText, 
  CheckCircle, 
  ArrowRight,
  TrendingUp,
  AlertCircle,
  ClipboardList,
  UploadCloud,
  X
} from 'lucide-react';
import { Student, StudentAcademicRecord, StudentFeeLedger, StudentClass } from '../types';
import { SCHOOL_INFO } from '../initialData';
import { getSubjectsForClass, calculateGrade, getGradingScale } from '../constants';

interface StudentPortalProps {
  students: Student[];
  records: StudentAcademicRecord[];
  fees: StudentFeeLedger[];
}

export default function StudentPortal({ students, records, fees }: StudentPortalProps) {
  // Login State
  const [admissionInput, setAdmissionInput] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loggedInStudent, setLoggedInStudent] = useState<Student | null>(null);
  
  // Active Tab inside Portal
  const [activeTab, setActiveTab] = useState<'overview' | 'academics' | 'financials' | 'assignments'>('overview');
  
  // Assignments and Submissions lists loaded from storage
  const [assignments, setAssignments] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);

  // Submission modal form states
  const [submittingAssignmentId, setSubmittingAssignmentId] = useState<string | null>(null);
  const [textResponse, setTextResponse] = useState('');
  const [mockFileName, setMockFileName] = useState('');
  const [mockFileSize, setMockFileSize] = useState('');

  // Sync with LocalStorage
  useEffect(() => {
    const handleStorageUpdate = () => {
      const cachedAssignments = localStorage.getItem('sma_assignments');
      const cachedSubmissions = localStorage.getItem('sma_submissions');
      if (cachedAssignments) setAssignments(JSON.parse(cachedAssignments));
      if (cachedSubmissions) setSubmissions(JSON.parse(cachedSubmissions));
    };

    handleStorageUpdate();
    // Also listen to storage events to keep sync when tabs change
    window.addEventListener('storage', handleStorageUpdate);
    return () => window.removeEventListener('storage', handleStorageUpdate);
  }, [activeTab]);
  
  // Academics selector
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(3);
  
  // Quick login handler
  const handleLogin = (admissionNumber: string) => {
    const found = students.find(
      s => s.admissionNumber.trim().toLowerCase() === admissionNumber.trim().toLowerCase()
    );
    
    if (found) {
      if (found.status !== 'Active') {
        setErrorMessage('This student record is no longer active.');
        return;
      }
      setLoggedInStudent(found);
      setErrorMessage(null);
      setActiveTab('overview');
    } else {
      setErrorMessage('Admission Number not found. Please try again or use the quick access links.');
    }
  };

  const handleLogout = () => {
    setLoggedInStudent(null);
    setAdmissionInput('');
    setErrorMessage(null);
  };

  // Pre-filtered quick logins for convenience in testing
  const activeStudents = students.filter(s => s.status === 'Active').slice(0, 4);

  // If NOT logged in, show elegant Login Gate
  if (!loggedInStudent) {
    return (
      <div className="max-w-md mx-auto my-8 bg-white border border-slate-100 rounded-3xl p-6 md:p-8 shadow-md" id="student-portal-login-gate">
        <div className="flex h-1.5 w-full overflow-hidden rounded-full mb-6">
          <div className="bg-emerald-500 w-1/3"></div>
          <div className="bg-white w-1/3 border-y border-slate-100"></div>
          <div className="bg-blue-500 w-1/3"></div>
        </div>

        <div className="text-center space-y-2 mb-6">
          <img 
            src={SCHOOL_INFO.logo} 
            alt={`${SCHOOL_INFO.name} Logo`} 
            className="w-16 h-16 object-contain rounded-2xl bg-white p-1 border border-slate-200 shadow-sm mx-auto"
            referrerPolicy="no-referrer"
          />
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Student Access Portal</h2>
          <p className="text-xs text-slate-400">Enter your admission identifier to view academic and fee ledgers</p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(admissionInput);
          }}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block">Admission ID Number</label>
            <input 
              type="text" 
              value={admissionInput}
              onChange={(e) => setAdmissionInput(e.target.value)}
              placeholder="e.g. SMA-2023-0142"
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 placeholder-slate-400 font-mono uppercase font-bold"
              required
            />
          </div>

          {errorMessage && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-600 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all shadow-sm cursor-pointer"
          >
            Access Portal <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Directory */}
        <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block text-center">
            Sandbox Fast Access Links
          </span>
          <div className="grid grid-cols-1 gap-2">
            {activeStudents.map(student => (
              <button
                key={student.id}
                onClick={() => {
                  setAdmissionInput(student.admissionNumber);
                  handleLogin(student.admissionNumber);
                }}
                className="flex items-center justify-between p-2.5 bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/40 rounded-xl text-xs text-left transition-colors cursor-pointer group"
              >
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-indigo-700">{student.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono">{student.admissionNumber} • {student.currentClass}</p>
                </div>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Auto login
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Loaded Profile and Records
  const student = loggedInStudent;
  const academicRecord = records.find(r => r.studentId === student.id);
  const feeLedger = fees.find(f => f.studentId === student.id);

  // Term Calculations
  const termData = academicRecord?.terms[selectedTerm];
  const grades = termData?.grades || [];
  const totalScoreSum = grades.reduce((sum, g) => sum + g.totalScore, 0);
  const averageScore = grades.length > 0 ? Math.round(totalScoreSum / grades.length) : 0;

  // Print single Term Report Helper
  const handlePrintPortalReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6" id="student-portal-dashboard">
      {/* 1. Portal Top banner */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        {/* Flag background ribbon */}
        <div className="flex h-1 w-full overflow-hidden absolute top-0 left-0">
          <div className="bg-emerald-500 w-1/3"></div>
          <div className="bg-white w-1/3"></div>
          <div className="bg-blue-500 w-1/3"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            {student.profileImage ? (
              <img
                src={student.profileImage}
                alt={student.name}
                referrerPolicy="no-referrer"
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700 shadow-md"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-xl border border-indigo-500 shadow-md">
                {student.name.split(' ').map(n => n[0]).join('')}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700 font-mono">
                  {student.admissionNumber}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                  Student Account
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-1">{student.name}</h2>
              <p className="text-xs text-slate-400 mt-0.5">Current Grade: <span className="font-bold text-white">{student.currentClass}</span> {student.stream ? `(${student.stream} Stream)` : ''}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="self-start md:self-auto flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 font-semibold text-xs transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </div>

      {/* 2. Portal Sub-tabs */}
      <div className="flex border-b border-slate-200" id="portal-tabs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <User className="w-4 h-4" /> Personal Profile
        </button>
        <button
          onClick={() => setActiveTab('academics')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'academics'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Award className="w-4 h-4" /> Report Cards
        </button>
        <button
          onClick={() => setActiveTab('financials')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'financials'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <CreditCard className="w-4 h-4" /> Tuition & Fees
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 py-3 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeTab === 'assignments'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <ClipboardList className="w-4 h-4" /> Home Assignments
        </button>
      </div>

      {/* 3. Portal Tab Render Content */}
      <div className="space-y-6">
        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="portal-overview-pane">
            {/* Left Col: Biographic details */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3">Biographical Profile</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Full Name</span>
                    <span className="font-bold text-slate-700">{student.name}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Admission Number</span>
                    <span className="font-bold text-slate-700 font-mono">{student.admissionNumber}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Date of Birth</span>
                    <span className="font-bold text-slate-700">{student.dateOfBirth}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Home Address</span>
                    <span className="font-bold text-slate-700">{student.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Parent / Guardian Name</span>
                    <span className="font-bold text-slate-700">{student.parentName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Parent Contact Phone</span>
                    <span className="font-bold text-slate-700">{student.parentPhone}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Col: Medical details */}
            <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-800 border-b border-slate-50 pb-3 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" /> Medical Summary
                </h3>
                
                <div className="mt-4 space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-rose-50 border border-rose-100 rounded-xl p-3 text-center">
                      <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider block">Blood Group</span>
                      <span className="text-2xl font-black text-rose-700">{student.bloodType || 'N/A'}</span>
                    </div>

                    <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl p-3">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-0.5">Allergies</span>
                      <p className="text-xs font-bold text-slate-700 line-clamp-2">
                        {student.allergies && student.allergies.trim().toLowerCase() !== 'none' && student.allergies.trim() !== ''
                          ? student.allergies 
                          : 'No documented allergies'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl space-y-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Assigned Emergency Contact
                    </span>
                    {student.emergencyContactName ? (
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between items-center font-bold text-slate-700">
                          <span>{student.emergencyContactName}</span>
                          <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                            {student.emergencyContactRelation || 'Contact'}
                          </span>
                        </div>
                        <p className="text-slate-500 flex items-center gap-1.5 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {student.emergencyContactPhone || 'No contact phone'}
                        </p>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">
                        No specific contact designated. Primary contact: {student.parentPhone} ({student.parentName})
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-indigo-600 bg-indigo-50/50 rounded-xl p-3 text-center font-bold">
                🔒 Keep your emergency details up-to-date with the School Administration registrar.
              </div>
            </div>
          </div>
        )}

        {/* ACADEMICS TAB */}
        {activeTab === 'academics' && (
          <div className="space-y-6" id="portal-academics-pane">
            {/* Filter Bar inside tab */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Academic Term:</span>
                <select
                  value={selectedTerm}
                  onChange={(e) => setSelectedTerm(parseInt(e.target.value) as any)}
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="1">Term 1 Record</option>
                  <option value="2">Term 2 Record</option>
                  <option value="3">Term 3 Record (Final)</option>
                </select>
              </div>

              <button 
                onClick={handlePrintPortalReport}
                className="flex items-center justify-center gap-1.5 py-1.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" /> Print Term Report Card
              </button>
            </div>

            {academicRecord && termData ? (
              <div className="bg-white border-2 border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-md max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
                {/* Sierra Leone Flag colors header */}
                <div className="flex h-1.5 w-full overflow-hidden rounded-full">
                  <div className="bg-emerald-500 w-1/3"></div>
                  <div className="bg-white w-1/3 border-y border-slate-100"></div>
                  <div className="bg-blue-500 w-1/3"></div>
                </div>

                {/* Report Card Header */}
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left border-b-2 border-slate-800 pb-5 gap-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white border-2 border-slate-800 font-bold shrink-0 relative overflow-hidden">
                      <span className="text-[10px] tracking-tight text-indigo-400 font-mono">NS</span>
                      <span className="text-[8px] text-slate-400 font-sans uppercase">Portal</span>
                    </div>
                    
                    <div className="space-y-1">
                      <h1 className="text-lg md:text-xl font-black text-slate-800 tracking-tight font-sans uppercase">{SCHOOL_INFO.name}</h1>
                      <p className="text-[10px] font-bold text-indigo-600 italic">" {SCHOOL_INFO.motto} "</p>
                      <p className="text-[10px] text-slate-500 font-medium">Phone: {SCHOOL_INFO.phone} | Email: {SCHOOL_INFO.email}</p>
                    </div>
                  </div>

                  <div className="text-center md:text-right md:shrink-0">
                    <span className="inline-block px-2.5 py-1 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-md border border-slate-900">
                      Academic Term Report
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-2">Academic Year: {academicRecord.academicYear}</p>
                    <p className="text-xs font-bold text-indigo-600">Term {selectedTerm} Terminal Assessment</p>
                  </div>
                </div>

                {/* Profile row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-50 text-xs font-medium text-slate-600">
                  <div>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Student Name</p>
                    <p className="font-bold text-slate-800 text-sm truncate">{student.name}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Admission ID</p>
                    <p className="font-bold text-slate-800 font-mono">{student.admissionNumber}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Class Grade</p>
                    <p className="font-bold text-slate-800">{student.currentClass} {student.stream ? `(${student.stream})` : ''}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-bold text-[9px] uppercase tracking-wider">Attendance</p>
                    <p className="font-bold text-slate-800">
                      {termData.attendance?.presentDays || 0} / {termData.attendance?.totalDays || 0} Days
                    </p>
                  </div>
                </div>

                {/* Subject Grades Table */}
                {grades.length > 0 ? (
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px]">
                        <tr>
                          <th className="py-3 px-4">Subject</th>
                          <th className="py-3 px-3 text-center">CA Score (40)</th>
                          <th className="py-3 px-3 text-center">Exam (60)</th>
                          <th className="py-3 px-3 text-center">Total (100)</th>
                          <th className="py-3 px-3 text-center">Grade</th>
                          <th className="py-3 px-4">Remark</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {grades.map((gradeRow) => (
                          <tr key={gradeRow.id} className="hover:bg-slate-50/50">
                            <td className="py-3 px-4 font-bold text-slate-900">{gradeRow.subject}</td>
                            <td className="py-3 px-3 text-center font-mono">{gradeRow.caScore}</td>
                            <td className="py-3 px-3 text-center font-mono">{gradeRow.examScore}</td>
                            <td className="py-3 px-3 text-center font-bold text-slate-900 font-mono">{gradeRow.totalScore}</td>
                            <td className="py-3 px-3 text-center">
                              <span className={`inline-block font-black px-2 py-0.5 rounded text-[11px] ${
                                ['A', 'A1', 'B2', 'B3'].some(g => gradeRow.grade.startsWith(g))
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : (gradeRow.grade === 'F9' || gradeRow.grade === 'E' ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700')
                              }`}>
                                {gradeRow.grade}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs font-semibold">{gradeRow.remark}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-semibold">Assessment grades pending for Term {selectedTerm}</p>
                    <p className="text-[10px] text-slate-400">Grades are published at the end of each assessment cycle.</p>
                  </div>
                )}

                {/* Bottom Comments / Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-4 border-t border-slate-200 text-xs">
                  {/* Summary performance numbers */}
                  <div className="md:col-span-4 bg-slate-50 rounded-2xl p-4 space-y-3 flex flex-col justify-center">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Average Terminal Score</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-black text-slate-800">{averageScore}%</span>
                        <span className="text-xs text-slate-400">/ 100%</span>
                      </div>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Conduct Grade</span>
                      <span className="text-xs font-bold text-indigo-600 bg-indigo-50/80 px-2 py-0.5 rounded mt-1 inline-block">
                        {termData.conduct || 'Excellent'}
                      </span>
                    </div>
                  </div>

                  {/* Teacher Comments */}
                  <div className="md:col-span-8 space-y-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Class Teacher Remarks</span>
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl font-semibold italic text-slate-600">
                        "{termData.teacherRemarks || 'A great performance. Continue to focus on core technical papers next term.'}"
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Principal remarks</span>
                      <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl font-semibold italic text-slate-600">
                        "{termData.principalRemarks || 'Approved. Exceptional dedication to self-improvement.'}"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer seal */}
                <div className="flex justify-between items-end pt-8 border-t border-slate-100 text-[10px] text-slate-400">
                  <div>
                    <p>Generated via Student Access Portal</p>
                    <p className="font-mono mt-0.5">Hash Code: SMA-{student.id}-{selectedTerm}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-700">{SCHOOL_INFO.principalName}</p>
                    <p className="italic">School Principal Seal & Signature</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <Award className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">No Academic Records Found</p>
                <p className="text-xs text-slate-400 mt-1">Please ask your administrator to register your academic profiles.</p>
              </div>
            )}
          </div>
        )}

        {/* FINANCIALS TAB */}
        {activeTab === 'financials' && (
          <div className="space-y-6" id="portal-financials-pane">
            {feeLedger ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Side: Summary and term blocks */}
                <div className="lg:col-span-4 space-y-4">
                  <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tuition Account Summary</h4>
                    
                    {[1, 2, 3].map((termNum) => {
                      const tData = feeLedger.terms[termNum];
                      if (!tData) return null;
                      
                      const badgeStyles = {
                        Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                        Partial: 'bg-amber-50 text-amber-700 border-amber-100',
                        Unpaid: 'bg-rose-50 text-rose-700 border-rose-100'
                      };

                      return (
                        <div key={termNum} className="p-3.5 bg-slate-50/60 border border-slate-100 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-slate-800">Term {termNum} Tuition</span>
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeStyles[tData.status] || badgeStyles.Unpaid}`}>
                              {tData.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-1 text-center font-mono text-xs pt-1.5 border-t border-slate-200/50">
                            <div>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Due</span>
                              <span className="font-bold text-slate-700">SLL {tData.totalDue}</span>
                            </div>
                            <div>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Paid</span>
                              <span className="font-bold text-emerald-600">SLL {tData.paidAmount}</span>
                            </div>
                            <div>
                              <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider block">Balance</span>
                              <span className={`font-extrabold ${tData.balance > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                                SLL {tData.balance}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Right Side: Transactions History */}
                <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" /> Payment Transaction Receipts
                  </h4>

                  {/* Extract all transactions across terms */}
                  {(() => {
                    const allTx: Array<{ term: number; id: string; amount: number; date: string; paymentMethod: string; receiptNumber: string }> = [];
                    [1, 2, 3].forEach(tNum => {
                      const termData = feeLedger.terms[tNum];
                      if (termData?.transactions) {
                        termData.transactions.forEach(tx => {
                          allTx.push({ ...tx, term: tNum });
                        });
                      }
                    });

                    // Sort newest transactions first
                    allTx.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    if (allTx.length === 0) {
                      return (
                        <div className="py-12 text-center text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
                          <CreditCard className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                          <p className="text-xs font-semibold">No transactions recorded yet</p>
                          <p className="text-[10px] text-slate-400">Payments registered by bank draft or office cashier will appear here.</p>
                        </div>
                      );
                    }

                    return (
                      <div className="border border-slate-100 rounded-2xl overflow-hidden shadow-xs">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase font-bold text-[9px] tracking-wider">
                            <tr>
                              <th className="py-3 px-4">Receipt ID</th>
                              <th className="py-3 px-3">Date</th>
                              <th className="py-3 px-3">Term</th>
                              <th className="py-3 px-3">Method</th>
                              <th className="py-3 px-3 text-right">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                            {allTx.map((tx) => (
                              <tr key={tx.id} className="hover:bg-slate-50/50">
                                <td className="py-3 px-4 font-mono font-bold text-indigo-600">{tx.receiptNumber || tx.id}</td>
                                <td className="py-3 px-3 font-mono text-[11px]">{tx.date}</td>
                                <td className="py-3 px-3">
                                  <span className="font-bold bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">
                                    Term {tx.term}
                                  </span>
                                </td>
                                <td className="py-3 px-3 text-slate-500">{tx.paymentMethod}</td>
                                <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">SLL {tx.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    );
                  })()}
                </div>

              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <CreditCard className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                <p className="text-sm font-semibold text-slate-600">No Fee Ledgers Found</p>
                <p className="text-xs text-slate-400 mt-1">Please ask your finance officer to initialize tuition accounts.</p>
              </div>
            )}
          </div>
        )}

        {/* HOME ASSIGNMENTS TAB */}
        {activeTab === 'assignments' && (
          <div className="space-y-6" id="portal-assignments-pane">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-4">
                <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-indigo-500" /> Active Coursework Homework
                </h4>
                <p className="text-[11px] text-slate-400 mt-1">Review assignments posted by your grade teachers and upload your response materials.</p>
              </div>

              {(() => {
                const classAssignments = assignments.filter(a => a.className === student.currentClass);

                if (classAssignments.length === 0) {
                  return (
                    <div className="py-12 text-center text-slate-400">
                      <ClipboardList className="w-10 h-10 mx-auto text-slate-200 mb-2" />
                      <p className="text-xs font-semibold">No homework has been posted for your class level.</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Please check back later or notify your class teacher.</p>
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {classAssignments.map(assign => {
                      const studentSubmission = submissions.find(
                        s => s.assignmentId === assign.id && s.studentId === student.id
                      );

                      return (
                        <div key={assign.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50 space-y-4 flex flex-col justify-between">
                          <div className="space-y-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-mono">
                                  {assign.subject}
                                </span>
                                <h5 className="font-bold text-slate-800 text-xs mt-1.5 leading-tight">{assign.title}</h5>
                                <span className="text-[9px] text-slate-400 block mt-0.5">Posted by {assign.teacherName}</span>
                              </div>

                              {studentSubmission ? (
                                studentSubmission.status === 'Graded' ? (
                                  <span className="text-[9px] font-black uppercase bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-0.5 rounded font-mono">
                                    Graded: {studentSubmission.score}/{assign.maxPoints}
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-black uppercase bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded font-mono">
                                    Submitted
                                  </span>
                                )
                              ) : (
                                <span className="text-[9px] font-black uppercase bg-rose-50 text-rose-700 border border-rose-100 px-2 py-0.5 rounded font-mono">
                                  Pending Action
                                </span>
                              )}
                            </div>

                            <p className="text-xs text-slate-500 leading-relaxed font-medium">{assign.description}</p>
                          </div>

                          <div className="pt-3 border-t border-slate-200/50 space-y-3">
                            <div className="flex justify-between items-center text-[10px] text-slate-400 font-bold font-mono">
                              <span>Max Points: {assign.maxPoints} pts</span>
                              <span className="text-rose-600">Due: {assign.dueDate}</span>
                            </div>

                            {studentSubmission ? (
                              <div className="p-3 bg-white border border-slate-100 rounded-xl space-y-2 text-xs">
                                <div>
                                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Your Submission</span>
                                  <p className="text-slate-600 mt-0.5 italic">"{studentSubmission.textResponse}"</p>
                                  {studentSubmission.fileName && (
                                    <span className="inline-block mt-1 font-mono text-indigo-600 text-[9px] bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                                      📎 {studentSubmission.fileName} ({studentSubmission.fileSize})
                                    </span>
                                  )}
                                </div>

                                {studentSubmission.status === 'Graded' && (
                                  <div className="pt-2 border-t border-slate-100 text-[11px] text-emerald-800 bg-emerald-50/20 p-2 rounded-lg">
                                    <span className="font-bold block">Educator Feedback:</span>
                                    <p className="italic mt-0.5">{studentSubmission.feedback}</p>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setSubmittingAssignmentId(assign.id);
                                  setTextResponse('');
                                  setMockFileName('answers_document.pdf');
                                  setMockFileSize('450 KB');
                                }}
                                className="w-full flex items-center justify-center gap-1.5 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs cursor-pointer transition-all shadow-xs"
                              >
                                <UploadCloud className="w-4 h-4" /> Upload Assignment
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* MOCK UPLOAD MODAL */}
            {submittingAssignmentId && (
              <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden text-left">
                  <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <UploadCloud className="w-5 h-5 text-indigo-600" /> Submit Homework Assignment
                    </h4>
                    <button 
                      onClick={() => setSubmittingAssignmentId(null)}
                      className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer"
                    >
                      <X className="w-4.5 h-4.5" />
                    </button>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const newSub = {
                        id: `sub-${Date.now()}`,
                        assignmentId: submittingAssignmentId,
                        studentId: student.id,
                        studentName: student.name,
                        className: student.currentClass,
                        submittedAt: new Date().toISOString().substring(0, 16).replace('T', ' '),
                        textResponse: textResponse,
                        fileName: mockFileName || "completed_sheet.pdf",
                        fileSize: mockFileSize || "310 KB",
                        status: 'Pending'
                      };

                      const updated = [...submissions, newSub];
                      setSubmissions(updated);
                      localStorage.setItem('sma_submissions', JSON.stringify(updated));
                      setSubmittingAssignmentId(null);
                    }}
                    className="p-5 space-y-4"
                  >
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Write Submission Text / Explanations</label>
                      <textarea
                        required
                        rows={4}
                        value={textResponse}
                        onChange={(e) => setTextResponse(e.target.value)}
                        placeholder="Type down your completion remarks, step-by-step answers or reference notes..."
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-700 leading-normal"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Simulate File Upload</label>
                      
                      {/* Drag & Drop simulated area */}
                      <div className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl p-4 text-center cursor-pointer bg-slate-50/50 transition-colors">
                        <UploadCloud className="w-8 h-8 text-indigo-500 mx-auto mb-1.5" />
                        <span className="text-xs font-bold text-slate-700 block">Drag & Drop file here or Click to select</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Supports PDF, DOCX, PNG up to 10MB</span>

                        <div className="mt-3 bg-white border border-slate-100 p-2 rounded-xl flex items-center justify-between text-xs font-medium max-w-xs mx-auto">
                          <input
                            type="text"
                            value={mockFileName}
                            onChange={(e) => setMockFileName(e.target.value)}
                            placeholder="File Name"
                            className="bg-transparent border-none font-mono text-[10px] text-indigo-600 focus:outline-none"
                            required
                          />
                          <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.5 rounded">
                            {mockFileSize}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        Submit Assignment
                      </button>
                      <button
                        type="button"
                        onClick={() => setSubmittingAssignmentId(null)}
                        className="py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
