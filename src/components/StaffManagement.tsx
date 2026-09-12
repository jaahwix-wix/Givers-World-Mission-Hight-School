/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Users, 
  User, 
  Plus, 
  Edit, 
  Trash2, 
  Mail, 
  Phone, 
  BookOpen, 
  GraduationCap, 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  X, 
  ClipboardList, 
  Send, 
  Eye, 
  Award,
  Lock,
  ArrowRight,
  Search
} from 'lucide-react';
import { StudentClass } from '../types';

interface StaffManagementProps {
  students: any[];
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  classes: StudentClass[];
  salary: number;
  hireDate: string;
  payrollStatus: 'Paid' | 'Pending' | 'Unpaid';
  avatarColor?: string;
}

interface Assignment {
  id: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  subject: string;
  className: StudentClass;
  dueDate: string;
  maxPoints: number;
  createdAt: string;
}

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  className: StudentClass;
  submittedAt: string;
  textResponse: string;
  fileName: string;
  fileSize: string;
  status: 'Pending' | 'Graded';
  score?: number;
  feedback?: string;
}

const DEFAULT_TEACHERS: Teacher[] = [];

const DEFAULT_ASSIGNMENTS: Assignment[] = [];

const DEFAULT_SUBMISSIONS: Submission[] = [];

export default function StaffManagement({ students }: StaffManagementProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  // Navigation: "admin" vs "portal"
  const [viewMode, setViewMode] = useState<'admin' | 'portal'>('admin');
  
  // Selected teacher in portal mode
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');

  // Search & Filter
  const [adminSearch, setAdminSearch] = useState('');
  const [adminSubjectFilter, setAdminSubjectFilter] = useState('All');

  // Modal State (Add/Edit Teacher)
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);

  // Modal Form Fields
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formSubjects, setFormSubjects] = useState('');
  const [formClasses, setFormClasses] = useState<StudentClass[]>([]);
  const [formSalary, setFormSalary] = useState(3000000);
  const [formHireDate, setFormHireDate] = useState('');
  const [formPayroll, setFormPayroll] = useState<'Paid' | 'Pending' | 'Unpaid'>('Unpaid');

  // Modal State (Post Assignment)
  const [isAssignmentModalOpen, setIsAssignmentModalOpen] = useState(false);
  const [assignTitle, setAssignTitle] = useState('');
  const [assignDesc, setAssignDesc] = useState('');
  const [assignSubject, setAssignSubject] = useState('');
  const [assignClass, setAssignClass] = useState<StudentClass>('Class 1');
  const [assignDueDate, setAssignDueDate] = useState('');
  const [assignMaxPoints, setAssignMaxPoints] = useState(100);

  // Modal State (Grade Submission)
  const [gradingSubmission, setGradingSubmission] = useState<Submission | null>(null);
  const [gradeScore, setGradeScore] = useState(0);
  const [gradeFeedback, setGradeFeedback] = useState('');

  // Load States
  useEffect(() => {
    const loadStaffData = () => {
      const cachedTeachers = localStorage.getItem('sma_teachers');
      const cachedAssignments = localStorage.getItem('sma_assignments');
      const cachedSubmissions = localStorage.getItem('sma_submissions');

      if (cachedTeachers) {
        setTeachers(JSON.parse(cachedTeachers));
      } else {
        setTeachers(DEFAULT_TEACHERS);
        localStorage.setItem('sma_teachers', JSON.stringify(DEFAULT_TEACHERS));
      }

      if (cachedAssignments) {
        setAssignments(JSON.parse(cachedAssignments));
      } else {
        setAssignments(DEFAULT_ASSIGNMENTS);
        localStorage.setItem('sma_assignments', JSON.stringify(DEFAULT_ASSIGNMENTS));
      }

      if (cachedSubmissions) {
        setSubmissions(JSON.parse(cachedSubmissions));
      } else {
        setSubmissions(DEFAULT_SUBMISSIONS);
        localStorage.setItem('sma_submissions', JSON.stringify(DEFAULT_SUBMISSIONS));
      }
    };

    loadStaffData();
    window.addEventListener('sma_database_wiped', loadStaffData);
    window.addEventListener('storage', loadStaffData);
    return () => {
      window.removeEventListener('sma_database_wiped', loadStaffData);
      window.removeEventListener('storage', loadStaffData);
    };
  }, []);

  // Save Helpers
  const saveTeachers = (newTeachers: Teacher[]) => {
    setTeachers(newTeachers);
    localStorage.setItem('sma_teachers', JSON.stringify(newTeachers));
  };

  const saveAssignments = (newAssigns: Assignment[]) => {
    setAssignments(newAssigns);
    localStorage.setItem('sma_assignments', JSON.stringify(newAssigns));
  };

  const saveSubmissions = (newSubs: Submission[]) => {
    setSubmissions(newSubs);
    localStorage.setItem('sma_submissions', JSON.stringify(newSubs));
  };

  // Add/Edit Teacher Handlers
  const handleOpenAddTeacher = () => {
    setEditingTeacher(null);
    setFormName('');
    setFormEmail('');
    setFormPhone('');
    setFormSubjects('');
    setFormClasses(['Class 1']);
    setFormSalary(3500000);
    setFormHireDate(new Date().toISOString().substring(0, 10));
    setFormPayroll('Unpaid');
    setIsTeacherModalOpen(true);
  };

  const handleOpenEditTeacher = (t: Teacher) => {
    setEditingTeacher(t);
    setFormName(t.name);
    setFormEmail(t.email);
    setFormPhone(t.phone);
    setFormSubjects(t.subjects.join(', '));
    setFormClasses(t.classes);
    setFormSalary(t.salary);
    setFormHireDate(t.hireDate);
    setFormPayroll(t.payrollStatus);
    setIsTeacherModalOpen(true);
  };

  const handleTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subList = formSubjects.split(',').map(s => s.trim()).filter(s => s.length > 0);
    
    if (editingTeacher) {
      const updated = teachers.map(t => t.id === editingTeacher.id ? {
        ...t,
        name: formName,
        email: formEmail,
        phone: formPhone,
        subjects: subList,
        classes: formClasses,
        salary: formSalary,
        hireDate: formHireDate,
        payrollStatus: formPayroll
      } : t);
      saveTeachers(updated);
    } else {
      const colors = ['bg-indigo-600', 'bg-emerald-600', 'bg-amber-600', 'bg-purple-600', 'bg-rose-600', 'bg-teal-600'];
      const randColor = colors[Math.floor(Math.random() * colors.length)];
      const newTeacher: Teacher = {
        id: `t-${Date.now()}`,
        name: formName,
        email: formEmail,
        phone: formPhone,
        subjects: subList,
        classes: formClasses,
        salary: formSalary,
        hireDate: formHireDate,
        payrollStatus: formPayroll,
        avatarColor: randColor
      };
      saveTeachers([...teachers, newTeacher]);
    }
    setIsTeacherModalOpen(false);
  };

  const handleTeacherDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this staff record?')) {
      const updated = teachers.filter(t => t.id !== id);
      saveTeachers(updated);
    }
  };

  // Toggle Single Payroll Status shortcut
  const handleTogglePayroll = (id: string) => {
    const updated = teachers.map(t => {
      if (t.id === id) {
        const nextStatus: Teacher['payrollStatus'] = 
          t.payrollStatus === 'Paid' ? 'Pending' : (t.payrollStatus === 'Pending' ? 'Unpaid' : 'Paid');
        return { ...t, payrollStatus: nextStatus };
      }
      return t;
    });
    saveTeachers(updated);
  };

  // Post Assignment
  const handleOpenAssignmentModal = () => {
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    setAssignTitle('');
    setAssignDesc('');
    setAssignSubject(teacher?.subjects[0] || 'Mathematics');
    setAssignClass(teacher?.classes[0] || 'Class 1');
    setAssignDueDate(new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10)); // 5 days out
    setAssignMaxPoints(100);
    setIsAssignmentModalOpen(true);
  };

  const handleAssignmentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const teacher = teachers.find(t => t.id === selectedTeacherId);
    if (!teacher) return;

    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      teacherId: teacher.id,
      teacherName: teacher.name,
      title: assignTitle,
      description: assignDesc,
      subject: assignSubject,
      className: assignClass,
      dueDate: assignDueDate,
      maxPoints: assignMaxPoints,
      createdAt: new Date().toISOString().substring(0, 10)
    };

    saveAssignments([...assignments, newAssignment]);
    setIsAssignmentModalOpen(false);
  };

  const handleDeleteAssignment = (id: string) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      const updated = assignments.filter(a => a.id !== id);
      saveAssignments(updated);
      
      // Also delete corresponding submissions
      const updatedSubs = submissions.filter(s => s.assignmentId !== id);
      saveSubmissions(updatedSubs);
    }
  };

  // Grade Submission Submit
  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gradingSubmission) return;

    const updated = submissions.map(s => s.id === gradingSubmission.id ? {
      ...s,
      status: 'Graded' as const,
      score: gradeScore,
      feedback: gradeFeedback
    } : s);

    saveSubmissions(updated);
    setGradingSubmission(null);
  };

  // Filter teachers for admin list
  const filteredTeachers = teachers.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(adminSearch.toLowerCase()) || 
                          t.email.toLowerCase().includes(adminSearch.toLowerCase());
    const matchesSubject = adminSubjectFilter === 'All' || 
                           t.subjects.some(s => s.toLowerCase().includes(adminSubjectFilter.toLowerCase()));
    return matchesSearch && matchesSubject;
  });

  // Get active teacher details for portal mode
  const currentTeacher = teachers.find(t => t.id === selectedTeacherId);
  const teacherAssignments = assignments.filter(a => a.teacherId === selectedTeacherId);
  const teacherSubmissions = submissions.filter(s => {
    const assign = assignments.find(a => a.id === s.assignmentId);
    return assign?.teacherId === selectedTeacherId;
  });

  const ALL_CLASSES_LIST: StudentClass[] = [
    'Prep 1', 'Prep 2',
    'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6',
    'JSS 1', 'JSS 2', 'JSS 3',
    'SSS 1', 'SSS 2', 'SSS 3'
  ];

  return (
    <div className="space-y-6" id="staff-management-panel">
      {/* Flag style header */}
      <div className="bg-slate-900 rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-slate-800">
        <div className="flex h-1 w-full overflow-hidden absolute top-0 left-0">
          <div className="bg-emerald-500 w-1/3"></div>
          <div className="bg-white w-1/3"></div>
          <div className="bg-blue-500 w-1/3"></div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-indigo-400 border border-slate-700 font-mono">
                Human Resources
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900">
                Staff & Assignments
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight mt-1 flex items-center gap-2">
              <Users className="w-7 h-7 text-indigo-500" /> Educator Registry & Class Portals
            </h2>
            <p className="text-xs text-slate-400 mt-1">Track staff details, payroll status, assign subjects, post student homework, and grade uploads.</p>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => { setViewMode('admin'); setSelectedTeacherId(''); }}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'admin'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Administrator View
            </button>
            <button
              onClick={() => {
                setViewMode('portal');
                if (teachers.length > 0 && !selectedTeacherId) {
                  setSelectedTeacherId(teachers[0].id);
                }
              }}
              className={`py-2 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'portal'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700'
              }`}
            >
              Educator Portal
            </button>
          </div>
        </div>
      </div>

      {/* ADMIN VIEW */}
      {viewMode === 'admin' && (
        <div className="space-y-6" id="admin-staff-view">
          {/* Controls bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search teacher name or email..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs bg-slate-50 focus:outline-none focus:border-indigo-500 focus:bg-white text-slate-700 font-medium"
                />
              </div>

              <select
                value={adminSubjectFilter}
                onChange={(e) => setAdminSubjectFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Subjects</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Physics">Physics</option>
                <option value="Literature">Literature</option>
              </select>
            </div>

            <button
              onClick={handleOpenAddTeacher}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Register New Teacher
            </button>
          </div>

          {/* Teacher directory grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="teacher-directory-cards">
            {filteredTeachers.map(teacher => {
              const statusColors = {
                Paid: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                Pending: 'bg-amber-50 text-amber-700 border-amber-100',
                Unpaid: 'bg-rose-50 text-rose-700 border-rose-100'
              };

              return (
                <div key={teacher.id} className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5 space-y-4 flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Top block */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${teacher.avatarColor || 'bg-slate-900'} text-white flex items-center justify-center font-bold text-sm`}>
                          {teacher.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{teacher.name}</h4>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> Hired: {teacher.hireDate}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleTogglePayroll(teacher.id)}
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border cursor-pointer hover:opacity-85 transition-opacity ${statusColors[teacher.payrollStatus]}`}
                        title="Click to toggle payroll status"
                      >
                        {teacher.payrollStatus}
                      </button>
                    </div>

                    {/* Contacts */}
                    <div className="space-y-1 text-xs text-slate-500 font-medium">
                      <a href={`mailto:${teacher.email}`} className="flex items-center gap-2 hover:text-indigo-600 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {teacher.email}
                      </a>
                      <a href={`tel:${teacher.phone}`} className="flex items-center gap-2 hover:text-indigo-600 font-mono">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /> {teacher.phone}
                      </a>
                    </div>

                    {/* Classes & Subjects */}
                    <div className="space-y-2 pt-2 border-t border-slate-50">
                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Assigned Classes</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {teacher.classes.map(cls => (
                            <span key={cls} className="text-[9px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                              {cls}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Specializations</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {teacher.subjects.map(sub => (
                            <span key={sub} className="text-[9px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded">
                              {sub}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Salary and actions */}
                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">Monthly Salary</span>
                      <span className="font-mono font-bold text-slate-800 text-xs">SLL {teacher.salary.toLocaleString()}</span>
                    </div>

                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleOpenEditTeacher(teacher)}
                        className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/50 text-slate-600 rounded-lg cursor-pointer transition-colors"
                        title="Edit Teacher details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleTeacherDelete(teacher.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-600 rounded-lg cursor-pointer transition-colors"
                        title="Delete Teacher"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredTeachers.length === 0 && (
              <div className="col-span-full py-16 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl">
                <Users className="w-12 h-12 mx-auto text-slate-200 mb-2" />
                <p className="text-sm font-semibold text-slate-600">No staff members found matching criteria</p>
                <p className="text-xs text-slate-400 mt-1">Click the "Register New Teacher" button to begin populating the directory.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* EDUCATOR PORTAL VIEW */}
      {viewMode === 'portal' && (
        <div className="space-y-6" id="educator-portal-view">
          {/* Teacher Selection Profile bar */}
          <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Lock className="w-4 h-4 text-slate-400" />
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block whitespace-nowrap">Access Profile:</label>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            {currentTeacher && (
              <div className="flex items-center gap-2 text-xs font-bold text-slate-500 font-mono">
                <span>Classes assigned: <span className="text-slate-800">{currentTeacher.classes.length}</span></span>
                <span className="text-slate-300">|</span>
                <span>Payroll Status: <span className="text-emerald-600">{currentTeacher.payrollStatus}</span></span>
              </div>
            )}
          </div>

          {currentTeacher ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT: Assignments Posted */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                      <ClipboardList className="w-5 h-5 text-indigo-600" /> Posted Class Assignments
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">Academic home assignments, coursework activities and grading rubrics.</p>
                  </div>

                  <button
                    onClick={handleOpenAssignmentModal}
                    className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-sm cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Create Homework
                  </button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                  {teacherAssignments.map(assign => {
                    const submissionCount = submissions.filter(s => s.assignmentId === assign.id).length;
                    const pendingGradingCount = submissions.filter(s => s.assignmentId === assign.id && s.status === 'Pending').length;

                    return (
                      <div key={assign.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3 relative overflow-hidden flex flex-col justify-between">
                        <div>
                          {/* Title block */}
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded font-mono">
                                {assign.subject} - {assign.className}
                              </span>
                              <h4 className="font-bold text-slate-800 text-xs mt-1.5 leading-tight">{assign.title}</h4>
                            </div>

                            <button
                              onClick={() => handleDeleteAssignment(assign.id)}
                              className="p-1 hover:bg-rose-100 text-rose-500 rounded cursor-pointer transition-colors"
                              title="Delete Homework assignment"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed mt-2 line-clamp-3">{assign.description}</p>
                        </div>

                        {/* Stats & Deadline */}
                        <div className="pt-3 border-t border-slate-200/50 flex flex-wrap justify-between items-center text-[10px] text-slate-400 font-medium">
                          <div className="flex gap-3">
                            <span>Max points: <span className="font-bold text-slate-700">{assign.maxPoints} pts</span></span>
                            <span>Submissions: <span className="font-bold text-slate-700">{submissionCount}</span></span>
                            {pendingGradingCount > 0 && (
                              <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.2 rounded border border-amber-100">
                                {pendingGradingCount} Pending
                              </span>
                            )}
                          </div>

                          <span className="font-bold text-rose-600 font-mono">
                            Due Date: {assign.dueDate}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {teacherAssignments.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      <ClipboardList className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                      <p className="text-xs font-semibold">You haven't posted any homework yet.</p>
                      <p className="text-[11px] text-slate-400">Click the "Create Homework" button to set coursework for your students.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Submissions received */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-6">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 border-b border-slate-50 pb-4">
                    <Send className="w-5 h-5 text-indigo-600" /> Student Submissions ({teacherSubmissions.length})
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1">Review student uploads, add academic scores, and write personalized feedback remarks.</p>
                </div>

                <div className="space-y-3.5 max-h-[460px] overflow-y-auto pr-1 font-medium">
                  {teacherSubmissions.map(sub => {
                    const assign = assignments.find(a => a.id === sub.assignmentId);
                    
                    return (
                      <div key={sub.id} className="p-3 border border-slate-100 rounded-xl space-y-3 bg-slate-50/40">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-slate-800 text-xs">{sub.studentName}</h5>
                            <span className="text-[9px] font-mono text-slate-400 block">{sub.className} • Submitted {sub.submittedAt}</span>
                          </div>

                          {sub.status === 'Graded' ? (
                            <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                              Graded: {sub.score}/{assign?.maxPoints}
                            </span>
                          ) : (
                            <span className="text-[9px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">
                              Pending Review
                            </span>
                          )}
                        </div>

                        {/* Homework reference */}
                        <div className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                          <span className="font-bold text-slate-700 block">Task: {assign?.title}</span>
                          <span className="text-slate-400 block truncate mt-0.5">{sub.textResponse}</span>
                          {sub.fileName && (
                            <span className="inline-block mt-1 font-mono text-indigo-600 text-[8px] bg-indigo-50 px-1 py-0.2 rounded border border-indigo-100">
                              📎 {sub.fileName} ({sub.fileSize})
                            </span>
                          )}
                        </div>

                        {sub.status === 'Graded' && sub.feedback && (
                          <div className="p-2 bg-emerald-50/30 border border-emerald-100/50 rounded-lg text-[10px] text-emerald-800 leading-relaxed">
                            <span className="font-bold block">Educator Feedback:</span>
                            {sub.feedback}
                          </div>
                        )}

                        {sub.status === 'Pending' && (
                          <button
                            type="button"
                            onClick={() => {
                              setGradingSubmission(sub);
                              setGradeScore(assign?.maxPoints || 100);
                              setGradeFeedback('');
                            }}
                            className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold rounded-lg text-[10px] cursor-pointer transition-colors border border-indigo-100"
                          >
                            <Award className="w-3.5 h-3.5" /> Grade & Feedback
                          </button>
                        )}
                      </div>
                    );
                  })}

                  {teacherSubmissions.length === 0 && (
                    <div className="py-12 text-center text-slate-400">
                      <Eye className="w-8 h-8 mx-auto text-slate-200 mb-2" />
                      <p className="text-xs font-semibold">No submissions received yet.</p>
                      <p className="text-[11px] text-slate-400">Student answers will appear here once they log in and submit assignments.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 bg-white border border-slate-100 rounded-2xl">
              <Users className="w-12 h-12 mx-auto text-slate-200 mb-2" />
              <p className="text-sm font-semibold">Please select a teacher profile to access the educator workspace.</p>
            </div>
          )}
        </div>
      )}

      {/* MODAL: ADD / EDIT TEACHER */}
      {isTeacherModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Users className="w-5 h-5 text-indigo-600" /> {editingTeacher ? 'Edit Staff details' : 'Register New Teacher'}
              </h3>
              <button 
                onClick={() => setIsTeacherModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleTeacherSubmit} className="p-5 space-y-4 max-h-[500px] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Dr. Samuel Margai"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="e.g. s.margai@school.edu.sl"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Phone Contact</label>
                  <input
                    type="text"
                    required
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    placeholder="e.g. +232 76 000000"
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Subject Specializations (comma separated)</label>
                <input
                  type="text"
                  required
                  value={formSubjects}
                  onChange={(e) => setFormSubjects(e.target.value)}
                  placeholder="e.g. Mathematics, English Language, Physics"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assigned Class Levels</label>
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200/50 max-h-[120px] overflow-y-auto">
                  {ALL_CLASSES_LIST.map(cls => (
                    <label key={cls} className="flex items-center gap-2 text-xs text-slate-600 font-medium cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formClasses.includes(cls)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormClasses([...formClasses, cls]);
                          } else {
                            setFormClasses(formClasses.filter(c => c !== cls));
                          }
                        }}
                        className="rounded text-indigo-600 focus:ring-indigo-500"
                      />
                      {cls}
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Monthly Salary (SLL)</label>
                  <input
                    type="number"
                    required
                    min={100000}
                    value={formSalary}
                    onChange={(e) => setFormSalary(parseInt(e.target.value) || 0)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Hire Date</label>
                  <input
                    type="date"
                    required
                    value={formHireDate}
                    onChange={(e) => setFormHireDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Payroll Status</label>
                <select
                  value={formPayroll}
                  onChange={(e) => setFormPayroll(e.target.value as any)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white cursor-pointer"
                >
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending Approval</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Save Educator Details
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeacherModalOpen(false)}
                  className="py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST ASSIGNMENT */}
      {isAssignmentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <ClipboardList className="w-5 h-5 text-indigo-600" /> Create Homework Task
              </h3>
              <button 
                onClick={() => setIsAssignmentModalOpen(false)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleAssignmentSubmit} className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Assignment Title</label>
                <input
                  type="text"
                  required
                  value={assignTitle}
                  onChange={(e) => setAssignTitle(e.target.value)}
                  placeholder="e.g. Algebraic Functions & Quadratic Equations"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Task Instructions / Description</label>
                <textarea
                  required
                  rows={4}
                  value={assignDesc}
                  onChange={(e) => setAssignDesc(e.target.value)}
                  placeholder="Provide explicit homework guidelines, textbook exercises or writing guidelines..."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-700 leading-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Subject</label>
                  <select
                    value={assignSubject}
                    onChange={(e) => setAssignSubject(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-700 bg-white cursor-pointer font-semibold"
                  >
                    {currentTeacher?.subjects.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Grade Level</label>
                  <select
                    value={assignClass}
                    onChange={(e) => setAssignClass(e.target.value as StudentClass)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-700 bg-white cursor-pointer font-semibold"
                  >
                    {currentTeacher?.classes.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Max Points</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={assignMaxPoints}
                    onChange={(e) => setAssignMaxPoints(parseInt(e.target.value) || 100)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Due Date Deadline</label>
                  <input
                    type="date"
                    required
                    value={assignDueDate}
                    onChange={(e) => setAssignDueDate(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  BroadCast Assignment
                </button>
                <button
                  type="button"
                  onClick={() => setIsAssignmentModalOpen(false)}
                  className="py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: GRADE SUBMISSION */}
      {gradingSubmission && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-xl border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5">
                <Award className="w-5 h-5 text-indigo-600" /> Grade Student Submission
              </h3>
              <button 
                onClick={() => setGradingSubmission(null)}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <form onSubmit={handleGradeSubmit} className="p-5 space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-700 leading-normal font-medium space-y-1">
                <p><span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Student</span> {gradingSubmission.studentName} ({gradingSubmission.className})</p>
                <p className="mt-2"><span className="text-slate-400 font-bold uppercase tracking-wider block text-[9px]">Typed response</span> "{gradingSubmission.textResponse}"</p>
                {gradingSubmission.fileName && <p className="mt-1 font-mono text-[9px] text-indigo-600">📎 {gradingSubmission.fileName}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Award Score</label>
                <input
                  type="number"
                  required
                  min={0}
                  max={assignments.find(a => a.id === gradingSubmission.assignmentId)?.maxPoints || 100}
                  value={gradeScore}
                  onChange={(e) => setGradeScore(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 font-mono font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Feedback Remarks</label>
                <textarea
                  required
                  rows={3}
                  value={gradeFeedback}
                  onChange={(e) => setGradeFeedback(e.target.value)}
                  placeholder="e.g. Excellent solution structure. Well detailed step-by-step proofs."
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-700 leading-normal"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Record Grade
                </button>
                <button
                  type="button"
                  onClick={() => setGradingSubmission(null)}
                  className="py-2 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
