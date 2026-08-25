import React from 'react';
import {
  Search,
  Plus,
  Receipt,
  Download,
  ShieldCheck,
  Clock,
  Menu,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenAddStudent: () => void;
  onOpenCollectFee: () => void;
  onOpenBackup: () => void;
  toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSearch,
  onOpenAddStudent,
  onOpenCollectFee,
  onOpenBackup,
  toggleSidebar
}) => {
  const { stats, todayDateStr } = useSchool();

  const formattedDate = new Date().toLocaleDateString('en-PK', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Left Brand / Mobile Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-amber-500 p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-amber-400" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-sm sm:text-base tracking-tight text-white leading-tight">
                    PREMIER SCHOOL SYSTEM
                  </h1>
                  <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Science Academy
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block font-medium">
                  Smart Digital Campus & Academic Management System
                </p>
              </div>
            </div>
          </div>

          {/* Center Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <button
              onClick={onOpenSearch}
              className="w-full flex items-center justify-between px-3.5 py-2 text-xs sm:text-sm bg-slate-800/90 hover:bg-slate-800 text-slate-300 rounded-xl border border-slate-700/80 shadow-inner group transition-all"
            >
              <div className="flex items-center gap-2 truncate">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
                <span className="truncate">Search students, roll no, teachers, phone...</span>
              </div>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-900 border border-slate-700 rounded-md">
                /
              </kbd>
            </button>
          </div>

          {/* Right Actions & Clock */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Clock & Safe Data Status */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-800/80 rounded-lg border border-slate-700/60 text-xs">
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-slate-300 font-medium">{formattedDate}</span>
              <span className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-emerald-400 font-semibold text-[11px]">Data Safe</span>
            </div>

            {/* Quick Fee Collection Button */}
            <button
              onClick={onOpenCollectFee}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm transition-all active:scale-95"
              title="Collect Student Fee"
            >
              <Receipt className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Collect Fee</span>
            </button>

            {/* Quick Add Student */}
            <button
              onClick={onOpenAddStudent}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-blue-600 hover:bg-blue-500 text-white shadow-sm transition-all active:scale-95"
              title="Enroll New Student"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Admission</span>
            </button>

            {/* Backup & Data Protection Trigger */}
            <button
              onClick={onOpenBackup}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700/80 transition-colors"
              title="Digital Data Protection & Safe Backup"
            >
              <ShieldCheck className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
