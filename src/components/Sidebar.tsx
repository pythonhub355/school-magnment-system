import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Atom,
  CalendarCheck,
  Calendar,
  Receipt,
  Users,
  Wallet,
  FileSpreadsheet,
  Megaphone,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export type TabType =
  | 'dashboard'
  | 'students-school'
  | 'students-academy'
  | 'attendance'
  | 'timetable'
  | 'fees'
  | 'teachers'
  | 'expenses'
  | 'tests'
  | 'parents'
  | 'backup';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  setIsOpen,
  isCollapsed,
  setIsCollapsed
}) => {
  const { stats } = useSchool();

  const navItems = [
    {
      group: 'Overview',
      items: [
        {
          id: 'dashboard' as TabType,
          label: 'Executive Dashboard',
          icon: LayoutDashboard,
          badge: null
        }
      ]
    },
    {
      group: 'Students & Enrollment',
      items: [
        {
          id: 'students-school' as TabType,
          label: 'School Division',
          icon: GraduationCap,
          badge: `${stats.schoolStudents} Std`
        },
        {
          id: 'students-academy' as TabType,
          label: 'Science Academy',
          icon: Atom,
          badge: `${stats.academyStudents} Std`,
          highlight: true
        }
      ]
    },
    {
      group: 'Daily Operations',
      items: [
        {
          id: 'attendance' as TabType,
          label: 'Daily Attendance',
          icon: CalendarCheck,
          badge: `${stats.todayAttendanceRate}% Today`
        },
        {
          id: 'timetable' as TabType,
          label: 'Class Timetables',
          icon: Calendar,
          badge: 'Schedules'
        },
        {
          id: 'fees' as TabType,
          label: 'Fee Submissions',
          icon: Receipt,
          badge: stats.totalPendingDues > 0 ? 'Dues Pending' : 'Paid',
          badgeColor: stats.totalPendingDues > 0 ? 'rose' : 'emerald'
        },
        {
          id: 'expenses' as TabType,
          label: 'Daily Expenses',
          icon: Wallet,
          badge: null
        }
      ]
    },
    {
      group: 'Faculty & Academics',
      items: [
        {
          id: 'teachers' as TabType,
          label: 'Teachers & Payroll',
          icon: Users,
          badge: `${stats.totalTeachers} Staff`
        },
        {
          id: 'tests' as TabType,
          label: 'Tests & Progress DMC',
          icon: FileSpreadsheet,
          badge: 'Reports'
        },
        {
          id: 'parents' as TabType,
          label: 'Parents Notices & PTM',
          icon: Megaphone,
          badge: 'Broadcast'
        }
      ]
    },
    {
      group: 'System & Security',
      items: [
        {
          id: 'backup' as TabType,
          label: 'Digital Data Safe',
          icon: ShieldCheck,
          badge: '100% Safe'
        }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col bg-slate-950 text-slate-300 border-r border-slate-800 transition-all duration-300 ease-in-out lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'w-20' : 'w-72'}`}
      >
        {/* Top Header / Collapse toggle */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 bg-slate-900/50">
          {!isCollapsed && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm text-sm">
                PS
              </div>
              <div className="leading-tight">
                <span className="text-xs font-bold tracking-tight text-white block">
                  PREMIER PORTAL
                </span>
                <span className="text-[10px] text-amber-400 font-semibold block">
                  Science Academy
                </span>
              </div>
            </div>
          )}

          {isCollapsed && (
            <div className="mx-auto w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
              PS
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  {group.group}
                </p>
              )}
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setIsOpen(false);
                    }}
                    title={isCollapsed ? item.label : undefined}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-150 group relative ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                        isActive ? 'text-white' : item.highlight ? 'text-amber-400' : 'text-slate-400 group-hover:text-blue-400'
                      }`}
                    />
                    {!isCollapsed && (
                      <div className="flex items-center justify-between flex-1 truncate text-left">
                        <span className="truncate">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-1.5 whitespace-nowrap ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : item.badgeColor === 'rose'
                                ? 'bg-rose-900/50 text-rose-300 border border-rose-800'
                                : item.badgeColor === 'emerald'
                                ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-800'
                                : item.highlight
                                ? 'bg-amber-900/40 text-amber-300 border border-amber-800/60'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Sidebar Footer with Developer credit */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950">
          {!isCollapsed ? (
            <div className="px-2 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold mb-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Premier Digital Campus</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Developed by{' '}
                <span className="text-white font-bold tracking-wide">
                  MA DEVELOPER
                </span>
              </p>
            </div>
          ) : (
            <div className="text-center py-1" title="Developed by MA DEVELOPER">
              <span className="text-[9px] font-black text-amber-400 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800/80">
                MA
              </span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
