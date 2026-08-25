import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  DollarSign,
  Printer,
  Edit2,
  Trash2,
  Clock,
  Phone,
  Briefcase,
  GraduationCap,
  Calendar,
  CheckCircle2,
  AlertCircle,
  X,
  CheckCheck,
  UserX,
  UserCheck,
  AlertTriangle,
  Building2,
  IdCard,
  FileSpreadsheet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../context/SchoolContext';
import { Teacher } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const TeachersView: React.FC = () => {
  const {
    teachers,
    timeSlots,
    timetableEntries,
    addTeacher,
    updateTeacher,
    deleteTeacher,
    toggleTeacherStatus,
    payTeacherSalary,
    clearTeacherSalary,
    setActivePrintDoc,
    stats,
    todayDateStr
  } = useSchool();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterSalaryStatus, setFilterSalaryStatus] = useState<'all' | 'pending' | 'cleared'>('all');
  const [filterCampusStatus, setFilterCampusStatus] = useState<'all' | 'active' | 'left'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [payingTeacher, setPayingTeacher] = useState<Teacher | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm state
  const [confirmDeleteTeacher, setConfirmDeleteTeacher] = useState<{ id: string; name: string; facultyCode: string } | null>(null);
  const [confirmClearSalaryTeacher, setConfirmClearSalaryTeacher] = useState<{ teacher: Teacher; due: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Pay Salary Form State
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payDate, setPayDate] = useState<string>(todayDateStr);
  const [payRemarks, setPayRemarks] = useState<string>('August 2026 Monthly Salary');

  // Add Teacher Form State
  const [formData, setFormData] = useState({
    name: '',
    fatherOrHusbandName: '',
    qualification: '',
    subject: '',
    mobileNumber: '',
    email: '',
    joiningDate: todayDateStr,
    monthlySalary: 60000,
    paidSalary: 0,
    reportingTime: '07:45 AM',
    assignedClasses: 'Grade 9, Grade 10',
    status: 'Active' as const
  });

  const filteredTeachers = teachers.filter((t) => {
    const pendingSal = Math.max(0, t.monthlySalary - t.paidSalary);
    const isCleared = pendingSal === 0;

    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.facultyCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.qualification.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.mobileNumber.includes(searchQuery);

    const matchesSalary =
      filterSalaryStatus === 'all'
        ? true
        : filterSalaryStatus === 'pending'
        ? pendingSal > 0
        : isCleared;

    const matchesCampus =
      filterCampusStatus === 'all'
        ? true
        : filterCampusStatus === 'active'
        ? t.status === 'Active'
        : t.status === 'Left Campus';

    return matchesSearch && matchesSalary && matchesCampus;
  });

  const handleOpenPay = (teacher: Teacher) => {
    const due = Math.max(0, teacher.monthlySalary - teacher.paidSalary);
    setPayingTeacher(teacher);
    setPayAmount(due > 0 ? due : teacher.monthlySalary);
    setPayDate(todayDateStr);
    setPayRemarks('Monthly Salary Disbursement');
  };

  const handleInstantClearSalary = (teacher: Teacher) => {
    const due = Math.max(0, teacher.monthlySalary - teacher.paidSalary);
    if (due <= 0) return;
    setConfirmClearSalaryTeacher({ teacher, due });
  };

  const handleConfirmClearSalary = () => {
    if (!confirmClearSalaryTeacher) return;
    const { teacher, due } = confirmClearSalaryTeacher;
    clearTeacherSalary(teacher.id, 'Full Monthly Salary Settlement');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`Cleared pending salary of Rs. ${due.toLocaleString()} for ${teacher.name}!`);
    setConfirmClearSalaryTeacher(null);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteTeacher) return;
    deleteTeacher(confirmDeleteTeacher.id);
    showToast(`Faculty record for ${confirmDeleteTeacher.name} permanently removed.`);
    setConfirmDeleteTeacher(null);
  };

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingTeacher || payAmount <= 0) return;

    payTeacherSalary(payingTeacher.id, payAmount, payDate, payRemarks);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    showToast(`Paid Rs. ${payAmount.toLocaleString()} to ${payingTeacher.name}`);
    setPayingTeacher(null);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addTeacher({
      ...formData,
      assignedClasses: formData.assignedClasses.split(',').map((c) => c.trim())
    });
    setIsAddModalOpen(false);
    showToast(`Added faculty member ${created.name} (${created.facultyCode})`);
    setFormData({
      name: '',
      fatherOrHusbandName: '',
      qualification: '',
      subject: '',
      mobileNumber: '',
      email: '',
      joiningDate: todayDateStr,
      monthlySalary: 60000,
      paidSalary: 0,
      reportingTime: '07:45 AM',
      assignedClasses: 'Grade 9, Grade 10',
      status: 'Active'
    });
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-300">
              Staff & Payroll Roster
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-600" />
            Faculty Directory, Shifts & Payroll Ledger
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage teacher profiles, reporting shifts, active vs left campus status, and clear pending monthly salaries
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-indigo-900/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Faculty Member
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Teaching Faculty</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {teachers.length} Teachers
          </div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-emerald-600 font-semibold">{stats.activeTeachers} Active</span>
            <span className="text-amber-600 font-semibold">{stats.leftCampusTeachers} Left Campus</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Standard Reporting Time</span>
          <div className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-600" />
            07:45 AM
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            {stats.teachersOnTimeToday} checked-in on time today
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-800">Pending Salary Balance</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            Rs. {stats.totalTeacherSalaryPending.toLocaleString()}
          </div>
          <span className="text-xs text-rose-700 font-semibold mt-1 block">
            {stats.pendingSalaryTeachers} teachers awaiting clearance
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Cleared Salaries</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            {stats.clearedSalaryTeachers} Faculty
          </div>
          <span className="text-xs text-emerald-700 font-semibold mt-1 block">
            100% Salary cleared this month
          </span>
        </div>
      </div>

      {/* Filtering and Search Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Code, Teacher Name, Subject, Phone..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 font-medium"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterSalaryStatus('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterSalaryStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Salaries
            </button>
            <button
              onClick={() => setFilterSalaryStatus('pending')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filterSalaryStatus === 'pending' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <AlertCircle className="w-3 h-3" />
              Pending ({stats.pendingSalaryTeachers})
            </button>
            <button
              onClick={() => setFilterSalaryStatus('cleared')}
              className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1 cursor-pointer ${
                filterSalaryStatus === 'cleared' ? 'bg-emerald-600 text-white shadow-sm' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <CheckCheck className="w-3 h-3" />
              Cleared ({stats.clearedSalaryTeachers})
            </button>
          </div>

          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setFilterCampusStatus('all')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterCampusStatus === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              All Staff
            </button>
            <button
              onClick={() => setFilterCampusStatus('active')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterCampusStatus === 'active' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Active ({stats.activeTeachers})
            </button>
            <button
              onClick={() => setFilterCampusStatus('left')}
              className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                filterCampusStatus === 'left' ? 'bg-amber-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Left Campus ({stats.leftCampusTeachers})
            </button>
          </div>
        </div>
      </div>

      {/* Faculty Directory Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Faculty Code</th>
                <th className="px-4 py-3.5">Teacher Name</th>
                <th className="px-4 py-3.5">Campus Status</th>
                <th className="px-4 py-3.5">Qualification & Subject</th>
                <th className="px-4 py-3.5">Reporting Time</th>
                <th className="px-4 py-3.5">Monthly Salary</th>
                <th className="px-4 py-3.5">Paid So Far</th>
                <th className="px-4 py-3.5">Salary Clearance</th>
                <th className="px-4 py-3.5">Mobile Phone</th>
                <th className="px-4 py-3.5 text-right">Actions & Clearance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTeachers.length > 0 ? (
                filteredTeachers.map((teacher) => {
                  const pendingSal = Math.max(0, teacher.monthlySalary - teacher.paidSalary);
                  const isLeftCampus = teacher.status === 'Left Campus';

                  return (
                    <tr key={teacher.id} className={`hover:bg-indigo-50/20 transition-colors ${isLeftCampus ? 'bg-slate-50/60 opacity-85' : ''}`}>
                      <td className="px-4 py-3.5 font-mono font-bold text-indigo-700">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-900 rounded-lg border border-indigo-200">
                          {teacher.facultyCode}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        <div>{teacher.name}</div>
                        <span className="text-[11px] text-slate-400 font-normal">
                          Joined: {teacher.joiningDate}
                        </span>
                      </td>
                      
                      {/* Active vs Left Campus Status Toggle */}
                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => {
                            const newStatus = isLeftCampus ? 'Active' : 'Left Campus';
                            toggleTeacherStatus(teacher.id, newStatus);
                            showToast(`Updated status for ${teacher.name} to "${newStatus}".`);
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

                      <td className="px-4 py-3.5">
                        <div className="font-semibold text-slate-800 text-xs">{teacher.subject}</div>
                        <span className="text-[11px] text-slate-500">{teacher.qualification}</span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-slate-600">
                        <span className="flex items-center gap-1 font-bold">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          {teacher.reportingTime || '07:45 AM'}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        Rs. {teacher.monthlySalary.toLocaleString()}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-emerald-600 font-semibold">
                        Rs. {teacher.paidSalary.toLocaleString()}
                      </td>

                      {/* Salary Clearance Status */}
                      <td className="px-4 py-3.5 font-mono font-black">
                        {pendingSal > 0 ? (
                          <span className="text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 text-xs inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Pending: Rs. {pendingSal.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-300 text-xs inline-flex items-center gap-1">
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            Cleared
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 font-mono text-xs">
                        <a href={`tel:${teacher.mobileNumber}`} className="text-blue-600 hover:underline flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {teacher.mobileNumber}
                        </a>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5 text-right space-x-1 whitespace-nowrap">
                        {/* 1-Click Clear Salary Button if pending */}
                        {pendingSal > 0 && (
                          <button
                            onClick={() => handleInstantClearSalary(teacher)}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                            title="Instantly clear and disburse full remaining salary"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            Clear Salary
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenPay(teacher)}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white inline-flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                          title="Disburse Custom Salary Amount"
                        >
                          <DollarSign className="w-3.5 h-3.5" />
                          Pay
                        </button>

                        <button
                          onClick={() =>
                            setActivePrintDoc({
                              type: 'teacher_id_card',
                              teacher
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-blue-50 cursor-pointer"
                          title="Print Faculty ID Card"
                        >
                          <IdCard className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            setActivePrintDoc({
                              type: 'salary_slip',
                              teacher,
                              paidAmount: teacher.paidSalary > 0 ? teacher.paidSalary : teacher.monthlySalary,
                              date: todayDateStr,
                              voucherNo: `SAL-${teacher.facultyCode}`
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-emerald-600 rounded-lg hover:bg-emerald-50 cursor-pointer"
                          title="Print Salary Slip / Voucher"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            setActivePrintDoc({
                              type: 'teacher_timetable',
                              teacher,
                              entries: timetableEntries.filter((e) => e.teacherId === teacher.id),
                              timeSlots
                            })
                          }
                          className="p-1.5 text-slate-500 hover:text-amber-600 rounded-lg hover:bg-amber-50 cursor-pointer"
                          title="Print Teacher Teaching Schedule"
                        >
                          <FileSpreadsheet className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => setEditingTeacher(teacher)}
                          className="p-1.5 text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 cursor-pointer"
                          title="Edit Teacher Record"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            setConfirmDeleteTeacher({
                              id: teacher.id,
                              name: teacher.name,
                              facultyCode: teacher.facultyCode
                            })
                          }
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                          title="Delete Teacher"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No faculty members found matching the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Salary Modal */}
      {payingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-emerald-800 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-base">Pay Faculty Salary</h3>
                <p className="text-xs text-emerald-200">
                  {payingTeacher.name} ({payingTeacher.facultyCode})
                </p>
              </div>
              <button onClick={() => setPayingTeacher(null)} className="text-emerald-200 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmPay} className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-600">Base Monthly Salary:</span>
                  <strong className="text-slate-900">Rs. {payingTeacher.monthlySalary.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Paid so far this month:</span>
                  <strong className="text-emerald-700">Rs. {payingTeacher.paidSalary.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between font-bold pt-1.5 border-t border-emerald-200">
                  <span className="text-slate-800">Pending Salary:</span>
                  <strong className="text-rose-700">
                    Rs. {Math.max(0, payingTeacher.monthlySalary - payingTeacher.paidSalary).toLocaleString()}
                  </strong>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Disbursement Amount (PKR)</label>
                <input
                  type="number"
                  min="1"
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Payment Date</label>
                <input
                  type="date"
                  value={payDate}
                  onChange={(e) => setPayDate(e.target.value)}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Payment Remarks / Month</label>
                <input
                  type="text"
                  value={payRemarks}
                  onChange={(e) => setPayRemarks(e.target.value)}
                  placeholder="e.g. August 2026 Monthly Salary"
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setPayingTeacher(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 font-bold text-white rounded-xl shadow-md cursor-pointer"
                >
                  Confirm & Issue Salary
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Teacher Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 bg-indigo-900 text-white flex items-center justify-between">
              <h3 className="font-black text-base">Add New Faculty Member</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-300 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-5 overflow-y-auto space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Teacher Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="e.g. Prof. Tariq Mehmood"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Father / Husband Name</label>
                  <input
                    type="text"
                    value={formData.fatherOrHusbandName}
                    onChange={(e) => setFormData({ ...formData, fatherOrHusbandName: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    value={formData.qualification}
                    onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                    required
                    placeholder="e.g. M.Phil Physics / M.Sc Math"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Subjects Taught</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="e.g. Physics, Chemistry"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Mobile Phone Number</label>
                  <input
                    type="text"
                    value={formData.mobileNumber}
                    onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                    required
                    placeholder="03xx-xxxxxxx"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Standard Shift Reporting Time</label>
                  <input
                    type="text"
                    value={formData.reportingTime}
                    onChange={(e) => setFormData({ ...formData, reportingTime: e.target.value })}
                    placeholder="07:45 AM"
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Campus Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Active">Active Faculty</option>
                    <option value="Left Campus">Left Campus / Exited</option>
                    <option value="On Leave">On Leave</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Assigned Classes / Tracks</label>
                <input
                  type="text"
                  value={formData.assignedClasses}
                  onChange={(e) => setFormData({ ...formData, assignedClasses: e.target.value })}
                  placeholder="Grade 9, F.Sc Part 1"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl shadow-md cursor-pointer"
                >
                  Add Teacher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Teacher Modal */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-black text-base">Edit Faculty Record ({editingTeacher.facultyCode})</h3>
              <button onClick={() => setEditingTeacher(null)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                updateTeacher(editingTeacher.id, editingTeacher);
                setEditingTeacher(null);
              }}
              className="p-5 space-y-3 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Teacher Full Name</label>
                  <input
                    type="text"
                    value={editingTeacher.name}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, name: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Campus Status</label>
                  <select
                    value={editingTeacher.status || 'Active'}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, status: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold"
                  >
                    <option value="Active">Active Faculty</option>
                    <option value="Left Campus">Left Campus / Exited</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Resigned">Resigned</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Qualification</label>
                  <input
                    type="text"
                    value={editingTeacher.qualification}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, qualification: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Subject</label>
                  <input
                    type="text"
                    value={editingTeacher.subject}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, subject: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Mobile Phone</label>
                  <input
                    type="text"
                    value={editingTeacher.mobileNumber}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, mobileNumber: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Monthly Salary (PKR)</label>
                  <input
                    type="number"
                    value={editingTeacher.monthlySalary}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, monthlySalary: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Reporting Time</label>
                  <input
                    type="text"
                    value={editingTeacher.reportingTime}
                    onChange={(e) => setEditingTeacher({ ...editingTeacher, reportingTime: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 font-bold text-white rounded-xl cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Teacher Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteTeacher}
        onClose={() => setConfirmDeleteTeacher(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Faculty Member"
        message={`Are you sure you want to permanently remove the faculty profile for "${confirmDeleteTeacher?.name}" (${confirmDeleteTeacher?.facultyCode})? This will delete all salary archives and assigned shifts.`}
        confirmText="Yes, Remove Faculty"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />

      {/* Clear Teacher Salary Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmClearSalaryTeacher}
        onClose={() => setConfirmClearSalaryTeacher(null)}
        onConfirm={handleConfirmClearSalary}
        title="Disburse Full Monthly Salary"
        message={`Are you sure you want to clear the entire pending salary of Rs. ${confirmClearSalaryTeacher?.due.toLocaleString()} for "${confirmClearSalaryTeacher?.teacher.name}" (${confirmClearSalaryTeacher?.teacher.facultyCode})? This will record an official campus payroll expense and issue a cleared salary slip.`}
        confirmText="Confirm Salary Clearance"
        cancelText="Cancel"
        variant="success"
        icon="check"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-indigo-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};

