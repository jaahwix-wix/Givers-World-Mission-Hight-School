/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  Wallet, 
  FileText, 
  TrendingUp, 
  Clock, 
  Search, 
  Filter, 
  CreditCard,
  PlusCircle,
  X,
  Check,
  Receipt,
  User
} from 'lucide-react';
import { Student, StudentFeeLedger, FeeTransaction } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface FinancialsProps {
  students: Student[];
  fees: StudentFeeLedger[];
  onAddTransaction: (studentId: string, term: number, tx: Omit<FeeTransaction, 'id'>) => void;
  initialStudentId?: string;
  initialTerm?: number;
}

export default function Financials({ students, fees, onAddTransaction, initialStudentId, initialTerm }: FinancialsProps) {
  
  // State
  const [search, setSearch] = useState('');
  const [selectedTermFilter, setSelectedTermFilter] = useState<1 | 2 | 3>(3);

  React.useEffect(() => {
    if (initialStudentId) {
      const target = students.find(s => s.id === initialStudentId);
      if (target) {
        setSearch(target.admissionNumber || target.name);
        if (initialTerm) {
          setSelectedTermFilter(initialTerm as 1 | 2 | 3);
        }
      }
    }
  }, [initialStudentId, initialTerm, students]);
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Paid' | 'Partial' | 'Unpaid'>('All');
  
  // Payment Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [paymentTerm, setPaymentTerm] = useState<1 | 2 | 3>(3);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'Bank Deposit' | 'Orange Money' | 'Africell Money' | 'Cash'>('Orange Money');
  const [paymentReceipt, setPaymentReceipt] = useState('');

  // 1. Core Summary Metrics
  const activeStudents = students.filter(s => s.status === 'Active');
  
  let totalInvoiced = 0;
  let totalReceived = 0;
  let totalOutstanding = 0;

  fees.forEach(ledger => {
    const isStudentActive = activeStudents.some(s => s.id === ledger.studentId);
    if (isStudentActive) {
      Object.values(ledger.terms).forEach(term => {
        totalInvoiced += term.totalDue;
        totalReceived += term.paidAmount;
        totalOutstanding += term.balance;
      });
    }
  });

  // Handle Recording New Payment
  const handleRecordPaymentClick = (studentId: string) => {
    const sLedger = fees.find(l => l.studentId === studentId);
    setSelectedStudentId(studentId);
    setPaymentTerm(3); // default term
    
    // Suggest the remaining balance for Term 3
    const term3Balance = sLedger?.terms[3]?.balance || 0;
    setPaymentAmount(term3Balance);
    setPaymentReceipt(`NS-REC-${Math.floor(100000 + Math.random() * 900000)}`);
    setIsModalOpen(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentId || paymentAmount <= 0) {
      alert('Please enter a valid student and payment amount greater than 0.');
      return;
    }

    onAddTransaction(selectedStudentId, paymentTerm, {
      date: new Date().toISOString().split('T')[0],
      amount: paymentAmount,
      paymentMethod,
      receiptNumber: paymentReceipt || `NS-REC-${Date.now().toString().slice(-6)}`
    });

    setIsModalOpen(false);
  };

  // Filter students ledger
  const filteredLedgers = fees.filter(ledger => {
    const student = students.find(s => s.id === ledger.studentId);
    if (!student || student.status !== 'Active') return false;

    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                          student.admissionNumber.toLowerCase().includes(search.toLowerCase());

    const termStatus = ledger.terms[selectedTermFilter]?.status || 'Unpaid';
    const matchesStatus = selectedStatusFilter === 'All' || termStatus === selectedStatusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="fees-ledger-tab-panel">
      {/* Metrics Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="fees-metrics-grid">
        {/* Total Invoiced */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Term Invoices</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">SLE {totalInvoiced.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-slate-50 text-slate-700 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-slate-400 mt-3">Calculated across Prep 1 to SSS 3 tracks</p>
        </div>

        {/* Total Collected */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Paid Collections</p>
              <h3 className="text-2xl font-extrabold text-indigo-600 mt-1">SLE {totalReceived.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-indigo-600 font-bold mt-3">
            {totalInvoiced > 0 ? Math.round((totalReceived / totalInvoiced) * 100) : 0}% recovery rate
          </p>
        </div>

        {/* Outstanding tuition fees */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Outstanding Balances</p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-1">SLE {totalOutstanding.toLocaleString()}</h3>
            </div>
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <p className="text-[10px] text-rose-500 font-semibold mt-3">Requires prompt terminal recovery campaigns</p>
        </div>
      </div>

      {/* Filter and Table Card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Table Filter controls */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-base">Student Accounts Registry</h3>
            <p className="text-slate-400 text-xs">Track payments and balance summaries term-by-term</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input 
                type="text" 
                placeholder="Search Student..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs w-48 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Term Filter */}
            <select
              value={selectedTermFilter}
              onChange={(e) => setSelectedTermFilter(parseInt(e.target.value) as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none"
            >
              <option value="1">Term 1 accounts</option>
              <option value="2">Term 2 accounts</option>
              <option value="3">Term 3 accounts</option>
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none"
            >
              <option value="All">All statuses</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partial">Partial Pay</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider bg-slate-50/50">
                <th className="py-3 px-5">Student / Admission ID</th>
                <th className="py-3 px-5 text-center">Class</th>
                <th className="py-3 px-5 text-center">Total Fee (Due)</th>
                <th className="py-3 px-5 text-center">Paid Amount</th>
                <th className="py-3 px-5 text-center">Balance Due</th>
                <th className="py-3 px-5 text-center">Status</th>
                <th className="py-3 px-5 text-right">Accounting Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-600">
              {filteredLedgers.map((ledger) => {
                const student = students.find(s => s.id === ledger.studentId)!;
                const termDetail = ledger.terms[selectedTermFilter] || { totalDue: 0, paidAmount: 0, balance: 0, status: 'Unpaid' as const };
                
                const badgeColor = termDetail.status === 'Paid' 
                  ? 'text-indigo-700 bg-indigo-50 border-indigo-100' 
                  : termDetail.status === 'Partial'
                    ? 'text-amber-700 bg-amber-50 border-amber-100'
                    : 'text-rose-700 bg-rose-50 border-rose-100';

                return (
                  <tr key={ledger.studentId} className="hover:bg-slate-50/20">
                    {/* Student Identity */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 shrink-0">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">{student.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{student.admissionNumber}</p>
                        </div>
                      </div>
                    </td>

                    {/* Class */}
                    <td className="py-3.5 px-5 text-center font-bold text-slate-700">
                      {student.currentClass}
                    </td>

                    {/* Due */}
                    <td className="py-3.5 px-5 text-center font-mono">
                      SLE {termDetail.totalDue.toLocaleString()}
                    </td>

                    {/* Paid */}
                    <td className="py-3.5 px-5 text-center font-mono text-indigo-600 font-bold">
                      SLE {termDetail.paidAmount.toLocaleString()}
                    </td>

                    {/* Balance */}
                    <td className="py-3.5 px-5 text-center font-mono text-rose-600 font-bold">
                      SLE {termDetail.balance.toLocaleString()}
                    </td>

                    {/* Status badge */}
                    <td className="py-3.5 px-5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${badgeColor}`}>
                        {termDetail.status}
                      </span>
                    </td>

                    {/* Payment Trigger */}
                    <td className="py-3.5 px-5 text-right">
                      {termDetail.balance > 0 ? (
                        <button
                          onClick={() => handleRecordPaymentClick(student.id)}
                          className="inline-flex items-center gap-1.5 py-1 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] shadow-xs cursor-pointer transition-colors"
                        >
                          <PlusCircle className="w-3.5 h-3.5" /> Post Payment
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold flex items-center justify-end gap-1">
                          <Check className="w-3.5 h-3.5 text-indigo-500" /> Accounts Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredLedgers.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 bg-slate-50/50">
                    <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                    No financial ledger matches the selection parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Entry Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="payment-entry-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl w-full max-w-md overflow-hidden"
            >
              <div className="bg-slate-900 text-white p-5 flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-base">Record Tuition Payment</h3>
                  <p className="text-slate-400 text-xs">Post manual or mobile money receipts to ledger</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePayment} className="p-6 space-y-4">
                {/* Selected student details */}
                {selectedStudentId && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-100 text-indigo-700 rounded-lg">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">
                        {students.find(s => s.id === selectedStudentId)?.name}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        Class: {students.find(s => s.id === selectedStudentId)?.currentClass} • Admin ID: {students.find(s => s.id === selectedStudentId)?.admissionNumber}
                      </p>
                    </div>
                  </div>
                )}

                {/* Term Selector */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Academic Term Segment</label>
                  <select
                    value={paymentTerm}
                    onChange={(e) => {
                      const termValue = parseInt(e.target.value) as 1 | 2 | 3;
                      setPaymentTerm(termValue);
                      // Suggest the balance for the newly selected term
                      const sLedger = fees.find(l => l.studentId === selectedStudentId);
                      const balanceValue = sLedger?.terms[termValue]?.balance || 0;
                      setPaymentAmount(balanceValue);
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white cursor-pointer"
                  >
                    <option value="1">Term 1 dues</option>
                    <option value="2">Term 2 dues</option>
                    <option value="3">Term 3 dues</option>
                  </select>
                </div>

                {/* Payment Amount */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Transaction Amount (SLE)</label>
                  <div className="relative">
                    <span className="text-xs font-bold text-slate-400 absolute left-3 top-2.5">SLE</span>
                    <input 
                      type="number" 
                      required
                      min="1"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                  <p className="text-[9px] text-slate-400">
                    Max suggested term balance: SLE {fees.find(l => l.studentId === selectedStudentId)?.terms[paymentTerm]?.balance || 0}
                  </p>
                </div>

                {/* Payment Method */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Receipting Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white cursor-pointer"
                  >
                    <option value="Orange Money">Orange Money Transfer</option>
                    <option value="Africell Money">Africell Money Transfer</option>
                    <option value="Bank Deposit">Commercial Bank Deposit Slip</option>
                    <option value="Cash">Physical Cash Registrar</option>
                  </select>
                </div>

                {/* Receipt Number */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500">Receipt / Transaction Reference</label>
                  <div className="relative">
                    <Receipt className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input 
                      type="text" 
                      required
                      value={paymentReceipt}
                      onChange={(e) => setPaymentReceipt(e.target.value)}
                      placeholder="e.g. SLMB-8490321"
                      className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submission triggers */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2 px-4 rounded-xl border border-slate-200 text-slate-500 text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-2 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Post Transaction
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
