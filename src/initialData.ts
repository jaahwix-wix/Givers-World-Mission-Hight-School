/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Student, 
  StudentAcademicRecord, 
  NationalExamPrep, 
  StudentFeeLedger, 
  StudentClass, 
  SSSStream,
  Teacher,
  Assignment,
  Submission,
  SchoolAnnouncement 
} from './types';
import { getSubjectsForClass, calculateGrade } from './constants';

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

export const DEMO_SAMPLE_STUDENTS: Student[] = [
  {
    id: 'stud-001',
    name: 'Mustapha Koroma',
    admissionNumber: 'SMA-2023-0142',
    dateOfBirth: '2010-04-15',
    gender: 'Male',
    currentClass: 'Class 6',
    classSection: 'A',
    parentName: 'Sorie Koroma',
    parentPhone: '+232 77 123456',
    address: '15 Campbell Street, Freetown',
    enrollmentYear: 2023,
    status: 'Active',
    profileColor: 'emerald',
    allergies: 'Peanuts, Penicillin',
    bloodType: 'O+',
    emergencyContactName: 'Sorie Koroma',
    emergencyContactPhone: '+232 77 123456',
    emergencyContactRelation: 'Father',
    verified: true,
    verifiedBy: 'Evangelist Saint Turay (CEO/Principal & Admin)',
    verifiedAt: '2024-09-12'
  },
  {
    id: 'stud-002',
    name: 'Kadiatu Mansaray',
    admissionNumber: 'SMA-2020-0089',
    dateOfBirth: '2008-09-22',
    gender: 'Female',
    currentClass: 'JSS 3',
    classSection: 'B',
    parentName: 'Mariama Mansaray',
    parentPhone: '+232 76 890123',
    address: '42 Kissy Road, Freetown',
    enrollmentYear: 2020,
    status: 'Active',
    profileColor: 'purple',
    allergies: 'None',
    bloodType: 'A-',
    emergencyContactName: 'Mariama Mansaray',
    emergencyContactPhone: '+232 76 890123',
    emergencyContactRelation: 'Mother',
    verified: true,
    verifiedBy: 'Evangelist Saint Turay (CEO/Principal & Admin)',
    verifiedAt: '2024-09-12'
  },
  {
    id: 'stud-003',
    name: 'Samuel Bangura',
    admissionNumber: 'SMA-2024-0205',
    dateOfBirth: '2007-01-10',
    gender: 'Male',
    currentClass: 'SSS 3',
    stream: 'Science',
    classSection: 'A',
    parentName: 'Abu Bangura',
    parentPhone: '+232 88 555666',
    address: '109 Sir Samuel Lewis Road, Aberdeen, Freetown',
    enrollmentYear: 2024,
    status: 'Active',
    profileColor: 'blue',
    verified: false
  },
  {
    id: 'stud-004',
    name: 'Aminata Turay',
    admissionNumber: 'SMA-2024-0211',
    dateOfBirth: '2007-11-05',
    gender: 'Female',
    currentClass: 'SSS 3',
    stream: 'Commercial',
    classSection: 'B',
    parentName: 'Ibrahim Turay',
    parentPhone: '+232 78 443322',
    address: '8 Signal Hill, Freetown',
    enrollmentYear: 2024,
    status: 'Active',
    profileColor: 'pink'
  },
  {
    id: 'stud-005',
    name: 'Amadu Jalloh',
    admissionNumber: 'SMA-2025-0301',
    dateOfBirth: '2014-06-18',
    gender: 'Male',
    currentClass: 'Class 3',
    classSection: 'A',
    parentName: 'Saidu Jalloh',
    parentPhone: '+232 79 998877',
    address: '18 Murray Town, Freetown',
    enrollmentYear: 2025,
    status: 'Active',
    profileColor: 'teal'
  },
  {
    id: 'stud-006',
    name: 'Hawa Conteh',
    admissionNumber: 'SMA-2026-0410',
    dateOfBirth: '2021-02-14',
    gender: 'Female',
    currentClass: 'Prep 2',
    classSection: 'Alpha',
    parentName: 'Charles Conteh',
    parentPhone: '+232 30 112233',
    address: '56 Regent Road, Lumley, Freetown',
    enrollmentYear: 2026,
    status: 'Active',
    profileColor: 'amber'
  },
  {
    id: 'stud-007',
    name: 'Mohamed Kamara',
    admissionNumber: 'SMA-2021-0112',
    dateOfBirth: '2009-12-01',
    gender: 'Male',
    currentClass: 'JSS 3',
    classSection: 'A',
    parentName: 'Alhaji Kamara',
    parentPhone: '+232 75 444333',
    address: '22 Sanders Street, Central Freetown',
    enrollmentYear: 2021,
    status: 'Active',
    profileColor: 'sky'
  },
  {
    id: 'stud-008',
    name: 'Fatmatta Sesay',
    admissionNumber: 'SMA-2024-0230',
    dateOfBirth: '2007-05-30',
    gender: 'Female',
    currentClass: 'SSS 3',
    stream: 'Arts',
    classSection: 'A',
    parentName: 'Lansana Sesay',
    parentPhone: '+232 76 111222',
    address: '14 Circular Road, Freetown',
    enrollmentYear: 2024,
    status: 'Active',
    profileColor: 'rose'
  },
  {
    id: 'stud-009',
    name: 'Josephine Dumbuya',
    admissionNumber: 'SMA-2025-0322',
    dateOfBirth: '2016-08-09',
    gender: 'Female',
    currentClass: 'Class 1',
    classSection: 'B',
    parentName: 'Momodu Dumbuya',
    parentPhone: '+232 88 123987',
    address: '88 Kroo Town Road, Freetown',
    enrollmentYear: 2025,
    status: 'Active',
    profileColor: 'violet'
  },
  {
    id: 'stud-010',
    name: 'Alieu Barrie',
    admissionNumber: 'SMA-2022-0199',
    dateOfBirth: '2012-03-27',
    gender: 'Male',
    currentClass: 'JSS 1',
    classSection: 'C',
    parentName: 'Chernor Barrie',
    parentPhone: '+232 77 776655',
    address: '61 Wilkinson Road, Freetown',
    enrollmentYear: 2022,
    status: 'Active',
    profileColor: 'cyan'
  },
  {
    id: 'stud-011',
    name: 'Mariama Kamara',
    admissionNumber: 'SMA-2026-0501',
    dateOfBirth: '2023-03-15',
    gender: 'Female',
    currentClass: 'Pre 1',
    classSection: 'A',
    parentName: 'Sullay Kamara',
    parentPhone: '+232 76 345678',
    address: '7 Lowcost Housing, Kambia 2, Northern Province',
    enrollmentYear: 2026,
    status: 'Active',
    profileColor: 'rose',
    allergies: 'None',
    bloodType: 'B+',
    emergencyContactName: 'Sullay Kamara',
    emergencyContactPhone: '+232 76 345678',
    emergencyContactRelation: 'Father',
    verified: true,
    verifiedBy: 'Evangelist Saint Turay (CEO/Principal & Admin)',
    verifiedAt: '2026-01-15'
  },
  {
    id: 'stud-012',
    name: 'Ibrahim S. Bangura',
    admissionNumber: 'SMA-2025-0488',
    dateOfBirth: '2021-06-10',
    gender: 'Male',
    currentClass: 'Nursery 2',
    classSection: 'Sunflowers',
    parentName: 'Hawa Bangura',
    parentPhone: '+232 78 889900',
    address: '24 Hospital Road, Kambia',
    enrollmentYear: 2025,
    status: 'Active',
    profileColor: 'amber',
    allergies: 'Lactose intolerant',
    bloodType: 'O+',
    emergencyContactName: 'Hawa Bangura',
    emergencyContactPhone: '+232 78 889900',
    emergencyContactRelation: 'Mother',
    verified: true,
    verifiedBy: 'Evangelist Saint Turay (CEO/Principal & Admin)',
    verifiedAt: '2025-09-10'
  },
  {
    id: 'stud-013',
    name: 'Alpha Umaru Bah',
    admissionNumber: 'GWM-UNI-2024-0012',
    dateOfBirth: '2004-10-18',
    gender: 'Male',
    currentClass: 'University Year 2',
    stream: 'Science',
    classSection: 'Department of Computing & Applied Sciences',
    parentName: 'Dr. Momoh Bah',
    parentPhone: '+232 77 223344',
    address: '88 University Way, Northern Province, Sierra Leone',
    enrollmentYear: 2024,
    status: 'Active',
    profileColor: 'emerald',
    allergies: 'None',
    bloodType: 'A+',
    emergencyContactName: 'Dr. Momoh Bah',
    emergencyContactPhone: '+232 77 223344',
    emergencyContactRelation: 'Guardian',
    verified: true,
    verifiedBy: 'Evangelist Saint Turay (CEO/Principal & Admin)',
    verifiedAt: '2024-10-02'
  }
];

// Helper to generate a standardized list of subject grades for a student class
function generateMockGrades(studentId: string, className: StudentClass, stream?: SSSStream, factor: number = 1): any[] {
  const subjects = getSubjectsForClass(className, stream);
  
  // Seedable/Deterministic-like generation based on index/id
  return subjects.map((subject, idx) => {
    // Generate scores (factor ranges from 0.7 to 1.1 to show variation among students)
    const baseCA = 20 + (idx % 4) * 2; // e.g., 20, 22, 24, 26
    const baseExam = 40 + (idx % 5) * 5; // e.g., 40, 45, 50, 55, 60
    
    let caScore = Math.min(30, Math.round(baseCA * factor));
    // For primary and early childhood level and university, CA is out of 40, Exam out of 60
    const isPrimaryOrEarly = className.startsWith('Pre') || className.startsWith('Prep') || className.startsWith('Nursery') || className.startsWith('Class');
    const isUniversity = className.startsWith('University');
    if (isPrimaryOrEarly || isUniversity) {
      caScore = Math.min(40, Math.round((baseCA + 8) * factor));
    }
    
    const maxExam = (isPrimaryOrEarly || isUniversity) ? 60 : 70;
    const examScore = Math.min(maxExam, Math.round(baseExam * factor));
    const totalScore = caScore + examScore;
    
    const { grade, remark } = calculateGrade(totalScore, className);
    
    return {
      id: `g-${studentId}-${idx}`,
      subject,
      caScore,
      examScore,
      totalScore,
      grade,
      remark
    };
  });
}

// Generate Sample Academic Records
export const DEMO_SAMPLE_ACADEMIC_RECORDS: StudentAcademicRecord[] = DEMO_SAMPLE_STUDENTS.map((student, sIdx) => {
  // Give different grade factors for realistic spread
  let factor = 1.0;
  if (sIdx === 0) factor = 1.05; // Excellent
  if (sIdx === 1) factor = 0.95; // Very Good
  if (sIdx === 2) factor = 1.10; // Brilliant Science
  if (sIdx === 3) factor = 0.88; // Commercial Credit
  if (sIdx === 4) factor = 0.80; // Pass level
  if (sIdx === 5) factor = 1.08; // High Nursery
  if (sIdx === 6) factor = 0.72; // Struggling
  if (sIdx === 7) factor = 1.02; // Fine Arts
  if (sIdx === 8) factor = 0.92; // Fresh primary
  if (sIdx === 9) factor = 0.86; // Middle JSS

  const term1Grades = generateMockGrades(student.id, student.currentClass, student.stream, factor);
  const term2Grades = generateMockGrades(student.id, student.currentClass, student.stream, factor * 1.02); // slight improvement
  const term3Grades = generateMockGrades(student.id, student.currentClass, student.stream, factor * 1.04); // further improvement

  const calcAverage = (grades: any[]) => {
    return Math.round(grades.reduce((acc, g) => acc + g.totalScore, 0) / grades.length);
  };

  const avg3 = calcAverage(term3Grades);
  
  let teacherRemarks = 'A very dedicated and hardworking student. Keep up the excellent work!';
  let principalRemarks = 'Outstanding performance. Promoted to the next grade.';
  let conduct = 'Excellent';

  if (avg3 < 50) {
    teacherRemarks = 'Needs to concentrate more and seek help with core subjects.';
    principalRemarks = 'Under review. Recommended for summer remedial classes.';
    conduct = 'Fair';
  } else if (avg3 < 65) {
    teacherRemarks = 'Satisfactory performance. Shows potential to achieve higher results.';
    principalRemarks = 'Good effort. Promoted with recommendations for math improvement.';
    conduct = 'Very Good';
  }

  return {
    studentId: student.id,
    academicYear: '2025/2026',
    terms: {
      1: {
        grades: term1Grades,
        teacherRemarks: 'He/She demonstrates keen interest in all subjects. A positive start.',
        principalRemarks: 'A very encouraging performance. Promoted to maintain momentum.',
        conduct: 'Excellent',
        attendance: { totalDays: 60, presentDays: 57 }
      },
      2: {
        grades: term2Grades,
        teacherRemarks: 'Steady progress observed. Consistent effort has produced better scores.',
        principalRemarks: 'Commendable improvements. Continue striving for core credits.',
        conduct: 'Excellent',
        attendance: { totalDays: 65, presentDays: 63 }
      },
      3: {
        grades: term3Grades,
        teacherRemarks,
        principalRemarks,
        conduct,
        attendance: { totalDays: 70, presentDays: Math.round(70 * (avg3 < 50 ? 0.85 : 0.96)) }
      }
    }
  };
});

// Sample National Examinations Prep Tracker for Milestone Classes
export const DEMO_SAMPLE_NATIONAL_EXAMS: NationalExamPrep[] = [
  {
    studentId: 'stud-001', // Class 6 (NPSE)
    examType: 'NPSE',
    registered: true,
    indexNumber: 'NP-349001-042',
    subjectsScores: [
      { subject: 'English', mockScore: 82, grade: 'A', status: 'Ready' },
      { subject: 'Mathematics', mockScore: 78, grade: 'B', status: 'Ready' },
      { subject: 'General Science', mockScore: 88, grade: 'A', status: 'Ready' },
      { subject: 'Social Studies', mockScore: 76, grade: 'B', status: 'Ready' },
      { subject: 'Quantitative Aptitude', mockScore: 84, grade: 'A', status: 'Ready' },
      { subject: 'Verbal Aptitude', mockScore: 81, grade: 'A', status: 'Ready' }
    ],
    totalScore: 489, // Out of 600 sum
    recommendation: 'Excellent prospect for top placement. Recommended for National Scholarship nomination.'
  },
  {
    studentId: 'stud-002', // JSS 3 (BECE)
    examType: 'BECE',
    registered: true,
    indexNumber: 'BE-581023-089',
    subjectsScores: [
      { subject: 'Language Arts (English)', mockScore: 71, grade: 'B2', status: 'Ready' },
      { subject: 'Mathematics', mockScore: 68, grade: 'B3', status: 'Ready' },
      { subject: 'Integrated Science', mockScore: 74, grade: 'B2', status: 'Ready' },
      { subject: 'Social Studies', mockScore: 78, grade: 'A1', status: 'Ready' },
      { subject: 'Business Studies', mockScore: 62, grade: 'C4', status: 'Ready' },
      { subject: 'Religious & Moral Education', mockScore: 82, grade: 'A1', status: 'Ready' },
      { subject: 'French', mockScore: 54, grade: 'C6', status: 'Review Needed' }
    ],
    totalScore: 6, // 6 Credits or better
    recommendation: 'High chance of science stream admission. Strengthen French elective prior to final BECE.'
  },
  {
    studentId: 'stud-007', // JSS 3 (BECE) - struggling
    examType: 'BECE',
    registered: true,
    indexNumber: 'BE-581023-112',
    subjectsScores: [
      { subject: 'Language Arts (English)', mockScore: 48, grade: 'D7', status: 'Critical' },
      { subject: 'Mathematics', mockScore: 39, grade: 'F9', status: 'Critical' },
      { subject: 'Integrated Science', mockScore: 45, grade: 'D7', status: 'Critical' },
      { subject: 'Social Studies', mockScore: 52, grade: 'C6', status: 'Review Needed' },
      { subject: 'Business Studies', mockScore: 41, grade: 'E8', status: 'Critical' },
      { subject: 'Religious & Moral Education', mockScore: 61, grade: 'C4', status: 'Ready' }
    ],
    totalScore: 2,
    recommendation: 'Targeted mathematics tutorials required. Needs intensive intervention to secure 5 credits.'
  },
  {
    studentId: 'stud-003', // SSS 3 (WASSCE) - Science
    examType: 'WASSCE',
    registered: true,
    indexNumber: 'WA-001090-005',
    subjectsScores: [
      { subject: 'English Language', mockScore: 79, grade: 'A1', status: 'Ready' },
      { subject: 'Mathematics (Core)', mockScore: 84, grade: 'A1', status: 'Ready' },
      { subject: 'Biology', mockScore: 81, grade: 'A1', status: 'Ready' },
      { subject: 'Chemistry', mockScore: 76, grade: 'A1', status: 'Ready' },
      { subject: 'Physics', mockScore: 78, grade: 'A1', status: 'Ready' },
      { subject: 'Further Mathematics', mockScore: 73, grade: 'B2', status: 'Ready' },
      { subject: 'Geography', mockScore: 82, grade: 'A1', status: 'Ready' }
    ],
    totalScore: 7, // 7 Distinctions
    recommendation: 'Outstanding academic record. Strongly positioned for medical/engineering degree scholarships.'
  },
  {
    studentId: 'stud-004', // SSS 3 (WASSCE) - Commercial
    examType: 'WASSCE',
    registered: true,
    indexNumber: 'WA-001090-211',
    subjectsScores: [
      { subject: 'English Language', mockScore: 62, grade: 'C4', status: 'Ready' },
      { subject: 'Mathematics (Core)', mockScore: 58, grade: 'C5', status: 'Ready' },
      { subject: 'Financial Accounting', mockScore: 71, grade: 'B2', status: 'Ready' },
      { subject: 'Commerce', mockScore: 69, grade: 'B3', status: 'Ready' },
      { subject: 'Economics', mockScore: 65, grade: 'B3', status: 'Ready' },
      { subject: 'Business Management', mockScore: 73, grade: 'B2', status: 'Ready' }
    ],
    totalScore: 6, // 6 Credits/Distinctions
    recommendation: 'WASSCE performance projected to clear all university commercial entry requirements.'
  },
  {
    studentId: 'stud-008', // SSS 3 (WASSCE) - Arts
    examType: 'WASSCE',
    registered: true,
    indexNumber: 'WA-001090-230',
    subjectsScores: [
      { subject: 'English Language', mockScore: 77, grade: 'A1', status: 'Ready' },
      { subject: 'Mathematics (Core)', mockScore: 51, grade: 'C6', status: 'Review Needed' },
      { subject: 'Literature in English', mockScore: 80, grade: 'A1', status: 'Ready' },
      { subject: 'Government', mockScore: 73, grade: 'B2', status: 'Ready' },
      { subject: 'History', mockScore: 75, grade: 'A1', status: 'Ready' },
      { subject: 'Christian Religious Studies (CRS)', mockScore: 81, grade: 'A1', status: 'Ready' }
    ],
    totalScore: 6,
    recommendation: 'Highly proficient in literature and arts. Core Mathematics needs practice to secure a credit.'
  }
];

// Sample Fee Ledgers for students
export const DEMO_SAMPLE_FEE_LEDGERS: StudentFeeLedger[] = DEMO_SAMPLE_STUDENTS.map((student, idx) => {
  // Pre-School & Nursery: SLL 2,000 per term
  // Primary (Class 1-6): SLL 2,500 per term
  // JSS (1-3): SLL 3,500 per term
  // SSS (1-3): SLL 4,500 per term
  // University: SLL 6,500 per semester
  // (In Sierra Leone Leones, using modern Leones SLE/SLL denomination values)
  let baseFee = 2500;
  if (student.currentClass.startsWith('Pre') || student.currentClass.startsWith('Prep') || student.currentClass.startsWith('Nursery')) {
    baseFee = 2000;
  } else if (student.currentClass.startsWith('Class')) {
    baseFee = 2500;
  } else if (student.currentClass.startsWith('JSS')) {
    baseFee = 3500;
  } else if (student.currentClass.startsWith('SSS')) {
    baseFee = 4500;
  } else if (student.currentClass.startsWith('University')) {
    baseFee = 6500;
  }

  // Let's vary the payment statuses
  let t1Paid = baseFee;
  let t2Paid = baseFee;
  let t3Paid = baseFee;
  
  if (idx === 1) { // Partial Term 3
    t3Paid = Math.round(baseFee * 0.6);
  } else if (idx === 4) { // Unpaid Term 3
    t3Paid = 0;
  } else if (idx === 6) { // Struggling financially
    t2Paid = Math.round(baseFee * 0.5);
    t3Paid = 0;
  } else if (idx === 9) { // Partial Term 2 & Term 3
    t2Paid = Math.round(baseFee * 0.8);
    t3Paid = Math.round(baseFee * 0.3);
  }

  const buildStatus = (due: number, paid: number) => {
    if (paid >= due) return 'Paid';
    if (paid > 0) return 'Partial';
    return 'Unpaid';
  };

  const getT1History = (): any[] => [
    {
      id: `rcpt-${student.id}-t1-1`,
      date: '2025-09-12',
      amount: t1Paid,
      paymentMethod: 'Bank Deposit',
      receiptNumber: `SMA-REC-00${idx + 10}A`
    }
  ];

  const getT2History = (): any[] => {
    if (t2Paid === 0) return [];
    return [
      {
        id: `rcpt-${student.id}-t2-1`,
        date: '2026-01-10',
        amount: t2Paid,
        paymentMethod: idx % 2 === 0 ? 'Orange Money' : 'Africell Money',
        receiptNumber: `SMA-REC-00${idx + 10}B`
      }
    ];
  };

  const getT3History = (): any[] => {
    if (t3Paid === 0) return [];
    return [
      {
        id: `rcpt-${student.id}-t3-1`,
        date: '2026-04-18',
        amount: t3Paid,
        paymentMethod: 'Cash',
        receiptNumber: `SMA-REC-00${idx + 10}C`
      }
    ];
  };

  return {
    studentId: student.id,
    academicYear: '2025/2026',
    terms: {
      1: {
        totalDue: baseFee,
        paidAmount: t1Paid,
        balance: baseFee - t1Paid,
        status: buildStatus(baseFee, t1Paid),
        transactions: getT1History()
      },
      2: {
        totalDue: baseFee,
        paidAmount: t2Paid,
        balance: baseFee - t2Paid,
        status: buildStatus(baseFee, t2Paid),
        transactions: getT2History()
      },
      3: {
        totalDue: baseFee,
        paidAmount: t3Paid,
        balance: baseFee - t3Paid,
        status: buildStatus(baseFee, t3Paid),
        transactions: getT3History()
      }
    }
  };
});

/**
 * LIVE PRODUCTION DATABASE SCHEMAS
 * In production mode, all registries start completely clean and unseeded.
 * Real students, academic records, national exams, and fees are entered
 * through the school administrative interfaces.
 */
export const INITIAL_STUDENTS: Student[] = [];
export const INITIAL_ACADEMIC_RECORDS: StudentAcademicRecord[] = [];
export const INITIAL_NATIONAL_EXAMS: NationalExamPrep[] = [];
export const INITIAL_FEE_LEDGERS: StudentFeeLedger[] = [];

export const DEFAULT_SCHOOL_ANNOUNCEMENTS: SchoolAnnouncement[] = [
  {
    id: 'ann-001',
    title: 'Urgent: WASSCE & BECE Candidate File Verification',
    message: 'All Class Masters and exam candidates are advised that registration verification closes on Friday. Only official Administrator-verified student files signed by Principal Evangelist Saint Turay will be transmitted to the WAEC Kambia regional registry.',
    date: 'Today, 08:30 AM',
    priority: 'urgent',
    author: 'Evangelist Saint Turay (CEO/Principal)',
    category: 'administrative'
  },
  {
    id: 'ann-002',
    title: 'Urgent: Term 3 Tuition Fee Clearance Deadline',
    message: 'Notice to all guardians: The final deadline for Term 3 tuition settlement is next Monday. Please review the fee portal or visit the Bursary to verify receipts before continuous assessment exams.',
    date: 'Yesterday, 02:15 PM',
    priority: 'urgent',
    author: 'Bursary & Administration',
    category: 'fee'
  },
  {
    id: 'ann-003',
    title: 'New Digital Homework Upload & Download System Active',
    message: 'Teachers can now upload syllabus worksheets and revision materials directly. Staff can download and grade all student submitted assignments in real-time through the Educator Portal.',
    date: '2 days ago',
    priority: 'normal',
    author: 'Evangelist Saint Turay (CEO/Principal)',
    category: 'academic'
  },
  {
    id: 'ann-004',
    title: 'Rainy Season Bus Route #2 (Kambia Highway) Update',
    message: 'Morning pickup times for Route #2 will commence 15 minutes earlier due to road repairs near Kambia Junction. Ensure students are at transit checkpoints on time.',
    date: '3 days ago',
    priority: 'normal',
    author: 'Logistics & Transport Office',
    category: 'transport'
  }
];

export const DEFAULT_SAMPLE_TEACHERS: Teacher[] = [
  {
    id: 't-001',
    staffId: 'STF-2021-001',
    name: 'Mr. Sorie Conteh',
    email: 'sorie.conteh@giversworldmission.edu.sl',
    phone: '+232 76 345678',
    roleTitle: 'Head of Mathematics',
    department: 'Department of Mathematics & Computing',
    bloodType: 'O+',
    subjects: ['Mathematics (Core)', 'Further Mathematics'],
    classes: ['JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'],
    salary: 3800000,
    hireDate: '2021-09-01',
    payrollStatus: 'Paid',
    avatarColor: 'indigo',
    verified: true,
    verifiedBy: 'Evangelist Saint Turay (CEO/Principal & Admin)',
    verifiedAt: '2024-09-15'
  },
  {
    id: 't-002',
    staffId: 'STF-2020-002',
    name: 'Mrs. Mariama Sesay',
    email: 'mariama.sesay@giversworldmission.edu.sl',
    phone: '+232 78 912345',
    roleTitle: 'Head of Languages',
    department: 'Department of English & Literature',
    bloodType: 'A+',
    subjects: ['English Language', 'Literature in English'],
    classes: ['JSS 2', 'JSS 3', 'SSS 2', 'SSS 3'],
    salary: 3600000,
    hireDate: '2020-01-15',
    payrollStatus: 'Paid',
    avatarColor: 'emerald',
    verified: true,
    verifiedBy: 'Evangelist Saint Turay (CEO/Principal & Admin)',
    verifiedAt: '2024-09-15'
  },
  {
    id: 't-003',
    staffId: 'STF-2022-003',
    name: 'Dr. Joseph Kamara',
    email: 'joseph.kamara@giversworldmission.edu.sl',
    phone: '+232 30 554433',
    roleTitle: 'Senior Science Lecturer',
    department: 'Department of Natural Sciences',
    bloodType: 'B+',
    subjects: ['Chemistry', 'Biology', 'Integrated Science'],
    classes: ['JSS 3', 'SSS 1', 'SSS 2', 'SSS 3'],
    salary: 4200000,
    hireDate: '2022-03-10',
    payrollStatus: 'Pending',
    avatarColor: 'amber',
    verified: false,
    verifiedBy: undefined,
    verifiedAt: undefined
  },
  {
    id: 't-004',
    staffId: 'STF-2023-004',
    name: 'Mr. Alie Bangura',
    email: 'alie.bangura@giversworldmission.edu.sl',
    phone: '+232 77 889900',
    roleTitle: 'Physics & General Science Tutor',
    department: 'Department of Applied Physics',
    bloodType: 'O-',
    subjects: ['Physics', 'General Science'],
    classes: ['Class 6', 'JSS 1', 'SSS 1'],
    salary: 3500000,
    hireDate: '2023-11-01',
    payrollStatus: 'Unpaid',
    avatarColor: 'purple',
    verified: false,
    verifiedBy: undefined,
    verifiedAt: undefined
  }
];

export const DEFAULT_SAMPLE_ASSIGNMENTS: Assignment[] = [
  {
    id: 'assign-001',
    teacherId: 't-001',
    teacherName: 'Mr. Sorie Conteh',
    title: 'Quadratic Equations & Simultaneous Linear Systems',
    description: 'Solve problems 1 to 10 on quadratic factorization and elimination methods. Show detailed workings for each step in your written worksheet.',
    subject: 'Mathematics (Core)',
    className: 'SSS 3',
    dueDate: '2026-05-15',
    maxPoints: 100,
    createdAt: '2026-05-01',
    attachmentName: 'Quadratic_Equations_Problem_Set.pdf',
    attachmentSize: '420 KB',
    attachmentType: 'application/pdf'
  },
  {
    id: 'assign-002',
    teacherId: 't-002',
    teacherName: 'Mrs. Mariama Sesay',
    title: 'WAEC Essay: "The Role of Youth in National Development"',
    description: 'Write a comprehensive expository essay (between 450 to 500 words) discussing youth involvement in agriculture and technological innovation in Sierra Leone.',
    subject: 'English Language',
    className: 'SSS 3',
    dueDate: '2026-05-18',
    maxPoints: 50,
    createdAt: '2026-05-02',
    attachmentName: 'WAEC_Essay_Writing_Guide.docx',
    attachmentSize: '280 KB',
    attachmentType: 'application/msword'
  },
  {
    id: 'assign-003',
    teacherId: 't-003',
    teacherName: 'Dr. Joseph Kamara',
    title: 'Organic Chemistry: Hydrocarbons & Homologous Series',
    description: 'Provide IUPAC nomenclature for alkanes, alkenes, and functional isomers listed in section 3 of your laboratory manual.',
    subject: 'Chemistry',
    className: 'SSS 3',
    dueDate: '2026-05-20',
    maxPoints: 60,
    createdAt: '2026-05-03',
    attachmentName: 'Organic_Chemistry_Worksheet.pdf',
    attachmentSize: '510 KB',
    attachmentType: 'application/pdf'
  }
];

export const DEFAULT_SAMPLE_SUBMISSIONS: Submission[] = [
  {
    id: 'sub-001',
    assignmentId: 'assign-001',
    studentId: 'stud-003',
    studentName: 'Samuel Bangura',
    className: 'SSS 3',
    submittedAt: '2026-05-04 11:30',
    textResponse: 'Completed all 10 quadratic factorization questions. Used the quadratic formula for problems 7 and 8 where discriminant is non-perfect square. Step-by-step calculations attached.',
    fileName: 'Samuel_Bangura_Math_Quadratic_Solutions.pdf',
    fileSize: '680 KB',
    status: 'Pending'
  },
  {
    id: 'sub-002',
    assignmentId: 'assign-002',
    studentId: 'stud-003',
    studentName: 'Samuel Bangura',
    className: 'SSS 3',
    submittedAt: '2026-05-05 14:15',
    textResponse: 'Expository essay draft completed (490 words). Highlights the transformative potential of mechanized farming and youth literacy clubs in Kambia district.',
    fileName: 'Samuel_Bangura_English_Essay_Draft.docx',
    fileSize: '340 KB',
    status: 'Graded',
    score: 46,
    feedback: 'Commendable coherence, persuasive rhetoric, and accurate punctuation. Well-structured introduction!'
  },
  {
    id: 'sub-003',
    assignmentId: 'assign-001',
    studentId: 'stud-005',
    studentName: 'Fatmata Kamara',
    className: 'SSS 3',
    submittedAt: '2026-05-06 09:45',
    textResponse: 'Here are my solutions to the Quadratic Equations problem set. Solved using completing the square method for questions 1 through 5.',
    fileName: 'Fatmata_Kamara_Quadratic_Worksheet.pdf',
    fileSize: '512 KB',
    status: 'Pending'
  }
];


