/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  LogIn, 
  ShieldCheck, 
  UserCheck, 
  Lock, 
  GraduationCap, 
  AlertCircle
} from 'lucide-react';
import schoolLogo from '../../../assets/logo.jpg';
import { UserRole } from '../../../types';

interface PortalLoginPageProps {
  onLoginSuccess: (role: UserRole, studentAdmissionNumber?: string) => void;
  onNavigateHome: () => void;
}

export default function PortalLoginPage({ onLoginSuccess, onNavigateHome }: PortalLoginPageProps) {
  const [loginMode, setLoginMode] = useState<'staff' | 'student'>('staff');
  
  // Staff credentials
  const [staffRole, setStaffRole] = useState<UserRole>('admin');
  const [staffPasscode, setStaffPasscode] = useState('1234');
  
  // Student credentials
  const [admissionNo, setAdmissionNo] = useState('GWM/2026/001');

  const [errorMessage, setErrorMessage] = useState('');

  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffPasscode.trim()) {
      setErrorMessage('Please enter your security passcode.');
      return;
    }
    setErrorMessage('');
    onLoginSuccess(staffRole);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!admissionNo.trim()) {
      setErrorMessage('Please enter a valid student admission number.');
      return;
    }
    setErrorMessage('');
    onLoginSuccess('student_parent', admissionNo.trim());
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6" id="website-portal-login-page">
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl">
        {/* Banner with National Colors */}
        <div className="h-2 w-full flex">
          <div className="flex-1 bg-emerald-600" />
          <div className="flex-1 bg-white" />
          <div className="flex-1 bg-blue-600" />
        </div>

        <div className="p-6 sm:p-10 space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 max-w-xl mx-auto">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl p-1 bg-emerald-50 border-2 border-emerald-600 shadow-md mx-auto overflow-hidden">
              <img 
                src={schoolLogo} 
                alt="Givers World Mission Crest" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                School & College Management Portal
              </h1>
              <p className="text-xs sm:text-sm text-emerald-700 font-extrabold mt-1">
                Givers World Mission Diplomats Academy & College • Kambia 1
              </p>
              <p className="text-xs text-slate-400">
                Secure access for Teachers, Administrators, Bursars, Students & Parents
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="flex rounded-2xl bg-slate-100 p-1.5 max-w-md mx-auto">
            <button
              type="button"
              onClick={() => { setLoginMode('staff'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginMode === 'staff'
                  ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Staff / Administration</span>
            </button>

            <button
              type="button"
              onClick={() => { setLoginMode('student'); setErrorMessage(''); }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                loginMode === 'student'
                  ? 'bg-white text-slate-900 shadow-sm font-extrabold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Student / Parent Portal</span>
            </button>
          </div>

          {errorMessage && (
            <div className="max-w-md mx-auto p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form: Staff Mode */}
          {loginMode === 'staff' && (
            <form onSubmit={handleStaffLogin} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Select Your Assigned Role & Privileges
                </label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as UserRole)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-xs cursor-pointer"
                >
                  <option value="admin">Principal / Executive Admin (Evangelist Saint Turay)</option>
                  <option value="teacher">Class Teacher / Subject Instructor</option>
                  <option value="bursar">Bursar / Financial Accounts Officer</option>
                  <option value="transport">Fleet & School Bus Coordinator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Security Passcode / PIN
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={staffPasscode}
                    onChange={(e) => setStaffPasscode(e.target.value)}
                    placeholder="Enter security passcode (default: 1234)"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 shadow-xs"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Default demonstration passcode: <strong>1234</strong>
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg"
              >
                <LogIn className="w-4 h-4 text-emerald-400" />
                <span>Enter Management Portal as {staffRole.toUpperCase()}</span>
              </button>
            </form>
          )}

          {/* Form: Student Mode */}
          {loginMode === 'student' && (
            <form onSubmit={handleStudentLogin} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Student Admission / ID Number
                </label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={admissionNo}
                    onChange={(e) => setAdmissionNo(e.target.value)}
                    placeholder="e.g. GWM/2026/001"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 shadow-xs uppercase tracking-wider"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Sample admission numbers: <strong>GWM/2026/001</strong> (Musa Bangura) or <strong>GWM/2026/002</strong> (Fatmata Kamara)
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer hover:shadow-lg"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Access Student Grade Card & Fee Status</span>
              </button>
            </form>
          )}

          {/* Quick Demo Pre-sets for Testing */}
          <div className="pt-4 border-t border-slate-100 max-w-lg mx-auto">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider text-center mb-3">
              One-Click Role Demonstration Presets
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => onLoginSuccess('admin')}
                className="p-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 text-center cursor-pointer transition-colors"
              >
                <span className="block text-xs font-black">Principal</span>
                <span className="text-[10px] text-emerald-700">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess('teacher')}
                className="p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-center cursor-pointer transition-colors"
              >
                <span className="block text-xs font-black">Teacher</span>
                <span className="text-[10px] text-blue-700">Grades & SMS</span>
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess('bursar')}
                className="p-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-center cursor-pointer transition-colors"
              >
                <span className="block text-xs font-black">Bursar</span>
                <span className="text-[10px] text-purple-700">Fees Center</span>
              </button>

              <button
                type="button"
                onClick={() => onLoginSuccess('student_parent', 'GWM/2026/001')}
                className="p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-center cursor-pointer transition-colors"
              >
                <span className="block text-xs font-black">Student</span>
                <span className="text-[10px] text-amber-700">Report & Bus</span>
              </button>
            </div>
          </div>

          {/* Return link */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onNavigateHome}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              ← Return to School Public Website
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
