import React, { useState } from 'react';
import {
  CalendarCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Users,
  CheckCheck,
  Calendar,
  Sparkles,
  AlertCircle,
  GraduationCap,
  Atom,
  Phone,
  Printer
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { AttendanceStatus, TeacherAttendanceStatus, Division } from '../types';

export const AttendanceView: React.FC = () => {
  const {
    students,
    teachers,
    attendance,
    teacherAttendance,
    markStudentAttendance,
    markBatchAttendance,
    recordTeacherAttendance,
    getStudentAttendanceStats,
    setActivePrintDoc,
    todayDateStr
  } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'students' | 'teachers'>('students');
  const [selectedDate, setSelectedDate] = useState<string>(todayDateStr);
  const [divisionFilter, setDivisionFilter] = useState<'All' | Division>('All');
  const [classFilter, setClassFilter] = useState<string>('All');
  const [studentStatusFilter, setStudentStatusFilter] = useState<'Active' | 'All' | 'Inactive'>('Active');
  const [teacherStatusFilter, setTeacherStatusFilter] = useState<'Active' | 'All' | 'Left/Leave'>('Active');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter students
  const filteredStudents = students.filter((s) => {
    const matchesDiv = divisionFilter === 'All' || s.division === divisionFilter;
    const matchesClass = classFilter === 'All' || s.classGrade === classFilter;
    const isActive = s.status === 'Active' || !s.status;
    const matchesStatus =
      studentStatusFilter === 'All'
        ? true
        : studentStatusFilter === 'Active'
        ? isActive
        : !isActive;
    return matchesDiv && matchesClass && matchesStatus;
  });

  const availableClasses = Array.from(
    new Set(
      students
        .filter((s) => divisionFilter === 'All' || s.division === divisionFilter)
        .map((s) => s.classGrade)
    )
  );

  // Filter teachers
  const filteredTeachers = teachers.filter((t) => {
    const isActive = t.status === 'Active' || !t.status;
    if (teacherStatusFilter === 'Active') return isActive;
    if (teacherStatusFilter === 'Left/Leave') return !isActive;
    return true;
  });

  // Student stats for selected date
  const dateRecords = attendance.filter((a) => a.date === selectedDate);
  const presentCount = filteredStudents.filter((s) => {
    const rec = dateRecords.find((a) => a.studentId === s.id);
    return rec ? rec.status === 'Present' || rec.status === 'Late' : false;
  }).length;

  const absentCount = filteredStudents.filter((s) => {
    const rec = dateRecords.find((a) => a.studentId === s.id);
    return rec ? rec.status === 'Absent' : false;
  }).length;

  const currentRate =
    filteredStudents.length > 0
      ? Math.round((presentCount / filteredStudents.length) * 100)
      : 0;

  // Mark all present
  const handleMarkAll = (status: AttendanceStatus) => {
    const batch = filteredStudents.map((s) => ({
      studentId: s.id,
      status
    }));
    markBatchAttendance(selectedDate, batch);
    showToast(`Marked ${filteredStudents.length} students as ${status} for ${selectedDate}`);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header with Sub-tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <CalendarCheck className="w-6 h-6 text-blue-600" />
            Attendance Management Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time daily registers, attendance percentages, and faculty reporting times
          </p>
        </div>

        {/* Tab switch */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('students')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'students'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            Students Register
          </button>
          <button
            onClick={() => setActiveSubTab('teachers')}
            className={`px-4 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'teachers'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Faculty Reporting Times
          </button>
        </div>
      </div>

      {activeSubTab === 'students' ? (
        <>
          {/* Controls Ribbon: Date Selector & Batch Markers */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Date Picker & Filters */}
            <div className="flex items-center gap-2.5 flex-wrap text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-slate-500 font-medium">Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none"
                />
              </div>

              {/* Division Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Wing:</span>
                <select
                  value={divisionFilter}
                  onChange={(e) => {
                    setDivisionFilter(e.target.value as any);
                    setClassFilter('All');
                  }}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none"
                >
                  <option value="All">All Wings</option>
                  <option value="School">School Division</option>
                  <option value="Academy">Science Academy</option>
                </select>
              </div>

              {/* Class Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-slate-500 font-medium">Class:</span>
                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none"
                >
                  <option value="All">All Classes ({availableClasses.length})</option>
                  {availableClasses.map((cls) => (
                    <option key={cls} value={cls}>
                      {cls}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Status:</span>
                <select
                  value={studentStatusFilter}
                  onChange={(e) => setStudentStatusFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none"
                >
                  <option value="Active">Active Enrolled</option>
                  <option value="All">All Statuses</option>
                  <option value="Inactive">Left / Struck Off</option>
                </select>
              </div>
            </div>

            {/* Batch Action Buttons & Register Print */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => handleMarkAll('Present')}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                Mark All Present
              </button>
              <button
                onClick={() => handleMarkAll('Absent')}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                Mark All Absent
              </button>
              <button
                onClick={() => {
                  const targetClass = classFilter === 'All' ? (availableClasses[0] || 'Grade 9 - Science') : classFilter;
                  const targetDiv = divisionFilter === 'All' ? 'School' : divisionFilter;
                  const targetStudents = students.filter((s) => s.classGrade === targetClass && s.division === targetDiv);
                  setActivePrintDoc({
                    type: 'attendance_register_sheet',
                    division: targetDiv,
                    classGrade: targetClass,
                    month: 'August 2026',
                    students: targetStudents.length > 0 ? targetStudents : students.slice(0, 10),
                    attendance
                  });
                }}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Generate Official Monthly Attendance Register Ledger Sheet"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                Print Register
              </button>
            </div>

          </div>

          {/* Daily Metric Stat Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-slate-400">Total In View</span>
                <div className="text-xl font-black text-slate-900">{filteredStudents.length}</div>
              </div>
              <Users className="w-5 h-5 text-slate-400" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-emerald-700">Present</span>
                <div className="text-xl font-black text-emerald-700">{presentCount}</div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-rose-200 bg-rose-50/30 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-rose-700">Absent</span>
                <div className="text-xl font-black text-rose-700">{absentCount}</div>
              </div>
              <XCircle className="w-5 h-5 text-rose-500" />
            </div>

            <div className="bg-white p-4 rounded-xl border border-blue-200 bg-blue-50/30 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase text-blue-700">Attendance Rate</span>
                <div className="text-xl font-black text-blue-700">{currentRate}%</div>
              </div>
              <CalendarCheck className="w-5 h-5 text-blue-500" />
            </div>
          </div>

          {/* Student Attendance Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Roll No</th>
                    <th className="px-4 py-3.5">Student Name</th>
                    <th className="px-4 py-3.5">Division / Class</th>
                    <th className="px-4 py-3.5">Overall Session %</th>
                    <th className="px-4 py-3.5">Daily Attendance Status</th>
                    <th className="px-4 py-3.5">Reporting Time In</th>
                    <th className="px-4 py-3.5">Parent Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.map((student) => {
                    const rec = dateRecords.find((a) => a.studentId === student.id);
                    const currentStatus = rec ? rec.status : 'Present';
                    const att = getStudentAttendanceStats(student.id);

                    return (
                      <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-slate-900">
                          <span
                            className={`px-2 py-1 rounded-lg ${
                              student.division === 'School'
                                ? 'bg-blue-100 text-blue-900'
                                : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            #{student.rollNo}
                          </span>
                        </td>

                        <td className="px-4 py-3 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{student.name}</span>
                            {student.status && student.status !== 'Active' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200">
                                {student.status}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="px-4 py-3">
                          <span className="text-xs text-slate-600 font-medium">
                            {student.classGrade}
                          </span>
                        </td>

                        {/* Overall session % */}
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold text-xs ${
                              att.percentage >= 85
                                ? 'bg-emerald-100 text-emerald-800'
                                : att.percentage >= 70
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {att.percentage}%
                          </span>
                        </td>

                        {/* Radio toggles */}
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 sm:gap-2">
                            {(['Present', 'Absent', 'Late', 'Leave'] as AttendanceStatus[]).map(
                              (status) => {
                                const isChecked = currentStatus === status;
                                return (
                                  <button
                                    key={status}
                                    type="button"
                                    onClick={() => {
                                      markStudentAttendance(student.id, status, selectedDate);
                                      showToast(`Updated ${student.name} to ${status}`);
                                    }}
                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                                      isChecked
                                        ? status === 'Present'
                                          ? 'bg-emerald-600 text-white shadow-sm'
                                          : status === 'Absent'
                                          ? 'bg-rose-600 text-white shadow-sm'
                                          : status === 'Late'
                                          ? 'bg-amber-500 text-white shadow-sm'
                                          : 'bg-purple-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {status}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </td>

                        {/* Time In */}
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">
                          {rec?.timeIn || (currentStatus === 'Present' ? '07:45 AM' : '—')}
                        </td>

                        {/* Parent contact */}
                        <td className="px-4 py-3 text-xs text-slate-500">
                          <a
                            href={`tel:${student.parentContact}`}
                            className="flex items-center gap-1 text-blue-600 hover:underline font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            {student.parentContact}
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* Teacher Reporting Time & Attendance */
        <div className="space-y-6">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-wrap text-xs sm:text-sm">
              <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span className="text-slate-500 font-medium">Faculty Reporting Date:</span>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent font-bold text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200">
                <span className="text-slate-500 font-medium">Faculty Status:</span>
                <select
                  value={teacherStatusFilter}
                  onChange={(e) => setTeacherStatusFilter(e.target.value as any)}
                  className="bg-transparent font-bold text-slate-800 focus:outline-none"
                >
                  <option value="Active">Active Faculty</option>
                  <option value="All">All Staff ({teachers.length})</option>
                  <option value="Left/Leave">Left Campus / On Leave</option>
                </select>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              Standard Reporting Time: <strong className="text-slate-800">07:45 AM</strong>
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Code</th>
                    <th className="px-4 py-3.5">Teacher Name</th>
                    <th className="px-4 py-3.5">Qualification & Subject</th>
                    <th className="px-4 py-3.5">Official Shift Time</th>
                    <th className="px-4 py-3.5">Actual Clock-In Time</th>
                    <th className="px-4 py-3.5">Reporting Status</th>
                    <th className="px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredTeachers.map((teacher) => {
                    const rec = teacherAttendance.find(
                      (ta) => ta.teacherId === teacher.id && ta.date === selectedDate
                    );
                    const currentStatus: TeacherAttendanceStatus = rec ? rec.status : 'On Time';
                    const clockInTime = rec ? rec.actualReportingTime : teacher.reportingTime || '07:45 AM';

                    return (
                      <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-4 py-3.5 font-mono font-bold text-indigo-700">
                          {teacher.facultyCode}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">
                          <div className="flex items-center gap-2">
                            <span>{teacher.name}</span>
                            {teacher.status && teacher.status !== 'Active' && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                                {teacher.status}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold text-slate-800">{teacher.subject}</div>
                          <span className="text-xs text-slate-400">{teacher.qualification}</span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-slate-500">
                          {teacher.reportingTime || '07:45 AM'}
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                          {clockInTime}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1">
                            {(['On Time', 'Late', 'Absent', 'Leave'] as TeacherAttendanceStatus[]).map(
                              (st) => {
                                const isChecked = currentStatus === st;
                                return (
                                  <button
                                    key={st}
                                    type="button"
                                    onClick={() => {
                                      recordTeacherAttendance(
                                        teacher.id,
                                        teacher.reportingTime || '07:45 AM',
                                        st,
                                        selectedDate
                                      );
                                      showToast(`Updated ${teacher.name} status to ${st}`);
                                    }}
                                    className={`px-2 py-1 text-xs font-bold rounded-lg transition-all ${
                                      isChecked
                                        ? st === 'On Time'
                                          ? 'bg-emerald-600 text-white shadow-sm'
                                          : st === 'Late'
                                          ? 'bg-amber-500 text-white shadow-sm'
                                          : st === 'Absent'
                                          ? 'bg-rose-600 text-white shadow-sm'
                                          : 'bg-purple-600 text-white shadow-sm'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                                  >
                                    {st}
                                  </button>
                                );
                              }
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => {
                              const timeNow = new Date().toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              });
                              recordTeacherAttendance(teacher.id, timeNow, 'On Time', selectedDate);
                              showToast(`Clocked in ${teacher.name} at ${timeNow}`);
                            }}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1 inline-flex"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            Clock-In Now
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
