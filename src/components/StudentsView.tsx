import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Atom,
  Search,
  Plus,
  Filter,
  Phone,
  Receipt,
  Printer,
  Edit2,
  Trash2,
  IdCard,
  FileSpreadsheet,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  CalendarCheck,
  MapPin,
  HeartPulse,
  UserCheck,
  UserX,
  ChevronRight,
  X,
  CheckCheck,
  Building2,
  History,
  Award,
  FileText,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../context/SchoolContext';
import { Student, Division } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface StudentsViewProps {
  initialDivision?: Division;
  onOpenAddStudent?: () => void;
  onOpenCollectFeeForStudent: (student: Student) => void;
  selectedStudent?: Student | null;
  onSelectStudent?: (student: Student | null) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  initialDivision = 'School',
  onOpenAddStudent,
  onOpenCollectFeeForStudent,
  selectedStudent: externalSelectedStudent,
  onSelectStudent: externalOnSelectStudent
}) => {
  const {
    students,
    attendance,
    fees,
    testSchedules,
    testResults,
    addStudent,
    updateStudent,
    deleteStudent,
    toggleStudentStatus,
    clearStudentFee,
    getStudentAttendanceStats,
    setActivePrintDoc,
    stats
  } = useSchool();

  const [activeDivision, setActiveDivision] = useState<Division>(initialDivision);

  useEffect(() => {
    if (initialDivision) {
      setActiveDivision(initialDivision);
    }
  }, [initialDivision]);
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('All');
  const [feeStatusFilter, setFeeStatusFilter] = useState<'All' | 'Paid' | 'Pending'>('All');
  const [campusStatusFilter, setCampusStatusFilter] = useState<'All' | 'Active' | 'Left Campus'>('All');
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [internalSelectedStudent, setInternalSelectedStudent] = useState<Student | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm Modal state
  const [confirmDeleteStudent, setConfirmDeleteStudent] = useState<{ id: string; name: string } | null>(null);
  const [confirmClearFeeStudent, setConfirmClearFeeStudent] = useState<{ student: Student; due: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // New Student Form State
  const [newStudent, setNewStudent] = useState<Partial<Student>>({
    name: '',
    rollNo: '',
    fatherName: '',
    division: 'School',
    classGrade: 'Class 9th (Science)',
    parentContact: '0300-1234567',
    emergencyContact: '0312-7654321',
    address: 'Near Campus, City',
    bloodGroup: 'O+',
    gender: 'Male',
    totalFee: 4500,
    paidFee: 0,
    discountFee: 0,
    activeStatus: 'Active',
    academicRemarks: ''
  });

  const selectedStudent = externalSelectedStudent !== undefined ? externalSelectedStudent : internalSelectedStudent;
  const onSelectStudent = externalOnSelectStudent || setInternalSelectedStudent;

  const handleOpenAdd = () => {
    if (onOpenAddStudent) {
      onOpenAddStudent();
    } else {
      setNewStudent({
        name: '',
        rollNo: String(students.length + 101),
        fatherName: '',
        division: activeDivision,
        classGrade: activeDivision === 'School' ? 'Class 9th (Science)' : 'Matric Science',
        parentContact: '',
        emergencyContact: '',
        address: '',
        bloodGroup: 'B+',
        gender: 'Male',
        totalFee: activeDivision === 'School' ? 4500 : 6500,
        paidFee: 0,
        discountFee: 0,
        activeStatus: 'Active',
        academicRemarks: ''
      });
      setIsAddModalOpen(true);
    }
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudent.name || !newStudent.rollNo) return;

    const created = addStudent({
      name: newStudent.name!,
      rollNo: newStudent.rollNo!,
      fatherName: newStudent.fatherName || 'Guardian',
      division: newStudent.division || activeDivision,
      classGrade: newStudent.classGrade || 'Class 9th',
      parentContact: newStudent.parentContact || '0300-0000000',
      emergencyContact: newStudent.emergencyContact || '0300-0000000',
      address: newStudent.address || 'Campus locality',
      bloodGroup: newStudent.bloodGroup || 'O+',
      gender: (newStudent.gender as any) || 'Male',
      admissionDate: new Date().toISOString().split('T')[0],
      totalFee: Number(newStudent.totalFee) || 4500,
      paidFee: Number(newStudent.paidFee) || 0,
      discountFee: Number(newStudent.discountFee) || 0,
      activeStatus: 'Active',
      academicRemarks: newStudent.academicRemarks || 'Newly admitted student.'
    });

    setIsAddModalOpen(false);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast(`Student ${created.name} (Roll #${created.rollNo}) admitted successfully!`);
  };

  // Filter students based on active division and criteria
  const divisionStudents = students.filter((s) => s.division === activeDivision);

  // Available classes in this division
  const availableClasses = Array.from(new Set(divisionStudents.map((s) => s.classGrade)));

  const filteredStudents = divisionStudents.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentContact.includes(searchQuery) ||
      s.classGrade.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesClass = classFilter === 'All' || s.classGrade === classFilter;

    const due = s.totalFee - s.paidFee - (s.discountFee || 0);
    const matchesFee =
      feeStatusFilter === 'All' ||
      (feeStatusFilter === 'Paid' && due <= 0) ||
      (feeStatusFilter === 'Pending' && due > 0);

    const matchesCampus =
      campusStatusFilter === 'All' ||
      (campusStatusFilter === 'Active' && (s.activeStatus === 'Active' || !s.activeStatus)) ||
      (campusStatusFilter === 'Left Campus' && s.activeStatus === 'Left Campus');

    return matchesSearch && matchesClass && matchesFee && matchesCampus;
  });

  const handleDelete = (id: string, name: string) => {
    setConfirmDeleteStudent({ id, name });
  };

  const handleConfirmDeleteStudent = () => {
    if (!confirmDeleteStudent) return;
    deleteStudent(confirmDeleteStudent.id);
    if (selectedStudent?.id === confirmDeleteStudent.id) onSelectStudent(null);
    showToast(`Student ${confirmDeleteStudent.name} permanently removed.`);
    setConfirmDeleteStudent(null);
  };

  const handleInstantClearFee = (student: Student) => {
    const due = student.totalFee - student.paidFee - (student.discountFee || 0);
    if (due <= 0) return;
    setConfirmClearFeeStudent({ student, due });
  };

  const handleConfirmClearFee = () => {
    if (!confirmClearFeeStudent) return;
    const { student, due } = confirmClearFeeStudent;
    clearStudentFee(student.id, 'Full Outstanding Clearance');
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast(`Remaining fee balance of Rs. ${due.toLocaleString()} cleared for ${student.name}!`);
    setConfirmClearFeeStudent(null);
  };

  // WhatsApp Message Generator
  const sendWhatsAppMessage = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formatted = cleanPhone.startsWith('0') ? '92' + cleanPhone.substring(1) : cleanPhone;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Header & Division Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`p-1.5 rounded-lg ${
                activeDivision === 'School'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {activeDivision === 'School' ? (
                <GraduationCap className="w-5 h-5" />
              ) : (
                <Atom className="w-5 h-5" />
              )}
            </span>
            <span className="px-2 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-md bg-slate-100 text-slate-700">
              {activeDivision === 'School' ? 'School Wing (Playgroup to 10th)' : 'Science Academy (Matric & F.Sc)'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Student Enrollment, Campus Status & Fee Dues
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Total {divisionStudents.length} registered students • Manage active enrollment, left campus departures, and clear pending dues
          </p>
        </div>

        {/* Division Switch Buttons + Add Student */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setActiveDivision('School')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeDivision === 'School'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              School Wing
            </button>
            <button
              onClick={() => setActiveDivision('Academy')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                activeDivision === 'Academy'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Science Academy
            </button>
          </div>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Student
          </button>
        </div>
      </div>

      {/* Quick Division Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {divisionStudents.length} Students
          </div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">
            Premier School System
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Active on Campus</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {divisionStudents.filter((s) => s.activeStatus === 'Active' || !s.activeStatus).length} Active
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            Regularly attending classes
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Left Campus / Exited</span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {divisionStudents.filter((s) => s.activeStatus === 'Left Campus').length} Left
          </div>
          <span className="text-xs text-amber-700 font-semibold mt-1 block">
            Departure records archived
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Fee Accounts</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            {divisionStudents.filter((s) => s.totalFee - s.paidFee - (s.discountFee || 0) > 0).length} Pending
          </div>
          <span className="text-xs text-rose-700 font-semibold mt-1 block">
            {divisionStudents.filter((s) => s.totalFee - s.paidFee - (s.discountFee || 0) <= 0).length} Cleared in full
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Roll No, Student Name, Father Name, Phone..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-all font-medium"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-slate-500 font-medium">Class:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Classes ({availableClasses.length})</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Fee Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Fee:</span>
            <select
              value={feeStatusFilter}
              onChange={(e) => setFeeStatusFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Fee Status</option>
              <option value="Pending">Pending Dues Only</option>
              <option value="Paid">Cleared (Paid 100%)</option>
            </select>
          </div>

          {/* Campus Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-slate-500 font-medium">Campus:</span>
            <select
              value={campusStatusFilter}
              onChange={(e) => setCampusStatusFilter(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 focus:outline-none cursor-pointer"
            >
              <option value="All">All Campus Status</option>
              <option value="Active">Active Enrolled</option>
              <option value="Left Campus">Left Campus / Exited</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Directory Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Roll No</th>
                <th className="px-4 py-3.5">Student Name</th>
                <th className="px-4 py-3.5">Campus Status</th>
                <th className="px-4 py-3.5">Father / Guardian</th>
                <th className="px-4 py-3.5">Class / Track</th>
                <th className="px-4 py-3.5">Attendance %</th>
                <th className="px-4 py-3.5">Fee Status</th>
                <th className="px-4 py-3.5">Parent Contact</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => {
                  const att = getStudentAttendanceStats(student.id);
                  const pendingDue = student.totalFee - student.paidFee - (student.discountFee || 0);
                  const isLeftCampus = student.activeStatus === 'Left Campus';

                  return (
                    <tr
                      key={student.id}
                      className={`hover:bg-blue-50/30 transition-colors group cursor-pointer ${
                        isLeftCampus ? 'bg-slate-50/70 opacity-85' : ''
                      }`}
                      onClick={() => onSelectStudent(student)}
                    >
                      {/* Roll No */}
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        <span
                          className={`px-2.5 py-1 rounded-lg ${
                            activeDivision === 'School'
                              ? 'bg-blue-100 text-blue-900 border border-blue-200'
                              : 'bg-amber-100 text-amber-900 border border-amber-200'
                          }`}
                        >
                          #{student.rollNo}
                        </span>
                      </td>

                      {/* Name & Gender */}
                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {student.name}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {student.gender} • Adm: {student.admissionDate}
                        </span>
                      </td>

                      {/* Campus Status Toggle Button */}
                      <td
                        className="px-4 py-3.5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => {
                            const newStatus = isLeftCampus ? 'Active' : 'Left Campus';
                            toggleStudentStatus(student.id, newStatus);
                            showToast(`Updated status for ${student.name} to "${newStatus}".`);
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-black inline-flex items-center gap-1.5 transition-all cursor-pointer border ${
                            isLeftCampus
                              ? 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300 hover:bg-emerald-200'
                          }`}
                          title="Click to toggle Active vs Left Campus"
                        >
                          {isLeftCampus ? (
                            <>
                              <UserX className="w-3 h-3 text-amber-700" />
                              Left Campus
                            </>
                          ) : (
                            <>
                              <UserCheck className="w-3 h-3 text-emerald-700" />
                              Active
                            </>
                          )}
                        </button>
                      </td>

                      {/* Father Name */}
                      <td className="px-4 py-3.5 font-medium text-slate-700">
                        {student.fatherName}
                      </td>

                      {/* Class */}
                      <td className="px-4 py-3.5 font-medium text-slate-800">
                        <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs border border-slate-200">
                          {student.classGrade}
                        </span>
                      </td>

                      {/* Attendance % */}
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-md text-xs ${
                              att.percentage >= 85
                                ? 'bg-emerald-100 text-emerald-800'
                                : att.percentage >= 70
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {att.percentage}%
                          </span>
                          <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                            ({att.present}P / {att.absent}A)
                          </span>
                        </div>
                      </td>

                      {/* Fee Status */}
                      <td className="px-4 py-3.5">
                        {pendingDue > 0 ? (
                          <div className="leading-tight">
                            <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-xs inline-block">
                              Due: Rs. {pendingDue.toLocaleString()}
                            </span>
                            <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                              Paid: Rs. {student.paidFee.toLocaleString()}
                            </div>
                          </div>
                        ) : (
                          <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-300 text-xs inline-flex items-center gap-1">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Cleared
                          </span>
                        )}
                      </td>

                      {/* Contacts */}
                      <td className="px-4 py-3.5 font-mono text-xs">
                        <div className="flex items-center gap-1 text-slate-800 font-semibold">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {student.parentContact}
                        </div>
                        <span className="text-[11px] text-rose-600 font-medium">
                          Emerg: {student.emergencyContact}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td
                        className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* 1-Click Clear Fee button if pending */}
                        {pendingDue > 0 && (
                          <button
                            onClick={() => handleInstantClearFee(student)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                            title="Instantly clear all pending fee dues and issue receipt"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Clear Fee
                          </button>
                        )}

                        {pendingDue > 0 && (
                          <button
                            onClick={() => onOpenCollectFeeForStudent(student)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                            title="Collect Custom Fee Amount"
                          >
                            <Receipt className="w-3.5 h-3.5 inline mr-1" />
                            Pay
                          </button>
                        )}

                        <button
                          onClick={() =>
                            setActivePrintDoc({
                              type: 'id_card',
                              student
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Print Student ID Card"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 transition-colors cursor-pointer"
                          title="Edit Student Info"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDelete(student.id, student.name)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete / Remove Student Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No student records found matching your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Full Profile Modal / Drawer */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header with Division Crest */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-amber-400 text-lg font-mono">
                  #{selectedStudent.rollNo}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-white leading-tight">
                      {selectedStudent.name}
                    </h3>
                    <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded bg-amber-500 text-slate-950">
                      {selectedStudent.division}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                        selectedStudent.activeStatus === 'Left Campus'
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {selectedStudent.activeStatus || 'Active'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {selectedStudent.classGrade} • S/O {selectedStudent.fatherName}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onSelectStudent(null)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Body */}
            <div className="overflow-y-auto p-6 space-y-6 flex-1 text-xs sm:text-sm">
              
              {/* Bio Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[11px] block">Date of Birth</span>
                  <strong className="text-slate-800">{selectedStudent.dob || '—'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Gender</span>
                  <strong className="text-slate-800">{selectedStudent.gender}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Blood Group</span>
                  <strong className="text-rose-600 font-extrabold">{selectedStudent.bloodGroup || 'O+'}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Admission Date</span>
                  <strong className="text-slate-800">{selectedStudent.admissionDate}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Parent Phone</span>
                  <strong className="text-slate-800">{selectedStudent.parentContact}</strong>
                </div>
                <div>
                  <span className="text-slate-400 text-[11px] block">Emergency Phone</span>
                  <strong className="text-rose-700">{selectedStudent.emergencyContact}</strong>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400 text-[11px] block">Campus Enrollment Status</span>
                  <span className="font-bold text-slate-800">
                    {selectedStudent.activeStatus === 'Left Campus' ? 'Left Campus / Exited' : 'Currently Active & Enrolled'}
                  </span>
                </div>
                <div className="col-span-2 sm:col-span-3">
                  <span className="text-slate-400 text-[11px] block">Home Address</span>
                  <strong className="text-slate-800">{selectedStudent.address || 'Campus locality'}</strong>
                </div>
              </div>

              {/* Attendance & Financial Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Attendance Summary */}
                {(() => {
                  const att = getStudentAttendanceStats(selectedStudent.id);
                  return (
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Attendance Record
                        </span>
                        <span
                          className={`font-black text-sm px-2 py-0.5 rounded ${
                            att.percentage >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {att.percentage}%
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-600 mt-3 pt-3 border-t border-slate-100">
                        <span>Present: <strong className="text-emerald-600">{att.present}</strong></span>
                        <span>Absent: <strong className="text-rose-600">{att.absent}</strong></span>
                        <span>Late: <strong className="text-amber-600">{att.late}</strong></span>
                        <span>Total: <strong>{att.total}</strong></span>
                      </div>
                    </div>
                  );
                })()}

                {/* Fee Status */}
                {(() => {
                  const pending = selectedStudent.totalFee - selectedStudent.paidFee - (selectedStudent.discountFee || 0);
                  return (
                    <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                          Fee Account
                        </span>
                        <span
                          className={`font-black text-xs px-2.5 py-0.5 rounded-full ${
                            pending <= 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {pending <= 0 ? 'Cleared' : `Due: Rs. ${pending.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="space-y-1 text-xs text-slate-600 mt-2">
                        <div className="flex justify-between">
                          <span>Total Session Fee:</span>
                          <strong>Rs. {selectedStudent.totalFee.toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Amount Paid:</span>
                          <strong className="text-emerald-700">Rs. {selectedStudent.paidFee.toLocaleString()}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              </div>

              {/* Academic Remarks */}
              {selectedStudent.academicRemarks && (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-800 block mb-1">
                    Teacher / Principal Academic Remarks
                  </span>
                  <p className="text-slate-700 italic">
                    "{selectedStudent.academicRemarks}"
                  </p>
                </div>
              )}

              {/* WhatsApp Direct Notification Buttons */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5 mb-2">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  Instant WhatsApp Message to Parent ({selectedStudent.parentContact})
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      sendWhatsAppMessage(
                        selectedStudent.parentContact,
                        `Respected Parent of ${selectedStudent.name} (Roll #${selectedStudent.rollNo}), your child's attendance rate at Premier School System & Science Academy is currently ${
                          getStudentAttendanceStats(selectedStudent.id).percentage
                        }%. Thank you.`
                      )
                    }
                    className="px-3 py-1.5 bg-white hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-300 transition-colors cursor-pointer"
                  >
                    Send Attendance Update
                  </button>

                  {selectedStudent.totalFee - selectedStudent.paidFee > 0 && (
                    <button
                      onClick={() =>
                        sendWhatsAppMessage(
                          selectedStudent.parentContact,
                          `Respected Parent of ${selectedStudent.name}, a fee balance of Rs. ${(
                            selectedStudent.totalFee - selectedStudent.paidFee
                          ).toLocaleString()} is pending for Premier School System. Kindly submit it at the campus accounts counter.`
                        )
                      }
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Send Fee Due Reminder
                    </button>
                  )}
                </div>
              </div>

            </div>

            {/* Profile Modal Footer with Printable actions */}
            <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => {
                    setActivePrintDoc({
                      type: 'id_card',
                      student: selectedStudent
                    });
                  }}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Print Student Identity Card"
                >
                  <IdCard className="w-3.5 h-3.5" />
                  ID Card
                </button>

                <button
                  onClick={() => {
                    const results = testResults.filter((r) => r.studentId === selectedStudent.id);
                    const att = getStudentAttendanceStats(selectedStudent.id);
                    setActivePrintDoc({
                      type: 'report_card',
                      student: selectedStudent,
                      results,
                      attendanceRate: att.percentage
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Print Academic DMC Report Card"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-amber-400" />
                  Report Card / DMC
                </button>

                <button
                  onClick={() => {
                    setActivePrintDoc({
                      type: 'character_certificate',
                      student: selectedStudent
                    });
                  }}
                  className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Generate Official Character & Conduct Certificate"
                >
                  <Award className="w-3.5 h-3.5 text-amber-300" />
                  Character Certificate
                </button>

                <button
                  onClick={() => {
                    const relevantTests = testSchedules.filter(
                      (t) => t.classGrade === selectedStudent.classGrade || t.division === selectedStudent.division
                    );
                    setActivePrintDoc({
                      type: 'admit_card',
                      student: selectedStudent,
                      testSchedules: relevantTests
                    });
                  }}
                  className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Print Roll No Examination Admit Slip"
                >
                  <FileText className="w-3.5 h-3.5 text-indigo-300" />
                  Admit Card
                </button>

                <button
                  onClick={() => {
                    setActivePrintDoc({
                      type: 'leaving_certificate',
                      student: selectedStudent
                    });
                  }}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                  title="Generate School Leaving Certificate (SLC)"
                >
                  <GraduationCap className="w-3.5 h-3.5 text-slate-300" />
                  Leaving Cert (SLC)
                </button>

                {selectedStudent.totalFee - selectedStudent.paidFee > 0 && (
                  <button
                    onClick={() => {
                      setActivePrintDoc({
                        type: 'fee_reminder_notice',
                        student: selectedStudent,
                        dueAmount: selectedStudent.totalFee - selectedStudent.paidFee
                      });
                    }}
                    className="px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm"
                    title="Print Official Fee Dues Warning / Reminder Slip"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-200" />
                    Fee Notice
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedStudent.totalFee - selectedStudent.paidFee > 0 && (
                  <button
                    onClick={() => {
                      onOpenCollectFeeForStudent(selectedStudent);
                    }}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    Submit Fee
                  </button>
                )}
                <button
                  onClick={() => onSelectStudent(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-black text-base">Edit Student Record (#{editingStudent.rollNo})</h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateStudent(editingStudent.id, editingStudent);
                setEditingStudent(null);
              }}
              className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editingStudent.name}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, name: e.target.value })
                    }
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Campus Status</label>
                  <select
                    value={editingStudent.activeStatus || 'Active'}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, activeStatus: e.target.value as any })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Active">Active Enrolled</option>
                    <option value="Left Campus">Left Campus / Exited</option>
                    <option value="Struck Off">Struck Off</option>
                    <option value="Passed Out">Passed Out / Graduated</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Father / Guardian Name</label>
                  <input
                    type="text"
                    value={editingStudent.fatherName}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, fatherName: e.target.value })
                    }
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Class / Grade / Track</label>
                  <input
                    type="text"
                    value={editingStudent.classGrade}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, classGrade: e.target.value })
                    }
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Parent Mobile Contact</label>
                  <input
                    type="text"
                    value={editingStudent.parentContact}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, parentContact: e.target.value })
                    }
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Emergency Mobile Number</label>
                  <input
                    type="text"
                    value={editingStudent.emergencyContact}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, emergencyContact: e.target.value })
                    }
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Total Session Fee (PKR)</label>
                  <input
                    type="number"
                    value={editingStudent.totalFee}
                    onChange={(e) =>
                      setEditingStudent({ ...editingStudent, totalFee: Number(e.target.value) })
                    }
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Academic Remarks</label>
                <textarea
                  value={editingStudent.academicRemarks || ''}
                  onChange={(e) =>
                    setEditingStudent({ ...editingStudent, academicRemarks: e.target.value })
                  }
                  rows={2}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-base">New Student Admission Enrollment</h3>
                <p className="text-xs text-slate-300">
                  Register student record for {activeDivision === 'School' ? 'School Wing' : 'Science Academy'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleCreateStudent}
              className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    value={newStudent.name || ''}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, name: e.target.value })
                    }
                    placeholder="e.g. Muhammad Hamza"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Roll / Student ID No *</label>
                  <input
                    type="text"
                    value={newStudent.rollNo || ''}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, rollNo: e.target.value })
                    }
                    placeholder="e.g. 109"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Father / Guardian Name *</label>
                  <input
                    type="text"
                    value={newStudent.fatherName || ''}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, fatherName: e.target.value })
                    }
                    placeholder="e.g. Asghar Ali"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Division</label>
                  <select
                    value={newStudent.division || activeDivision}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, division: e.target.value as any })
                    }
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold"
                  >
                    <option value="School">School Wing</option>
                    <option value="Academy">Science Academy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Class / Grade / Track *</label>
                  <input
                    type="text"
                    value={newStudent.classGrade || ''}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, classGrade: e.target.value })
                    }
                    placeholder="e.g. Class 10th (Bio Science)"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Parent Mobile Contact *</label>
                  <input
                    type="text"
                    value={newStudent.parentContact || ''}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, parentContact: e.target.value })
                    }
                    placeholder="0300-1234567"
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Emergency Phone Number</label>
                  <input
                    type="text"
                    value={newStudent.emergencyContact || ''}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, emergencyContact: e.target.value })
                    }
                    placeholder="0312-7654321"
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Total Session Fee (PKR) *</label>
                  <input
                    type="number"
                    value={newStudent.totalFee || 0}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, totalFee: Number(e.target.value) })
                    }
                    required
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Home Address</label>
                <input
                  type="text"
                  value={newStudent.address || ''}
                  onChange={(e) =>
                    setNewStudent({ ...newStudent, address: e.target.value })
                  }
                  placeholder="Street / Locality, Campus Area"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl shadow-md cursor-pointer"
                >
                  Confirm Admission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Student Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteStudent}
        onClose={() => setConfirmDeleteStudent(null)}
        onConfirm={handleConfirmDeleteStudent}
        title="Delete Student Record"
        message={`Are you sure you want to permanently remove the student record for "${confirmDeleteStudent?.name}"? All associated attendance and academic archives will be deleted.`}
        confirmText="Yes, Delete Record"
        cancelText="Keep Record"
        variant="danger"
        icon="trash"
      />

      {/* Clear Fee Confirmation Modal */}
      <ConfirmModal
        isOpen={!!confirmClearFeeStudent}
        onClose={() => setConfirmClearFeeStudent(null)}
        onConfirm={handleConfirmClearFee}
        title="Clear Outstanding Fee Dues"
        message={`Are you sure you want to clear the remaining fee balance of Rs. ${confirmClearFeeStudent?.due.toLocaleString()} for "${confirmClearFeeStudent?.student.name}" (Roll #${confirmClearFeeStudent?.student.rollNo})? This will record an official fee clearance transaction and update the student balance.`}
        confirmText="Clear Outstanding Dues"
        cancelText="Cancel"
        variant="success"
        icon="check"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
