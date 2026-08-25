import React from 'react';
import {
  Printer,
  X,
  Clock,
  Calendar,
  Sparkles,
  BookOpen,
  GraduationCap,
  Award,
  FileText,
  CheckCircle2,
  AlertTriangle,
  QrCode,
  IdCard as IdCardIcon
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { FeeTransaction, StudentTestResult, DayOfWeek } from '../types';

export const PrintDocumentModal: React.FC = () => {
  const { activePrintDoc, setActivePrintDoc } = useSchool();

  if (!activePrintDoc) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleClose = () => {
    setActivePrintDoc(null);
  };

  const isWideDoc =
    activePrintDoc.type === 'class_timetable' ||
    activePrintDoc.type === 'teacher_timetable' ||
    activePrintDoc.type === 'master_timetable' ||
    activePrintDoc.type === 'attendance_register_sheet';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      
      {/* Container */}
      <div className={`w-full ${isWideDoc ? 'max-w-5xl' : 'max-w-3xl'} bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[95vh]`}>
        
        {/* Modal Toolbar (hidden in print via @media print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm sm:text-base">Document Print Preview</h3>
              <p className="text-[11px] text-slate-300">
                Official Premier School System & Science Academy Stationery
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Print / Save as PDF
            </button>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area with ID #printable-document */}
        <div className="p-4 sm:p-8 overflow-y-auto bg-slate-50 flex justify-center">
          <div id="printable-document" className={`w-full ${isWideDoc ? 'max-w-4xl' : 'max-w-2xl'} bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-slate-200 text-slate-800`}>
            
            {/* 1. FEE RECEIPT VOUCHER */}
            {activePrintDoc.type === 'fee_receipt' && (
              <div className="space-y-6">
                
                {/* Official Letterhead Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mt-0.5">
                    Official Fee Deposit Voucher & Account Clearance Receipt
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Main Campus • Contact: 0300-1234567 • Reg # PSS-2026-HQ
                  </p>
                </div>

                {/* Receipt Particulars Header */}
                <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block font-bold">RECEIPT NUMBER:</span>
                    <strong className="text-slate-900 font-mono text-sm font-black">
                      {(activePrintDoc.data as FeeTransaction).receiptNo}
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block font-bold">DATE OF ISSUE:</span>
                    <strong className="text-slate-900 font-mono">
                      {(activePrintDoc.data as FeeTransaction).paymentDate}
                    </strong>
                  </div>
                </div>

                {/* Student Details Grid */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block font-semibold">Student Name:</span>
                    <strong className="text-sm font-bold text-slate-900 uppercase">
                      {(activePrintDoc.data as FeeTransaction).studentName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Roll Number:</span>
                    <strong className="text-sm font-mono font-bold text-slate-900">
                      {(activePrintDoc.data as FeeTransaction).rollNo}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Class / Academic Program:</span>
                    <strong className="text-slate-800">
                      {(activePrintDoc.data as FeeTransaction).classGrade}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Academic Division:</span>
                    <strong className="text-blue-700 font-bold uppercase">
                      {(activePrintDoc.data as FeeTransaction).division}
                    </strong>
                  </div>
                </div>

                {/* Payment Breakdown Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-white font-bold">
                    <tr>
                      <th className="p-2.5">Billing Description</th>
                      <th className="p-2.5">Fee Month / Term</th>
                      <th className="p-2.5">Payment Channel</th>
                      <th className="p-2.5 text-right">Amount Paid</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5 font-bold text-slate-900">
                        Monthly Tuition & Lab Maintenance Fee
                      </td>
                      <td className="p-2.5 font-medium text-slate-600">
                        {(activePrintDoc.data as FeeTransaction).paymentMonth}
                      </td>
                      <td className="p-2.5 font-semibold text-slate-700">
                        {(activePrintDoc.data as FeeTransaction).paymentMethod}
                      </td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                        Rs. {(activePrintDoc.data as FeeTransaction).amountPaid.toLocaleString()}
                      </td>
                    </tr>
                    {(activePrintDoc.data as FeeTransaction).discountApplied ? (
                      <tr className="bg-amber-50/60 text-amber-900">
                        <td colSpan={3} className="p-2 font-semibold italic text-right">
                          Scholarship / Sibling Concession Applied:
                        </td>
                        <td className="p-2 text-right font-mono font-bold">
                          - Rs. {(activePrintDoc.data as FeeTransaction).discountApplied?.toLocaleString()}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 font-bold text-slate-900 border-t-2 border-slate-900">
                      <td colSpan={3} className="p-2.5 text-right uppercase">
                        Net Total Received:
                      </td>
                      <td className="p-2.5 text-right font-mono text-sm text-blue-900 font-black">
                        Rs. {(activePrintDoc.data as FeeTransaction).amountPaid.toLocaleString()}
                      </td>
                    </tr>
                  </tfoot>
                </table>

                {/* Transaction Remarks and Collector */}
                <div className="text-xs p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                  <div>
                    <span className="text-slate-400 block font-semibold">Remarks / Note:</span>
                    <span className="text-slate-700 font-medium italic">
                      {(activePrintDoc.data as FeeTransaction).remarks || 'Official deposit received in good order.'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-semibold">Authorized Officer:</span>
                    <span className="text-slate-900 font-bold">
                      {(activePrintDoc.data as FeeTransaction).receivedBy}
                    </span>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-400">
                      Authorized Cashier
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Cashier Signature & Stamp</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-900 font-bold">
                      Mudassar Asghar
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal Signature</span>
                  </div>
                </div>

              </div>
            )}

            {/* 2. STUDENT ID CARD */}
            {activePrintDoc.type === 'id_card' && (
              <div className="max-w-sm mx-auto border-2 border-blue-900 rounded-2xl p-4 bg-gradient-to-b from-blue-900/5 via-white to-amber-500/5 shadow-md">
                <div className="text-center border-b border-blue-900 pb-2 mb-3">
                  <h2 className="text-xs font-black text-blue-900 tracking-wider uppercase">
                    Premier School System & Science Academy
                  </h2>
                  <p className="text-[9px] font-bold text-amber-700 uppercase">
                    Official Student Identity Card • 2026-2027
                  </p>
                </div>

                <div className="flex gap-3 items-center mb-3">
                  <div className="w-16 h-20 bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs uppercase overflow-hidden shrink-0">
                    PHOTO
                  </div>
                  <div className="text-xs space-y-0.5 min-w-0">
                    <h3 className="font-extrabold text-slate-900 truncate uppercase text-sm">
                      {activePrintDoc.student.name}
                    </h3>
                    <p className="text-slate-600 font-medium">
                      S/D of {activePrintDoc.student.fatherName}
                    </p>
                    <p className="text-blue-700 font-bold">
                      Roll: {activePrintDoc.student.rollNo}
                    </p>
                    <p className="text-slate-700 font-medium">
                      Class: {activePrintDoc.student.classGrade}
                    </p>
                    <p className="text-slate-500 text-[10px]">
                      Emergency: {activePrintDoc.student.contactNumber}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-end text-[9px] text-slate-500">
                  <div>
                    <span className="block font-mono font-bold text-slate-800">
                      ID: {activePrintDoc.student.id}
                    </span>
                    <span>Blood: {activePrintDoc.student.bloodGroup || 'B+'}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif italic font-bold text-slate-900 block">
                      Mudassar Asghar
                    </span>
                    <span className="uppercase text-[8px] font-bold">Principal Signature</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SALARY SLIP VOUCHER */}
            {activePrintDoc.type === 'salary_slip' && (
              <div className="space-y-6">
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <h1 className="text-xl font-black text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mt-0.5">
                    Faculty Salary Payment Voucher & Acknowledgement Slip
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">Teacher Name:</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {activePrintDoc.teacher.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Faculty ID / Code:</span>
                    <strong className="text-sm font-mono font-bold text-slate-900">
                      {activePrintDoc.teacher.facultyCode}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Subject Specialization:</span>
                    <strong className="text-slate-800">
                      {activePrintDoc.teacher.subject} ({activePrintDoc.teacher.division})
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Disbursement Date:</span>
                    <strong className="text-slate-800 font-mono">
                      {activePrintDoc.date}
                    </strong>
                  </div>
                </div>

                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-white font-bold">
                    <tr>
                      <th className="p-2.5">Salary Component</th>
                      <th className="p-2.5 text-right">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    <tr>
                      <td className="p-2.5 font-medium text-slate-800">Agreed Monthly Base Salary</td>
                      <td className="p-2.5 text-right font-mono font-bold">
                        Rs. {(activePrintDoc.teacher.monthlySalary || activePrintDoc.teacher.paidSalary || 0).toLocaleString()}
                      </td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-bold text-emerald-700">Net Amount Disbursed & Cleared</td>
                      <td className="p-2.5 text-right font-mono font-bold text-emerald-700">
                        Rs. {activePrintDoc.paidAmount.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-400">
                      {activePrintDoc.teacher.name}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Teacher Receiver Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-900 font-bold">
                      Mudassar Asghar
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal / Disbursing Officer</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. STUDENT REPORT CARD */}
            {activePrintDoc.type === 'report_card' && (
              <div className="space-y-6">
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mt-0.5">
                    Official Student Academic Progress & Examination Report Card
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Academic Year 2026-2027 • Main Campus Lahore
                  </p>
                </div>

                {/* Student Info */}
                <div className="grid grid-cols-3 gap-4 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">Student Name:</span>
                    <strong className="text-sm font-bold text-slate-900 uppercase">
                      {activePrintDoc.student.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Father's Name:</span>
                    <strong className="text-slate-900 font-medium">
                      {activePrintDoc.student.fatherName}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Roll Number:</span>
                    <strong className="text-sm font-mono font-bold text-blue-900">
                      {activePrintDoc.student.rollNo}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Class / Grade:</span>
                    <strong className="text-slate-800">
                      {activePrintDoc.student.classGrade}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Division:</span>
                    <strong className="text-blue-700 font-bold uppercase">
                      {activePrintDoc.student.division}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Issue Date:</span>
                    <strong className="text-slate-800 font-mono">
                      {new Date().toISOString().split('T')[0]}
                    </strong>
                  </div>
                </div>

                {/* Results Table */}
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-900 text-white font-bold">
                    <tr>
                      <th className="p-2.5">Subject Assessment</th>
                      <th className="p-2.5 text-center">Total Marks</th>
                      <th className="p-2.5 text-center">Obtained Marks</th>
                      <th className="p-2.5 text-center">Percentage</th>
                      <th className="p-2.5 text-center">Grade</th>
                      <th className="p-2.5">Teacher Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-800">
                    {activePrintDoc.results && activePrintDoc.results.length > 0 ? (
                      activePrintDoc.results.map((res: StudentTestResult) => (
                        <tr key={res.id}>
                          <td className="p-2.5 font-bold text-slate-900">{res.classGrade} Exam</td>
                          <td className="p-2.5 text-center font-mono">{res.totalMarks}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-blue-700">{res.obtainedMarks}</td>
                          <td className="p-2.5 text-center font-mono font-bold">{res.percentage}%</td>
                          <td className="p-2.5 text-center font-black">{res.grade}</td>
                          <td className="p-2.5 text-slate-600">{res.remarks}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-slate-400 italic">
                          Official assessment marks logged for this term.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>

                {/* Footer Signatures */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                      {activePrintDoc.attendanceRate || 95}% Present
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Session Attendance</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-emerald-700">
                      PASSED (Grade A)
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Academic Result</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-900 font-bold">
                      Mudassar Asghar
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal / Authority</span>
                  </div>
                </div>

              </div>
            )}

            {/* 5. CLASS TIMETABLE */}
            {activePrintDoc.type === 'class_timetable' && (
              <div className="space-y-5">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-blue-900 font-bold uppercase tracking-widest mt-0.5">
                    Official Weekly Class Timetable & Lecture Schedule
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Academic Session 2026-2027 • Main Campus • Reg # PSS-2026-HQ
                  </p>
                </div>

                {/* Class & Schedule Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">Academic Class:</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {activePrintDoc.classGrade}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Division:</span>
                    <strong className="text-blue-700 font-bold uppercase">
                      {activePrintDoc.division}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Effective Term:</span>
                    <strong className="text-slate-800 font-medium">
                      Fall / Spring 2026
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Print Date:</span>
                    <strong className="text-slate-800 font-mono">
                      {new Date().toISOString().split('T')[0]}
                    </strong>
                  </div>
                </div>

                {/* Weekly Grid */}
                {(() => {
                  const days: DayOfWeek[] = activePrintDoc.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse border border-slate-300">
                        <thead className="bg-slate-900 text-white">
                          <tr>
                            <th className="p-2 border border-slate-700 text-center font-bold w-24">Day</th>
                            {activePrintDoc.timeSlots.map((slot) => (
                              <th
                                key={slot.id}
                                className={`p-2 border border-slate-700 text-center ${
                                  slot.isBreak ? 'bg-amber-950/70 text-amber-200 font-medium text-[10px]' : 'font-bold'
                                }`}
                              >
                                <div>{slot.periodName}</div>
                                <div className="text-[9px] font-mono text-slate-300 font-normal">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300 text-slate-800">
                          {days.map((day) => (
                            <tr key={day} className="hover:bg-slate-50/50">
                              <td className="p-2 border border-slate-300 font-bold bg-slate-100 text-slate-900 text-center">
                                {day}
                              </td>
                              {activePrintDoc.timeSlots.map((slot) => {
                                if (slot.isBreak) {
                                  return (
                                    <td
                                      key={slot.id}
                                      className="p-1 border border-slate-300 bg-amber-50/70 text-center text-[10px] font-semibold text-amber-900"
                                    >
                                      {slot.periodName}
                                    </td>
                                  );
                                }

                                const entry = activePrintDoc.entries.find(
                                  (e) =>
                                    e.division === activePrintDoc.division &&
                                    e.classGrade === activePrintDoc.classGrade &&
                                    e.day === day &&
                                    e.timeSlotId === slot.id
                                );

                                return (
                                  <td
                                    key={slot.id}
                                    className="p-1.5 border border-slate-300 align-top min-w-[100px]"
                                  >
                                    {entry ? (
                                      <div className="space-y-0.5">
                                        <div className="font-bold text-slate-900 leading-tight">
                                          {entry.subject}
                                        </div>
                                        {entry.teacherName && (
                                          <div className="text-[10px] text-blue-800 font-medium">
                                            {entry.teacherName}
                                          </div>
                                        )}
                                        {entry.roomNo && (
                                          <div className="text-[9px] text-slate-500 font-mono">
                                            📍 {entry.roomNo}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-center text-slate-300 text-[10px] py-2">
                                        —
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}

                {/* Important Notes & Instructions */}
                <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-200 text-xs text-blue-900 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-700" />
                    Student & Faculty Guidelines:
                  </div>
                  <p className="text-[11px] text-slate-700">
                    • Punctuality is strictly enforced. Students must be inside their respective lecture hall before bell chime.
                  </p>
                  <p className="text-[11px] text-slate-700">
                    • Laboratory practical sessions require white lab coats and standard laboratory manuals.
                  </p>
                </div>

                {/* Footer Signatures */}
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-slate-800">
                      Academic Coordinator
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Prepared By</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-bold text-blue-800">
                      Approved & Scheduled
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Status</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-900 font-bold">
                      Mudassar Asghar
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal / Administrator</span>
                  </div>
                </div>
              </div>
            )}

            {/* 6. TEACHER TIMETABLE */}
            {activePrintDoc.type === 'teacher_timetable' && (
              <div className="space-y-5">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-blue-900 font-bold uppercase tracking-widest mt-0.5">
                    Faculty Individual Teaching Schedule & Lecture Load
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Academic Year 2026-2027 • Main Campus • Reg # PSS-2026-HQ
                  </p>
                </div>

                {/* Faculty Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">Teacher Name:</span>
                    <strong className="text-sm font-bold text-slate-900">
                      {activePrintDoc.teacher.name}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Faculty Code:</span>
                    <strong className="text-sm font-mono font-bold text-blue-900">
                      {activePrintDoc.teacher.facultyCode}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Specialization:</span>
                    <strong className="text-slate-800 font-medium">
                      {activePrintDoc.teacher.subject}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Division:</span>
                    <strong className="text-blue-700 font-bold uppercase">
                      {activePrintDoc.teacher.division}
                    </strong>
                  </div>
                </div>

                {/* Weekly Grid */}
                {(() => {
                  const days: DayOfWeek[] = activePrintDoc.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                  const teacherId = activePrintDoc.teacher.id;
                  const teacherName = activePrintDoc.teacher.name;

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse border border-slate-300">
                        <thead className="bg-slate-900 text-white">
                          <tr>
                            <th className="p-2 border border-slate-700 text-center font-bold w-24">Day</th>
                            {activePrintDoc.timeSlots.map((slot) => (
                              <th
                                key={slot.id}
                                className={`p-2 border border-slate-700 text-center ${
                                  slot.isBreak ? 'bg-amber-950/70 text-amber-200 font-medium text-[10px]' : 'font-bold'
                                }`}
                              >
                                <div>{slot.periodName}</div>
                                <div className="text-[9px] font-mono text-slate-300 font-normal">
                                  {slot.startTime} - {slot.endTime}
                                </div>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-300 text-slate-800">
                          {days.map((day) => (
                            <tr key={day} className="hover:bg-slate-50/50">
                              <td className="p-2 border border-slate-300 font-bold bg-slate-100 text-slate-900 text-center">
                                {day}
                              </td>
                              {activePrintDoc.timeSlots.map((slot) => {
                                if (slot.isBreak) {
                                  return (
                                    <td
                                      key={slot.id}
                                      className="p-1 border border-slate-300 bg-amber-50/70 text-center text-[10px] font-semibold text-amber-900"
                                    >
                                      {slot.periodName}
                                    </td>
                                  );
                                }

                                const entry = activePrintDoc.entries.find(
                                  (e) =>
                                    (e.teacherId === teacherId || e.teacherName === teacherName) &&
                                    e.day === day &&
                                    e.timeSlotId === slot.id
                                );

                                return (
                                  <td
                                    key={slot.id}
                                    className="p-1.5 border border-slate-300 align-top min-w-[100px]"
                                  >
                                    {entry ? (
                                      <div className="space-y-0.5">
                                        <div className="font-bold text-blue-900 leading-tight">
                                          {entry.classGrade}
                                        </div>
                                        <div className="text-[10px] text-slate-700 font-medium">
                                          {entry.subject}
                                        </div>
                                        {entry.roomNo && (
                                          <div className="text-[9px] text-slate-500 font-mono">
                                            📍 {entry.roomNo}
                                          </div>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="text-center text-slate-300 text-[10px] py-2">
                                        Free Period
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}

                {/* Footer Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-800">
                      {activePrintDoc.teacher.name}
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Faculty Member Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-900 font-bold">
                      Mudassar Asghar
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal / Academic Dean</span>
                  </div>
                </div>
              </div>
            )}

            {/* 7. MASTER TIMETABLE */}
            {activePrintDoc.type === 'master_timetable' && (
              <div className="space-y-5">
                {/* Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-blue-900 font-bold uppercase tracking-widest mt-0.5">
                    Master Institutional Timetable & Lecture Schedule ({activePrintDoc.division} Division)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Academic Year 2026-2027 • Main Campus • Reg # PSS-2026-HQ
                  </p>
                </div>

                {/* Master Grid per day */}
                {(() => {
                  const days: DayOfWeek[] = activePrintDoc.days || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

                  return (
                    <div className="space-y-6">
                      {days.map((day) => (
                        <div key={day} className="border border-slate-300 rounded-xl overflow-hidden">
                          <div className="bg-slate-900 text-white px-3 py-1.5 font-bold text-xs flex justify-between items-center">
                            <span>{day.toUpperCase()} MASTER SCHEDULE</span>
                            <span className="text-[10px] text-amber-300 font-mono">{activePrintDoc.division} Division</span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-left text-[11px] border-collapse">
                              <thead className="bg-slate-100 text-slate-700">
                                <tr>
                                  <th className="p-2 border border-slate-200 font-bold w-28">Class / Grade</th>
                                  {activePrintDoc.timeSlots.map((slot) => (
                                    <th
                                      key={slot.id}
                                      className={`p-1.5 border border-slate-200 text-center ${
                                        slot.isBreak ? 'bg-amber-100/70 text-amber-900 text-[9px]' : 'font-bold'
                                      }`}
                                    >
                                      <div>{slot.periodName}</div>
                                      <div className="text-[8px] font-mono text-slate-500 font-normal">
                                        {slot.startTime}
                                      </div>
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-200">
                                {activePrintDoc.classGrades.map((cls) => (
                                  <tr key={cls} className="hover:bg-slate-50">
                                    <td className="p-2 border border-slate-200 font-bold text-slate-900 bg-slate-50">
                                      {cls}
                                    </td>
                                    {activePrintDoc.timeSlots.map((slot) => {
                                      if (slot.isBreak) {
                                        return (
                                          <td key={slot.id} className="p-1 border border-slate-200 bg-amber-50 text-center text-[9px] text-amber-800">
                                            {slot.periodName}
                                          </td>
                                        );
                                      }

                                      const entry = activePrintDoc.entries.find(
                                        (e) =>
                                          e.division === activePrintDoc.division &&
                                          e.classGrade === cls &&
                                          e.day === day &&
                                          e.timeSlotId === slot.id
                                      );

                                      return (
                                        <td key={slot.id} className="p-1 border border-slate-200 align-top">
                                          {entry ? (
                                            <div>
                                              <div className="font-bold text-slate-900 text-[10px] leading-tight">
                                                {entry.subject}
                                              </div>
                                              {entry.teacherName && (
                                                <div className="text-[8px] text-blue-700 truncate">
                                                  {entry.teacherName}
                                                </div>
                                              )}
                                            </div>
                                          ) : (
                                            <div className="text-center text-slate-300 text-[9px]">—</div>
                                          )}
                                        </td>
                                      );
                                    })}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Footer Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-800">
                      Dean of Academics
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Academic Committee</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-900 font-bold">
                      Mudassar Asghar
                    </div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal Signature & Official Seal</span>
                  </div>
                </div>
              </div>
            )}

            {/* 8. CHARACTER & CONDUCT CERTIFICATE */}
            {activePrintDoc.type === 'character_certificate' && (
              <div className="p-8 border-8 border-double border-amber-900/40 rounded-3xl bg-gradient-to-b from-amber-50/20 via-white to-amber-50/30 text-slate-900 relative">
                {/* Certificate Seal Watermark Background */}
                <div className="text-center border-b-2 border-slate-900 pb-6 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-tr from-blue-900 to-indigo-950 text-amber-400 font-black rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-md border-2 border-amber-400/50">
                    PS
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 uppercase font-serif">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mt-1">
                    Recognized Institution of High Academic Distinction • Main Campus
                  </p>
                  <div className="mt-4 inline-block bg-slate-900 text-amber-300 font-bold text-sm sm:text-base px-6 py-1.5 rounded-full uppercase tracking-widest shadow-sm">
                    Character & Conduct Certificate
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs font-mono text-slate-600 mb-6 px-2">
                  <span>Ref No: <strong>PSS/CC/2026/{(activePrintDoc.student.rollNo || '101').padStart(4, '0')}</strong></span>
                  <span>Issue Date: <strong>{activePrintDoc.issueDate || new Date().toISOString().split('T')[0]}</strong></span>
                </div>

                {/* Certificate Body */}
                <div className="space-y-6 text-sm sm:text-base text-slate-800 leading-relaxed font-serif text-justify px-2 sm:px-6">
                  <p>
                    This is to certify that Mr. / Ms.{' '}
                    <strong className="underline underline-offset-4 font-sans font-bold text-slate-950 uppercase">
                      {activePrintDoc.student.name}
                    </strong>
                    , son/daughter of{' '}
                    <strong className="underline underline-offset-4 font-sans font-bold text-slate-950 uppercase">
                      {activePrintDoc.student.fatherName}
                    </strong>
                    , bearing Institutional Roll / Reg No.{' '}
                    <strong className="underline underline-offset-4 font-sans font-bold font-mono text-blue-900">
                      {activePrintDoc.student.rollNo}
                    </strong>
                    , has been a regular student of this institution in{' '}
                    <strong className="underline underline-offset-4 font-sans font-bold text-slate-950">
                      {activePrintDoc.student.classGrade}
                    </strong>{' '}
                    under the{' '}
                    <strong className="underline underline-offset-4 font-sans font-bold text-blue-800">
                      {activePrintDoc.student.division === 'School' ? 'School Wing' : 'Science Academy'}
                    </strong>.
                  </p>

                  <p>
                    During the period of their studies, their moral character, discipline, and academic attitude were found to be{' '}
                    <strong className="text-emerald-800 font-bold uppercase">EXEMPLARY & COMMENDABLE</strong>. They actively participated in co-curricular scientific endeavors and adhered strictly to the campus code of conduct.
                  </p>

                  <p>
                    We wish them tremendous success in all their future academic and professional pursuits.
                  </p>
                </div>

                {/* Certificate Signatures */}
                <div className="grid grid-cols-2 gap-12 pt-12 mt-8 border-t border-slate-300 text-xs">
                  <div className="text-center">
                    <div className="border-b-2 border-slate-400 pb-1 mb-1 font-serif italic text-slate-500 font-bold">
                      Academic Controller
                    </div>
                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Controller of Examinations</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b-2 border-slate-900 pb-1 mb-1 font-serif italic text-slate-950 font-black text-sm">
                      Mudassar Asghar
                    </div>
                    <span className="text-[10px] text-slate-600 uppercase font-bold tracking-wider">Principal / Head of Institution</span>
                  </div>
                </div>
              </div>
            )}

            {/* 9. SCHOOL LEAVING CERTIFICATE (SLC) */}
            {activePrintDoc.type === 'leaving_certificate' && (
              <div className="p-8 border-4 border-slate-800 rounded-3xl bg-white text-slate-900 relative">
                <div className="text-center border-b-2 border-slate-900 pb-4 mb-6">
                  <div className="w-14 h-14 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-xl mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mt-0.5">
                    Official School Leaving & Migration Transfer Certificate (SLC)
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Registration No: PSS-2026-SLC-{(activePrintDoc.student.rollNo || '001').padStart(4, '0')}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs p-4 bg-slate-50 rounded-2xl border border-slate-200 mb-6">
                  <div>
                    <span className="text-slate-500 block font-semibold">1. Student Full Name:</span>
                    <strong className="text-sm font-bold text-slate-900 uppercase">{activePrintDoc.student.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">2. Father's Name:</span>
                    <strong className="text-sm font-bold text-slate-900 uppercase">{activePrintDoc.student.fatherName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">3. Institutional Roll No:</span>
                    <strong className="text-sm font-mono font-bold text-blue-900">{activePrintDoc.student.rollNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">4. Date of Admission:</span>
                    <strong className="text-slate-800 font-mono">{activePrintDoc.student.admissionDate || '2025-08-15'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">5. Class at Time of Leaving:</span>
                    <strong className="text-slate-900">{activePrintDoc.student.classGrade} ({activePrintDoc.student.division})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">6. Date of School Leaving:</span>
                    <strong className="text-slate-800 font-mono">{activePrintDoc.issueDate || new Date().toISOString().split('T')[0]}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">7. Institutional Dues Status:</span>
                    <strong className="text-emerald-700 font-bold">ALL DUES CLEARED & SETTLED</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block font-semibold">8. General Conduct / Behavior:</span>
                    <strong className="text-slate-900 font-bold">Satisfactory & Good</strong>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-900 mb-6">
                  <span className="font-bold">Reason for Leaving: </span>
                  <span>{activePrintDoc.leavingReason || 'Completion of Academic Session / Parents Relocation'}</span>
                </div>

                <div className="grid grid-cols-3 gap-6 pt-8 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-400">Class Incharge</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Class Teacher</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-400">Office Clerk</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Checked By</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-900 pb-1 mb-1 font-serif italic text-slate-900 font-bold">Mudassar Asghar</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal Signature & Stamp</span>
                  </div>
                </div>
              </div>
            )}

            {/* 10. EXAM ADMIT CARD / ROLL NUMBER SLIP */}
            {activePrintDoc.type === 'admit_card' && (
              <div className="space-y-6">
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-blue-900 font-bold uppercase tracking-widest mt-0.5">
                    Official Examination Admit Card & Roll Number Slip
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    {activePrintDoc.examTitle || 'Mid Term Examination Session 2026-2027'}
                  </p>
                </div>

                {/* Candidate & Photo Header */}
                <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 items-center justify-between">
                  <div className="grid grid-cols-2 gap-3 text-xs flex-1">
                    <div>
                      <span className="text-slate-400 block font-semibold">Student Name:</span>
                      <strong className="text-sm font-bold text-slate-900 uppercase">{activePrintDoc.student.name}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Father's Name:</span>
                      <strong className="text-sm font-bold text-slate-900 uppercase">{activePrintDoc.student.fatherName}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Roll Number:</span>
                      <strong className="text-base font-mono font-black text-blue-900">#{activePrintDoc.student.rollNo}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold">Class / Division:</span>
                      <strong className="text-slate-900">{activePrintDoc.student.classGrade} ({activePrintDoc.student.division})</strong>
                    </div>
                  </div>
                  <div className="w-20 h-24 bg-slate-200 border-2 border-dashed border-slate-400 rounded-xl flex flex-col items-center justify-center text-[10px] text-slate-400 font-bold shrink-0 uppercase text-center p-1">
                    Passport Photo
                  </div>
                </div>

                {/* Date Sheet Schedule */}
                <div>
                  <h4 className="text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">Examination Date Sheet & Timetable:</h4>
                  <table className="w-full text-left text-xs border-collapse border border-slate-300">
                    <thead className="bg-slate-900 text-white font-bold">
                      <tr>
                        <th className="p-2 border border-slate-700">Date & Day</th>
                        <th className="p-2 border border-slate-700">Subject Paper</th>
                        <th className="p-2 border border-slate-700 text-center">Timing</th>
                        <th className="p-2 border border-slate-700 text-center">Hall / Room</th>
                        <th className="p-2 border border-slate-700 text-center">Invigilator Sign</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {activePrintDoc.testSchedules && activePrintDoc.testSchedules.length > 0 ? (
                        activePrintDoc.testSchedules.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50">
                            <td className="p-2 border border-slate-200 font-mono font-bold">{t.testDate}</td>
                            <td className="p-2 border border-slate-200 font-bold text-slate-900">{t.subject}</td>
                            <td className="p-2 border border-slate-200 text-center font-mono">{t.startTime || '09:00 AM'}</td>
                            <td className="p-2 border border-slate-200 text-center font-mono font-semibold">{t.roomNo || 'Room 1'}</td>
                            <td className="p-2 border border-slate-200 text-center text-slate-300">__________</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-4 text-center text-slate-400 italic">No scheduled tests logged for this class.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Exam Hall Rules */}
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-0.5">
                  <div className="font-bold uppercase tracking-wide">Important Exam Instructions:</div>
                  <p>1. Candidates must bring this original admit card to every paper.</p>
                  <p>2. Electronic gadgets, smart watches, and mobile phones are strictly prohibited in the exam hall.</p>
                  <p>3. Candidates arriving 15 minutes after paper commencement will not be seated.</p>
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-400">Student Signature</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Candidate Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-900 pb-1 mb-1 font-serif italic text-slate-900 font-bold">Mudassar Asghar</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Controller of Examinations</span>
                  </div>
                </div>
              </div>
            )}

            {/* 11. OFFICIAL FEE REMINDER NOTICE */}
            {activePrintDoc.type === 'fee_reminder_notice' && (
              <div className="space-y-6">
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-rose-700 font-bold uppercase tracking-widest mt-0.5">
                    Official Accounts Notice • Outstanding Tuition Fee Reminder
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Main Campus Accounts & Finance Office • Contact: 0300-1234567
                  </p>
                </div>

                <div className="flex justify-between items-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-semibold">Notice Ref No:</span>
                    <strong className="text-slate-900 font-mono">PSS/FEE/{(activePrintDoc.student.rollNo || '101')}/2026</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block font-semibold">Issue Date:</span>
                    <strong className="text-slate-900 font-mono">{new Date().toISOString().split('T')[0]}</strong>
                  </div>
                </div>

                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-2xl space-y-3 text-xs sm:text-sm text-slate-800">
                  <p className="font-bold text-slate-900">
                    To the Respected Parents / Guardian of:
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-rose-200">
                    <div>Student Name: <strong className="text-slate-900 uppercase font-bold">{activePrintDoc.student.name}</strong></div>
                    <div>Roll Number: <strong className="font-mono font-bold text-blue-900">#{activePrintDoc.student.rollNo}</strong></div>
                    <div>Class / Program: <strong className="text-slate-900">{activePrintDoc.student.classGrade}</strong></div>
                    <div>Parent Contact: <strong className="font-mono text-slate-900">{activePrintDoc.student.parentContact}</strong></div>
                  </div>

                  <p className="leading-relaxed">
                    This is a courteous reminder from the campus accounts department regarding outstanding session tuition and academic maintenance dues. Our digital records indicate an outstanding balance of:
                  </p>

                  <div className="p-4 bg-white rounded-xl border border-rose-300 text-center">
                    <span className="text-xs text-slate-500 font-bold uppercase block mb-1">Total Outstanding Fee Balance Due:</span>
                    <span className="text-2xl sm:text-3xl font-black text-rose-700 font-mono">
                      Rs. {(activePrintDoc.dueAmount || 0).toLocaleString()}
                    </span>
                  </div>

                  <p className="leading-relaxed text-xs">
                    You are kindly requested to submit the balance at the campus accounts counter or online bank channel by or before{' '}
                    <strong className="underline text-slate-900 font-mono font-bold">{activePrintDoc.dueDate || 'End of Current Month'}</strong> to ensure uninterrupted class attendance and admit card issuance for upcoming examinations.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-400">Accounts Officer</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Campus Bursar</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-900 pb-1 mb-1 font-serif italic text-slate-900 font-bold">Mudassar Asghar</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal / Administrator</span>
                  </div>
                </div>
              </div>
            )}

            {/* 12. TEACHER IDENTITY CARD */}
            {activePrintDoc.type === 'teacher_id_card' && (
              <div className="max-w-sm mx-auto border-2 border-indigo-900 rounded-2xl p-4 bg-gradient-to-b from-indigo-900/10 via-white to-amber-500/10 shadow-md">
                <div className="text-center border-b border-indigo-900 pb-2 mb-3">
                  <h2 className="text-xs font-black text-indigo-950 tracking-wider uppercase">
                    Premier School System & Science Academy
                  </h2>
                  <p className="text-[9px] font-bold text-indigo-800 uppercase">
                    Official Faculty Identification Card • 2026-2027
                  </p>
                </div>

                <div className="flex gap-3 items-center mb-3">
                  <div className="w-16 h-20 bg-slate-200 border border-slate-300 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs uppercase overflow-hidden shrink-0">
                    PHOTO
                  </div>
                  <div className="text-xs space-y-0.5 min-w-0">
                    <h3 className="font-extrabold text-slate-900 truncate uppercase text-sm">
                      {activePrintDoc.teacher.name}
                    </h3>
                    <p className="text-indigo-900 font-bold text-[11px]">
                      {activePrintDoc.teacher.facultyCode} • Faculty
                    </p>
                    <p className="text-slate-700 font-medium text-[11px]">
                      {activePrintDoc.teacher.qualification}
                    </p>
                    <p className="text-slate-800 font-bold text-[11px]">
                      {activePrintDoc.teacher.subject}
                    </p>
                    <p className="text-slate-500 text-[10px] font-mono">
                      Contact: {activePrintDoc.teacher.mobileNumber}
                    </p>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-2 flex justify-between items-end text-[9px] text-slate-500">
                  <div>
                    <span className="block font-mono font-bold text-slate-800">
                      Join: {activePrintDoc.teacher.joiningDate || '2024'}
                    </span>
                    <span>Status: {activePrintDoc.teacher.status}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-serif italic font-bold text-slate-900 block">
                      Mudassar Asghar
                    </span>
                    <span className="uppercase text-[8px] font-bold">Principal Signature</span>
                  </div>
                </div>
              </div>
            )}

            {/* 13. CLASS ATTENDANCE REGISTER SHEET */}
            {activePrintDoc.type === 'attendance_register_sheet' && (
              <div className="space-y-4">
                <div className="text-center border-b-2 border-slate-900 pb-3">
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h1>
                  <p className="text-xs text-blue-900 font-bold uppercase tracking-widest">
                    Monthly Student Attendance Ledger & Register Sheet ({activePrintDoc.division})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Class: <strong>{activePrintDoc.classGrade}</strong> • Month: <strong>{activePrintDoc.month}</strong> • Academic Session 2026-2027
                  </p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[10px] border-collapse border border-slate-400">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="p-1.5 border border-slate-600 text-center w-10">Roll</th>
                        <th className="p-1.5 border border-slate-600 w-36">Student Name</th>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                          <th key={d} className="p-1 border border-slate-600 text-center w-5 font-mono">
                            {d}
                          </th>
                        ))}
                        <th className="p-1 border border-slate-600 text-center bg-emerald-950 text-emerald-200">P</th>
                        <th className="p-1 border border-slate-600 text-center bg-rose-950 text-rose-200">A</th>
                        <th className="p-1 border border-slate-600 text-center bg-amber-950 text-amber-200">%</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300">
                      {activePrintDoc.students.map((st) => {
                        const stRecords = activePrintDoc.attendance.filter((a) => a.studentId === st.id);
                        const pCount = stRecords.filter((a) => a.status === 'Present').length;
                        const aCount = stRecords.filter((a) => a.status === 'Absent').length;
                        const total = stRecords.length || 1;
                        const pct = Math.round((pCount / total) * 100);

                        return (
                          <tr key={st.id} className="hover:bg-slate-50">
                            <td className="p-1 border border-slate-300 text-center font-mono font-bold text-slate-900">
                              {st.rollNo}
                            </td>
                            <td className="p-1 border border-slate-300 font-bold text-slate-900 truncate max-w-[140px]">
                              {st.name}
                            </td>
                            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => {
                              const dayStr = d < 10 ? `0${d}` : `${d}`;
                              const found = stRecords.find((a) => a.date.endsWith(`-${dayStr}`));
                              return (
                                <td key={d} className="p-0.5 border border-slate-300 text-center font-bold font-mono">
                                  {found ? (
                                    found.status === 'Present' ? (
                                      <span className="text-emerald-700">P</span>
                                    ) : found.status === 'Absent' ? (
                                      <span className="text-rose-700">A</span>
                                    ) : (
                                      <span className="text-amber-700">L</span>
                                    )
                                  ) : (
                                    <span className="text-slate-300">·</span>
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-1 border border-slate-300 text-center font-mono font-bold text-emerald-700 bg-emerald-50">
                              {pCount}
                            </td>
                            <td className="p-1 border border-slate-300 text-center font-mono font-bold text-rose-700 bg-rose-50">
                              {aCount}
                            </td>
                            <td className="p-1 border border-slate-300 text-center font-mono font-bold text-slate-900 bg-slate-100">
                              {pct}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200 text-xs">
                  <div className="text-center">
                    <div className="border-b border-slate-400 pb-1 mb-1 font-serif italic text-slate-400">Class Teacher Incharge</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Class Teacher Signature</span>
                  </div>
                  <div className="text-center">
                    <div className="border-b border-slate-900 pb-1 mb-1 font-serif italic text-slate-900 font-bold">Mudassar Asghar</div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Principal Signature & Stamp</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
};
