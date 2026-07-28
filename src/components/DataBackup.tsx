/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Database, 
  CheckCircle, 
  AlertTriangle,
  FileJson,
  ShieldCheck
} from 'lucide-react';
import { Student, StudentAcademicRecord, NationalExamPrep, StudentFeeLedger } from '../types';

interface DataBackupProps {
  students: Student[];
  records: StudentAcademicRecord[];
  examPreps: NationalExamPrep[];
  fees: StudentFeeLedger[];
  onRestoreData: (data: {
    students: Student[];
    records: StudentAcademicRecord[];
    examPreps: NationalExamPrep[];
    fees: StudentFeeLedger[];
  }) => void;
  onResetData: () => void;
}

export default function DataBackup({ students, records, examPreps, fees, onRestoreData, onResetData }: DataBackupProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // 1. Export Data to JSON
  const handleExport = () => {
    try {
      const dataToExport = {
        app: 'Givers World Mission School Records Manager',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        payload: {
          students,
          records,
          examPreps,
          fees
        }
      };

      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `NS_School_Database_Backup_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setSuccessMessage('School database backup downloaded successfully.');
      setTimeout(() => setSuccessMessage(''), 4000);
    } catch (err) {
      setErrorMessage('Failed to generate database backup file.');
      setTimeout(() => setErrorMessage(''), 4000);
    }
  };

  // 2. Import / Restore Data from JSON
  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        
        // Validation checks
        if (!['Givers World Mission School Records Manager', 'Naiahcom School Records Manager', 'Salone Model Academy Records Manager'].includes(json.app) || !json.payload) {
          throw new Error('Invalid backup file signature.');
        }

        const { students: impStuds, records: impRecs, examPreps: impPreps, fees: impFees } = json.payload;

        if (!Array.isArray(impStuds) || !Array.isArray(impRecs) || !Array.isArray(impPreps) || !Array.isArray(impFees)) {
          throw new Error('Malformed backup database records structure.');
        }

        onRestoreData({
          students: impStuds,
          records: impRecs,
          examPreps: impPreps,
          fees: impFees
        });

        setSuccessMessage(`Database restored successfully. Loaded ${impStuds.length} student files.`);
        setErrorMessage('');
        setTimeout(() => setSuccessMessage(''), 4000);
      } catch (err: any) {
        setErrorMessage(err?.message || 'Failed to parse database backup file. Ensure it is a valid NS/SMA JSON file.');
        setSuccessMessage('');
        setTimeout(() => setErrorMessage(''), 5000);
      }
    };

    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = ''; // clear input
  };

  return (
    <div className="space-y-6" id="data-backup-portal">
      {/* Informative Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-800">Backup & Administration Center</h2>
        <p className="text-xs text-slate-400">Export database backups or restore registry data to prevent data loss</p>
      </div>

      {/* Grid: Export & Import Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Export Database */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl w-fit">
              <Download className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Download School Backup</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Generate a completely compiled database snapshot file containing all registered students, term continuous assessments, exam prep predictors, and fee histories. Keep this file safe on your computer as a terminal backup.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-indigo-500" /> SECURE JSON SIGNATURE
            </span>
            <button
              onClick={handleExport}
              className="py-2 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <FileJson className="w-4 h-4" /> Download Backup (.json)
            </button>
          </div>
        </div>

        {/* Card 2: Restore Database */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">Upload & Restore Database</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Upload a previously downloaded NS/SMA backup file (`.json`) to completely restore your student lists, continuous assessments, and payment records. Restoring will overwrite the current live browser database state.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-50 flex items-center justify-between text-xs">
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImport}
              accept=".json"
              className="hidden"
            />
            <span className="text-slate-400 font-semibold">OVERWRITES LIVE STATE</span>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="py-2 px-5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
            >
              <Database className="w-4 h-4" /> Upload Backup File
            </button>
          </div>
        </div>

      </div>

      {/* Alerts Row */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-indigo-50 text-indigo-800 border border-indigo-100 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-indigo-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 text-rose-800 border border-rose-100 text-xs font-semibold flex items-center gap-2.5 animate-fadeIn">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Card 3: Dangerous Administration Operations */}
      <div className="bg-white p-6 rounded-2xl border border-rose-100 shadow-sm space-y-4">
        <div>
          <h3 className="font-bold text-rose-700 text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-600" /> Dangerous Administrative Operations
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            These tasks directly modify or wipe database partitions. Please execute them with caution.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-rose-50/30 border border-rose-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-700">Restore Factory Seed Database</p>
            <p className="text-[11px] text-slate-500">
              Wipe all manual additions and restore the system to its initial fully populated mock Sierra Leone student registry (10 base students, grades, preps, fees).
            </p>
          </div>

          <button
            onClick={() => {
              if (confirm('Warning: This will wipe all current customized records and reload the pristine, original demo school data. Continue?')) {
                onResetData();
                setSuccessMessage('Database reset successfully. Demo school files loaded.');
                setTimeout(() => setSuccessMessage(''), 4000);
              }
            }}
            className="py-2 px-4 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Wipe & Reload Demo Data
          </button>
        </div>
      </div>
    </div>
  );
}
