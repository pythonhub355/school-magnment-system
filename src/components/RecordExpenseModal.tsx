import React, { useState } from 'react';
import {
  X,
  Wallet,
  DollarSign,
  Calendar,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { ExpenseCategory } from '../types';

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordExpenseModal: React.FC<RecordExpenseModalProps> = ({
  isOpen,
  onClose
}) => {
  const { recordExpense, todayDateStr } = useSchool();

  const categories: ExpenseCategory[] = [
    'Electricity & Utility',
    'Stationery & Printing',
    'Science Lab Supplies',
    'Staff Refreshments',
    'Building Maintenance',
    'Building Rent',
    'Examination Papers',
    'Sports & Activities',
    'Advertising & Prospectus',
    'Miscellaneous'
  ];

  const [formData, setFormData] = useState({
    category: 'Electricity & Utility' as ExpenseCategory,
    description: '',
    amount: 1500,
    paidTo: '',
    date: todayDateStr,
    paymentMode: 'Cash' as const,
    approvedBy: 'Mudassar Asghar (Principal)'
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0 || !formData.description) return;

    recordExpense(formData);
    onClose();
    setFormData({
      category: 'Electricity & Utility',
      description: '',
      amount: 1500,
      paidTo: '',
      date: todayDateStr,
      paymentMode: 'Cash',
      approvedBy: 'Mudassar Asghar (Principal)'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 bg-purple-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-purple-300" />
            <div>
              <h3 className="font-extrabold text-base">Record Daily School Expense</h3>
              <p className="text-[11px] text-purple-200">
                Official Campus Petty Cash & Operational Outflow Voucher
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-purple-200 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs sm:text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Expense Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Disbursement Date</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-bold mb-1">Expense Description / Purpose</label>
            <input
              type="text"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              placeholder="e.g. Generator diesel 20 Litres / Whiteboard markers 1 box"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Amount (PKR)</label>
              <input
                type="number"
                min="1"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-base font-extrabold text-slate-900 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Paid To (Vendor / Person)</label>
              <input
                type="text"
                value={formData.paidTo}
                onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
                required
                placeholder="e.g. Shell Filling Station / Stationery Depot"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 font-bold mb-1">Payment Mode</label>
              <select
                value={formData.paymentMode}
                onChange={(e) => setFormData({ ...formData, paymentMode: e.target.value as any })}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-800"
              >
                <option value="Cash">Cash</option>
                <option value="Online">Online / Bank</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Approved By</label>
              <input
                type="text"
                value={formData.approvedBy}
                onChange={(e) => setFormData({ ...formData, approvedBy: e.target.value })}
                required
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-purple-900/20"
            >
              Record Voucher
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
