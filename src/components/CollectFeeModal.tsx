import React, { useState, useEffect } from 'react';
import {
  X,
  Receipt,
  DollarSign,
  User,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../context/SchoolContext';
import { Student, PaymentMethod } from '../types';

interface CollectFeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStudent?: Student | null;
}

export const CollectFeeModal: React.FC<CollectFeeModalProps> = ({
  isOpen,
  onClose,
  initialStudent
}) => {
  const { students, recordFeePayment, setActivePrintDoc, todayDateStr } = useSchool();

  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialStudent?.id || students[0]?.id || ''
  );
  const [amountPaid, setAmountPaid] = useState<number>(5000);
  const [paymentDate, setPaymentDate] = useState<string>(todayDateStr);
  const [paymentMonth, setPaymentMonth] = useState<string>('August 2026');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [receivedBy, setReceivedBy] = useState<string>('Mudassar Asghar (Principal/Admin)');
  const [remarks, setRemarks] = useState<string>('Regular monthly tuition fee submission');

  useEffect(() => {
    if (initialStudent) {
      setSelectedStudentId(initialStudent.id);
      const pending = initialStudent.totalFee - initialStudent.paidFee - (initialStudent.discountFee || 0);
      setAmountPaid(pending > 0 ? pending : 5000);
    }
  }, [initialStudent, isOpen]);

  if (!isOpen) return null;

  const currentStudent = students.find((s) => s.id === selectedStudentId);
  const pendingBalance = currentStudent
    ? Math.max(0, currentStudent.totalFee - currentStudent.paidFee - (currentStudent.discountFee || 0))
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent || amountPaid <= 0) return;

    const receipt = recordFeePayment({
      studentId: currentStudent.id,
      amountPaid,
      paymentDate,
      paymentMonth,
      paymentMethod,
      receivedBy,
      remarks
    });

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Ask to print or show print doc
    setActivePrintDoc({
      type: 'fee_receipt',
      data: receipt,
      student: currentStudent
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-4 bg-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-extrabold text-base">Collect Student Fee Payment</h3>
              <p className="text-[11px] text-emerald-200">
                Official Receipt Issuance & Immediate Account Clearance
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-emerald-200 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs sm:text-sm">
          
          {/* Select Student */}
          <div>
            <label className="block text-slate-500 font-bold mb-1">Select Student</label>
            <select
              value={selectedStudentId}
              onChange={(e) => {
                const sId = e.target.value;
                setSelectedStudentId(sId);
                const s = students.find((st) => st.id === sId);
                if (s) {
                  const p = s.totalFee - s.paidFee - (s.discountFee || 0);
                  setAmountPaid(p > 0 ? p : 5000);
                }
              }}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900 focus:outline-none focus:border-emerald-500"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  #{st.rollNo} - {st.name} ({st.classGrade} - {st.division})
                </option>
              ))}
            </select>
          </div>

          {/* Student Dues Info Box */}
          {currentStudent && (
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-600">Total Enrolled Fee:</span>
                <strong className="text-slate-900 font-mono">Rs. {currentStudent.totalFee.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Amount Already Paid:</span>
                <strong className="text-emerald-700 font-mono">Rs. {currentStudent.paidFee.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between pt-1 border-t border-emerald-200 font-bold">
                <span className="text-slate-800">Current Outstanding Balance:</span>
                <strong className="text-rose-700 font-mono text-sm">
                  Rs. {pendingBalance.toLocaleString()}
                </strong>
              </div>
            </div>
          )}

          {/* Amount and Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Fee Amount Received (PKR)</label>
              <input
                type="number"
                min="1"
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-extrabold text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Payment Date</label>
              <input
                type="date"
                value={paymentDate}
                onChange={(e) => setPaymentDate(e.target.value)}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-medium"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Fee For Month / Session</label>
              <select
                value={paymentMonth}
                onChange={(e) => setPaymentMonth(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="August 2026">August 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="October 2026">October 2026</option>
                <option value="November 2026">November 2026</option>
                <option value="December 2026">December 2026</option>
                <option value="1st Term Fee">1st Term Examination Fee</option>
                <option value="Mid Term Fee">Mid Term Examination Fee</option>
                <option value="Annual / Registration Fee">Annual / Registration Fee</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Payment Mode</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="Cash">Cash at Counter</option>
                <option value="Online / Bank">Online / Bank Transfer</option>
                <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                <option value="Cheque">Bank Cheque</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Received / Authorized By</label>
            <input
              type="text"
              value={receivedBy}
              onChange={(e) => setReceivedBy(e.target.value)}
              required
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Receipt Remarks / Note</label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Paid in cash at accounts counter"
              className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-900/20 flex items-center gap-1.5 transition-all active:scale-95"
            >
              <Printer className="w-4 h-4" />
              Collect & Print Receipt
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
