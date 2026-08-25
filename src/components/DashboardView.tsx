import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  Atom,
  CalendarCheck,
  Receipt,
  Wallet,
  TrendingUp,
  AlertTriangle,
  Clock,
  Printer,
  ChevronRight,
  PlusCircle,
  FileSpreadsheet,
  Megaphone,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Calendar,
  Sparkles,
  Award,
  FileText,
  IdCard,
  Building2,
  BookOpen
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Student, Teacher } from '../types';

interface DashboardViewProps {
  onNavigate: (tab: any) => void;
  onOpenAddStudent: () => void;
  onOpenCollectFee: () => void;
  onOpenAddExpense: () => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenAddStudent,
  onOpenCollectFee,
  onOpenAddExpense,
  onSelectStudent
}) => {
  const {
    students,
    teachers,
    fees,
    expenses,
    attendance,
    teacherAttendance,
    testSchedules,
    events,
    timeSlots,
    timetableEntries,
    stats,
    todayDateStr,
    setActivePrintDoc
  } = useSchool();

  const [selectedQuickStudentId, setSelectedQuickStudentId] = useState<string>(students[0]?.id || '');
  const [selectedQuickTeacherId, setSelectedQuickTeacherId] = useState<string>(teachers[0]?.id || '');

  const recentFees = fees.slice(0, 5);
  const recentExpenses = expenses.slice(0, 4);
  const upcomingTests = testSchedules.slice(0, 3);
  const activeEvents = events.slice(0, 2);

  const selectedQuickStudent = students.find((s) => s.id === selectedQuickStudentId) || students[0];
  const selectedQuickTeacher = teachers.find((t) => t.id === selectedQuickTeacherId) || teachers[0];

  // Calculate top pending defaulters
  const defaulterStudents = students
    .map((s) => {
      const due = s.totalFee - s.paidFee - (s.discountFee || 0);
      return { student: s, due };
    })
    .filter((item) => item.due > 0)
    .sort((a, b) => b.due - a.due)
    .slice(0, 4);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 -mb-8 w-48 h-48 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-xs font-extrabold uppercase tracking-wider rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Official Campus Portal
              </span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                System Operational & Safe
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Premier School System & Science Academy
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
              Complete digitalized administration: Real-time attendance, daily fee collection ledger, teacher reporting times, test records, expense control, and parent communications.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddStudent}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-blue-900/40 flex items-center gap-2 transition-all active:scale-95 border border-blue-400/30 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-amber-300" />
              + Add New Student
            </button>
            <button
              onClick={onOpenCollectFee}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Receipt className="w-4 h-4" />
              Collect Fee
            </button>
            <button
              onClick={() => onNavigate('timetable')}
              className="px-4 py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-950/30 flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-amber-300" />
              Timetables
            </button>
            <button
              onClick={onOpenAddExpense}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4 text-amber-400" />
              + Daily Expense
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Card 1: Total Students */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Student Enrollment
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {stats.totalStudents} <span className="text-sm font-bold text-slate-400">Enrolled</span>
              </h3>
              <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500 flex-wrap">
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                  {stats.activeStudents ?? stats.totalStudents} Active
                </span>
                {(stats.leftCampusStudents ?? 0) > 0 && (
                  <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200">
                    {stats.leftCampusStudents} Left Campus
                  </span>
                )}
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>School: <strong>{stats.schoolStudents}</strong></span>
                <span>Academy: <strong>{stats.academyStudents}</strong></span>
              </div>
            </div>
          </div>
          <button
            onClick={onOpenAddStudent}
            className="mt-3 w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-blue-200/60 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            + Add New Student
          </button>
        </div>

        {/* Card 2: Today Attendance Rate */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Today's Attendance
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <CalendarCheck className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-black text-emerald-600 tracking-tight">
                  {stats.todayAttendanceRate}%
                </h3>
                <span className="text-xs font-semibold text-slate-500">
                  ({stats.todayPresentCount} of {stats.totalStudents})
                </span>
              </div>
              <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                <span className="text-emerald-700 flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {stats.todayPresentCount} Present
                </span>
                <span>•</span>
                <span className="text-rose-700 flex items-center gap-1 font-bold">
                  <XCircle className="w-3.5 h-3.5 text-rose-500" />
                  {stats.todayAbsentCount} Absent
                </span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
                Faculty on-time: <strong className="text-indigo-700 font-bold">{stats.teachersOnTimeToday} / {stats.totalTeachers}</strong>
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('attendance')}
            className="mt-3 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/60 cursor-pointer"
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            Mark Class Attendance
          </button>
        </div>

        {/* Card 3: Today's Fee Submissions */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Fee Collections
              </span>
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Receipt className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                Rs. {stats.todayFeesCollected.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
                <span>Today collected</span>
                <span className="text-emerald-700 font-bold">{stats.totalClearedStudents ?? 0} Accounts Cleared</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Pending Dues:</span>
                <span className="font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  Rs. {stats.totalPendingDues.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onOpenCollectFee}
            className="mt-3 w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-emerald-200/60 cursor-pointer"
          >
            <Receipt className="w-3.5 h-3.5" />
            + Collect Student Fee
          </button>
        </div>

        {/* Card 4: Daily Expenses & Net Cash */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Daily Expenses & Cash
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                Rs. {stats.netCashBalance.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-slate-500 flex items-center justify-between">
                <span>Today Outflow: <strong className="text-rose-600">Rs. {stats.todayExpenses.toLocaleString()}</strong></span>
                <span className="text-emerald-700 font-bold">{stats.clearedSalaryTeachers ?? 0} Salaries Paid</span>
              </div>
              <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Salary Due:</span>
                <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Rs. {stats.totalTeacherSalaryPending.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={onOpenAddExpense}
              className="flex-1 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 font-bold text-xs rounded-xl flex items-center justify-center gap-1 transition-colors border border-purple-200/60 cursor-pointer"
            >
              <Wallet className="w-3.5 h-3.5" />
              + Add Expense
            </button>
            <button
              onClick={() => onNavigate('expenses')}
              className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              title="View All Expenses"
            >
              All
            </button>
          </div>
        </div>

      </div>

      {/* 1-Click Executive Document & Certificate Center */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-6 text-white border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
                <Printer className="w-4 h-4" />
              </span>
              <h3 className="font-black text-base sm:text-lg text-white">
                Official Stationery & Document Issuance Center
              </h3>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              1-Click instant generation with official watermark seals, barcodes & principal signature blocks
            </p>
          </div>

          {/* Quick Target Student Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold hidden sm:inline">Select Candidate:</span>
            <select
              value={selectedQuickStudentId}
              onChange={(e) => setSelectedQuickStudentId(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-400"
            >
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  #{s.rollNo} - {s.name} ({s.classGrade})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Document Action Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Student ID Card */}
          <button
            onClick={() => {
              if (selectedQuickStudent) {
                setActivePrintDoc({
                  type: 'id_card',
                  student: selectedQuickStudent
                });
              }
            }}
            className="p-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <IdCard className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Student ID Card</span>
              <span className="text-[10px] text-slate-400">Institutional badge</span>
            </div>
          </button>

          {/* 2. Character Certificate */}
          <button
            onClick={() => {
              if (selectedQuickStudent) {
                setActivePrintDoc({
                  type: 'character_certificate',
                  student: selectedQuickStudent
                });
              }
            }}
            className="p-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Character Cert</span>
              <span className="text-[10px] text-slate-400">Conduct credential</span>
            </div>
          </button>

          {/* 3. School Leaving SLC */}
          <button
            onClick={() => {
              if (selectedQuickStudent) {
                setActivePrintDoc({
                  type: 'leaving_certificate',
                  student: selectedQuickStudent
                });
              }
            }}
            className="p-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-emerald-500 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Leaving SLC</span>
              <span className="text-[10px] text-slate-400">Migration certificate</span>
            </div>
          </button>

          {/* 4. Admit Card Roll No Slip */}
          <button
            onClick={() => {
              if (selectedQuickStudent) {
                const relevant = testSchedules.filter(
                  (t) => t.classGrade === selectedQuickStudent.classGrade || t.division === selectedQuickStudent.division
                );
                setActivePrintDoc({
                  type: 'admit_card',
                  student: selectedQuickStudent,
                  testSchedules: relevant
                });
              }
            }}
            className="p-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-indigo-500 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Exam Admit Slip</span>
              <span className="text-[10px] text-slate-400">Roll number voucher</span>
            </div>
          </button>

          {/* 5. Class Master Timetable */}
          <button
            onClick={() => {
              const classes = Array.from(new Set(students.map((s) => s.classGrade)));
              setActivePrintDoc({
                type: 'master_timetable',
                division: 'School',
                entries: timetableEntries,
                timeSlots,
                classGrades: classes.length > 0 ? classes : ['Grade 9 - Science', 'Grade 10 - Science']
              });
            }}
            className="p-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Master Schedule</span>
              <span className="text-[10px] text-slate-400">School timetable</span>
            </div>
          </button>

          {/* 6. Faculty ID Card */}
          <button
            onClick={() => {
              if (selectedQuickTeacher) {
                setActivePrintDoc({
                  type: 'teacher_id_card',
                  teacher: selectedQuickTeacher
                });
              }
            }}
            className="p-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 hover:border-purple-500 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold mb-2 group-hover:scale-110 transition-transform">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-white block">Faculty ID Card</span>
              <span className="text-[10px] text-slate-400">Staff identification</span>
            </div>
          </button>
        </div>
      </div>

      {/* Main Content Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Recent Fee Submissions & Defaulters */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Recent Daily Fee Submissions */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Recent Fee Submissions Ledger
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Latest recorded student payments with instant printable vouchers
                </p>
              </div>
              <button
                onClick={() => onNavigate('fees')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                View All Fees
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-4 py-3">Receipt No</th>
                    <th className="px-4 py-3">Student / Roll</th>
                    <th className="px-4 py-3">Class</th>
                    <th className="px-4 py-3">Paid Amount</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {recentFees.map((fee) => {
                    const st = students.find((s) => s.id === fee.studentId);
                    return (
                      <tr key={fee.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          {fee.receiptNo}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-bold text-slate-900">{fee.studentName}</div>
                          <span className="text-xs text-slate-500 font-mono">Roll #{fee.rollNo}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600">
                          {fee.classGrade}
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-600">
                          Rs. {fee.amountPaid.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 text-[11px] font-bold rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                            {fee.paymentMethod}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() =>
                              setActivePrintDoc({
                                type: 'fee_receipt',
                                data: fee,
                                student: st
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Print Fee Receipt Voucher"
                          >
                            <Printer className="w-3.5 h-3.5" />
                            Receipt
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Outstanding Fee Defaulters */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Top Pending Fee Accounts
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Follow up with parents via WhatsApp or phone call
                </p>
              </div>
              <button
                onClick={() => onNavigate('fees')}
                className="text-xs font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                Defaulters List
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {defaulterStudents.map(({ student, due }) => (
                <div
                  key={student.id}
                  className="p-3 rounded-xl border border-rose-100 bg-rose-50/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 bg-white rounded border border-rose-200 text-rose-800">
                        #{student.rollNo}
                      </span>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                        {student.name}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {student.classGrade} • Parent: {student.parentContact}
                    </p>
                  </div>

                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-extrabold text-rose-700">
                      Rs. {due.toLocaleString()}
                    </span>
                    <button
                      onClick={() => onSelectStudent(student)}
                      className="mt-1 text-[11px] text-blue-600 hover:underline font-bold cursor-pointer"
                    >
                      View & Alert
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Campus Expenses & Outflow Tracker with Quick Add Student */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-purple-600" />
                  Daily Campus Expenses & Outflow Register
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Today's campus operational bills, generator fuel, lab items & teacher salaries
                </p>
              </div>

              {/* Fast Action Buttons in Daily Expenses Block */}
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenAddStudent}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  + Add Student
                </button>
                <button
                  onClick={onOpenAddExpense}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer active:scale-95"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  + Add Expense
                </button>
                <button
                  onClick={() => onNavigate('expenses')}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                  title="View Full Ledger"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expenses List Preview */}
            <div className="space-y-2">
              {recentExpenses.length > 0 ? (
                recentExpenses.map((exp) => (
                  <div
                    key={exp.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 flex items-center justify-between text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{exp.title}</div>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {exp.category} • Paid by {exp.paidBy || 'Campus Admin'} • {exp.expenseDate}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-black text-rose-600 text-xs sm:text-sm">
                        - Rs. {exp.amount.toLocaleString()}
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium">
                        {exp.paymentMethod}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No expenses recorded today. Click "+ Add Expense" to log campus outflow.
                </div>
              )}
            </div>

            {/* Quick Summary Footer */}
            <div className="pt-2 flex items-center justify-between text-xs font-semibold text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <span>Today's Total Recorded Expenses:</span>
              <span className="font-mono font-black text-rose-600 text-sm">
                Rs. {stats.todayExpenses.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

        {/* Right 1 Column: Faculty Reporting Time & Events / Tests */}
        <div className="space-y-6">
          
          {/* Teacher Reporting Time & Daily Status */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Faculty Reporting Times
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                {stats.teachersOnTimeToday} On-Time
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Scheduled check-in at 07:45 AM
            </p>

            <div className="space-y-2.5">
              {teachers.slice(0, 4).map((tch) => {
                const todayRec = teacherAttendance.find(
                  (ta) => ta.teacherId === tch.id && ta.date === todayDateStr
                );
                const isOnTime = !todayRec || todayRec.status === 'On Time';

                return (
                  <div
                    key={tch.id}
                    className="p-2.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>{tch.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({tch.facultyCode})</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{tch.subject}</span>
                    </div>

                    <div className="text-right">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                          isOnTime
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {todayRec ? todayRec.actualReportingTime : tch.reportingTime || '07:45 AM'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => onNavigate('teachers')}
              className="w-full mt-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-colors text-center block"
            >
              Manage Faculty & Payroll
            </button>
          </div>

          {/* Upcoming Tests & PTM Announcements */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                Academic Tests & Events
              </h3>
              <button
                onClick={() => onNavigate('tests')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Schedule
              </button>
            </div>

            <div className="space-y-3">
              {upcomingTests.map((t) => (
                <div
                  key={t.id}
                  className="p-3 rounded-xl bg-blue-50/50 border border-blue-100 text-xs"
                >
                  <div className="flex items-center justify-between text-blue-900 font-bold">
                    <span>{t.subject}</span>
                    <span className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-blue-200">
                      {t.testDate}
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1">
                    {t.testTitle} • <strong>{t.classGrade}</strong> ({t.totalMarks} Marks)
                  </p>
                </div>
              ))}

              {activeEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs"
                >
                  <div className="flex items-center gap-1 text-amber-800 font-extrabold mb-1">
                    <Megaphone className="w-3.5 h-3.5" />
                    <span>{ev.title}</span>
                  </div>
                  <p className="text-slate-600 line-clamp-2">
                    {ev.description}
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-amber-900 font-semibold">
                    <span>Date: {ev.eventDate}</span>
                    <button
                      onClick={() => onNavigate('parents')}
                      className="text-blue-600 hover:underline font-bold"
                    >
                      Broadcast
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 100% Digital Protection Security Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950 to-slate-900 text-white border border-indigo-900/60">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm text-white">
                  Offline & Cloud Safe Data
                </h4>
                <p className="text-[11px] text-slate-300">
                  Zero risk of physical file damage. 1-Click JSON backup export available.
                </p>
              </div>
            </div>
            <button
              onClick={() => onNavigate('backup')}
              className="mt-3 w-full py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Open Data Safe Center
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
