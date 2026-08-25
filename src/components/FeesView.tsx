import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Printer,
  Trash2,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  CreditCard,
  MessageSquare,
  Sparkles,
  ArrowUpRight,
  Filter,
  CheckCheck,
  Building2,
  Users
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../context/SchoolContext';
import { Student, PaymentMethod } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface FeesViewProps {
  onOpenCollectFee: () => void;
  onOpenCollectFeeForStudent: (student: Student) => void;
}

export const FeesView: React.FC<FeesViewProps> = ({
  onOpenCollectFee,
  onOpenCollectFeeForStudent
}) => {
  const {
    students,
    fees,
    deleteFeeTransaction,
    setActivePrintDoc,
    clearStudentFee,
    stats
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'submissions' | 'defaulters' | 'cleared'>('submissions');
  const [searchQuery, setSearchQuery] = useState('');
  const [methodFilter, setMethodFilter] = useState('All');
  const [campusStatusFilter, setCampusStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm states
  const [confirmDeleteFee, setConfirmDeleteFee] = useState<{ id: string; receiptNo: string; studentName: string } | null>(null);
  const [confirmClearFee, setConfirmClearFee] = useState<{ student: Student; due: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Defaulters vs Cleared lists
  const studentFeeList = students.map((s) => {
    const due = s.totalFee - s.paidFee - (s.discountFee || 0);
    const isCleared = due <= 0;
    return { student: s, due: Math.max(0, due), isCleared };
  });

  const defaulterStudents = studentFeeList
    .filter((item) => !item.isCleared)
    .sort((a, b) => b.due - a.due);

  const clearedStudents = studentFeeList
    .filter((item) => item.isCleared)
    .sort((a, b) => b.student.paidFee - a.student.paidFee);

  // Filter Fee Transactions
  const filteredFees = fees.filter((f) => {
    const matchesSearch =
      f.receiptNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.rollNo.includes(searchQuery) ||
      f.paymentMonth.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesMethod = methodFilter === 'All' || f.paymentMethod === methodFilter;

    return matchesSearch && matchesMethod;
  });

  const handleInstantClearFee = (student: Student, dueAmount: number) => {
    setConfirmClearFee({ student, due: dueAmount });
  };

  const handleConfirmClearFee = () => {
    if (!confirmClearFee) return;
    const { student, due } = confirmClearFee;
    clearStudentFee(student.id, 'Session Fee Clearance', 'Cash', 'Mudassar Asghar / Accounts Section', 'Full Clearance Settled');
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    showToast(`Outstanding fee of Rs. ${due.toLocaleString()} cleared for ${student.name}!`);
    setConfirmClearFee(null);
  };

  const handleConfirmDeleteFee = () => {
    if (!confirmDeleteFee) return;
    deleteFeeTransaction(confirmDeleteFee.id);
    showToast(`Fee transaction ${confirmDeleteFee.receiptNo} deleted.`);
    setConfirmDeleteFee(null);
  };

  const sendWhatsAppReminder = (student: Student, dueAmount: number) => {
    const text = `Respected Parent of ${student.name} (Roll #${student.rollNo}), this is an official reminder from Premier School System & Science Academy. Outstanding fee balance of Rs. ${dueAmount.toLocaleString()} is due for ${student.classGrade}. Kindly deposit at the campus accounts section at your earliest convenience. Thank you.`;
    const cleanPhone = student.parentContact.replace(/[^0-9]/g, '');
    const formatted = cleanPhone.startsWith('0') ? '92' + cleanPhone.substring(1) : cleanPhone;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Header & Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
              Accounts & Fee Ledger
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <Receipt className="w-6 h-6 text-emerald-600" />
            Fee Management, Collections & Clearance
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track daily fee submissions, manage pending student dues, settle cleared accounts, and print official fee receipts
          </p>
        </div>

        <button
          onClick={onOpenCollectFee}
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-md shadow-emerald-800/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Collect Fee Payment
        </button>
      </div>

      {/* Financial Snapshot Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Fees Collected</span>
          <div className="text-2xl font-black text-emerald-600 mt-1">
            Rs. {stats.totalFeesCollectedAllTime.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {fees.length} receipts generated
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 bg-emerald-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Today's Fee Submissions</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            Rs. {stats.todayFeesCollected.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Collected today at counter
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-rose-200 bg-rose-50/30 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Total Pending Dues</span>
          <div className="text-2xl font-black text-rose-600 mt-1">
            Rs. {stats.totalPendingDues.toLocaleString()}
          </div>
          <span className="text-xs text-rose-700 font-semibold mt-1 block">
            Across {defaulterStudents.length} pending accounts
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 bg-blue-50/30 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700">Cleared Accounts</span>
          <div className="text-2xl font-black text-blue-600 mt-1">
            {clearedStudents.length} Students
          </div>
          <span className="text-xs text-blue-700 font-semibold mt-1 block">
            100% Fully settled fee status
          </span>
        </div>

      </div>

      {/* Tabs: Submissions History vs Defaulters List vs Cleared Accounts */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'submissions'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Daily Submissions Ledger ({fees.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('defaulters')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'defaulters'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-rose-700 bg-rose-50 hover:bg-rose-100'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          <span>Pending Dues / Defaulters ({defaulterStudents.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('cleared')}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === 'cleared'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
          }`}
        >
          <CheckCheck className="w-4 h-4" />
          <span>Cleared / Fully Paid Accounts ({clearedStudents.length})</span>
        </button>
      </div>

      {/* TAB 1: Submissions Ledger */}
      {activeTab === 'submissions' && (
        <>
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Receipt No, Student Name, Roll No..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500 font-medium">Payment Mode:</span>
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none"
              >
                <option value="All">All Methods</option>
                <option value="Cash">Cash</option>
                <option value="Online / Bank">Online / Bank</option>
                <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
          </div>

          {/* Transactions Ledger Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Receipt #</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5">Student / Roll</th>
                    <th className="px-4 py-3.5">Division / Class</th>
                    <th className="px-4 py-3.5">Payment Month</th>
                    <th className="px-4 py-3.5">Amount Paid</th>
                    <th className="px-4 py-3.5">Method</th>
                    <th className="px-4 py-3.5">Received By</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredFees.length > 0 ? (
                    filteredFees.map((fee) => {
                      const st = students.find((s) => s.id === fee.studentId);
                      return (
                        <tr key={fee.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                            {fee.receiptNo}
                          </td>
                          <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                            {fee.paymentDate}
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="font-bold text-slate-900">{fee.studentName}</div>
                            <span className="text-xs font-mono text-slate-500">Roll #{fee.rollNo}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="text-xs text-slate-600 font-medium">
                              {fee.classGrade}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-700 font-medium">
                            {fee.paymentMonth}
                          </td>
                          <td className="px-4 py-3.5 font-bold text-emerald-600 font-mono">
                            Rs. {fee.amountPaid.toLocaleString()}
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              {fee.paymentMethod}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-xs text-slate-500">
                            {fee.receivedBy}
                          </td>
                          <td className="px-4 py-3.5 text-right space-x-1">
                            <button
                              onClick={() =>
                                setActivePrintDoc({
                                  type: 'fee_receipt',
                                  data: fee,
                                  student: st
                                })
                              }
                              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                              title="Print Official Fee Receipt"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              Print
                            </button>
                            <button
                              onClick={() =>
                                setConfirmDeleteFee({
                                  id: fee.id,
                                  receiptNo: fee.receiptNo,
                                  studentName: fee.studentName
                                })
                              }
                              className="p-1 text-slate-300 hover:text-rose-600 rounded cursor-pointer"
                              title="Delete Transaction"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                        No fee transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* TAB 2: Defaulters / Pending Dues List */}
      {activeTab === 'defaulters' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-rose-50/70 border-b border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>Outstanding Fee Accounts ({defaulterStudents.length} Students Pending)</span>
            </div>
            <span className="text-xs font-extrabold text-rose-700 bg-rose-100 px-3 py-1.5 rounded-xl border border-rose-300 self-start sm:self-auto">
              Total Outstanding: Rs. {stats.totalPendingDues.toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Roll No</th>
                  <th className="px-4 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5">Father / Guardian</th>
                  <th className="px-4 py-3.5">Class / Wing</th>
                  <th className="px-4 py-3.5">Total Fee</th>
                  <th className="px-4 py-3.5">Paid So Far</th>
                  <th className="px-4 py-3.5">Pending Balance</th>
                  <th className="px-4 py-3.5">Campus Status</th>
                  <th className="px-4 py-3.5 text-right">Clearance & Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {defaulterStudents.length > 0 ? (
                  defaulterStudents.map(({ student, due }) => (
                    <tr key={student.id} className="hover:bg-rose-50/30 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        <span className="px-2 py-1 rounded-lg bg-rose-100 text-rose-900 font-mono">
                          #{student.rollNo}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {student.name}
                        <div className="text-[11px] font-normal text-slate-500 font-mono">{student.parentContact}</div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {student.fatherName}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                          {student.classGrade}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono">
                        Rs. {student.totalFee.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-emerald-600 font-semibold">
                        Rs. {student.paidFee.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5 font-mono font-black text-rose-600">
                        Rs. {due.toLocaleString()}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          (student.status && student.status !== 'Active') ||
                          student.activeStatus === 'Left Campus' ||
                          student.activeStatus === 'Struck Off'
                            ? 'bg-amber-100 text-amber-800 border border-amber-300'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {student.status || student.activeStatus || 'Active'}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1.5 whitespace-nowrap">
                        {/* 1-Click Clear Fee Action */}
                        <button
                          onClick={() => handleInstantClearFee(student, due)}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white inline-flex items-center gap-1 transition-all shadow-sm active:scale-95 cursor-pointer"
                          title="Instantly clear and settle full remaining fee balance"
                        >
                          <CheckCheck className="w-3.5 h-3.5" />
                          Clear Fee
                        </button>

                        <button
                          onClick={() => sendWhatsAppReminder(student, due)}
                          className="px-2 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1 transition-colors cursor-pointer"
                          title="Send WhatsApp Fee Reminder"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                          WhatsApp
                        </button>

                        <button
                          onClick={() => onOpenCollectFeeForStudent(student)}
                          className="px-2.5 py-1.5 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-700 text-white inline-flex items-center gap-1 transition-colors shadow-sm cursor-pointer"
                          title="Collect Partial Fee"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          Custom Pay
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                      <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                      Congratulations! All student fee accounts are 100% cleared.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Cleared / Fully Paid Accounts */}
      {activeTab === 'cleared' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-4 sm:p-5 bg-emerald-50/70 border-b border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Fully Cleared Student Accounts ({clearedStudents.length} Students)</span>
            </div>
            <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-300 self-start sm:self-auto">
              Fee Status: 100% Cleared (Zero Dues)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3.5">Roll No</th>
                  <th className="px-4 py-3.5">Student Name</th>
                  <th className="px-4 py-3.5">Father Name</th>
                  <th className="px-4 py-3.5">Class / Wing</th>
                  <th className="px-4 py-3.5">Total Fee</th>
                  <th className="px-4 py-3.5">Paid Fee</th>
                  <th className="px-4 py-3.5">Fee Status</th>
                  <th className="px-4 py-3.5">Campus Status</th>
                  <th className="px-4 py-3.5 text-right">Receipt History</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {clearedStudents.map(({ student }) => (
                  <tr key={student.id} className="hover:bg-emerald-50/30 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                      <span className="px-2 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-mono">
                        #{student.rollNo}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-slate-900">
                      {student.name}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">
                      {student.fatherName}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                        {student.classGrade} ({student.division})
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono">
                      Rs. {student.totalFee.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-emerald-600">
                      Rs. {student.paidFee.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 inline-flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Cleared
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        (student.status && student.status !== 'Active') ||
                        student.activeStatus === 'Left Campus' ||
                        student.activeStatus === 'Struck Off'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {student.status || student.activeStatus || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() => onOpenCollectFeeForStudent(student)}
                        className="px-2.5 py-1 text-xs font-bold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1 transition-colors cursor-pointer"
                        title="View or Add Advance Voucher"
                      >
                        <Receipt className="w-3.5 h-3.5" />
                        Vouchers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Fee Transaction Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteFee}
        onClose={() => setConfirmDeleteFee(null)}
        onConfirm={handleConfirmDeleteFee}
        title="Delete Fee Transaction"
        message={`Are you sure you want to delete receipt "${confirmDeleteFee?.receiptNo}" for student "${confirmDeleteFee?.studentName}"? The student's paid balance will be adjusted accordingly.`}
        confirmText="Yes, Delete Transaction"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />

      {/* 1-Click Clear Fee Dues Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmClearFee}
        onClose={() => setConfirmClearFee(null)}
        onConfirm={handleConfirmClearFee}
        title="Clear Outstanding Student Fee"
        message={`Are you sure you want to clear the entire pending fee balance of Rs. ${confirmClearFee?.due.toLocaleString()} for "${confirmClearFee?.student.name}" (Roll #${confirmClearFee?.student.rollNo})? This will generate an official clearance receipt in the ledger.`}
        confirmText="Clear & Settle Dues"
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
