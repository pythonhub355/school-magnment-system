import React, { useState } from 'react';
import {
  Wallet,
  Plus,
  Search,
  DollarSign,
  TrendingDown,
  Receipt,
  Calendar,
  Trash2,
  Filter,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { ExpenseCategory, ExpenseItem } from '../types';
import { ConfirmModal } from './ConfirmModal';

interface ExpensesViewProps {
  onOpenAddExpense: () => void;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({ onOpenAddExpense }) => {
  const { expenses, deleteExpense, stats, todayDateStr } = useSchool();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Confirm delete expense
  const [confirmDeleteExpense, setConfirmDeleteExpense] = useState<{ id: string; voucherNo: string; amount: number } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleConfirmDelete = () => {
    if (!confirmDeleteExpense) return;
    deleteExpense(confirmDeleteExpense.id);
    showToast(`Expense voucher ${confirmDeleteExpense.voucherNo} removed.`);
    setConfirmDeleteExpense(null);
  };

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

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.voucherNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;

    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <Wallet className="w-6 h-6 text-purple-600" />
            School Daily Expenses & Petty Cash Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Track daily generator fuel, science lab consumables, staff tea, maintenance, and examination printing
          </p>
        </div>

        <button
          onClick={onOpenAddExpense}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-purple-900/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Record Daily Expense
        </button>
      </div>

      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-slate-400">Total Expenses (All-Time)</span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            Rs. {stats.totalExpensesAllTime.toLocaleString()}
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            {expenses.length} official vouchers recorded
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-purple-200 bg-purple-50/20 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-purple-700">Today's Daily Expense</span>
          <div className="text-2xl font-black text-purple-700 mt-1">
            Rs. {stats.todayExpenses.toLocaleString()}
          </div>
          <span className="text-xs text-purple-600 font-semibold mt-1 block">
            Disbursed on campus today ({todayDateStr})
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 shadow-sm">
          <span className="text-[11px] font-bold uppercase text-emerald-700">Net Campus Cash in Hand</span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            Rs. {stats.netCashBalance.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Total Collections − Total Expenses
          </span>
        </div>

      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Voucher #, Description, Paid To..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-purple-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500 font-medium">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 font-bold text-slate-800 focus:outline-none"
          >
            <option value="All">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3.5">Voucher #</th>
                <th className="px-4 py-3.5">Date</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Description</th>
                <th className="px-4 py-3.5">Paid To</th>
                <th className="px-4 py-3.5">Amount (PKR)</th>
                <th className="px-4 py-3.5">Mode</th>
                <th className="px-4 py-3.5">Approved By</th>
                <th className="px-4 py-3.5 text-right">Delete</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-purple-50/20 transition-colors">
                    <td className="px-4 py-3.5 font-mono font-bold text-purple-900">
                      {exp.voucherNo}
                    </td>
                    <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                      {exp.date}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-medium text-slate-900 max-w-xs truncate">
                      {exp.description}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-700">
                      {exp.paidTo}
                    </td>
                    <td className="px-4 py-3.5 font-mono font-bold text-rose-600">
                      Rs. {exp.amount.toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {exp.paymentMode}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500">
                      {exp.approvedBy}
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button
                        onClick={() =>
                          setConfirmDeleteExpense({
                            id: exp.id,
                            voucherNo: exp.voucherNo,
                            amount: exp.amount
                          })
                        }
                        className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete Voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No expense vouchers recorded for the selected filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Expense Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteExpense}
        onClose={() => setConfirmDeleteExpense(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Expense Voucher"
        message={`Are you sure you want to remove expense voucher "${confirmDeleteExpense?.voucherNo}" (Rs. ${confirmDeleteExpense?.amount.toLocaleString()})?`}
        confirmText="Yes, Delete Voucher"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

    </div>
  );
};
