/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Student, 
  StudentAcademicRecord, 
  NationalExamPrep, 
  StudentFeeLedger, 
  Teacher,
  Assignment,
  Submission,
  SchoolAnnouncement 
} from './types';

import schoolLogo from './assets/logo.jpg';

export const SCHOOL_INFO = {
  name: 'Givers World Mission Diplomats Academy',
  shortName: 'G.W.D.A',
  systemName: 'Givers World Mission Diplomats Academy MIS',
  motto: 'Eagles Squad',
  slogan: 'Eagles Squad',
  address: 'Kambia 2, Northern Province, Kambia, Sierra Leone',
  phone: '034 055410',
  email: 'info@giversworldmission.edu.sl',
  website: 'https://givers-world-mission-high-school.vercel.app/',
  logo: schoolLogo,
  founded: 1998,
  principalName: 'Evangelist Saint Turay',
  principalTitle: 'CEO/Principal',
  coFounder: 'Evangelist Saint Turay',
  principalSignature: 'Evang. Saint Turay',
  vicePrincipalName: 'Mrs. Fatmata Sesay',
};

/**
 * LIVE PRODUCTION DATABASE REGISTRIES
 * All demo records have been permanently cleared for live production go-live.
 * Real students, academic marks, national exams, fee ledgers, staff, assignments,
 * and announcements are created through the school management interfaces.
 */
export const DEMO_SAMPLE_STUDENTS: Student[] = [];
export const DEMO_SAMPLE_ACADEMIC_RECORDS: StudentAcademicRecord[] = [];
export const DEMO_SAMPLE_NATIONAL_EXAMS: NationalExamPrep[] = [];
export const DEMO_SAMPLE_FEE_LEDGERS: StudentFeeLedger[] = [];

export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_ACADEMIC_RECORDS: StudentAcademicRecord[] = [];
export const INITIAL_NATIONAL_EXAMS: NationalExamPrep[] = [];
export const INITIAL_FEE_LEDGERS: StudentFeeLedger[] = [];

export const DEFAULT_SCHOOL_ANNOUNCEMENTS: SchoolAnnouncement[] = [];
export const DEFAULT_SAMPLE_TEACHERS: Teacher[] = [];
export const DEFAULT_SAMPLE_ASSIGNMENTS: Assignment[] = [];
export const DEFAULT_SAMPLE_SUBMISSIONS: Submission[] = [];
