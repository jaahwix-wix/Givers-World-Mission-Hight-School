/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  Wallet, 
  AlertCircle, 
  TrendingUp, 
  BookOpen, 
  Award,
  CheckCircle,
  FileSpreadsheet,
  TrendingDown,
  Info,
  Search,
  CreditCard,
  ChevronRight,
  User,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Student, StudentAcademicRecord, NationalExamPrep, StudentFeeLedger } from '../types';
import { SCHOOL_INFO } from '../initialData';

interface DashboardProps {
  students: Student[];
  records: StudentAcademicRecord[];
  examPreps: NationalExamPrep[];
  fees: StudentFeeLedger[];
  onNavigate: (tab: string, arg?: any) => void;
}

export default function Dashboard({ students, records, examPreps, fees, onNavigate }: DashboardProps) {
  // 1. Calculations
  const activeStudents = students.filter(s => s.status === 'Active');
  const totalStudentsCount = activeStudents.length;
  const maleCount = activeStudents.filter(s => s.gender === 'Male').length;
  const femaleCount = activeStudents.filter(s => s.gender === 'Female').length;
  const femalePercentage = totalStudentsCount > 0 ? Math.round((femaleCount / totalStudentsCount) * 100) : 0;

  // GPA Distribution Data mapping for recharts
  const gpaData = useMemo(() => {
    const tiers = [
      { name: 'Nursery', filter: (c: string) => c.startsWith('Prep') },
      { name: 'Primary', filter: (c: string) => c.startsWith('Class') },
      { name: 'JSS', filter: (c: string) => c.startsWith('JSS') },
      { name: 'SSS', filter: (c: string) => c.startsWith('SSS') },
    ];

    return tiers.map(tier => {
      const tierStudents = activeStudents.filter(s => tier.filter(s.currentClass));
      let honorsHigh = 0; // 3.5 - 4.0
      let honors = 0;     // 3.0 - 3.49
      let passing = 0;    // 2.0 - 2.99
      let support = 0;    // < 2.0
      let sumGpa = 0;
      let countWithGpa = 0;

      tierStudents.forEach(student => {
        const record = records.find(r => r.studentId === student.id);
        if (record) {
          const grades = record.terms[3].grades.length > 0 ? record.terms[3].grades :
                         record.terms[2].grades.length > 0 ? record.terms[2].grades :
                         record.terms[1].grades.length > 0 ? record.terms[1].grades : [];
          if (grades.length > 0) {
            const totalGpa = grades.reduce((sum, g) => {
              const score = g.totalScore;
              let gpa = 0;
              if (score >= 80) gpa = 4.0;
              else if (score >= 75) gpa = 3.7;
              else if (score >= 70) gpa = 3.3;
              else if (score >= 65) gpa = 3.0;
              else if (score >= 60) gpa = 2.7;
              else if (score >= 55) gpa = 2.3;
              else if (score >= 50) gpa = 2.0;
              else if (score >= 45) gpa = 1.3;
              else if (score >= 40) gpa = 1.0;
              else gpa = 0.0;
              return sum + gpa;
            }, 0);
            const gpa = Number((totalGpa / grades.length).toFixed(2));
            sumGpa += gpa;
            countWithGpa++;

            if (gpa >= 3.5) honorsHigh++;
            else if (gpa >= 3.0) honors++;
            else if (gpa >= 2.0) passing++;
            else support++;
          } else {
            passing++; // default placeholder
          }
        } else {
          passing++; // default placeholder
        }
      });

      const averageGpa = countWithGpa > 0 ? Number((sumGpa / countWithGpa).toFixed(2)) : 2.5;

      return {
        gradeLevel: tier.name,
        'High Honors (3.5 - 4.0)': honorsHigh,
        'Honors (3.0 - 3.49)': honors,
        'Passing (2.0 - 2.99)': passing,
        'Needs Support (< 2.0)': support,
        averageGpa,
        totalStudents: tierStudents.length
      };
    });
  }, [activeStudents, records]);

  // Total Outstanding Tuition Fees (SLE - Sierra Leone New Leone)
  let totalOutstanding = 0;
  fees.forEach(ledger => {
    // Sum outstanding balances for active students
    const activeStud = activeStudents.find(s => s.id === ledger.studentId);
    if (activeStud) {
      Object.values(ledger.terms).forEach(term => {
        totalOutstanding += term.balance;
      });
    }
  });

  // Pending Fees State & Calculation (Term 3 default)
  const [pendingTermFilter, setPendingTermFilter] = useState<1 | 2 | 3>(3);
  const [pendingSearchQuery, setPendingSearchQuery] = useState('');
  const [pendingStatusFilter, setPendingStatusFilter] = useState<'All' | 'Unpaid' | 'Partial'>('All');

  // Identifies active students with 'Unpaid' or 'Partial' fee status for the selected term
  const pendingFeeStudents = useMemo(() => {
    return activeStudents.map(student => {
      const ledger = fees.find(f => f.studentId === student.id);
      if (!ledger || !ledger.terms || !ledger.terms[pendingTermFilter]) return null;

      const termFee = ledger.terms[pendingTermFilter];
      if (termFee.status === 'Unpaid' || termFee.status === 'Partial') {
        return {
          student,
          feeLedger: ledger,
          term: pendingTermFilter,
          totalDue: termFee.totalDue,
          paidAmount: termFee.paidAmount,
          balance: termFee.balance,
          status: termFee.status as 'Unpaid' | 'Partial'
        };
      }
      return null;
    }).filter((item): item is {
      student: Student;
      feeLedger: StudentFeeLedger;
      term: number;
      totalDue: number;
      paidAmount: number;
      balance: number;
      status: 'Unpaid' | 'Partial';
    } => item !== null);
  }, [activeStudents, fees, pendingTermFilter]);

  // Filter pending list by search query and status filter
  const filteredPendingList = useMemo(() => {
    return pendingFeeStudents.filter(item => {
      const matchesStatus = pendingStatusFilter === 'All' || item.status === pendingStatusFilter;
      const query = pendingSearchQuery.trim().toLowerCase();
      const matchesQuery = !query || 
        item.student.name.toLowerCase().includes(query) ||
        item.student.admissionNumber.toLowerCase().includes(query) ||
        item.student.currentClass.toLowerCase().includes(query);

      return matchesStatus && matchesQuery;
    });
  }, [pendingFeeStudents, pendingSearchQuery, pendingStatusFilter]);

  const totalPendingBalanceForTerm = useMemo(() => {
    return pendingFeeStudents.reduce((sum, item) => sum + item.balance, 0);
  }, [pendingFeeStudents]);

  // National Exam Candidates
  const examCandidateCount = examPreps.filter(ep => ep.registered).length;

  // Average Score across school (Term 3 averages)
  let sumAverage = 0;
  let recordCount = 0;
  records.forEach(r => {
    const isTerm3Active = r.terms[3].grades.length > 0;
    const grades = isTerm3Active ? r.terms[3].grades : r.terms[2].grades;
    if (grades.length > 0) {
      const avg = grades.reduce((sum, g) => sum + g.totalScore, 0) / grades.length;
      sumAverage += avg;
      recordCount++;
    }
  });
  const schoolAverageScore = recordCount > 0 ? Math.round(sumAverage / recordCount) : 0;

  // Class distribution calculation
  const levelCounts = {
    Nursery: activeStudents.filter(s => s.currentClass.startsWith('Prep')).length,
    Primary: activeStudents.filter(s => s.currentClass.startsWith('Class')).length,
    JSS: activeStudents.filter(s => s.currentClass.startsWith('JSS')).length,
    SSS: activeStudents.filter(s => s.currentClass.startsWith('SSS')).length
  };

  const levelColors = {
    Nursery: 'bg-amber-500',
    Primary: 'bg-indigo-500',
    JSS: 'bg-blue-500',
    SSS: 'bg-purple-500'
  };

  // Recent high achievers (Average grade > 75 in latest term)
  const highPerformers = records
    .map(r => {
      const student = students.find(s => s.id === r.studentId);
      if (!student || student.status !== 'Active') return null;
      const grades = r.terms[3].grades.length > 0 ? r.terms[3].grades : r.terms[2].grades;
      if (grades.length === 0) return null;
      const average = Math.round(grades.reduce((sum, g) => sum + g.totalScore, 0) / grades.length);
      return { student, average };
    })
    .filter((p): p is { student: Student; average: number } => p !== null && p.average >= 75)
    .slice(0, 4);

  // Critical items (Unpaid Term 3 fees or low exam prep score)
  const lowPreps = examPreps
    .filter(ep => {
      const student = students.find(s => s.id === ep.studentId);
      if (!student || student.status !== 'Active') return false;
      const scores = ep.subjectsScores;
      const avgMock = scores.reduce((sum, s) => sum + s.mockScore, 0) / scores.length;
      return avgMock < 55;
    })
    .map(ep => {
      const student = students.find(s => s.id === ep.studentId)!;
      const scores = ep.subjectsScores;
      const avgMock = Math.round(scores.reduce((sum, s) => sum + s.mockScore, 0) / scores.length);
      return { student, type: ep.examType, average: avgMock };
    });

  return (
    <div className="space-y-6" id="dashboard-tab-panel">
      {/* Flag Accented Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white p-6 md:p-8 shadow-md" id="school-banner-accent">
        {/* Flag representation in background */}
        <div className="absolute top-0 right-0 h-full w-2 flex flex-col">
          <div className="h-1/3 bg-emerald-500"></div>
          <div className="h-1/3 bg-white"></div>
          <div className="h-1/3 bg-blue-500"></div>
        </div>
        <div className="absolute top-0 right-0 h-full w-64 bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <img 
            src={SCHOOL_INFO.logo} 
            alt={`${SCHOOL_INFO.name} Crest`} 
            className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white p-1.5 object-contain shadow-lg border border-slate-700 shrink-0"
            referrerPolicy="no-referrer"
          />
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 mb-2">
              <CheckCircle className="w-3.5 h-3.5" /> Sierra Leone National Curriculum Aligned
            </span>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-sans">{SCHOOL_INFO.name}</h1>
            <p className="text-indigo-300 font-medium italic text-sm mt-0.5">"{SCHOOL_INFO.motto}"</p>
            <p className="text-slate-300 text-xs md:text-sm mt-2 max-w-xl">
              Welcome to the academic control panel. Managing student profiles, Continuous Assessment (CA) scores, term positions, school fees, and national exams (NPSE, BECE, WASSCE).
            </p>
            <div className="flex flex-wrap gap-4 mt-4 text-xs text-slate-400 border-t border-slate-800 pt-3">
              <div><span className="text-slate-200 font-semibold">Principal:</span> {SCHOOL_INFO.principalName}</div>
              <div><span className="text-slate-200 font-semibold">Address:</span> {SCHOOL_INFO.address}</div>
              <div><span className="text-slate-200 font-semibold">Year:</span> 2025/2026 Academic Cycle</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: High-level Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4" id="stats-grid">
        {/* Total Students */}
        <div 
          onClick={() => onNavigate('students')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden" 
          id="stat-card-students"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Total Enrollment</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{totalStudentsCount}</h3>
            </div>
            <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-indigo-600">Free Quality Edu</span>
            <span>•</span>
            <span>{maleCount} Boys / {femaleCount} Girls ({femalePercentage}% Girls)</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </div>

        {/* Academic Performance */}
        <div 
          onClick={() => onNavigate('performance')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          id="stat-card-performance"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">School-Wide Avg</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{schoolAverageScore}%</h3>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Award className="w-3.5 h-3.5 text-blue-500" />
            <span className="font-semibold text-blue-600">Satisfactory</span>
            <span>overall standing (Term 3)</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-blue-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </div>

        {/* Exam Candidates */}
        <div 
          onClick={() => onNavigate('performance', { tab: 'exams' })}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          id="stat-card-exams"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">National Exams</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">{examCandidateCount}</h3>
            </div>
            <div className="p-3 bg-purple-50 rounded-xl text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-slate-500">
            <BookOpen className="w-3.5 h-3.5 text-purple-500 animate-pulse" />
            <span>NPSE, BECE & WASSCE Tracks</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-purple-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </div>

        {/* Fees Ledger Balance */}
        <div 
          onClick={() => onNavigate('fees')}
          className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
          id="stat-card-fees"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">Unpaid Dues</p>
              <h3 className="text-3xl font-bold text-slate-800 mt-1">SLE {totalOutstanding.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
            <span>Outstanding tuition term collections</span>
          </div>
          <div className="absolute bottom-0 left-0 h-1 bg-amber-500 w-full transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
        </div>
      </div>

      {/* Main Grid: Data Visualization & Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Span): Class distribution & High Performers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: Classroom Performance GPA Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" id="classroom-performance-section">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="font-semibold text-slate-800 text-base">Classroom Performance</h3>
                <p className="text-slate-400 text-xs">Distribution of student GPAs across school tiers (calculated on a standard 4.0 scale)</p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 shrink-0 self-start sm:self-auto">
                <TrendingUp className="w-3.5 h-3.5" /> GPA Analytics Engine
              </div>
            </div>

            {/* Recharts Stacked Bar Chart */}
            <div className="h-72 w-full mt-4" id="gpa-distribution-chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gpaData}
                  margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="gradeLevel" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 600 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    allowDecimals={false}
                  />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs space-y-1.5 min-w-[200px]">
                            <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-indigo-300">{label} Tier</p>
                            {payload.map((entry) => (
                              <div key={entry.name} className="flex justify-between items-center gap-4">
                                <span className="flex items-center gap-1.5 text-slate-300">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></span>
                                  {entry.name}:
                                </span>
                                <span className="font-bold">{entry.value} {Number(entry.value) === 1 ? 'student' : 'students'}</span>
                              </div>
                            ))}
                            <div className="border-t border-slate-800 pt-1.5 mt-1.5 flex justify-between font-semibold text-emerald-400">
                              <span>Average GPA:</span>
                              <span>{data.averageGpa.toFixed(2)} / 4.00</span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '11px', fontWeight: 500 }}
                  />
                  <Bar dataKey="High Honors (3.5 - 4.0)" stackId="a" fill="#4f46e5" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Honors (3.0 - 3.49)" stackId="a" fill="#3b82f6" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Passing (2.0 - 2.99)" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                  <Bar dataKey="Needs Support (< 2.0)" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Dynamic Average GPA Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-100">
              {gpaData.map(tier => (
                <div key={tier.gradeLevel} className="bg-slate-50/50 p-2.5 rounded-xl border border-slate-100 flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{tier.gradeLevel} Avg</span>
                  <span className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1.5">
                    {tier.averageGpa >= 3.0 ? (
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
                    ) : (
                      <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
                    )}
                    {tier.averageGpa.toFixed(2)} <span className="text-[9px] text-slate-400 font-normal">GPA</span>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Academic Class Distribution */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="font-semibold text-slate-800 text-base">Class Level Distribution</h3>
                <p className="text-slate-400 text-xs">Total students segmented by official school tiers</p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">Active Cycle</span>
            </div>

            {/* Custom SVG/Bar chart for distribution */}
            <div className="space-y-4">
              {Object.entries(levelCounts).map(([level, count]) => {
                const percentage = totalStudentsCount > 0 ? Math.round((count / totalStudentsCount) * 100) : 0;
                const barColor = levelColors[level as keyof typeof levelColors];
                return (
                  <div key={level} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium text-slate-600">
                      <span className="flex items-center gap-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${barColor}`}></span>
                        {level} {level === 'Nursery' ? '(Prep 1 - Prep 2)' : level === 'Primary' ? '(Class 1 - 6)' : level === 'JSS' ? '(JSS 1 - 3)' : '(SSS 1 - 3)'}
                      </span>
                      <span>{count} Students ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${barColor} transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Quick action triggers */}
            <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-slate-50 text-xs font-medium">
              <button 
                onClick={() => onNavigate('students')}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 transition-colors cursor-pointer"
              >
                <Users className="w-4 h-4 text-indigo-500" /> View Student Files
              </button>
              <button 
                onClick={() => onNavigate('performance')}
                className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-100 transition-colors cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-blue-500" /> Enter Term Marks
              </button>
            </div>
          </div>

          {/* Section: Top Academic Achievers */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-semibold text-slate-800 text-base">Top Academic Achievers</h3>
                <p className="text-slate-400 text-xs">Students demonstrating outstanding overall performance</p>
              </div>
              <button 
                onClick={() => onNavigate('performance')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Full Standings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {highPerformers.map(({ student, average }) => (
                <div 
                  key={student.id} 
                  onClick={() => onNavigate('report-card', { studentId: student.id })}
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:border-indigo-100 bg-slate-50/50 hover:bg-indigo-50/10 cursor-pointer transition-all"
                >
                  <div className="flex items-center gap-3">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-slate-800 text-sm">{student.name}</h4>
                      <p className="text-slate-400 text-xs">{student.currentClass} {student.stream ? `(${student.stream})` : ''}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 font-bold text-sm">
                      {average}%
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">Average score</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Span): National Exams Alerts & Fee issues */}
        <div className="space-y-6">
          {/* Section: Pending Fee Payments Notification Panel */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm" id="pending-fee-payments-panel">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shrink-0">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-base leading-tight">Pending Fee Payments</h3>
                  <p className="text-slate-400 text-xs mt-0.5">Students with unpaid or partial tuition dues</p>
                </div>
              </div>

              {/* Term Selector Tabs */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0 self-start sm:self-auto">
                {([1, 2, 3] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPendingTermFilter(t)}
                    className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                      pendingTermFilter === t 
                        ? 'bg-white text-indigo-600 shadow-xs font-bold' 
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    Term {t} {t === 3 ? '(Active)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Term Summary Pill */}
            <div className="flex items-center justify-between p-3 bg-amber-50/60 border border-amber-100 rounded-xl mb-4 text-xs">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Term {pendingTermFilter} Outstanding:</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-extrabold text-[11px]">
                  {pendingFeeStudents.length} {pendingFeeStudents.length === 1 ? 'Student' : 'Students'}
                </span>
                <span className="font-extrabold text-slate-800">
                  SLE {totalPendingBalanceForTerm.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Search & Status Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={pendingSearchQuery}
                  onChange={(e) => setPendingSearchQuery(e.target.value)}
                  placeholder="Filter by student name or class..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 text-slate-700 placeholder-slate-400 rounded-xl text-xs border border-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
                {(['All', 'Unpaid', 'Partial'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setPendingStatusFilter(st)}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                      pendingStatusFilter === st
                        ? 'bg-slate-800 text-white'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable List of Pending Fee Students */}
            <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
              {filteredPendingList.length > 0 ? (
                filteredPendingList.map((item) => (
                  <div
                    key={item.student.id}
                    onClick={() => onNavigate('fees', { studentId: item.student.id, term: item.term })}
                    className="p-3 rounded-xl border border-slate-100 hover:border-indigo-200 bg-slate-50/50 hover:bg-indigo-50/20 transition-all cursor-pointer group flex flex-col gap-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {item.student.profileImage ? (
                          <img
                            src={item.student.profileImage}
                            alt={item.student.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {item.student.name.split(' ').map(n => n[0]).join('')}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                            {item.student.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium truncate">
                            {item.student.currentClass} • ID: <span className="font-mono">{item.student.admissionNumber}</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                          item.status === 'Unpaid' 
                            ? 'bg-rose-100 text-rose-800 border border-rose-200' 
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {item.status}
                        </span>

                        <button
                          type="button"
                          className="px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold transition-colors cursor-pointer flex items-center gap-0.5"
                          title="Collect payment or view ledger"
                        >
                          <span>Collect</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Progress & Financial details */}
                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1.5 border-t border-slate-100 font-medium">
                      <span>Paid: <strong className="text-slate-700">SLE {item.paidAmount.toLocaleString()}</strong> / {item.totalDue.toLocaleString()}</span>
                      <span className="text-rose-600 font-bold">Balance: SLE {item.balance.toLocaleString()}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-slate-400 space-y-1.5 border border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <CheckCircle className="w-6 h-6 text-emerald-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-700">No Pending Payments</p>
                  <p className="text-[11px] text-slate-400">
                    {pendingSearchQuery 
                      ? 'No students match your search filter.' 
                      : `All students have settled their tuition fees for Term ${pendingTermFilter}.`}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
              <span className="text-slate-400 text-[11px]">Free Quality Education Subsidies Applied</span>
              <button
                onClick={() => onNavigate('fees')}
                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-bold cursor-pointer"
              >
                <span>Full Financial Ledger</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section: National Exams Preparedness Alerts */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-base mb-1">National Exams Prep</h3>
            <p className="text-slate-400 text-xs mb-4">WAEC candidates and trial metrics</p>
            
            <div className="space-y-4">
              {/* Stat breakdowns */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs pb-4 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-800 rounded-lg">
                  <p className="font-bold text-base">{examPreps.filter(e => e.examType === 'NPSE').length}</p>
                  <p className="text-[10px] text-slate-500">NPSE Class 6</p>
                </div>
                <div className="p-2 bg-blue-50 text-blue-800 rounded-lg">
                  <p className="font-bold text-base">{examPreps.filter(e => e.examType === 'BECE').length}</p>
                  <p className="text-[10px] text-slate-500">BECE JSS 3</p>
                </div>
                <div className="p-2 bg-purple-50 text-purple-800 rounded-lg">
                  <p className="font-bold text-base">{examPreps.filter(e => e.examType === 'WASSCE').length}</p>
                  <p className="text-[10px] text-slate-500">WASSCE SSS 3</p>
                </div>
              </div>

              {/* Action alert: low mock scores */}
              <div>
                <h4 className="text-xs font-semibold text-slate-500 mb-2.5 uppercase tracking-wider">Urgent Intervention List</h4>
                <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                  {lowPreps.map(({ student, type, average }) => (
                    <div 
                      key={student.id} 
                      onClick={() => onNavigate('performance', { tab: 'exams', studentId: student.id })}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-rose-100 bg-rose-50/20 hover:bg-rose-50/50 cursor-pointer transition-all"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 truncate">{student.name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{student.currentClass} • WAEC {type}</p>
                      </div>
                      <div className="text-right flex flex-col items-end shrink-0">
                        <span className="text-xs font-bold text-rose-600 px-1.5 py-0.5 rounded bg-rose-50 border border-rose-100">
                          {average}%
                        </span>
                        <span className="text-[9px] text-rose-500 mt-0.5">Critical CA</span>
                      </div>
                    </div>
                  ))}
                  {lowPreps.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">All candidates exceeding 55% passing mock average.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section: System Actions & Notices */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-semibold text-slate-800 text-base mb-3">Notice Board</h3>
            
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100 text-xs">
                <div className="flex gap-2 text-indigo-800 font-semibold mb-1">
                  <CheckCircle className="w-4 h-4 shrink-0 text-indigo-600" />
                  <span>Free Quality School Education Act</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Basic tuition is subsidized. School charges listed here represent specialized learning guides, mock materials, and terminal WAEC administrative processing fees.
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                <div className="flex gap-2 text-amber-800 font-semibold mb-1">
                  <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                  <span>WASSCE Registration Deadline</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Sierra Leone WAEC registration portals close shortly. Ensure SSS 3 index numbers are fully uploaded in the Exams tab.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
