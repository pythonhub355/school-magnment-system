import React, { useRef, useState } from 'react';
import {
  ShieldCheck,
  Download,
  Upload,
  RefreshCw,
  FileSpreadsheet,
  Database,
  Lock,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Code2,
  Receipt,
  Users,
  Briefcase,
  Layers,
  HardDriveDownload,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../context/SchoolContext';
import { ConfirmModal } from './ConfirmModal';

export const BackupView: React.FC = () => {
  const {
    students,
    teachers,
    attendance,
    teacherAttendance,
    fees,
    expenses,
    stats,
    exportFullDatabaseJSON,
    importDatabaseJSON,
    resetToFactoryData,
    exportStudentsCSV,
    exportFinancialCSV,
    exportSalariesCSV,
    exportComprehensiveCSV
  } = useSchool();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isConfirmResetOpen, setIsConfirmResetOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDownloadBackupJSON = () => {
    const jsonStr = exportFullDatabaseJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PREMIER_SCHOOL_BACKUP_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    showToast('Secure Full System Backup JSON downloaded successfully!');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const success = importDatabaseJSON(content);
        if (success) {
          confetti({ particleCount: 80, spread: 80, origin: { y: 0.5 } });
          showToast('Database successfully restored from backup file!');
        } else {
          showToast('Error: Invalid backup file format. Please use a valid Premier School JSON backup.');
        }
      } catch {
        showToast('Error: Failed to parse the uploaded file.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn max-w-6xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 text-[11px] font-extrabold uppercase tracking-wider rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
              Zero Physical Data Loss Guarantee
            </span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2.5">
            <ShieldCheck className="w-7 h-7 text-emerald-600" />
            Physical Redundancy & Data Download Center
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
            Export all student rosters, fee vouchers, campus expenses, and faculty payroll directly to standardized CSV spreadsheets and JSON files to maintain 100% physical offline redundancy and audit compliance.
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
          <div className="flex items-center gap-2 bg-emerald-50 px-3.5 py-1.5 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-bold">
            <Lock className="w-4 h-4 text-emerald-600" />
            Encrypted & Digitized
          </div>
          <span className="text-[11px] text-slate-400">Premier School System & Science Academy</span>
        </div>
      </div>

      {/* Overview Metric Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Enrolled Students</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{students.length} Records</div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-emerald-600 font-semibold">{stats.activeStudents} Active</span>
            <span className="text-amber-600 font-semibold">{stats.leftCampusStudents} Left Campus</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Faculty & Payroll</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{teachers.length} Faculty</div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-emerald-600 font-semibold">{stats.clearedSalaryTeachers} Cleared</span>
            <span className="text-rose-600 font-semibold">{stats.pendingSalaryTeachers} Pending</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Student Fee Clearance</span>
          <div className="text-2xl font-black text-slate-900 mt-1">Rs. {stats.totalFeesCollectedAllTime.toLocaleString()}</div>
          <div className="flex items-center justify-between text-xs mt-1">
            <span className="text-emerald-600 font-semibold">{stats.totalClearedStudents} Cleared</span>
            <span className="text-rose-600 font-semibold">{stats.totalPendingStudents} Defaulters</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Daily Attendance Registers</span>
          <div className="text-2xl font-black text-slate-900 mt-1">{attendance.length + teacherAttendance.length} Logs</div>
          <span className="text-xs text-blue-600 font-semibold mt-1 block">Full Student & Teacher Registers</span>
        </div>
      </div>

      {/* HIGHLIGHTED SECTION: Download Data for Physical Redundancy */}
      <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-blue-800/60 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-800/70 pb-5">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest mb-1">
                <HardDriveDownload className="w-4 h-4" />
                Physical Redundancy System
              </div>
              <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                Download Data (Spreadsheets & Offline Archives)
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl">
                Export instant CSV spreadsheets to open in Microsoft Excel, print hard copies for the principal office, or store on flash drives so campus data cannot be lost.
              </p>
            </div>

            {/* Master Consolidated Redundancy Download */}
            <button
              onClick={() => {
                exportComprehensiveCSV();
                showToast('Master Physical Redundancy CSV downloaded successfully!');
                confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
              }}
              className="px-5 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg shadow-amber-950/40 flex items-center gap-2.5 transition-all active:scale-95 shrink-0 cursor-pointer"
            >
              <Download className="w-5 h-5" />
              Download All Data (Master CSV)
            </button>
          </div>

          {/* 3 Dedicated CSV Download Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* 1. Students CSV */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-white">Student & Academic Ledger</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Exports Roll No, student & father names, class grade, parent contacts, total/paid fee, discount, pending dues, fee status (Cleared/Pending), attendance rate, and campus status (Active/Left Campus).
                </p>
              </div>

              <button
                onClick={() => {
                  exportStudentsCSV();
                  showToast('Student Directory CSV exported successfully!');
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download Students CSV
              </button>
            </div>

            {/* 2. Financial Ledger CSV */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center mb-3">
                  <Receipt className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-white">Financial Accounts & Expenses</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Exports complete fee collection vouchers, daily operational campus expenses, cash balances, and overall financial reconciliation audit ready for Excel.
                </p>
              </div>

              <button
                onClick={() => {
                  exportFinancialCSV();
                  showToast('Financial Ledger CSV exported successfully!');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download Finance CSV
              </button>
            </div>

            {/* 3. Faculty & Salaries CSV */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/15 flex flex-col justify-between space-y-4 hover:bg-white/15 transition-colors">
              <div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center mb-3">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h4 className="text-base font-extrabold text-white">Faculty Directory & Payroll</h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Exports faculty codes, teacher qualifications, subjects taught, monthly base salary, paid salary, pending salary, salary clearance status, reporting times, and contact numbers.
                </p>
              </div>

              <button
                onClick={() => {
                  exportSalariesCSV();
                  showToast('Faculty Payroll CSV exported successfully!');
                }}
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Download Faculty CSV
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* System JSON Backup & Restore Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Full JSON Export */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
              <Database className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Complete System Database Backup (JSON)
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Download a comprehensive raw JSON snapshot containing 100% of data tables: student profiles, teacher shifts, fee receipts, daily attendance timestamps, tests, marks, and parent announcements.
            </p>
          </div>

          <button
            onClick={handleDownloadBackupJSON}
            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4 text-blue-400" />
            Download Full Database JSON Archive
          </button>
        </div>

        {/* Restore JSON Backup */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-900">
              Restore System from Backup File
            </h3>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Seamlessly migrate or restore your entire school management system to any computer, browser, or device by uploading your previously saved Premier School System backup file.
            </p>
          </div>

          <div>
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              id="restore-upload-input"
            />
            <label
              htmlFor="restore-upload-input"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-center block"
            >
              <Upload className="w-4 h-4 inline" />
              Choose Backup File to Restore
            </label>
          </div>
        </div>

      </div>

      {/* Reset to Factory Data */}
      <div className="bg-white p-6 rounded-3xl border border-rose-200 bg-rose-50/20 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-700 font-bold text-xs mb-1">
            <AlertTriangle className="w-4 h-4" />
            System Reset Utility
          </div>
          <h4 className="text-base font-extrabold text-slate-900">
            Reset to Standard Demo Database
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            Restores the initial sample student, teacher, fee vouchers, and test schedules dataset.
          </p>
        </div>

        <button
          onClick={() => setIsConfirmResetOpen(true)}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Reset Demo Data
        </button>
      </div>

      {/* Reset Demo Data Confirm Modal */}
      <ConfirmModal
        isOpen={isConfirmResetOpen}
        onClose={() => setIsConfirmResetOpen(false)}
        onConfirm={() => {
          resetToFactoryData();
          showToast('System reset to default sample dataset.');
          setIsConfirmResetOpen(false);
        }}
        title="Reset System to Demo Data"
        message="Are you sure you want to reset the database to the default sample dataset? Any unsaved changes or new admissions will be overwritten."
        confirmText="Yes, Reset Database"
        cancelText="Cancel"
        variant="danger"
        icon="alert"
      />

      {/* Lead Developer Accreditation */}
      <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-black text-xs uppercase tracking-widest">
            <Code2 className="w-4 h-4" />
            Engineering & Security Integrity
          </div>
          <h4 className="text-lg font-black tracking-tight text-white">
            Premier School System & Science Academy Portal
          </h4>
          <p className="text-xs text-slate-400">
            Full digital records management with instant print vouchers, fee clearance trackers, and physical data redundancy.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 text-right self-start sm:self-auto">
          <span className="text-[10px] uppercase font-bold text-amber-300 block">Lead Software Engineer</span>
          <strong className="text-sm font-extrabold text-white">MA DEVELOPER</strong>
        </div>
      </div>

    </div>
  );
};

