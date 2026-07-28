/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StudentClass =
  | 'Prep 1' | 'Prep 2'
  | 'Class 1' | 'Class 2' | 'Class 3' | 'Class 4' | 'Class 5' | 'Class 6'
  | 'JSS 1' | 'JSS 2' | 'JSS 3'
  | 'SSS 1' | 'SSS 2' | 'SSS 3';

export type SSSStream = 'Science' | 'Arts' | 'Commercial' | 'General';

export interface Student {
  id: string;
  name: string;
  admissionNumber: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female';
  currentClass: StudentClass;
  stream?: SSSStream;
  classSection?: string; // e.g. "A", "B"
  parentName: string;
  parentPhone: string;
  address: string;
  enrollmentYear: number;
  status: 'Active' | 'Transferred' | 'Graduated';
  profileColor?: string;
  profileImage?: string;
  allergies?: string;
  bloodType?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelation?: string;
}

export interface SubjectGrade {
  id: string;
  subject: string;
  caScore: number; // Continuous Assessment (out of 30 or 40)
  examScore: number; // Exam (out of 70 or 60)
  totalScore: number; // caScore + examScore (out of 100)
  grade: string; // A1, B2, B3, C4, C5, C6, D7, E8, F9
  remark: string; // Excellent, Credit, Pass, Fail, etc.
}

export interface TermPerformance {
  grades: SubjectGrade[];
  teacherRemarks: string;
  principalRemarks: string;
  conduct: string; // Excellent, Satisfactory, etc.
  attendance: {
    totalDays: number;
    presentDays: number;
  };
}

export interface StudentAcademicRecord {
  studentId: string;
  academicYear: string; // e.g., "2025/2026"
  terms: {
    1: TermPerformance;
    2: TermPerformance;
    3: TermPerformance;
  };
}

export interface NationalExamPrep {
  studentId: string;
  examType: 'NPSE' | 'BECE' | 'WASSCE';
  registered: boolean;
  indexNumber?: string;
  subjectsScores: Array<{
    subject: string;
    mockScore: number; // Out of 100
    grade: string;
    status: 'Ready' | 'Review Needed' | 'Critical';
  }>;
  totalScore?: number; // Sum for NPSE, or count of credits for BECE/WASSCE
  recommendation: string;
}

export interface FeeTransaction {
  id: string;
  date: string;
  amount: number;
  paymentMethod: 'Bank Deposit' | 'Orange Money' | 'Africell Money' | 'Cash';
  receiptNumber: string;
}

export interface StudentFeeLedger {
  studentId: string;
  academicYear: string;
  terms: {
    [term: number]: {
      totalDue: number;
      paidAmount: number;
      balance: number;
      status: 'Paid' | 'Partial' | 'Unpaid';
      transactions: FeeTransaction[];
    };
  };
}

export interface ClassPerformanceSummary {
  className: StudentClass;
  totalStudents: number;
  averageScore: number;
  passRate: number; // Percentage
  topStudentName: string;
}
