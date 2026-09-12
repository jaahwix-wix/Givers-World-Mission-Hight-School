/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  ArrowRight,
  TrendingUp,
  Percent
} from 'lucide-react';
import { Student, StudentFeeLedger } from '../types';

interface FinancialHealthCardProps {
  students: Student[];
  fees: StudentFeeLedger[];
  onNavigate: (tab: string, arg?: any) => void;
}

export default function FinancialHealthCard({ students, fees, onNavigate }: FinancialHealthCardProps) {
  const [selectedTerm, setSelectedTerm] = useState<1 | 2 | 3>(3);

  const stats = useMemo(() => {
    const activeStudents = students.filter(s => s.status === 'Active');
    let paidCount = 0;
    let partialCount = 0;
    let unpaidCount = 0;

    let totalCollected = 0;
    let totalOutstanding = 0;
    let totalExpected = 0;

    activeStudents.forEach(student => {
      const ledger = fees.find(f => f.studentId === student.id);
      if (!ledger || !ledger.terms || !ledger.terms[selectedTerm]) {
        // Fallback default
        unpaidCount++;
        return;
      }

      const termData = ledger.terms[selectedTerm];
      totalExpected += termData.totalDue;
      totalCollected += termData.paidAmount;
      totalOutstanding += termData.balance;

      if (termData.status === 'Paid' || termData.balance <= 0) {
        paidCount++;
      } else if (termData.status === 'Partial') {
        partialCount++;
      } else {
        unpaidCount++;
      }
    });

    const totalStudents = activeStudents.length;
    const collectionRate = totalExpected > 0 ? Math.round((totalCollected / totalExpected) * 100) : 0;
    const paidPercentage = totalStudents > 0 ? Math.round((paidCount / totalStudents) * 100) : 0;
    const unpaidPercentage = totalStudents > 0 ? Math.round((unpaidCount / totalStudents) * 100) : 0;

    const chartData = [
      { 
        name: 'Paid in Full', 
        value: paidCount, 
        color: '#10b981', 
        percentage: paidPercentage 
      },
      { 
        name: 'Partial Payment', 
        value: partialCount, 
        color: '#f59e0b', 
        percentage: totalStudents > 0 ? Math.round((partialCount / totalStudents) * 100) : 0 
      },
      { 
        name: 'Unpaid Dues', 
        value: unpaidCount, 
        color: '#ef4444', 
        percentage: unpaidPercentage 
      }
    ].filter(item => item.value > 0);

    return {
      totalStudents,
      paidCount,
      partialCount,
      unpaidCount,
      totalCollected,
      totalOutstanding,
      totalExpected,
      collectionRate,
      chartData
    };
  }, [students, fees, selectedTerm]);

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between" id="financial-health-card-section">
      <div>
        {/* Card Header with Term Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 shadow-2xs shrink-0">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-800 text-base">Financial Health Summary</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {stats.collectionRate}% Recovered
                </span>
              </div>
              <p className="text-slate-400 text-xs mt-0.5">Ratio of tuition fees paid vs unpaid across active enrollment</p>
            </div>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0 self-start sm:self-auto">
            {([1, 2, 3] as const).map(t => (
              <button
                key={t}
                onClick={() => setSelectedTerm(t)}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  selectedTerm === t 
                    ? 'bg-white text-indigo-600 shadow-xs font-bold' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Term {t} {t === 3 ? '(Active)' : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Pie Chart & Center Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          {/* Recharts Pie Chart */}
          <div className="h-56 w-full relative" id="paid-unpaid-pie-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {stats.chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg border border-slate-800 text-xs space-y-1 min-w-[160px]">
                          <div className="flex items-center gap-1.5 font-bold text-slate-100">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }}></span>
                            <span>{data.name}</span>
                          </div>
                          <div className="flex justify-between items-center text-slate-300 pt-1 border-t border-slate-800">
                            <span>Students:</span>
                            <span className="font-extrabold text-white">{data.value} ({data.percentage}%)</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Inner Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Enrolled</span>
              <span className="text-xl font-black text-slate-800">{stats.totalStudents}</span>
              <span className="text-[9px] text-slate-400">Students</span>
            </div>
          </div>

          {/* Breakdown Stats Legend */}
          <div className="space-y-2.5 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <span className="font-bold text-emerald-950 block">Fully Cleared (Paid)</span>
                  <span className="text-[11px] text-emerald-700">{stats.paidCount} students settled in full</span>
                </div>
              </div>
              <span className="font-black text-emerald-700 text-sm">
                {stats.totalStudents > 0 ? Math.round((stats.paidCount / stats.totalStudents) * 100) : 0}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500 shrink-0"></span>
                <div>
                  <span className="font-bold text-amber-950 block">Partial Payments</span>
                  <span className="text-[11px] text-amber-700">{stats.partialCount} students with deposit</span>
                </div>
              </div>
              <span className="font-black text-amber-700 text-sm">
                {stats.totalStudents > 0 ? Math.round((stats.partialCount / stats.totalStudents) * 100) : 0}%
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500 shrink-0"></span>
                <div>
                  <span className="font-bold text-rose-950 block">Unpaid Balance</span>
                  <span className="text-[11px] text-rose-700">{stats.unpaidCount} students outstanding</span>
                </div>
              </div>
              <span className="font-black text-rose-700 text-sm">
                {stats.totalStudents > 0 ? Math.round((stats.unpaidCount / stats.totalStudents) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Financial Metrics Summary Banner */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Total Collected (SLE)</span>
            <span className="font-black text-emerald-600 text-sm mt-0.5 block">
              SLE {stats.totalCollected.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">Bursary receipts</span>
          </div>

          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 block">Outstanding Due (SLE)</span>
            <span className="font-black text-rose-600 text-sm mt-0.5 block">
              SLE {stats.totalOutstanding.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400">Term receivables</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        <span className="text-slate-400">Currency: New Leone (SLE)</span>
        <button
          type="button"
          onClick={() => onNavigate('fees', { term: selectedTerm })}
          className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
        >
          <span>Open Bursary Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
