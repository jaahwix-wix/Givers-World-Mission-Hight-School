/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  setDoc,
  getDoc
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserRole, RolePrivileges, AuthUser } from './types';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Firestore must be initialized with the database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Standard West African School Management Role Privileges Matrix
export const ROLE_PRIVILEGES_MAP: Record<UserRole, RolePrivileges> = {
  admin: {
    role: 'admin',
    label: 'Super Admin / Principal',
    description: 'Unrestricted administrative authority across all school modules and financial controls',
    canViewDashboard: true,
    canViewStudents: true,
    canManageStudents: true,
    canTakeAttendance: true,
    canManageDiscipline: true,
    canViewAcademics: true,
    canManageAcademics: true,
    canGenerateReportCards: true,
    canViewFinances: true,
    canManageFinances: true,
    canManageStaff: true,
    canManageBus: true,
    canManageLibrary: true,
    canBackupData: true,
    canManageUserRoles: true,
    canViewStudentPortal: true,
    canVerifyStaffAndStudents: true, // Only administrator
  },
  teacher: {
    role: 'teacher',
    label: 'Academic Teacher / Form Master',
    description: 'Academic management, marks entry, attendance, report cards, and student pastoral care',
    canViewDashboard: true,
    canViewStudents: true,
    canManageStudents: false, // Cannot delete or alter primary registry records
    canTakeAttendance: true,
    canManageDiscipline: true,
    canViewAcademics: true,
    canManageAcademics: true,
    canGenerateReportCards: true,
    canViewFinances: false, // Restricted from tuition financial data
    canManageFinances: false,
    canManageStaff: false,
    canManageBus: false,
    canManageLibrary: true,
    canBackupData: false,
    canManageUserRoles: false,
    canViewStudentPortal: false,
    canVerifyStaffAndStudents: false, // Restricted
  },
  bursar: {
    role: 'bursar',
    label: 'Bursar / Financial Officer',
    description: 'Tuition fees ledger, student payment receipts, expense vouchers, and bank deposits',
    canViewDashboard: true,
    canViewStudents: true,
    canManageStudents: false,
    canTakeAttendance: false,
    canManageDiscipline: false,
    canViewAcademics: false,
    canManageAcademics: false, // Cannot tamper with exam marks
    canGenerateReportCards: false,
    canViewFinances: true,
    canManageFinances: true,
    canManageStaff: false,
    canManageBus: false,
    canManageLibrary: false,
    canBackupData: false,
    canManageUserRoles: false,
    canViewStudentPortal: false,
    canVerifyStaffAndStudents: false, // Restricted
  },
  transport: {
    role: 'transport',
    label: 'Transportation & Logistics Officer',
    description: 'School bus fleet operations, routes, safety checks, and student commuter manifests',
    canViewDashboard: true,
    canViewStudents: true, // View student contact details & drop-off zones
    canManageStudents: false,
    canTakeAttendance: false,
    canManageDiscipline: false,
    canViewAcademics: false,
    canManageAcademics: false,
    canGenerateReportCards: false,
    canViewFinances: false,
    canManageFinances: false,
    canManageStaff: false,
    canManageBus: true,
    canManageLibrary: false,
    canBackupData: false,
    canManageUserRoles: false,
    canViewStudentPortal: false,
    canVerifyStaffAndStudents: false, // Restricted
  },
  student_parent: {
    role: 'student_parent',
    label: 'Student & Guardian Portal',
    description: 'Read-only access to personal terminal report cards, continuous assessments, and fee balances',
    canViewDashboard: false,
    canViewStudents: false,
    canManageStudents: false,
    canTakeAttendance: false,
    canManageDiscipline: false,
    canViewAcademics: false,
    canManageAcademics: false,
    canGenerateReportCards: false,
    canViewFinances: false,
    canManageFinances: false,
    canManageStaff: false,
    canManageBus: false,
    canManageLibrary: false,
    canBackupData: false,
    canManageUserRoles: false,
    canViewStudentPortal: true,
    canVerifyStaffAndStudents: false, // Restricted
  },
};

// Demo Preset Accounts for Instant Role Testing
export const DEMO_PRESET_USERS: Record<UserRole, AuthUser> = {
  admin: {
    uid: 'demo_admin_01',
    email: 'principal.givers@school.edu.sl',
    displayName: 'Rev. Dr. Nabieu (Principal)',
    photoURL: null,
    role: 'admin',
    isCustomRole: true,
  },
  teacher: {
    uid: 'demo_teacher_01',
    email: 'mrs.turay.academics@school.edu.sl',
    displayName: 'Mrs. Fatmata Turay (Senior Teacher)',
    photoURL: null,
    role: 'teacher',
    isCustomRole: true,
  },
  bursar: {
    uid: 'demo_bursar_01',
    email: 'finance.bursar@school.edu.sl',
    displayName: 'Mr. Alie Kamara (School Bursar)',
    photoURL: null,
    role: 'bursar',
    isCustomRole: true,
  },
  transport: {
    uid: 'demo_transport_01',
    email: 'fleet.logistics@school.edu.sl',
    displayName: 'Capt. Mohamed Sesay (Fleet Officer)',
    photoURL: null,
    role: 'transport',
    isCustomRole: true,
  },
  student_parent: {
    uid: 'demo_parent_01',
    email: 'parent.kargbo@gmail.com',
    displayName: 'Pa Alhaji Kargbo (Guardian of Samuel)',
    photoURL: null,
    role: 'student_parent',
    isCustomRole: true,
  },
};

// Error handling specification conforming to Firebase skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase connection test: client offline or network timeout.');
      return false;
    }
    // Any permission-denied or non-offline error indicates successful server communication
    return true;
  }
}
