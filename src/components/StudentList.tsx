/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  FileText, 
  X, 
  UserPlus,
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Check,
  CircleDot,
  Camera,
  Upload,
  Image,
  CreditCard,
  Heart,
  ShieldAlert,
  Users,
  Printer
} from 'lucide-react';
import { Student, StudentClass, SSSStream } from '../types';
import { CLASSES_LIST, SSS_STREAMS } from '../constants';
import { SCHOOL_INFO } from '../initialData';
import { motion, AnimatePresence } from 'motion/react';
import StudentIdCardModal from './StudentIdCardModal';
import StudentAttendancePanel from './StudentAttendancePanel';
import StudentDisciplinaryPanel from './StudentDisciplinaryPanel';

interface StudentListProps {
  students: Student[];
  onAddStudent: (student: Student) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onNavigate: (tab: string, arg?: any) => void;
  initialSearch?: string;
  initialSelectedStudentId?: string;
}

export default function StudentList({ 
  students, 
  onAddStudent, 
  onUpdateStudent, 
  onDeleteStudent, 
  onNavigate,
  initialSearch,
  initialSelectedStudentId
}: StudentListProps) {
  // Filters & State
  const [search, setSearch] = useState('');

  // Handle incoming initial search or student selection
  useEffect(() => {
    if (initialSearch) {
      setSearch(initialSearch);
    } else if (initialSelectedStudentId) {
      const target = students.find(s => s.id === initialSelectedStudentId);
      if (target) {
        setSearch(target.admissionNumber || target.name);
      }
    }
  }, [initialSearch, initialSelectedStudentId, students]);
  const [selectedClass, setSelectedClass] = useState<StudentClass | 'All'>('All');
  const [selectedStream, setSelectedStream] = useState<SSSStream | 'All'>('All');
  const [selectedGender, setSelectedGender] = useState<'All' | 'Male' | 'Female'>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // ID Card Generator States
  const [isIdCardGeneratorOpen, setIsIdCardGeneratorOpen] = useState(false);
  const [idCardSelectedStudent, setIdCardSelectedStudent] = useState<Student | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formDob, setFormDob] = useState('');
  const [formGender, setFormGender] = useState<'Male' | 'Female'>('Male');
  const [formClass, setFormClass] = useState<StudentClass>('Class 1');
  const [formStream, setFormStream] = useState<SSSStream | undefined>(undefined);
  const [formSection, setFormSection] = useState('');
  const [formParentName, setFormParentName] = useState('');
  const [formParentPhone, setFormParentPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formEnrollmentYear, setFormEnrollmentYear] = useState(new Date().getFullYear());
  const [formStatus, setFormStatus] = useState<'Active' | 'Transferred' | 'Graduated'>('Active');
  const [formProfileImage, setFormProfileImage] = useState<string | undefined>(undefined);

  // Medical Record & SubTab States
  const [activeSubTab, setActiveSubTab] = useState<'directory' | 'medical' | 'attendance' | 'disciplinary'>('directory');
  const [formAllergies, setFormAllergies] = useState('');
  const [formBloodType, setFormBloodType] = useState('');
  const [formEmergencyName, setFormEmergencyName] = useState('');
  const [formEmergencyPhone, setFormEmergencyPhone] = useState('');
  const [formEmergencyRelation, setFormEmergencyRelation] = useState('');
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Camera Management States & Refs
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Stop camera helper
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Cleanup camera stream on modal close or unmount
  useEffect(() => {
    if (!isModalOpen) {
      stopCamera();
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isModalOpen]);

  // Start camera helper
  const startCamera = async () => {
    setCameraError(null);
    setIsCameraActive(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 400 }, height: { ideal: 400 }, facingMode: 'user' }
      });
      setCameraStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (err: any) {
      console.error('Camera access error:', err);
      setCameraError('Could not access camera. Please check permissions or upload a file.');
      setIsCameraActive(false);
    }
  };

  // Take Snapshot
  const captureSnapshot = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      const size = Math.min(video.videoWidth, video.videoHeight) || 300;
      canvas.width = size;
      canvas.height = size;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Center crop to make 1:1 square
        const sx = (video.videoWidth - size) / 2;
        const sy = (video.videoHeight - size) / 2;
        ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setFormProfileImage(dataUrl);
      }
      stopCamera();
    }
  };

  // Upload File handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Trigger modal for editing
  const handleEditClick = (student: Student) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormDob(student.dateOfBirth);
    setFormGender(student.gender);
    setFormClass(student.currentClass);
    setFormStream(student.stream);
    setFormSection(student.classSection || '');
    setFormParentName(student.parentName);
    setFormParentPhone(student.parentPhone);
    setFormAddress(student.address);
    setFormEnrollmentYear(student.enrollmentYear);
    setFormStatus(student.status);
    setFormProfileImage(student.profileImage);
    setFormAllergies(student.allergies || '');
    setFormBloodType(student.bloodType || '');
    setFormEmergencyName(student.emergencyContactName || '');
    setFormEmergencyPhone(student.emergencyContactPhone || '');
    setFormEmergencyRelation(student.emergencyContactRelation || '');
    setCameraError(null);
    setIsCameraActive(false);
    setIsModalOpen(true);
  };

  // Trigger modal for creating
  const handleAddClick = () => {
    setEditingStudent(null);
    setFormName('');
    setFormDob('');
    setFormGender('Male');
    setFormClass('Class 1');
    setFormStream(undefined);
    setFormSection('A');
    setFormParentName('');
    setFormParentPhone('');
    setFormAddress('');
    setFormEnrollmentYear(new Date().getFullYear());
    setFormStatus('Active');
    setFormProfileImage(undefined);
    setFormAllergies('');
    setFormBloodType('');
    setFormEmergencyName('');
    setFormEmergencyPhone('');
    setFormEmergencyRelation('');
    setCameraError(null);
    setIsCameraActive(false);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formParentName.trim() || !formParentPhone.trim()) {
      alert('Please fill in the required fields (Student Name, Parent Name, Parent Phone)');
      return;
    }

    if (editingStudent) {
      // Update
      const updated: Student = {
        ...editingStudent,
        name: formName,
        dateOfBirth: formDob,
        gender: formGender,
        currentClass: formClass,
        stream: formClass.startsWith('SSS') ? (formStream || 'Science') : undefined,
        classSection: formSection || 'A',
        parentName: formParentName,
        parentPhone: formParentPhone,
        address: formAddress,
        enrollmentYear: formEnrollmentYear,
        status: formStatus,
        profileImage: formProfileImage,
        allergies: formAllergies,
        bloodType: formBloodType,
        emergencyContactName: formEmergencyName,
        emergencyContactPhone: formEmergencyPhone,
        emergencyContactRelation: formEmergencyRelation,
      };
      onUpdateStudent(updated);
    } else {
      // Create
      const newId = `stud-${Date.now()}`;
      const admissionNum = `NS-${formEnrollmentYear}-${Math.floor(1000 + Math.random() * 9000)}`;
      const newStudent: Student = {
        id: newId,
        name: formName,
        admissionNumber: admissionNum,
        dateOfBirth: formDob || '2015-01-01',
        gender: formGender,
        currentClass: formClass,
        stream: formClass.startsWith('SSS') ? (formStream || 'Science') : undefined,
        classSection: formSection || 'A',
        parentName: formParentName,
        parentPhone: formParentPhone,
        address: formAddress || 'Freetown, Sierra Leone',
        enrollmentYear: formEnrollmentYear,
        status: formStatus,
        profileColor: ['emerald', 'blue', 'purple', 'rose', 'pink', 'amber', 'teal', 'cyan', 'sky'][Math.floor(Math.random() * 9)],
        profileImage: formProfileImage,
        allergies: formAllergies,
        bloodType: formBloodType,
        emergencyContactName: formEmergencyName,
        emergencyContactPhone: formEmergencyPhone,
        emergencyContactRelation: formEmergencyRelation,
      };
      onAddStudent(newStudent);
    }
    stopCamera();
    setIsModalOpen(false);
  };

  // Filter students based on state
  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(search.toLowerCase()) || 
                          student.admissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchesClass = selectedClass === 'All' || student.currentClass === selectedClass;
    const matchesStream = selectedStream === 'All' || 
                          (student.currentClass.startsWith('SSS') && student.stream === selectedStream);
    const matchesGender = selectedGender === 'All' || student.gender === selectedGender;
    
    return matchesSearch && matchesClass && matchesStream && matchesGender;
  });

  return (
    <div className="space-y-6" id="student-list-tab-panel">
      {/* Title & Add student button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Student Directory</h2>
          <p className="text-xs text-slate-400">Search, filter, and register student records for Prep 1 to SSS 3</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => setIsPrintPreviewOpen(true)}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm transition-colors shadow-sm cursor-pointer"
          >
            <Printer className="w-4.5 h-4.5" /> Export PDF / Print
          </button>
          <button 
            onClick={() => {
              setIdCardSelectedStudent(null);
              setIsIdCardGeneratorOpen(true);
            }}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white hover:bg-slate-50 text-indigo-600 border border-indigo-200/60 font-semibold text-sm transition-colors shadow-xs cursor-pointer"
          >
            <CreditCard className="w-4.5 h-4.5" /> ID Cards Portal
          </button>
          <button 
            onClick={handleAddClick}
            className="flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" /> Register New Student
          </button>
        </div>
      </div>

      {/* Sub tabs: Directory vs Medical Records */}
      <div className="flex border-b border-slate-200/80 mt-2" id="directory-subtabs">
        <button
          onClick={() => setActiveSubTab('directory')}
          className={`flex items-center gap-2 py-2.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'directory'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-4 h-4" /> Student Directory
        </button>
        <button
          onClick={() => setActiveSubTab('medical')}
          className={`flex items-center gap-2 py-2.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'medical'
              ? 'border-rose-600 text-rose-600'
              : 'border-transparent text-slate-400 hover:text-rose-600'
          }`}
        >
          <Heart className="w-4 h-4" /> Medical Records
        </button>
        <button
          onClick={() => setActiveSubTab('attendance')}
          className={`flex items-center gap-2 py-2.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'attendance'
              ? 'border-emerald-600 text-emerald-600'
              : 'border-transparent text-slate-400 hover:text-emerald-600'
          }`}
        >
          <Calendar className="w-4 h-4" /> Daily Attendance
        </button>
        <button
          onClick={() => setActiveSubTab('disciplinary')}
          className={`flex items-center gap-2 py-2.5 px-4 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'disciplinary'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-400 hover:text-indigo-600'
          }`}
        >
          <ShieldAlert className="w-4 h-4" /> Behavior & Merits
        </button>
      </div>

      {/* Filter Bar */}
      {(activeSubTab === 'directory' || activeSubTab === 'medical') && (
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3" id="student-filters">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search Name or Admission ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 placeholder-slate-400"
              />
            </div>

            {/* Class Filter */}
            <div className="relative flex items-center">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedClass}
                onChange={(e) => {
                  setSelectedClass(e.target.value as StudentClass | 'All');
                  // clear stream if class is not SSS
                  if (!e.target.value.startsWith('SSS')) {
                    setSelectedStream('All');
                  }
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 appearance-none cursor-pointer"
              >
                <option value="All">All Class Levels</option>
                {CLASSES_LIST.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Stream Filter (Only shows/enables if SSS is selected or general overview) */}
            <div className="relative flex items-center">
              <CircleDot className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value as SSSStream | 'All')}
                disabled={selectedClass !== 'All' && !selectedClass.startsWith('SSS')}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="All">All SSS Streams</option>
                {SSS_STREAMS.map(s => (
                  <option key={s} value={s}>{s} Stream</option>
                ))}
              </select>
            </div>

            {/* Gender Filter */}
            <div className="relative flex items-center">
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value as 'All' | 'Male' | 'Female')}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 appearance-none cursor-pointer"
              >
                <option value="All">All Genders</option>
                <option value="Male">Boys</option>
                <option value="Female">Girls</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Student List View Grid */}
      {activeSubTab === 'attendance' ? (
        <StudentAttendancePanel students={students} />
      ) : activeSubTab === 'disciplinary' ? (
        <StudentDisciplinaryPanel students={students} />
      ) : activeSubTab === 'medical' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="student-medical-grid">
          {filteredStudents.map((student) => {
            const initials = student.name.split(' ').map(n => n[0]).join('');
            const bType = student.bloodType || 'Unknown';
            const hasAllergies = student.allergies && student.allergies.trim().toLowerCase() !== 'none' && student.allergies.trim().toLowerCase() !== '';
            
            return (
              <motion.div 
                layout
                key={`med-${student.id}`}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all relative overflow-hidden group flex flex-col justify-between"
                id={`student-medical-card-${student.id}`}
              >
                <div>
                  {/* Top: Student Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {student.profileImage ? (
                        <img
                          src={student.profileImage}
                          alt={student.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm">
                          {initials}
                        </div>
                      )}
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {student.admissionNumber}
                        </span>
                        <h3 className="font-bold text-slate-800 text-base mt-1 truncate max-w-[150px]">{student.name}</h3>
                      </div>
                    </div>

                    <div className="flex flex-col items-end">
                      <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-50 text-slate-600 border border-slate-100">
                        {student.currentClass}
                      </span>
                      {student.stream && (
                        <span className="text-[9px] font-medium text-indigo-600 mt-1 uppercase tracking-wider">
                          {student.stream}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Medical Details Content */}
                  <div className="mt-5 space-y-4 pt-4 border-t border-slate-50">
                    {/* Blood Type & Allergies row */}
                    <div className="grid grid-cols-12 gap-2">
                      <div className="col-span-4 flex flex-col items-center justify-center bg-rose-50/50 rounded-xl p-2.5 border border-rose-100/60">
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Blood Group</span>
                        <span className="text-lg font-black text-rose-700 mt-1">{bType}</span>
                      </div>
                      
                      <div className="col-span-8 bg-slate-50 rounded-xl p-2.5 border border-slate-100 flex flex-col justify-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <ShieldAlert className={`w-3.5 h-3.5 ${hasAllergies ? 'text-amber-500' : 'text-slate-400'}`} />
                          Allergies / Risks
                        </span>
                        <p className={`text-xs font-semibold truncate ${hasAllergies ? 'text-amber-700' : 'text-slate-500'}`} title={student.allergies}>
                          {student.allergies || 'No documented allergies'}
                        </p>
                      </div>
                    </div>

                    {/* Emergency Contact Block */}
                    <div className="bg-slate-50/60 rounded-xl p-3 border border-slate-100/80 space-y-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        Emergency Contact
                      </span>
                      {student.emergencyContactName ? (
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between text-slate-700 font-semibold">
                            <span>{student.emergencyContactName}</span>
                            <span className="text-indigo-600 font-medium bg-indigo-50 px-1.5 py-0.5 rounded text-[10px]">
                              {student.emergencyContactRelation || 'Contact'}
                            </span>
                          </div>
                          {student.emergencyContactPhone ? (
                            <a 
                              href={`tel:${student.emergencyContactPhone}`}
                              className="flex items-center gap-1.5 text-slate-500 hover:text-indigo-600 font-medium transition-colors"
                            >
                              <Phone className="w-3.5 h-3.5 text-slate-400" />
                              <span>{student.emergencyContactPhone}</span>
                            </a>
                          ) : (
                            <p className="text-slate-400 italic text-[11px]">No contact number provided</p>
                          )}
                        </div>
                      ) : (
                        <div className="text-slate-400 text-xs italic py-1">
                          No specific emergency contact set. Fallback to Primary Parent:
                          <div className="mt-1.5 font-semibold text-slate-600 not-italic">
                            {student.parentName} ({student.parentPhone})
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Card Action Rail */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                  <button 
                    onClick={() => handleEditClick(student)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/50 transition-colors cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5 text-slate-500" /> Update Medical Details
                  </button>
                </div>
              </motion.div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
              <Heart className="w-8 h-8 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">No medical records found</p>
              <p className="text-xs text-slate-400 mt-1">Refine your active search filters or register a new record.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="student-grid">
          {filteredStudents.map((student) => {
            const initials = student.name.split(' ').map(n => n[0]).join('');
            
            // Set color theme depending on gender or stream
            const colorStyles = {
              emerald: 'bg-emerald-50 border-emerald-100 text-emerald-800',
              blue: 'bg-blue-50 border-blue-100 text-blue-800',
              purple: 'bg-purple-50 border-purple-100 text-purple-800',
              rose: 'bg-rose-50 border-rose-100 text-rose-800',
              pink: 'bg-pink-50 border-pink-100 text-pink-800',
              amber: 'bg-amber-50 border-amber-100 text-amber-800',
              teal: 'bg-teal-50 border-teal-100 text-teal-800',
              cyan: 'bg-cyan-50 border-cyan-100 text-cyan-800',
              sky: 'bg-sky-50 border-sky-100 text-sky-800',
            };

            const sColor = (student.profileColor || 'emerald') as keyof typeof colorStyles;
            const chosenStyle = colorStyles[sColor] || colorStyles.emerald;

            return (
              <motion.div 
                layout
                key={student.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all relative overflow-hidden group"
                id={`student-card-${student.id}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {student.profileImage ? (
                      <img
                        src={student.profileImage}
                        alt={student.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm ${chosenStyle}`}>
                        {initials}
                      </div>
                    )}
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {student.admissionNumber}
                      </span>
                      <h3 className="font-bold text-slate-800 text-base mt-1 truncate max-w-[150px]">{student.name}</h3>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-50 text-slate-600 border border-slate-100">
                      {student.currentClass}
                    </span>
                    {student.stream && (
                      <span className="text-[9px] font-medium text-indigo-600 mt-1 uppercase tracking-wider">
                        {student.stream}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bio Details */}
                <div className="mt-4 pt-4 border-t border-slate-50 text-xs text-slate-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{student.parentPhone} ({student.parentName})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 truncate" />
                    <span className="truncate max-w-[200px]">{student.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>DOB: {student.dateOfBirth} | Year: {student.enrollmentYear}</span>
                  </div>
                </div>

                {/* Card Action Rails */}
                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold gap-2">
                  <button 
                    onClick={() => onNavigate('report-card', { studentId: student.id })}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-800 border border-indigo-100/30 transition-colors cursor-pointer"
                    title="View report card"
                  >
                    <FileText className="w-3.5 h-3.5" /> Report
                  </button>

                  <button 
                    onClick={() => {
                      setIdCardSelectedStudent(student);
                      setIsIdCardGeneratorOpen(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/50 transition-colors cursor-pointer"
                    title="Generate ID card"
                  >
                    <CreditCard className="w-3.5 h-3.5" /> ID Card
                  </button>
                  
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEditClick(student)}
                      className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/50 transition-colors cursor-pointer"
                      title="Edit Record"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete ${student.name}'s file? This deletes academic and payment records.`)) {
                          onDeleteStudent(student.id);
                        }
                      }}
                      className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-100/50 transition-colors cursor-pointer"
                      title="Delete Student"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filteredStudents.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
              <UserPlus className="w-8 h-8 mx-auto text-slate-300 mb-3" />
              <p className="text-sm font-semibold">No students found</p>
              <p className="text-xs text-slate-400 mt-1">Refine your active search filters or register a new record.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal: Add/Edit student */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto" id="student-modal">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl border border-slate-100 shadow-xl w-full max-w-2xl overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center bg-slate-900 text-white p-5">
                <div>
                  <h3 className="font-bold text-lg">{editingStudent ? 'Edit Student File' : 'Register New Student'}</h3>
                  <p className="text-slate-400 text-xs">Fill out standard West African student registration details</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Profile Photo Capture */}
                  <div className="sm:col-span-2 flex flex-col items-center justify-center bg-slate-50 p-4 rounded-2xl border border-slate-100/80 mb-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">Student Profile Photo</label>
                    
                    <div className="relative w-32 h-32 rounded-2xl bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center group shadow-inner">
                      {isCameraActive ? (
                        <video
                          ref={videoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      ) : formProfileImage ? (
                        <img
                          src={formProfileImage}
                          alt="Preview"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-slate-400 text-center flex flex-col items-center justify-center p-2">
                          <Image className="w-8 h-8 text-slate-300 mb-1" />
                          <span className="text-[10px] font-semibold text-slate-400">No Photo Captured</span>
                        </div>
                      )}

                      {/* Hover Overlay to delete photo */}
                      {!isCameraActive && formProfileImage && (
                        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => setFormProfileImage(undefined)}
                            className="p-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition-colors cursor-pointer shadow-md"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Camera Control Buttons */}
                    <div className="mt-3.5 flex flex-wrap gap-2 justify-center">
                      {isCameraActive ? (
                        <>
                          <button
                            type="button"
                            onClick={captureSnapshot}
                            className="py-1.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                          >
                            <Camera className="w-4 h-4" /> Capture Snapshot
                          </button>
                          <button
                            type="button"
                            onClick={stopCamera}
                            className="py-1.5 px-4 bg-slate-600 hover:bg-slate-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer transition-colors"
                          >
                            <X className="w-4 h-4" /> Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={startCamera}
                            className="py-1.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-100/50 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Camera className="w-4 h-4" /> Start Camera
                          </button>
                          
                          <label className="py-1.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs transition-all cursor-pointer">
                            <Upload className="w-4 h-4 text-slate-500" /> Upload Photo
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                        </>
                      )}
                    </div>
                    
                    {cameraError && (
                      <p className="text-[10px] text-rose-500 font-semibold mt-2">{cameraError}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Student Full Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Samuel Kargbo"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* DOB */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Date of Birth</label>
                    <input 
                      type="date" 
                      value={formDob}
                      onChange={(e) => setFormDob(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* Gender */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Gender</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gender" 
                          checked={formGender === 'Male'} 
                          onChange={() => setFormGender('Male')} 
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        Male
                      </label>
                      <label className="flex items-center gap-1.5 text-sm text-slate-600 cursor-pointer">
                        <input 
                          type="radio" 
                          name="gender" 
                          checked={formGender === 'Female'} 
                          onChange={() => setFormGender('Female')}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        Female
                      </label>
                    </div>
                  </div>

                  {/* Class Level */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Class Level</label>
                    <select
                      value={formClass}
                      onChange={(e) => {
                        const val = e.target.value as StudentClass;
                        setFormClass(val);
                        if (val.startsWith('SSS') && !formStream) {
                          setFormStream('Science');
                        } else if (!val.startsWith('SSS')) {
                          setFormStream(undefined);
                        }
                      }}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white"
                    >
                      {CLASSES_LIST.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* Stream (conditional) */}
                  {formClass.startsWith('SSS') && (
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-500">Academic Stream</label>
                      <select
                        value={formStream || 'Science'}
                        onChange={(e) => setFormStream(e.target.value as SSSStream)}
                        className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white"
                      >
                        {SSS_STREAMS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {/* Section / Arms */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Class Section / Arm</label>
                    <input 
                      type="text" 
                      value={formSection}
                      onChange={(e) => setFormSection(e.target.value)}
                      placeholder="e.g. A, B, Alpha, Blue"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* Parent Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Parent / Guardian Full Name <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formParentName}
                      onChange={(e) => setFormParentName(e.target.value)}
                      placeholder="e.g. Alhaji Kargbo"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* Parent Phone */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Parent Phone Contact <span className="text-rose-500">*</span></label>
                    <input 
                      type="text" 
                      required
                      value={formParentPhone}
                      onChange={(e) => setFormParentPhone(e.target.value)}
                      placeholder="e.g. +232 76 XXXXXX"
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Home Address</label>
                    <textarea 
                      value={formAddress}
                      onChange={(e) => setFormAddress(e.target.value)}
                      placeholder="e.g. 12 Wilkinson Road, Freetown"
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* Admission Year */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Admission Enrollment Year</label>
                    <input 
                      type="number" 
                      value={formEnrollmentYear}
                      onChange={(e) => setFormEnrollmentYear(parseInt(e.target.value) || new Date().getFullYear())}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                    />
                  </div>

                  {/* Status */}
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500">Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as any)}
                      className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white"
                    >
                      <option value="Active">Active</option>
                      <option value="Transferred">Transferred</option>
                      <option value="Graduated">Graduated</option>
                    </select>
                  </div>

                  {/* Medical & Emergency Details Section */}
                  <div className="sm:col-span-2 mt-4 pt-4 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Heart className="w-4 h-4 text-rose-500" /> Medical & Emergency Records
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Blood Type */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Blood Type</label>
                        <select
                          value={formBloodType}
                          onChange={(e) => setFormBloodType(e.target.value)}
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700 bg-white"
                        >
                          <option value="">Unknown / Not Selected</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      {/* Allergies */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Known Allergies</label>
                        <input 
                          type="text" 
                          value={formAllergies}
                          onChange={(e) => setFormAllergies(e.target.value)}
                          placeholder="e.g. Peanuts, Penicillin (leave empty if none)"
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                        />
                      </div>

                      {/* Emergency Contact Name */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500">Emergency Contact Name</label>
                        <input 
                          type="text" 
                          value={formEmergencyName}
                          onChange={(e) => setFormEmergencyName(e.target.value)}
                          placeholder="e.g. Uncle Brima"
                          className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                        />
                      </div>

                      {/* Emergency Contact Phone & Relation */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Contact Phone</label>
                          <input 
                            type="text" 
                            value={formEmergencyPhone}
                            onChange={(e) => setFormEmergencyPhone(e.target.value)}
                            placeholder="e.g. +232 76 000000"
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-slate-500">Relation</label>
                          <input 
                            type="text" 
                            value={formEmergencyRelation}
                            onChange={(e) => setFormEmergencyRelation(e.target.value)}
                            placeholder="e.g. Father, Aunt"
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-700"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Submit row */}
                <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="py-2 px-4 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="py-2 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                  >
                    <Check className="w-4 h-4" /> Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Student ID Card Modal Component */}
      <StudentIdCardModal
        isOpen={isIdCardGeneratorOpen}
        onClose={() => {
          setIsIdCardGeneratorOpen(false);
          setIdCardSelectedStudent(null);
        }}
        students={students}
        initialStudent={idCardSelectedStudent}
      />

      {/* Full-Screen printable directory preview modal */}
      <AnimatePresence>
        {isPrintPreviewOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto p-4 md:p-8 flex justify-center print:bg-white print:p-0 print:absolute print:inset-auto" id="printable-directory-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl w-full max-w-5xl shadow-xl border border-slate-100 flex flex-col print:border-none print:shadow-none print:rounded-none"
            >
              {/* Controller bar - hidden during print */}
              <div className="p-4 bg-slate-50 border-b border-slate-100 rounded-t-3xl flex justify-between items-center print:hidden">
                <div>
                  <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                    <Printer className="w-4 h-4 text-indigo-600" /> Printable Document Preview
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5">Optimized for A4 Portrait paper printing and PDF export</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 py-1.5 px-4 bg-slate-900 hover:bg-slate-850 text-white rounded-xl text-xs font-semibold shadow-xs cursor-pointer"
                  >
                    <Printer className="w-4 h-4" /> Print / Save as PDF
                  </button>
                  <button
                    onClick={() => setIsPrintPreviewOpen(false)}
                    className="flex items-center gap-1.5 py-1.5 px-3 bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    <X className="w-4 h-4" /> Close
                  </button>
                </div>
              </div>

              {/* Document Sheet */}
              <div className="p-8 space-y-6 print:p-0 flex-1">
                {/* Sierra Leone National Colors ribbon */}
                <div className="flex h-1.5 w-full overflow-hidden rounded-full">
                  <div className="bg-emerald-500 w-1/3"></div>
                  <div className="bg-white w-1/3 border-y border-slate-100"></div>
                  <div className="bg-blue-500 w-1/3"></div>
                </div>

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left border-b-2 border-slate-800 pb-5 gap-4">
                  <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-900 flex flex-col items-center justify-center text-white border-2 border-slate-800 font-bold shrink-0 relative overflow-hidden">
                      <span className="text-[10px] tracking-tight text-indigo-400 font-mono">GWM</span>
                      <span className="text-[7px] text-slate-400 font-sans uppercase text-center leading-tight">Givers</span>
                      <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 w-full"></div>
                    </div>
                    
                    <div className="space-y-1">
                      <h1 className="text-xl font-black text-slate-800 tracking-tight font-sans uppercase">{SCHOOL_INFO.name}</h1>
                      <p className="text-[11px] font-bold text-indigo-600 italic">" {SCHOOL_INFO.motto} "</p>
                      <p className="text-[10px] text-slate-500 font-medium font-mono">{SCHOOL_INFO.address} | Phone: {SCHOOL_INFO.phone}</p>
                    </div>
                  </div>

                  <div className="text-center md:text-right md:shrink-0">
                    <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-xs uppercase tracking-widest rounded-md border border-slate-900">
                      Official Student Registry
                    </span>
                    <p className="text-xs font-bold text-slate-700 mt-2">Export Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    <p className="text-xs font-bold text-indigo-600">Document Type: Complete Student Directory</p>
                  </div>
                </div>

                {/* Directory Stats metadata */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 text-xs font-medium text-slate-600 border border-slate-100">
                  <div>
                    <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Total Registered</span>
                    <span className="font-extrabold text-slate-800 text-sm">{students.length} Students</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Active Enrolled</span>
                    <span className="font-extrabold text-emerald-700 text-sm">{students.filter(s => s.status === 'Active').length} Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Transferred</span>
                    <span className="font-extrabold text-amber-700 text-sm">{students.filter(s => s.status === 'Transferred').length} Pupils</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold text-[9px] uppercase tracking-wider block">Graduated Alumni</span>
                    <span className="font-extrabold text-indigo-700 text-sm">{students.filter(s => s.status === 'Graduated').length} Alumni</span>
                  </div>
                </div>

                {/* Directory Table */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[9px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Adm ID</th>
                        <th className="py-2.5 px-3">Student Name</th>
                        <th className="py-2.5 px-3">Class/Grade</th>
                        <th className="py-2.5 px-3">Gender</th>
                        <th className="py-2.5 px-3 text-center">Status</th>
                        <th className="py-2.5 px-3">Parent / Emergency Contact</th>
                        <th className="py-2.5 px-3">Address</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {students.map((stud) => {
                        const statusColors = {
                          Active: 'bg-emerald-50 text-emerald-700 border-emerald-100',
                          Transferred: 'bg-amber-50 text-amber-700 border-amber-100',
                          Graduated: 'bg-indigo-50 text-indigo-700 border-indigo-100'
                        };

                        return (
                          <tr key={stud.id} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-mono font-bold text-indigo-600">{stud.admissionNumber}</td>
                            <td className="py-2 px-3 font-bold text-slate-900">{stud.name}</td>
                            <td className="py-2 px-3">
                              {stud.currentClass} {stud.stream ? `(${stud.stream})` : ''}
                            </td>
                            <td className="py-2 px-3 text-slate-500">{stud.gender}</td>
                            <td className="py-2 px-3 text-center">
                              <span className={`inline-block font-black px-1.5 py-0.5 rounded text-[8px] border uppercase tracking-wider ${
                                statusColors[stud.status] || 'bg-slate-50 text-slate-500'
                              }`}>
                                {stud.status}
                              </span>
                            </td>
                            <td className="py-2 px-3">
                              <div className="font-semibold text-slate-700">{stud.parentName}</div>
                              <div className="text-[10px] text-slate-400 font-mono">{stud.parentPhone}</div>
                            </td>
                            <td className="py-2 px-3 text-slate-500 truncate max-w-[150px]">{stud.address}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer seal */}
                <div className="flex justify-between items-end pt-8 border-t border-slate-100 text-[10px] text-slate-400">
                  <div>
                    <p>Official school administration database release</p>
                    <p className="font-mono mt-0.5">SHA-256 Checksum: VERITAS-STUDENT-LEDGER-2026</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-700">Eunice O.C Decker</p>
                    <p className="italic">Principal Registrar Seal & Signature</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
