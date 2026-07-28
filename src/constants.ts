/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { StudentClass, SSSStream } from './types';

export const CLASSES_LIST: StudentClass[] = [
  'Prep 1', 'Prep 2',
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
  'JSS 1', 'JSS 2', 'JSS 3',
  'SSS 1', 'SSS 2', 'SSS 3'
];

export const SSS_STREAMS: SSSStream[] = ['Science', 'Arts', 'Commercial', 'General'];

// Subject lists specific to Sierra Leone school levels
export const LEVEL_SUBJECTS = {
  PREP: [
    'Numeracy',
    'Literacy',
    'Phonics',
    'Sensory & Practical Life',
    'Creative Arts & Rhymes',
    'Health Education'
  ],
  PRIMARY: [
    'English Language',
    'Mathematics',
    'General Science',
    'Social Studies',
    'Agricultural Science',
    'Home Economics',
    'Physical & Health Education',
    'Quantitative Aptitude',
    'Verbal Aptitude',
    'Creative & Practical Arts'
  ],
  JSS: [
    'Language Arts (English)',
    'Mathematics',
    'Integrated Science',
    'Social Studies',
    'Agricultural Science',
    'Home Economics',
    'Business Studies',
    'Religious & Moral Education (RME)',
    'Physical Health Education (PHE)',
    'French'
  ],
  SSS_SCIENCE: [
    'English Language',
    'Mathematics (Core)',
    'Biology',
    'Chemistry',
    'Physics',
    'Further Mathematics',
    'Geography',
    'Civic Education',
    'Agricultural Science'
  ],
  SSS_ARTS: [
    'English Language',
    'Mathematics (Core)',
    'Literature in English',
    'Government',
    'History',
    'Christian Religious Studies (CRS) / Islamic Studies (ISS)',
    'Krio / French',
    'Civic Education',
    'Economics'
  ],
  SSS_COMMERCIAL: [
    'English Language',
    'Mathematics (Core)',
    'Financial Accounting',
    'Commerce',
    'Economics',
    'Business Management',
    'Office Practice',
    'Civic Education',
    'Geography'
  ]
};

export function getSubjectsForClass(className: StudentClass, stream?: SSSStream): string[] {
  if (className.startsWith('Prep')) {
    return LEVEL_SUBJECTS.PREP;
  }
  if (className.startsWith('Class')) {
    return LEVEL_SUBJECTS.PRIMARY;
  }
  if (className.startsWith('JSS')) {
    return LEVEL_SUBJECTS.JSS;
  }
  // SSS classes
  if (stream === 'Science') {
    return LEVEL_SUBJECTS.SSS_SCIENCE;
  }
  if (stream === 'Arts') {
    return LEVEL_SUBJECTS.SSS_ARTS;
  }
  if (stream === 'Commercial') {
    return LEVEL_SUBJECTS.SSS_COMMERCIAL;
  }
  return LEVEL_SUBJECTS.SSS_SCIENCE; // Default
}

// Sierra Leone Grading Standards (WAEC / West African Standard)
export interface GradeScale {
  minScore: number;
  grade: string;
  remark: string;
  isCredit: boolean;
  color: string;
}

export const WAEC_GRADING_SCALE: GradeScale[] = [
  { minScore: 75, grade: 'A1', remark: 'Excellent', isCredit: true, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { minScore: 70, grade: 'B2', remark: 'Very Good', isCredit: true, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { minScore: 65, grade: 'B3', remark: 'Good', isCredit: true, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { minScore: 60, grade: 'C4', remark: 'Credit', isCredit: true, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { minScore: 55, grade: 'C5', remark: 'Credit', isCredit: true, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { minScore: 50, grade: 'C6', remark: 'Credit', isCredit: true, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { minScore: 45, grade: 'D7', remark: 'Pass', isCredit: false, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { minScore: 40, grade: 'E8', remark: 'Pass', isCredit: false, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { minScore: 0, grade: 'F9', remark: 'Fail', isCredit: false, color: 'text-rose-600 bg-rose-50 border-rose-200' }
];

export const PRIMARY_GRADING_SCALE: GradeScale[] = [
  { minScore: 80, grade: 'A', remark: 'Excellent', isCredit: true, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { minScore: 70, grade: 'B', remark: 'Very Good', isCredit: true, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { minScore: 60, grade: 'C', remark: 'Good', isCredit: true, color: 'text-sky-600 bg-sky-50 border-sky-200' },
  { minScore: 50, grade: 'D', remark: 'Satisfactory', isCredit: false, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { minScore: 0, grade: 'E', remark: 'Needs Improvement', isCredit: false, color: 'text-rose-600 bg-rose-50 border-rose-200' }
];

export function getGradingScale(className: StudentClass): GradeScale[] {
  if (className.startsWith('Prep') || className.startsWith('Class')) {
    return PRIMARY_GRADING_SCALE;
  }
  return WAEC_GRADING_SCALE;
}

export function calculateGrade(score: number, className: StudentClass): { grade: string; remark: string; color: string } {
  const scale = getGradingScale(className);
  const matched = scale.find(s => score >= s.minScore);
  if (matched) {
    return { grade: matched.grade, remark: matched.remark, color: matched.color };
  }
  return { grade: 'F9', remark: 'Fail', color: 'text-rose-600 bg-rose-50 border-rose-200' };
}
