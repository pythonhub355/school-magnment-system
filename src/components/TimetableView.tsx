import React, { useState, useMemo } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Edit3,
  Trash2,
  Printer,
  Copy,
  Check,
  AlertTriangle,
  Users,
  BookOpen,
  Layers,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  School,
  CheckCircle2,
  X,
  Search,
  ChevronDown,
  Building,
  GraduationCap,
  MapPin,
  Flame
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import {
  DayOfWeek,
  Division,
  TimeSlot,
  TimetableColorTag,
  TimetableEntry
} from '../types';
import { ConfirmModal } from './ConfirmModal';

const DAYS_OF_WEEK: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const SUBJECT_SUGGESTIONS = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'English Literature',
  'Urdu',
  'Islamiat',
  'Pak Studies',
  'General Science',
  'MDCAT Entry Test MCQ Drill',
  'ECAT Math Speed Coaching',
  'Physics Practical Lab',
  'Chemistry Practical Lab',
  'Computer Lab Practicum'
];

const ROOM_SUGGESTIONS = [
  'Room 101',
  'Room 102',
  'Room 103',
  'Room 201',
  'Room 204',
  'Physics Lab',
  'Chemistry Lab',
  'Bio Lab',
  'Computer Lab 1',
  'Computer Lab 2',
  'Main Auditorium',
  'Academy Hall A',
  'Academy Hall B'
];

const COLOR_TAG_MAP: Record<TimetableColorTag, { bg: string; text: string; border: string; badge: string }> = {
  blue: { bg: 'bg-blue-50', text: 'text-blue-950', border: 'border-blue-200', badge: 'bg-blue-600 text-white' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-950', border: 'border-emerald-200', badge: 'bg-emerald-600 text-white' },
  purple: { bg: 'bg-purple-50', text: 'text-purple-950', border: 'border-purple-200', badge: 'bg-purple-600 text-white' },
  amber: { bg: 'bg-amber-50', text: 'text-amber-950', border: 'border-amber-200', badge: 'bg-amber-600 text-white' },
  rose: { bg: 'bg-rose-50', text: 'text-rose-950', border: 'border-rose-200', badge: 'bg-rose-600 text-white' },
  cyan: { bg: 'bg-cyan-50', text: 'text-cyan-950', border: 'border-cyan-200', badge: 'bg-cyan-600 text-white' },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-950', border: 'border-indigo-200', badge: 'bg-indigo-600 text-white' },
  slate: { bg: 'bg-slate-50', text: 'text-slate-900', border: 'border-slate-200', badge: 'bg-slate-700 text-white' }
};

export const TimetableView: React.FC = () => {
  const {
    currentDivision,
    setCurrentDivision,
    students,
    teachers,
    timeSlots,
    timetableEntries,
    setOrReplaceTimetableEntry,
    deleteTimetableEntry,
    copyTimetableDay,
    clearClassTimetable,
    resetTimetableToDefault,
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,
    setActivePrintDoc
  } = useSchool();

  // Navigation & Filter states
  const [viewMode, setViewMode] = useState<'class' | 'teacher' | 'master' | 'timeslots'>('class');
  
  // Available classes in current division
  const availableClasses = useMemo(() => {
    const classSet = new Set<string>();
    // From students
    students
      .filter((s) => s.division === currentDivision)
      .forEach((s) => classSet.add(s.classGrade));
    // From timetable entries
    timetableEntries
      .filter((e) => e.division === currentDivision)
      .forEach((e) => classSet.add(e.classGrade));
    
    // Defaults if empty
    if (classSet.size === 0) {
      if (currentDivision === 'School') {
        classSet.add('Grade 9 - Science');
        classSet.add('Grade 10 - Science');
        classSet.add('Grade 8 - General');
      } else {
        classSet.add('F.Sc Pre-Medical (Part 1)');
        classSet.add('F.Sc Pre-Engineering (Part 1)');
        classSet.add('ICS (Physics & Stats)');
      }
    }
    return Array.from(classSet).sort();
  }, [students, timetableEntries, currentDivision]);

  const [selectedClass, setSelectedClass] = useState<string>(() => availableClasses[0] || 'Grade 9 - Science');

  // Sync selectedClass when division changes
  React.useEffect(() => {
    if (availableClasses.length > 0 && !availableClasses.includes(selectedClass)) {
      setSelectedClass(availableClasses[0]);
    }
  }, [availableClasses, selectedClass]);

  // Selected Teacher for Teacher View
  const activeTeachers = useMemo(() => {
    return teachers.filter((t) => t.status === 'Active' || !t.status);
  }, [teachers]);

  const [selectedTeacherId, setSelectedTeacherId] = useState<string>(() => {
    return activeTeachers[0]?.id || '';
  });

  const selectedTeacher = useMemo(() => {
    return teachers.find((t) => t.id === selectedTeacherId) || activeTeachers[0];
  }, [teachers, selectedTeacherId, activeTeachers]);

  // Master view day filter
  const [masterSelectedDay, setMasterSelectedDay] = useState<DayOfWeek | 'All'>('All');

  // Edit / Add Slot Modal State
  const [isSlotModalOpen, setIsSlotModalOpen] = useState<boolean>(false);
  const [editingSlotDay, setEditingSlotDay] = useState<DayOfWeek>('Monday');
  const [editingSlotTimeId, setEditingSlotTimeId] = useState<string>('');
  const [slotSubject, setSlotSubject] = useState<string>('');
  const [slotTeacherId, setSlotTeacherId] = useState<string>('');
  const [slotRoomNo, setSlotRoomNo] = useState<string>('');
  const [slotColorTag, setSlotColorTag] = useState<TimetableColorTag>('blue');
  const [slotNotes, setSlotNotes] = useState<string>('');
  const [existingEntryId, setExistingEntryId] = useState<string | null>(null);

  // Copy Day Modal State
  const [isCopyModalOpen, setIsCopyModalOpen] = useState<boolean>(false);
  const [copySourceDay, setCopySourceDay] = useState<DayOfWeek>('Monday');
  const [copyTargetDays, setCopyTargetDays] = useState<DayOfWeek[]>(['Tuesday', 'Wednesday', 'Thursday', 'Friday']);

  // Time Slot Management Modal State
  const [isTimeSlotEditorOpen, setIsTimeSlotEditorOpen] = useState<boolean>(false);
  const [editingTimeSlot, setEditingTimeSlot] = useState<TimeSlot | null>(null);
  const [newSlotPeriodName, setNewSlotPeriodName] = useState<string>('');
  const [newSlotStartTime, setNewSlotStartTime] = useState<string>('08:00 AM');
  const [newSlotEndTime, setNewSlotEndTime] = useState<string>('08:45 AM');
  const [newSlotIsBreak, setNewSlotIsBreak] = useState<boolean>(false);

  // Success message toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Confirm states for modal
  const [confirmClearClass, setConfirmClearClass] = useState<string | null>(null);
  const [confirmResetTimetable, setConfirmResetTimetable] = useState<boolean>(false);
  const [confirmDeleteSlot, setConfirmDeleteSlot] = useState<TimeSlot | null>(null);

  // Conflict Detector: find any teacher assigned to multiple classes in the same period and day
  const conflicts = useMemo(() => {
    const clashes: { teacherName: string; day: DayOfWeek; timeSlotName: string; classes: string[] }[] = [];
    
    // Group entries by teacherId (or teacherName) + day + timeSlotId
    const map = new Map<string, { teacherName: string; day: DayOfWeek; timeSlotId: string; classes: string[] }>();

    timetableEntries.forEach((entry) => {
      if (!entry.teacherName && !entry.teacherId) return;
      const key = `${entry.teacherId || entry.teacherName}-${entry.day}-${entry.timeSlotId}`;
      if (!map.has(key)) {
        map.set(key, {
          teacherName: entry.teacherName || 'Faculty',
          day: entry.day,
          timeSlotId: entry.timeSlotId,
          classes: [entry.classGrade]
        });
      } else {
        const item = map.get(key)!;
        if (!item.classes.includes(entry.classGrade)) {
          item.classes.push(entry.classGrade);
        }
      }
    });

    map.forEach((item) => {
      if (item.classes.length > 1) {
        const slot = timeSlots.find((s) => s.id === item.timeSlotId);
        clashes.push({
          teacherName: item.teacherName,
          day: item.day,
          timeSlotName: slot ? `${slot.periodName} (${slot.startTime} - ${slot.endTime})` : 'Period Slot',
          classes: item.classes
        });
      }
    });

    return clashes;
  }, [timetableEntries, timeSlots]);

  // Handle open slot edit modal
  const handleOpenSlotModal = (day: DayOfWeek, slotId: string) => {
    const existing = timetableEntries.find(
      (e) =>
        e.division === currentDivision &&
        e.classGrade === selectedClass &&
        e.day === day &&
        e.timeSlotId === slotId
    );

    setEditingSlotDay(day);
    setEditingSlotTimeId(slotId);

    if (existing) {
      setExistingEntryId(existing.id);
      setSlotSubject(existing.subject);
      setSlotTeacherId(existing.teacherId || '');
      setSlotRoomNo(existing.roomNo || '');
      setSlotColorTag(existing.colorTag || 'blue');
      setSlotNotes(existing.notes || '');
    } else {
      setExistingEntryId(null);
      setSlotSubject('');
      setSlotTeacherId('');
      setSlotRoomNo('Room 101');
      setSlotColorTag('blue');
      setSlotNotes('');
    }

    setIsSlotModalOpen(true);
  };

  // Check potential conflict while editing a slot
  const potentialSlotConflict = useMemo(() => {
    if (!slotTeacherId && !isSlotModalOpen) return null;
    const selectedTeacherObj = teachers.find((t) => t.id === slotTeacherId);
    if (!selectedTeacherObj) return null;

    const clash = timetableEntries.find(
      (e) =>
        (e.teacherId === slotTeacherId || e.teacherName === selectedTeacherObj.name) &&
        e.day === editingSlotDay &&
        e.timeSlotId === editingSlotTimeId &&
        !(e.division === currentDivision && e.classGrade === selectedClass)
    );

    if (clash) {
      return `⚠️ Warning: ${selectedTeacherObj.name} is already scheduled to teach "${clash.subject}" for ${clash.classGrade} on ${editingSlotDay} during this slot!`;
    }
    return null;
  }, [slotTeacherId, editingSlotDay, editingSlotTimeId, currentDivision, selectedClass, teachers, timetableEntries, isSlotModalOpen]);

  // Handle Save Slot
  const handleSaveSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!slotSubject.trim()) {
      showToast('Please enter a subject name.');
      return;
    }

    const assignedTeacher = teachers.find((t) => t.id === slotTeacherId);

    setOrReplaceTimetableEntry({
      division: currentDivision,
      classGrade: selectedClass,
      day: editingSlotDay,
      timeSlotId: editingSlotTimeId,
      subject: slotSubject.trim(),
      teacherId: slotTeacherId || undefined,
      teacherName: assignedTeacher ? assignedTeacher.name : undefined,
      roomNo: slotRoomNo.trim() || undefined,
      colorTag: slotColorTag,
      notes: slotNotes.trim() || undefined
    });

    setIsSlotModalOpen(false);
    showToast(`Saved lecture: ${slotSubject} for ${selectedClass} on ${editingSlotDay}!`);
  };

  // Handle Delete Slot
  const handleDeleteSlot = () => {
    if (existingEntryId) {
      deleteTimetableEntry(existingEntryId);
      setIsSlotModalOpen(false);
      showToast('Lecture entry removed.');
    }
  };

  // Handle Copy Day
  const handleExecuteCopy = () => {
    if (copyTargetDays.length === 0) {
      showToast('Please select at least one target day to duplicate schedule.');
      return;
    }
    copyTimetableDay(currentDivision, selectedClass, copySourceDay, copyTargetDays);
    setIsCopyModalOpen(false);
    showToast(`Schedule successfully copied from ${copySourceDay} to ${copyTargetDays.join(', ')}!`);
  };

  // Print Handlers
  const handlePrintClassTimetable = () => {
    setActivePrintDoc({
      type: 'class_timetable',
      division: currentDivision,
      classGrade: selectedClass,
      entries: timetableEntries,
      timeSlots: timeSlots,
      days: DAYS_OF_WEEK
    });
  };

  const handlePrintTeacherTimetable = () => {
    if (!selectedTeacher) return;
    setActivePrintDoc({
      type: 'teacher_timetable',
      teacher: selectedTeacher,
      entries: timetableEntries,
      timeSlots: timeSlots,
      days: DAYS_OF_WEEK
    });
  };

  const handlePrintMasterTimetable = () => {
    setActivePrintDoc({
      type: 'master_timetable',
      division: currentDivision,
      entries: timetableEntries,
      timeSlots: timeSlots,
      classGrades: availableClasses,
      days: DAYS_OF_WEEK
    });
  };

  // Stats calculation
  const currentClassEntries = useMemo(() => {
    return timetableEntries.filter(
      (e) => e.division === currentDivision && e.classGrade === selectedClass
    );
  }, [timetableEntries, currentDivision, selectedClass]);

  const uniqueFacultyInClass = useMemo(() => {
    const fSet = new Set<string>();
    currentClassEntries.forEach((e) => {
      if (e.teacherName) fSet.add(e.teacherName);
    });
    return fSet.size;
  }, [currentClassEntries]);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-amber-400 text-blue-950 rounded-2xl shadow-md">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-amber-300 border border-white/10">
                Academic Operations & Bell Timings
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Timetable & Lecture Scheduling Master
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Design, customize, edit, and print official weekly schedules for classes, individual faculty lecture loads, and master room allocations with real-time teacher clash prevention.
            </p>
          </div>

          {/* Quick Print & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {viewMode === 'class' && (
              <button
                onClick={handlePrintClassTimetable}
                id="btn-print-class-timetable"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg hover:shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print {selectedClass} Timetable
              </button>
            )}

            {viewMode === 'teacher' && (
              <button
                onClick={handlePrintTeacherTimetable}
                id="btn-print-teacher-timetable"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg hover:shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Teacher Schedule
              </button>
            )}

            {viewMode === 'master' && (
              <button
                onClick={handlePrintMasterTimetable}
                id="btn-print-master-timetable"
                className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg hover:shadow-amber-400/20 active:scale-95 transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                Print Master Timetable
              </button>
            )}

            <button
              onClick={() => setIsCopyModalOpen(true)}
              id="btn-copy-schedule"
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl flex items-center gap-2 backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            >
              <Copy className="w-4 h-4 text-amber-300" />
              Copy Day
            </button>

            <button
              onClick={() => setIsTimeSlotEditorOpen(true)}
              id="btn-bell-timing"
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl flex items-center gap-2 backdrop-blur-md border border-white/10 transition-colors cursor-pointer"
            >
              <Clock className="w-4 h-4 text-cyan-300" />
              Bell Timings
            </button>
          </div>
        </div>

        {/* Division Switcher */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-slate-950/40 p-1 rounded-2xl border border-white/10">
            <button
              onClick={() => setCurrentDivision('School')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentDivision === 'School'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <School className="w-4 h-4" />
              School Division (Grades 1-10)
            </button>
            <button
              onClick={() => setCurrentDivision('Academy')}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer ${
                currentDivision === 'Academy'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Science Academy (F.Sc / ICS / Entry Test)
            </button>
          </div>

          {/* Conflict Status Badge */}
          <div>
            {conflicts.length > 0 ? (
              <div className="px-3.5 py-1.5 bg-rose-500/20 border border-rose-400/40 rounded-xl flex items-center gap-2 text-rose-300 text-xs font-semibold">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{conflicts.length} Faculty Scheduling Conflict(s) Detected!</span>
              </div>
            ) : (
              <div className="px-3.5 py-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl flex items-center gap-2 text-emerald-300 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Conflict-Free Verified Schedule</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conflict Alert Banner if any exist */}
      {conflicts.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-900 space-y-2">
          <div className="font-bold flex items-center gap-2 text-rose-800 text-sm">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            Teacher Period Clashes Detected (Same faculty assigned to multiple classes simultaneously):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {conflicts.map((c, i) => (
              <div key={i} className="p-2.5 bg-white rounded-xl border border-rose-200 shadow-xs flex items-center justify-between">
                <div>
                  <strong className="text-rose-950 font-bold">{c.teacherName}</strong>
                  <div className="text-slate-600 text-[11px]">{c.day} • {c.timeSlotName}</div>
                </div>
                <div className="text-right font-semibold text-rose-700">
                  {c.classes.join(' & ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation View Tabs & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('class')}
            id="tab-class-view"
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'class'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Class Schedule
          </button>
          <button
            onClick={() => setViewMode('teacher')}
            id="tab-teacher-view"
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'teacher'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Faculty Schedule
          </button>
          <button
            onClick={() => setViewMode('master')}
            id="tab-master-view"
            className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              viewMode === 'master'
                ? 'bg-white text-blue-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Master Overview
          </button>
        </div>

        {/* Dynamic Selector based on View */}
        <div className="flex items-center gap-3">
          {viewMode === 'class' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Class / Program:</span>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                id="select-class-grade"
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'teacher' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Select Teacher:</span>
              <select
                value={selectedTeacherId}
                onChange={(e) => setSelectedTeacherId(e.target.value)}
                id="select-teacher"
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.subject} - {t.division})
                  </option>
                ))}
              </select>
            </div>
          )}

          {viewMode === 'master' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-bold">Filter Day:</span>
              <select
                value={masterSelectedDay}
                onChange={(e) => setMasterSelectedDay(e.target.value as any)}
                id="select-master-day"
                className="bg-slate-50 border border-slate-300 rounded-xl px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
              >
                <option value="All">All Days (Full Week)</option>
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. CLASS TIMETABLE VIEW */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'class' && (
        <div className="space-y-4">
          {/* Class Summary Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">Total Scheduled Lectures</span>
              <span className="text-lg font-black text-slate-900">{currentClassEntries.length} Periods / Week</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">Assigned Faculty</span>
              <span className="text-lg font-black text-blue-700">{uniqueFacultyInClass} Instructors</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
              <span className="text-[11px] text-slate-400 font-semibold block">Academic Division</span>
              <span className="text-lg font-black text-indigo-700">{currentDivision}</span>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold block">Schedule Actions</span>
                <span className="text-xs font-bold text-slate-700">Class Operations</span>
              </div>
              <button
                onClick={() => setConfirmClearClass(selectedClass)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                title="Clear class schedule"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>

          {/* Weekly Timetable Matrix */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <School className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-sm sm:text-base">
                    {selectedClass} — Weekly Lecture Matrix
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Click any cell to edit subject, teacher assignment, room, or lecture timing
                  </p>
                </div>
              </div>
              <div className="text-xs text-amber-300 font-mono font-semibold">
                Session 2026-27
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 border-r border-slate-200 text-center w-28 bg-slate-200/60">
                      Day / Period
                    </th>
                    {timeSlots.map((slot) => (
                      <th
                        key={slot.id}
                        className={`p-3 border-r border-slate-200 text-center ${
                          slot.isBreak ? 'bg-amber-50 text-amber-900 font-semibold' : ''
                        }`}
                      >
                        <div className="font-extrabold text-slate-900 text-xs">{slot.periodName}</div>
                        <div className="text-[10px] font-mono text-slate-500 font-normal mt-0.5">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DAYS_OF_WEEK.map((day) => (
                    <tr key={day} className="hover:bg-slate-50/70 transition-colors">
                      {/* Day Label */}
                      <td className="p-3 border-r border-slate-200 font-extrabold text-slate-900 bg-slate-50 text-center">
                        <div className="text-sm">{day}</div>
                      </td>

                      {/* Time Slots */}
                      {timeSlots.map((slot) => {
                        if (slot.isBreak) {
                          return (
                            <td
                              key={slot.id}
                              className="p-2 border-r border-slate-200 bg-amber-50/50 text-center text-[11px] font-bold text-amber-800"
                            >
                              <div className="py-3 px-1 rounded-lg bg-amber-100/50 border border-amber-200/50">
                                {slot.periodName}
                              </div>
                            </td>
                          );
                        }

                        const entry = timetableEntries.find(
                          (e) =>
                            e.division === currentDivision &&
                            e.classGrade === selectedClass &&
                            e.day === day &&
                            e.timeSlotId === slot.id
                        );

                        const colorConfig = entry?.colorTag
                          ? COLOR_TAG_MAP[entry.colorTag]
                          : COLOR_TAG_MAP.blue;

                        return (
                          <td
                            key={slot.id}
                            className="p-2 border-r border-slate-200 align-top hover:bg-blue-50/40 transition-colors group cursor-pointer"
                            onClick={() => handleOpenSlotModal(day, slot.id)}
                          >
                            {entry ? (
                              <div
                                className={`p-2.5 rounded-xl border ${colorConfig.border} ${colorConfig.bg} ${colorConfig.text} relative transition-all group-hover:shadow-sm group-hover:scale-[1.02]`}
                              >
                                <div className="font-extrabold text-xs leading-tight mb-1 flex items-start justify-between gap-1">
                                  <span>{entry.subject}</span>
                                  <Edit3 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 shrink-0" />
                                </div>
                                {entry.teacherName && (
                                  <div className="text-[11px] font-semibold text-blue-800 flex items-center gap-1">
                                    <Users className="w-2.5 h-2.5 shrink-0" />
                                    <span className="truncate">{entry.teacherName}</span>
                                  </div>
                                )}
                                {entry.roomNo && (
                                  <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1 mt-0.5">
                                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                                    <span>{entry.roomNo}</span>
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="h-full min-h-[64px] border border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-300 group-hover:text-blue-600 group-hover:border-blue-300 group-hover:bg-blue-50/20 transition-all p-2">
                                <Plus className="w-4 h-4 mb-0.5 opacity-60 group-hover:opacity-100" />
                                <span className="text-[10px] font-semibold">Assign</span>
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
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 2. FACULTY / TEACHER TIMETABLE VIEW */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'teacher' && selectedTeacher && (
        <div className="space-y-4">
          {/* Teacher Summary Card */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-tr from-blue-900 to-indigo-700 text-white rounded-2xl flex items-center justify-center text-lg font-black shadow-md">
                {selectedTeacher.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{selectedTeacher.name}</h2>
                  <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase">
                    {selectedTeacher.facultyCode}
                  </span>
                </div>
                <p className="text-xs text-slate-600 font-medium mt-0.5">
                  Subject: <strong className="text-slate-900">{selectedTeacher.subject}</strong> • Division: <strong className="text-blue-700">{selectedTeacher.division}</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handlePrintTeacherTimetable}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-amber-400" />
                Print Schedule
              </button>
            </div>
          </div>

          {/* Teacher Schedule Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3 border-r border-slate-200 text-center w-28 bg-slate-200/60">
                      Day
                    </th>
                    {timeSlots.map((slot) => (
                      <th
                        key={slot.id}
                        className={`p-3 border-r border-slate-200 text-center ${
                          slot.isBreak ? 'bg-amber-50 text-amber-900' : ''
                        }`}
                      >
                        <div className="font-extrabold text-slate-900 text-xs">{slot.periodName}</div>
                        <div className="text-[10px] font-mono text-slate-500 font-normal mt-0.5">
                          {slot.startTime} - {slot.endTime}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {DAYS_OF_WEEK.map((day) => (
                    <tr key={day} className="hover:bg-slate-50/70 transition-colors">
                      <td className="p-3 border-r border-slate-200 font-extrabold text-slate-900 bg-slate-50 text-center">
                        {day}
                      </td>
                      {timeSlots.map((slot) => {
                        if (slot.isBreak) {
                          return (
                            <td key={slot.id} className="p-2 border-r border-slate-200 bg-amber-50/40 text-center text-[10px] font-semibold text-amber-800">
                              {slot.periodName}
                            </td>
                          );
                        }

                        const entry = timetableEntries.find(
                          (e) =>
                            (e.teacherId === selectedTeacher.id || e.teacherName === selectedTeacher.name) &&
                            e.day === day &&
                            e.timeSlotId === slot.id
                        );

                        return (
                          <td key={slot.id} className="p-2 border-r border-slate-200 align-top">
                            {entry ? (
                              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-950">
                                <div className="font-black text-xs text-blue-900 mb-0.5">
                                  {entry.classGrade}
                                </div>
                                <div className="text-[11px] font-semibold text-slate-700">
                                  {entry.subject}
                                </div>
                                {entry.roomNo && (
                                  <div className="text-[9px] text-slate-500 font-mono mt-0.5">
                                    📍 {entry.roomNo}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="p-2 text-center text-slate-300 text-[10px] italic">
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
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 3. MASTER INSTITUTIONAL VIEW */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'master' && (
        <div className="space-y-6">
          {(masterSelectedDay === 'All' ? DAYS_OF_WEEK : [masterSelectedDay]).map((day) => (
            <div key={day} className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-sm tracking-wide">{day.toUpperCase()} MASTER SCHEDULE</span>
                </div>
                <span className="text-xs bg-white/10 px-2.5 py-0.5 rounded-full font-mono text-amber-300">
                  {currentDivision} Division
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse min-w-[800px]">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5 border-r border-slate-200 w-36 bg-slate-200/60 font-black">
                        Class / Program
                      </th>
                      {timeSlots.map((slot) => (
                        <th
                          key={slot.id}
                          className={`p-2.5 border-r border-slate-200 text-center ${
                            slot.isBreak ? 'bg-amber-50 text-amber-900 text-[10px]' : ''
                          }`}
                        >
                          <div className="font-extrabold text-slate-900">{slot.periodName}</div>
                          <div className="text-[9px] font-mono text-slate-500 font-normal">
                            {slot.startTime}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {availableClasses.map((cls) => (
                      <tr key={cls} className="hover:bg-slate-50/70">
                        <td className="p-2.5 border-r border-slate-200 font-black text-slate-900 bg-slate-50 text-xs">
                          {cls}
                        </td>
                        {timeSlots.map((slot) => {
                          if (slot.isBreak) {
                            return (
                              <td key={slot.id} className="p-1 border-r border-slate-200 bg-amber-50/40 text-center text-[9px] text-amber-800">
                                {slot.periodName}
                              </td>
                            );
                          }

                          const entry = timetableEntries.find(
                            (e) =>
                              e.division === currentDivision &&
                              e.classGrade === cls &&
                              e.day === day &&
                              e.timeSlotId === slot.id
                          );

                          return (
                            <td key={slot.id} className="p-1.5 border-r border-slate-200 align-top">
                              {entry ? (
                                <div className="p-1.5 rounded-lg bg-blue-50/80 border border-blue-100">
                                  <div className="font-bold text-slate-900 text-[11px] leading-tight">
                                    {entry.subject}
                                  </div>
                                  {entry.teacherName && (
                                    <div className="text-[9px] text-blue-700 font-medium truncate mt-0.5">
                                      {entry.teacherName}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="text-center text-slate-300 text-[9px] py-2">—</div>
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
      )}

      {/* ---------------------------------------------------- */}
      {/* 4. MODAL: EDIT / ADD TIMETABLE SLOT */}
      {/* ---------------------------------------------------- */}
      {isSlotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-base">
                    {existingEntryId ? 'Edit Lecture Entry' : 'Assign New Lecture'}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {selectedClass} • {editingSlotDay} •{' '}
                    {timeSlots.find((s) => s.id === editingSlotTimeId)?.periodName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSlotModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSlot} className="p-6 space-y-4">
              {/* Conflict warning in modal */}
              {potentialSlotConflict && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  {potentialSlotConflict}
                </div>
              )}

              {/* Subject Input with suggestions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Subject / Course Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mathematics, Physics Theory, Chemistry Lab"
                  value={slotSubject}
                  onChange={(e) => setSlotSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {/* Quick Subject Chips */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {SUBJECT_SUGGESTIONS.slice(0, 6).map((sub) => (
                    <button
                      key={sub}
                      type="button"
                      onClick={() => setSlotSubject(sub)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-900 rounded-md text-[11px] font-medium transition-colors cursor-pointer"
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teacher Assignment Dropdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Assign Faculty Member
                </label>
                <select
                  value={slotTeacherId}
                  onChange={(e) => setSlotTeacherId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none cursor-pointer"
                >
                  <option value="">— Unassigned / Guest Lecturer —</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.subject} - {t.division})
                    </option>
                  ))}
                </select>
              </div>

              {/* Room / Location */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Lecture Hall / Laboratory
                </label>
                <input
                  type="text"
                  placeholder="e.g. Room 101, Physics Lab, Hall A"
                  value={slotRoomNo}
                  onChange={(e) => setSlotRoomNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm text-slate-900 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {ROOM_SUGGESTIONS.slice(0, 5).map((rm) => (
                    <button
                      key={rm}
                      type="button"
                      onClick={() => setSlotRoomNo(rm)}
                      className="px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-md text-[10px] font-mono transition-colors cursor-pointer"
                    >
                      {rm}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Tag Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1.5">
                  Visual Color Tag
                </label>
                <div className="flex items-center gap-2">
                  {(Object.keys(COLOR_TAG_MAP) as TimetableColorTag[]).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSlotColorTag(tag)}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        COLOR_TAG_MAP[tag].bg
                      } ${
                        slotColorTag === tag
                          ? 'border-blue-600 ring-2 ring-blue-400 ring-offset-1 scale-110'
                          : 'border-slate-300 hover:scale-105'
                      }`}
                      title={tag}
                    />
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                {existingEntryId ? (
                  <button
                    type="button"
                    onClick={handleDeleteSlot}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete Lecture
                  </button>
                ) : (
                  <div />
                )}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSlotModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    Save Lecture
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 5. MODAL: COPY TIMETABLE DAY */}
      {/* ---------------------------------------------------- */}
      {isCopyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Copy className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-base">Replicate Day Schedule</h3>
              </div>
              <button
                onClick={() => setIsCopyModalOpen(false)}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-600">
                Replicate an entire day's lecture arrangement for <strong>{selectedClass}</strong> ({currentDivision}) across target weekdays instantly.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Source Day to Copy From:
                </label>
                <select
                  value={copySourceDay}
                  onChange={(e) => setCopySourceDay(e.target.value as DayOfWeek)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                  Select Target Day(s) to Overwrite:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DAYS_OF_WEEK.filter((d) => d !== copySourceDay).map((d) => {
                    const isChecked = copyTargetDays.includes(d);
                    return (
                      <label
                        key={d}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                          isChecked
                            ? 'bg-blue-50 border-blue-300 text-blue-900'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCopyTargetDays([...copyTargetDays, d]);
                            } else {
                              setCopyTargetDays(copyTargetDays.filter((x) => x !== d));
                            }
                          }}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span>{d}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCopyModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteCopy}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4" />
                  Copy & Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* 6. MODAL: BELL TIMINGS / TIME SLOTS EDITOR */}
      {/* ---------------------------------------------------- */}
      {isTimeSlotEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp max-h-[90vh] flex flex-col">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-base">Daily Bell Timings & Period Slots</h3>
                  <p className="text-xs text-slate-300">Customize period names, lecture durations, and break timings</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsTimeSlotEditorOpen(false);
                  setEditingTimeSlot(null);
                }}
                className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5">
              {/* Existing Time Slots List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Configured Campus Bell Schedule ({timeSlots.length} Slots)
                </h4>
                <div className="divide-y divide-slate-200 border border-slate-200 rounded-2xl overflow-hidden">
                  {timeSlots.map((slot, index) => (
                    <div
                      key={slot.id}
                      className={`p-3 flex items-center justify-between text-xs ${
                        slot.isBreak ? 'bg-amber-50/60 font-semibold' : 'bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                          {index + 1}
                        </span>
                        <div>
                          <strong className="text-slate-900 text-sm font-bold block">
                            {slot.periodName}
                          </strong>
                          <span className="text-slate-500 font-mono text-[11px]">
                            {slot.startTime} — {slot.endTime}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {slot.isBreak && (
                          <span className="px-2 py-0.5 bg-amber-200 text-amber-900 font-bold text-[10px] rounded-md">
                            Break / Assembly
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            setEditingTimeSlot(slot);
                            setNewSlotPeriodName(slot.periodName);
                            setNewSlotStartTime(slot.startTime);
                            setNewSlotEndTime(slot.endTime);
                            setNewSlotIsBreak(!!slot.isBreak);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit slot timing"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {timeSlots.length > 3 && (
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteSlot(slot)}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete slot"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add / Edit Form */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase">
                  {editingTimeSlot ? `Edit "${editingTimeSlot.periodName}"` : 'Add New Period Slot'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Period Label</label>
                    <input
                      type="text"
                      placeholder="e.g. Period 8 / Remedial"
                      value={newSlotPeriodName}
                      onChange={(e) => setNewSlotPeriodName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Time</label>
                    <input
                      type="text"
                      placeholder="01:45 PM"
                      value={newSlotStartTime}
                      onChange={(e) => setNewSlotStartTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">End Time</label>
                    <input
                      type="text"
                      placeholder="02:30 PM"
                      value={newSlotEndTime}
                      onChange={(e) => setNewSlotEndTime(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="flex items-center gap-2 text-xs text-slate-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newSlotIsBreak}
                      onChange={(e) => setNewSlotIsBreak(e.target.checked)}
                      className="rounded text-amber-600"
                    />
                    <span>Mark as Break / Assembly Slot (No lecture assigned)</span>
                  </label>

                  <div className="flex items-center gap-2">
                    {editingTimeSlot && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingTimeSlot(null);
                          setNewSlotPeriodName('');
                          setNewSlotStartTime('08:00 AM');
                          setNewSlotEndTime('08:45 AM');
                          setNewSlotIsBreak(false);
                        }}
                        className="px-3 py-1.5 text-slate-600 hover:bg-slate-200 rounded-lg text-xs font-semibold"
                      >
                        Cancel Edit
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        if (!newSlotPeriodName.trim()) {
                          showToast('Please enter a valid period label (e.g. Period 1, Break).');
                          return;
                        }

                        if (editingTimeSlot) {
                          updateTimeSlot(editingTimeSlot.id, {
                            periodName: newSlotPeriodName.trim(),
                            startTime: newSlotStartTime.trim(),
                            endTime: newSlotEndTime.trim(),
                            isBreak: newSlotIsBreak
                          });
                          showToast(`Updated ${newSlotPeriodName}.`);
                          setEditingTimeSlot(null);
                        } else {
                          addTimeSlot({
                            periodNumber: timeSlots.length + 1,
                            periodName: newSlotPeriodName.trim(),
                            startTime: newSlotStartTime.trim(),
                            endTime: newSlotEndTime.trim(),
                            isBreak: newSlotIsBreak
                          });
                          showToast(`Added new slot ${newSlotPeriodName}.`);
                        }

                        setNewSlotPeriodName('');
                        setNewSlotStartTime('08:00 AM');
                        setNewSlotEndTime('08:45 AM');
                        setNewSlotIsBreak(false);
                      }}
                      className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                    >
                      {editingTimeSlot ? 'Update Slot' : 'Add Slot'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reset to Factory default */}
              <div className="pt-2 flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={() => setConfirmResetTimetable(true)}
                  className="text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Restore Factory Timetable Template
                </button>

                <button
                  type="button"
                  onClick={() => setIsTimeSlotEditorOpen(false)}
                  className="px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Class Timetable Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmClearClass}
        onClose={() => setConfirmClearClass(null)}
        onConfirm={() => {
          if (confirmClearClass) {
            clearClassTimetable(currentDivision, confirmClearClass);
            showToast(`Cleared weekly schedule for ${confirmClearClass}.`);
            setConfirmClearClass(null);
          }
        }}
        title="Clear Class Schedule"
        message={`Are you sure you want to clear all weekly period entries for "${confirmClearClass}"? You will be able to add new periods or copy another day's schedule.`}
        confirmText="Yes, Clear Schedule"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />

      {/* Delete Single Time Slot Confirm Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteSlot}
        onClose={() => setConfirmDeleteSlot(null)}
        onConfirm={() => {
          if (confirmDeleteSlot) {
            deleteTimeSlot(confirmDeleteSlot.id);
            showToast(`Deleted period slot "${confirmDeleteSlot.periodName}".`);
            setConfirmDeleteSlot(null);
          }
        }}
        title="Delete Period Time Slot"
        message={`Are you sure you want to delete "${confirmDeleteSlot?.periodName}"? All lectures assigned to this slot across all classes will be unlinked.`}
        confirmText="Yes, Delete Period Slot"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />

      {/* Reset Timetable To Factory Template Confirm Modal */}
      <ConfirmModal
        isOpen={confirmResetTimetable}
        onClose={() => setConfirmResetTimetable(false)}
        onConfirm={() => {
          resetTimetableToDefault();
          showToast('Timetable & bell timings restored to campus defaults.');
          setConfirmResetTimetable(false);
          setIsTimeSlotEditorOpen(false);
        }}
        title="Restore Factory Timetable"
        message="Are you sure you want to reset the entire timetable and bell timing slots to the default official campus template? This will replace any custom periods created."
        confirmText="Restore Factory Template"
        cancelText="Cancel"
        variant="danger"
        icon="alert"
      />
    </div>
  );
};
