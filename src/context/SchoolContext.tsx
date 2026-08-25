import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Student,
  Teacher,
  AttendanceRecord,
  TeacherAttendanceRecord,
  FeeTransaction,
  ExpenseItem,
  TestSchedule,
  StudentTestResult,
  SchoolEvent,
  AttendanceStatus,
  TeacherAttendanceStatus,
  PaymentMethod,
  Division,
  TimeSlot,
  TimetableEntry,
  DayOfWeek,
  TimetableColorTag
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_TEACHERS,
  INITIAL_ATTENDANCE,
  INITIAL_TEACHER_ATTENDANCE,
  INITIAL_FEE_TRANSACTIONS,
  INITIAL_EXPENSES,
  INITIAL_TEST_SCHEDULES,
  INITIAL_TEST_RESULTS,
  INITIAL_SCHOOL_EVENTS,
  INITIAL_TIME_SLOTS,
  INITIAL_TIMETABLE_ENTRIES
} from '../data/initialData';

export type ActivePrintDoc =
  | { type: 'fee_receipt'; data: FeeTransaction; student?: Student }
  | { type: 'id_card'; student: Student }
  | { type: 'report_card'; student: Student; results: StudentTestResult[]; attendanceRate: number }
  | { type: 'salary_slip'; teacher: Teacher; paidAmount: number; date: string; voucherNo: string }
  | { type: 'class_timetable'; division: Division; classGrade: string; section?: string; entries: TimetableEntry[]; timeSlots: TimeSlot[]; days?: DayOfWeek[]; note?: string }
  | { type: 'teacher_timetable'; teacher: Teacher; entries: TimetableEntry[]; timeSlots: TimeSlot[]; days?: DayOfWeek[] }
  | { type: 'master_timetable'; division: Division; entries: TimetableEntry[]; timeSlots: TimeSlot[]; classGrades: string[]; days?: DayOfWeek[] }
  | { type: 'character_certificate'; student: Student; issueDate?: string }
  | { type: 'leaving_certificate'; student: Student; leavingReason?: string; issueDate?: string }
  | { type: 'admit_card'; student: Student; testSchedules: TestSchedule[]; examTitle?: string }
  | { type: 'fee_reminder_notice'; student: Student; dueAmount: number; dueDate?: string }
  | { type: 'teacher_id_card'; teacher: Teacher }
  | { type: 'attendance_register_sheet'; division: Division; classGrade: string; month: string; students: Student[]; attendance: AttendanceRecord[] }
  | null;

export interface SchoolContextType {
  students: Student[];
  teachers: Teacher[];
  attendance: AttendanceRecord[];
  teacherAttendance: TeacherAttendanceRecord[];
  fees: FeeTransaction[];
  expenses: ExpenseItem[];
  testSchedules: TestSchedule[];
  testResults: StudentTestResult[];
  events: SchoolEvent[];
  timeSlots: TimeSlot[];
  timetableEntries: TimetableEntry[];
  activePrintDoc: ActivePrintDoc;
  setActivePrintDoc: (doc: ActivePrintDoc) => void;

  currentDivision: Division;
  setCurrentDivision: (division: Division) => void;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'rollNo'> & { rollNo?: string }) => Student;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  toggleStudentStatus: (id: string, targetStatus?: Student['activeStatus']) => void;
  getStudentById: (id: string) => Student | undefined;
  getStudentAttendanceStats: (studentId: string) => {
    total: number;
    present: number;
    absent: number;
    late: number;
    percentage: number;
  };

  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id' | 'facultyCode'>) => Teacher;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  deleteTeacher: (id: string) => void;
  toggleTeacherStatus: (id: string, targetStatus?: Teacher['status']) => void;
  payTeacherSalary: (teacherId: string, amount: number, paymentDate: string, remarks?: string) => void;
  clearTeacherSalary: (teacherId: string, paymentDate?: string, remarks?: string) => void;
  recordTeacherAttendance: (teacherId: string, reportingTime: string, status: TeacherAttendanceStatus, date?: string) => void;

  // Attendance Actions
  markStudentAttendance: (studentId: string, status: AttendanceStatus, date?: string, remarks?: string) => void;
  markBatchAttendance: (date: string, records: { studentId: string; status: AttendanceStatus }[]) => void;

  // Fee Actions
  submitFee: (params: {
    studentId: string;
    amountPaid: number;
    discountApplied?: number;
    paymentMonth: string;
    paymentMethod: PaymentMethod;
    receivedBy: string;
    remarks?: string;
  }) => FeeTransaction;
  recordFeePayment: (params: {
    studentId: string;
    amountPaid: number;
    discountApplied?: number;
    paymentMonth: string;
    paymentMethod: PaymentMethod;
    receivedBy: string;
    remarks?: string;
  }) => FeeTransaction;
  clearStudentFee: (studentId: string, paymentMonth?: string, paymentMethod?: PaymentMethod, receivedBy?: string, remarks?: string) => FeeTransaction | undefined;
  deleteFeeTransaction: (id: string) => void;

  // Expense Actions
  addExpense: (expense: Omit<ExpenseItem, 'id' | 'voucherNo'>) => ExpenseItem;
  recordExpense: (expense: Omit<ExpenseItem, 'id' | 'voucherNo'>) => ExpenseItem;
  deleteExpense: (id: string) => void;

  // Tests & Progress Actions
  addTestSchedule: (test: Omit<TestSchedule, 'id'>) => TestSchedule;
  deleteTestSchedule: (id: string) => void;
  addOrUpdateTestResult: (result: Omit<StudentTestResult, 'id'>) => void;

  // Events & PTM Actions
  addSchoolEvent: (event: Omit<SchoolEvent, 'id'>) => SchoolEvent;
  deleteSchoolEvent: (id: string) => void;

  // Timetable Actions
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => TimetableEntry;
  updateTimetableEntry: (id: string, updates: Partial<TimetableEntry>) => void;
  deleteTimetableEntry: (id: string) => void;
  setOrReplaceTimetableEntry: (slotData: {
    division: Division;
    classGrade: string;
    section?: string;
    day: DayOfWeek;
    timeSlotId: string;
    subject: string;
    teacherId?: string;
    teacherName?: string;
    roomNo?: string;
    colorTag?: TimetableColorTag;
    notes?: string;
  }) => TimetableEntry;
  batchUpdateTimetable: (entries: TimetableEntry[]) => void;
  copyTimetableDay: (division: Division, classGrade: string, sourceDay: DayOfWeek, targetDays: DayOfWeek[]) => void;
  clearClassTimetable: (division: Division, classGrade: string) => void;
  resetTimetableToDefault: () => void;
  addTimeSlot: (slot: Omit<TimeSlot, 'id'>) => TimeSlot;
  updateTimeSlot: (id: string, updates: Partial<TimeSlot>) => void;
  deleteTimeSlot: (id: string) => void;

  // Stats & Utilities
  todayDateStr: string;
  stats: {
    totalStudents: number;
    activeStudents: number;
    leftCampusStudents: number;
    schoolStudents: number;
    academyStudents: number;
    todayAttendanceRate: number;
    todayPresentCount: number;
    todayAbsentCount: number;
    totalPendingDues: number;
    totalClearedStudents: number;
    totalPendingStudents: number;
    totalFeesCollectedAllTime: number;
    todayFeesCollected: number;
    todayExpenses: number;
    totalExpensesAllTime: number;
    netCashBalance: number;
    totalTeachers: number;
    activeTeachers: number;
    leftCampusTeachers: number;
    clearedSalaryTeachers: number;
    pendingSalaryTeachers: number;
    totalTeacherSalaryPending: number;
    teachersOnTimeToday: number;
  };

  // Data Safety & Backups
  lastBackupDate: string;
  exportBackupJSON: () => void;
  exportFullDatabaseJSON: () => string;
  importBackupJSON: (jsonStr: string) => { success: boolean; message: string };
  importDatabaseJSON: (jsonStr: string) => boolean;
  resetAllData: () => void;
  resetToFactoryData: () => void;

  // Redundancy CSV Exporters
  exportStudentsCSV: () => void;
  exportFinancialCSV: () => void;
  exportSalariesCSV: () => void;
  exportComprehensiveCSV: () => void;
}

const STORAGE_KEY = 'PREMIER_SCHOOL_DATA_V2';

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const todayDateStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [currentDivision, setCurrentDivision] = useState<Division>('School');

  // Initialize state from LocalStorage or Initial Data
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_STUDENTS`);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [teachers, setTeachers] = useState<Teacher[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TEACHERS`);
      return saved ? JSON.parse(saved) : INITIAL_TEACHERS;
    } catch {
      return INITIAL_TEACHERS;
    }
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_ATTENDANCE`);
      return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
    } catch {
      return INITIAL_ATTENDANCE;
    }
  });

  const [teacherAttendance, setTeacherAttendance] = useState<TeacherAttendanceRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_T_ATTENDANCE`);
      return saved ? JSON.parse(saved) : INITIAL_TEACHER_ATTENDANCE;
    } catch {
      return INITIAL_TEACHER_ATTENDANCE;
    }
  });

  const [fees, setFees] = useState<FeeTransaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_FEES`);
      return saved ? JSON.parse(saved) : INITIAL_FEE_TRANSACTIONS;
    } catch {
      return INITIAL_FEE_TRANSACTIONS;
    }
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_EXPENSES`);
      return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
    } catch {
      return INITIAL_EXPENSES;
    }
  });

  const [testSchedules, setTestSchedules] = useState<TestSchedule[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TESTS`);
      return saved ? JSON.parse(saved) : INITIAL_TEST_SCHEDULES;
    } catch {
      return INITIAL_TEST_SCHEDULES;
    }
  });

  const [testResults, setTestResults] = useState<StudentTestResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_RESULTS`);
      return saved ? JSON.parse(saved) : INITIAL_TEST_RESULTS;
    } catch {
      return INITIAL_TEST_RESULTS;
    }
  });

  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_EVENTS`);
      return saved ? JSON.parse(saved) : INITIAL_SCHOOL_EVENTS;
    } catch {
      return INITIAL_SCHOOL_EVENTS;
    }
  });

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TIMESLOTS`);
      return saved ? JSON.parse(saved) : INITIAL_TIME_SLOTS;
    } catch {
      return INITIAL_TIME_SLOTS;
    }
  });

  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEY}_TIMETABLE`);
      return saved ? JSON.parse(saved) : INITIAL_TIMETABLE_ENTRIES;
    } catch {
      return INITIAL_TIMETABLE_ENTRIES;
    }
  });

  const [lastBackupDate, setLastBackupDate] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_LAST_BACKUP`) || 'Never';
  });

  const [activePrintDoc, setActivePrintDoc] = useState<ActivePrintDoc>(null);

  // Sync to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_STUDENTS`, JSON.stringify(students));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_TEACHERS`, JSON.stringify(teachers));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [teachers]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_ATTENDANCE`, JSON.stringify(attendance));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [attendance]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_T_ATTENDANCE`, JSON.stringify(teacherAttendance));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [teacherAttendance]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_FEES`, JSON.stringify(fees));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [fees]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_EXPENSES`, JSON.stringify(expenses));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_TESTS`, JSON.stringify(testSchedules));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [testSchedules]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_RESULTS`, JSON.stringify(testResults));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [testResults]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_EVENTS`, JSON.stringify(events));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_TIMESLOTS`, JSON.stringify(timeSlots));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [timeSlots]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_TIMETABLE`, JSON.stringify(timetableEntries));
    } catch (e) {
      console.error('Storage quota error', e);
    }
  }, [timetableEntries]);

  // Student Attendance Statistics
  const getStudentAttendanceStats = (studentId: string) => {
    const studentRecords = attendance.filter((a) => a.studentId === studentId);
    if (studentRecords.length === 0) {
      return { total: 0, present: 0, absent: 0, late: 0, percentage: 100 };
    }
    const present = studentRecords.filter((a) => a.status === 'Present').length;
    const absent = studentRecords.filter((a) => a.status === 'Absent').length;
    const late = studentRecords.filter((a) => a.status === 'Late').length;
    // Late counts as 0.75 attendance
    const effectivePresent = present + late * 0.75;
    const percentage = Math.round((effectivePresent / studentRecords.length) * 100);
    return {
      total: studentRecords.length,
      present,
      absent,
      late,
      percentage
    };
  };

  const getStudentById = (id: string) => students.find((s) => s.id === id);

  // Student Actions
  const addStudent = (studentData: Omit<Student, 'id' | 'rollNo'> & { rollNo?: string }): Student => {
    const isSchool = studentData.division === 'School';
    const sameDiv = students.filter((s) => s.division === studentData.division);
    const highestRoll = sameDiv.reduce((max, s) => {
      const num = parseInt(s.rollNo, 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, isSchool ? 100 : 600);

    const newRoll = studentData.rollNo && studentData.rollNo.trim() !== '' ? studentData.rollNo.trim() : String(highestRoll + 1);
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      rollNo: newRoll,
      dob: studentData.dob || '2011-05-15',
      monthlyFee: studentData.monthlyFee || Math.round((studentData.totalFee || 4500) / 10),
      totalFee: Number(studentData.totalFee) || 4500,
      paidFee: Number(studentData.paidFee) || 0,
      discountFee: Number(studentData.discountFee) || 0,
      activeStatus: studentData.activeStatus || 'Active'
    };

    setStudents((prev) => [newStudent, ...prev]);

    // If initial fee was paid during admission, automatically record the fee transaction
    if (newStudent.paidFee > 0) {
      const initialFeeTx: FeeTransaction = {
        id: `fee-${Date.now()}`,
        receiptNo: `REC-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
        studentId: newStudent.id,
        studentName: newStudent.name,
        rollNo: newStudent.rollNo,
        division: newStudent.division,
        classGrade: newStudent.classGrade,
        amountPaid: newStudent.paidFee,
        discountApplied: newStudent.discountFee || 0,
        paymentDate: todayDateStr,
        paymentMonth: new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' }),
        paymentMethod: 'Cash',
        receivedBy: 'Admissions Office',
        remarks: 'Admission & Initial Session Fee'
      };
      setFees((prev) => [initialFeeTx, ...prev]);
    }

    // Automatically mark present for today
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const initialAtt: AttendanceRecord = {
      id: `att-${Date.now()}`,
      date: todayDateStr,
      studentId: newStudent.id,
      studentName: newStudent.name,
      rollNo: newStudent.rollNo,
      division: newStudent.division,
      classGrade: newStudent.classGrade,
      status: 'Present',
      timeIn: nowTime
    };
    setAttendance((prev) => [initialAtt, ...prev]);

    return newStudent;
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleStudentStatus = (id: string, targetStatus?: Student['activeStatus']) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (targetStatus) return { ...s, activeStatus: targetStatus };
        const nextStatus: Student['activeStatus'] = s.activeStatus === 'Active' ? 'Left Campus' : 'Active';
        return { ...s, activeStatus: nextStatus };
      })
    );
  };

  // Teacher Actions
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'facultyCode'>): Teacher => {
    const highestCode = teachers.reduce((max, t) => {
      const num = parseInt(t.facultyCode.replace(/\D/g, ''), 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, 100);

    const newCode = `T-${highestCode + 1}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id: `tch-${Date.now()}`,
      facultyCode: newCode,
      status: teacherData.status || 'Active'
    };

    setTeachers((prev) => [...prev, newTeacher]);
    return newTeacher;
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  const deleteTeacher = (id: string) => {
    setTeachers((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleTeacherStatus = (id: string, targetStatus?: Teacher['status']) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (targetStatus) return { ...t, status: targetStatus };
        const nextStatus: Teacher['status'] = t.status === 'Active' ? 'Left Campus' : 'Active';
        return { ...t, status: nextStatus };
      })
    );
  };

  const payTeacherSalary = (teacherId: string, amount: number, paymentDate: string, remarks?: string) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    setTeachers((prev) =>
      prev.map((t) => (t.id === teacherId ? { ...t, paidSalary: t.paidSalary + amount } : t))
    );

    // Also record an official school expense
    const voucherNo = `SAL-${Math.floor(1000 + Math.random() * 9000)}`;
    const newExpense: ExpenseItem = {
      id: `exp-${Date.now()}`,
      voucherNo,
      date: paymentDate || todayDateStr,
      category: 'Staff Refreshments',
      description: `Faculty Salary Disbursement: ${teacher.name} (${teacher.facultyCode}) - ${remarks || 'Monthly Salary'}`,
      amount,
      paidTo: teacher.name,
      paymentMode: 'Cash',
      approvedBy: 'Mudassar Asghar / Principal Office'
    };
    setExpenses((prev) => [newExpense, ...prev]);

    // Prepare print slip
    setActivePrintDoc({
      type: 'salary_slip',
      teacher: { ...teacher, paidSalary: teacher.paidSalary + amount },
      paidAmount: amount,
      date: paymentDate || todayDateStr,
      voucherNo
    });
  };

  const clearTeacherSalary = (teacherId: string, paymentDate = todayDateStr, remarks = 'Full Remaining Salary Clearance') => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;
    const pending = Math.max(0, teacher.monthlySalary - teacher.paidSalary);
    if (pending > 0) {
      payTeacherSalary(teacherId, pending, paymentDate, remarks);
    }
  };

  const recordTeacherAttendance = (
    teacherId: string,
    reportingTime: string,
    status: TeacherAttendanceStatus,
    date = todayDateStr
  ) => {
    const teacher = teachers.find((t) => t.id === teacherId);
    if (!teacher) return;

    setTeacherAttendance((prev) => {
      const existingIdx = prev.findIndex((a) => a.teacherId === teacherId && a.date === date);
      const newRec: TeacherAttendanceRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `tatt-${Date.now()}`,
        date,
        teacherId,
        teacherName: teacher.name,
        facultyCode: teacher.facultyCode,
        scheduledTime: teacher.reportingTime || '07:45 AM',
        actualReportingTime: reportingTime,
        status
      };
      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newRec;
        return copy;
      }
      return [newRec, ...prev];
    });
  };

  // Student Attendance Actions
  const markStudentAttendance = (
    studentId: string,
    status: AttendanceStatus,
    date = todayDateStr,
    remarks?: string
  ) => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return;

    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setAttendance((prev) => {
      const existingIdx = prev.findIndex((a) => a.studentId === studentId && a.date === date);
      const newRec: AttendanceRecord = {
        id: existingIdx >= 0 ? prev[existingIdx].id : `att-${Date.now()}-${studentId}`,
        date,
        studentId,
        studentName: student.name,
        rollNo: student.rollNo,
        division: student.division,
        classGrade: student.classGrade,
        status,
        timeIn: status === 'Present' || status === 'Late' ? timeNow : undefined,
        remarks
      };

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx] = newRec;
        return copy;
      }
      return [newRec, ...prev];
    });
  };

  const markBatchAttendance = (
    date: string,
    records: { studentId: string; status: AttendanceStatus }[]
  ) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAttendance((prev) => {
      const filtered = prev.filter((a) => a.date !== date);
      const newRecords: AttendanceRecord[] = records.map((r) => {
        const st = students.find((s) => s.id === r.studentId);
        return {
          id: `att-${Date.now()}-${r.studentId}`,
          date,
          studentId: r.studentId,
          studentName: st?.name || 'Student',
          rollNo: st?.rollNo || '000',
          division: st?.division || 'School',
          classGrade: st?.classGrade || '',
          status: r.status,
          timeIn: r.status === 'Present' || r.status === 'Late' ? timeNow : undefined
        };
      });
      return [...newRecords, ...filtered];
    });
  };

  // Fee Submissions
  const submitFee = (params: {
    studentId: string;
    amountPaid: number;
    discountApplied?: number;
    paymentMonth: string;
    paymentMethod: PaymentMethod;
    receivedBy: string;
    remarks?: string;
  }): FeeTransaction => {
    const student = students.find((s) => s.id === params.studentId);
    if (!student) throw new Error('Student not found');

    const discount = params.discountApplied || 0;
    const newPaid = student.paidFee + params.amountPaid;
    const newDiscount = (student.discountFee || 0) + discount;

    // Update Student Fee status
    setStudents((prev) =>
      prev.map((s) =>
        s.id === params.studentId
          ? {
              ...s,
              paidFee: newPaid,
              discountFee: newDiscount
            }
          : s
      )
    );

    const receiptNo = `PSS-REC-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo,
      studentId: student.id,
      studentName: student.name,
      rollNo: student.rollNo,
      division: student.division,
      classGrade: student.classGrade,
      amountPaid: params.amountPaid,
      discountApplied: discount,
      paymentDate: todayDateStr,
      paymentMonth: params.paymentMonth,
      paymentMethod: params.paymentMethod,
      receivedBy: params.receivedBy || 'Admin / Mudassar Asghar',
      remarks: params.remarks
    };

    setFees((prev) => [newTx, ...prev]);

    // Open print voucher preview
    setActivePrintDoc({
      type: 'fee_receipt',
      data: newTx,
      student: { ...student, paidFee: newPaid }
    });

    return newTx;
  };

  const clearStudentFee = (
    studentId: string,
    paymentMonth = 'Current Session Clearance',
    paymentMethod: PaymentMethod = 'Cash',
    receivedBy = 'Admin / Mudassar Asghar',
    remarks = 'Full Pending Dues Cleared'
  ): FeeTransaction | undefined => {
    const student = students.find((s) => s.id === studentId);
    if (!student) return undefined;

    const pending = Math.max(0, student.totalFee - student.paidFee - (student.discountFee || 0));
    if (pending <= 0) return undefined;

    return submitFee({
      studentId,
      amountPaid: pending,
      paymentMonth,
      paymentMethod,
      receivedBy,
      remarks
    });
  };

  const deleteFeeTransaction = (id: string) => {
    setFees((prev) => prev.filter((f) => f.id !== id));
  };

  // Expenses
  const addExpense = (expenseData: Omit<ExpenseItem, 'id' | 'voucherNo'>): ExpenseItem => {
    const voucherNo = `EXP-${Math.floor(100 + Math.random() * 900)}`;
    const newExp: ExpenseItem = {
      ...expenseData,
      id: `exp-${Date.now()}`,
      voucherNo
    };
    setExpenses((prev) => [newExp, ...prev]);
    return newExp;
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  // Tests & Progress
  const addTestSchedule = (testData: Omit<TestSchedule, 'id'>): TestSchedule => {
    const newTest: TestSchedule = {
      ...testData,
      id: `test-${Date.now()}`
    };
    setTestSchedules((prev) => [newTest, ...prev]);
    return newTest;
  };

  const deleteTestSchedule = (id: string) => {
    setTestSchedules((prev) => prev.filter((t) => t.id !== id));
    setTestResults((prev) => prev.filter((r) => r.testId !== id));
  };

  const addOrUpdateTestResult = (resultData: Omit<StudentTestResult, 'id'>) => {
    setTestResults((prev) => {
      const idx = prev.findIndex(
        (r) => r.testId === resultData.testId && r.studentId === resultData.studentId
      );
      const newResult: StudentTestResult = {
        ...resultData,
        id: idx >= 0 ? prev[idx].id : `res-${Date.now()}`
      };
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newResult;
        return copy;
      }
      return [newResult, ...prev];
    });
  };

  // Events & PTM
  const addSchoolEvent = (eventData: Omit<SchoolEvent, 'id'>): SchoolEvent => {
    const newEv: SchoolEvent = {
      ...eventData,
      id: `ev-${Date.now()}`
    };
    setEvents((prev) => [newEv, ...prev]);
    return newEv;
  };

  const deleteSchoolEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  // Timetable Actions
  const addTimetableEntry = (entryData: Omit<TimetableEntry, 'id'>): TimetableEntry => {
    const newEntry: TimetableEntry = {
      ...entryData,
      id: `tt-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };
    setTimetableEntries((prev) => [...prev, newEntry]);
    return newEntry;
  };

  const updateTimetableEntry = (id: string, updates: Partial<TimetableEntry>) => {
    setTimetableEntries((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetableEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const setOrReplaceTimetableEntry = (slotData: {
    division: Division;
    classGrade: string;
    section?: string;
    day: DayOfWeek;
    timeSlotId: string;
    subject: string;
    teacherId?: string;
    teacherName?: string;
    roomNo?: string;
    colorTag?: TimetableColorTag;
    notes?: string;
  }): TimetableEntry => {
    let resultEntry: TimetableEntry;
    setTimetableEntries((prev) => {
      const existingIdx = prev.findIndex(
        (e) =>
          e.division === slotData.division &&
          e.classGrade === slotData.classGrade &&
          e.day === slotData.day &&
          e.timeSlotId === slotData.timeSlotId
      );

      if (existingIdx >= 0) {
        resultEntry = {
          ...prev[existingIdx],
          ...slotData
        };
        const copy = [...prev];
        copy[existingIdx] = resultEntry;
        return copy;
      } else {
        resultEntry = {
          id: `tt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          ...slotData
        };
        return [...prev, resultEntry];
      }
    });
    return resultEntry!;
  };

  const batchUpdateTimetable = (entriesToUpdate: TimetableEntry[]) => {
    setTimetableEntries((prev) => {
      const copy = [...prev];
      entriesToUpdate.forEach((updated) => {
        const idx = copy.findIndex((e) => e.id === updated.id);
        if (idx >= 0) {
          copy[idx] = updated;
        } else {
          copy.push(updated);
        }
      });
      return copy;
    });
  };

  const copyTimetableDay = (
    division: Division,
    classGrade: string,
    sourceDay: DayOfWeek,
    targetDays: DayOfWeek[]
  ) => {
    setTimetableEntries((prev) => {
      // Find source day entries for this class
      const sourceEntries = prev.filter(
        (e) => e.division === division && e.classGrade === classGrade && e.day === sourceDay
      );

      // Remove existing entries for target days for this class
      const remaining = prev.filter(
        (e) => !(e.division === division && e.classGrade === classGrade && targetDays.includes(e.day))
      );

      // Create new cloned entries for each target day
      const cloned: TimetableEntry[] = [];
      targetDays.forEach((targetDay) => {
        sourceEntries.forEach((src) => {
          cloned.push({
            ...src,
            id: `tt-${Date.now()}-${Math.floor(Math.random() * 100000)}`,
            day: targetDay
          });
        });
      });

      return [...remaining, ...cloned];
    });
  };

  const clearClassTimetable = (division: Division, classGrade: string) => {
    setTimetableEntries((prev) =>
      prev.filter((e) => !(e.division === division && e.classGrade === classGrade))
    );
  };

  const resetTimetableToDefault = () => {
    setTimeSlots(INITIAL_TIME_SLOTS);
    setTimetableEntries(INITIAL_TIMETABLE_ENTRIES);
  };

  const addTimeSlot = (slotData: Omit<TimeSlot, 'id'>): TimeSlot => {
    const newSlot: TimeSlot = {
      ...slotData,
      id: `slot-${Date.now()}`
    };
    setTimeSlots((prev) => [...prev, newSlot]);
    return newSlot;
  };

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const deleteTimeSlot = (id: string) => {
    setTimeSlots((prev) => prev.filter((s) => s.id !== id));
    setTimetableEntries((prev) => prev.filter((e) => e.timeSlotId !== id));
  };

  // System Stats calculation
  const stats = useMemo(() => {
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.activeStatus === 'Active' || !s.activeStatus).length;
    const leftCampusStudents = students.filter((s) => s.activeStatus === 'Left Campus' || s.activeStatus === 'Struck Off' || s.activeStatus === 'Passed Out').length;
    const schoolStudents = students.filter((s) => s.division === 'School').length;
    const academyStudents = students.filter((s) => s.division === 'Academy').length;

    // Today attendance
    const todayAtt = attendance.filter((a) => a.date === todayDateStr);
    const todayPresent = todayAtt.filter((a) => a.status === 'Present' || a.status === 'Late').length;
    const todayAbsent = todayAtt.filter((a) => a.status === 'Absent').length;
    const todayRate = totalStudents > 0 ? Math.round((todayPresent / totalStudents) * 100) : 0;

    // Student fee clearance
    let totalClearedStudents = 0;
    let totalPendingStudents = 0;
    let totalPendingDues = 0;

    students.forEach((s) => {
      const due = s.totalFee - s.paidFee - (s.discountFee || 0);
      if (due > 0) {
        totalPendingDues += due;
        totalPendingStudents += 1;
      } else {
        totalClearedStudents += 1;
      }
    });

    // Total fees collected
    const totalFeesCollectedAllTime = fees.reduce((sum, f) => sum + f.amountPaid, 0);
    const todayFeesCollected = fees
      .filter((f) => f.paymentDate === todayDateStr)
      .reduce((sum, f) => sum + f.amountPaid, 0);

    // Expenses
    const totalExpensesAllTime = expenses.reduce((sum, e) => sum + e.amount, 0);
    const todayExpenses = expenses
      .filter((e) => e.date === todayDateStr)
      .reduce((sum, e) => sum + e.amount, 0);

    const netCashBalance = totalFeesCollectedAllTime - totalExpensesAllTime;

    // Teacher salaries
    const totalTeachers = teachers.length;
    const activeTeachers = teachers.filter((t) => t.status === 'Active' || !t.status).length;
    const leftCampusTeachers = teachers.filter((t) => t.status === 'Left Campus' || t.status === 'Resigned').length;

    let clearedSalaryTeachers = 0;
    let pendingSalaryTeachers = 0;
    let totalTeacherSalaryPending = 0;

    teachers.forEach((t) => {
      const due = t.monthlySalary - t.paidSalary;
      if (due > 0) {
        totalTeacherSalaryPending += due;
        pendingSalaryTeachers += 1;
      } else {
        clearedSalaryTeachers += 1;
      }
    });

    const todayTAtt = teacherAttendance.filter((ta) => ta.date === todayDateStr);
    const teachersOnTimeToday = todayTAtt.filter((ta) => ta.status === 'On Time').length;

    return {
      totalStudents,
      activeStudents,
      leftCampusStudents,
      schoolStudents,
      academyStudents,
      todayAttendanceRate: todayRate,
      todayPresentCount: todayPresent,
      todayAbsentCount: todayAbsent,
      totalPendingDues,
      totalClearedStudents,
      totalPendingStudents,
      totalFeesCollectedAllTime,
      todayFeesCollected,
      todayExpenses,
      totalExpensesAllTime,
      netCashBalance,
      totalTeachers,
      activeTeachers,
      leftCampusTeachers,
      clearedSalaryTeachers,
      pendingSalaryTeachers,
      totalTeacherSalaryPending,
      teachersOnTimeToday
    };
  }, [students, teachers, attendance, teacherAttendance, fees, expenses, todayDateStr]);

  // Data Safety / JSON Export
  const exportFullDatabaseJSON = (): string => {
    const fullBackup = {
      appName: 'Premier School System and Science Academy',
      version: '2.0',
      exportedAt: new Date().toISOString(),
      developer: 'Mudassar Asghar',
      data: {
        students,
        teachers,
        attendance,
        teacherAttendance,
        fees,
        expenses,
        testSchedules,
        testResults,
        events,
        timeSlots,
        timetableEntries
      }
    };
    return JSON.stringify(fullBackup, null, 2);
  };

  const exportBackupJSON = () => {
    const jsonStr = exportFullDatabaseJSON();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonStr);
    const downloadAnchor = document.createElement('a');
    const filename = `Premier_School_System_Backup_${todayDateStr}.json`;
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', filename);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    const timestamp = new Date().toLocaleString();
    setLastBackupDate(timestamp);
    localStorage.setItem(`${STORAGE_KEY}_LAST_BACKUP`, timestamp);
  };

  const importBackupJSON = (jsonStr: string): { success: boolean; message: string } => {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.data || !Array.isArray(parsed.data.students)) {
        return { success: false, message: 'Invalid backup file structure. Missing data entities.' };
      }

      setStudents(parsed.data.students || []);
      setTeachers(parsed.data.teachers || []);
      setAttendance(parsed.data.attendance || []);
      setTeacherAttendance(parsed.data.teacherAttendance || []);
      setFees(parsed.data.fees || []);
      setExpenses(parsed.data.expenses || []);
      setTestSchedules(parsed.data.testSchedules || []);
      setTestResults(parsed.data.testResults || []);
      setEvents(parsed.data.events || []);
      if (Array.isArray(parsed.data.timeSlots)) {
        setTimeSlots(parsed.data.timeSlots);
      }
      if (Array.isArray(parsed.data.timetableEntries)) {
        setTimetableEntries(parsed.data.timetableEntries);
      }

      const timestamp = `Restored on ${new Date().toLocaleString()}`;
      setLastBackupDate(timestamp);
      localStorage.setItem(`${STORAGE_KEY}_LAST_BACKUP`, timestamp);

      return { success: true, message: 'All school database records restored successfully without any data loss!' };
    } catch (err: any) {
      return { success: false, message: `Failed to parse backup JSON: ${err.message}` };
    }
  };

  const importDatabaseJSON = (jsonStr: string): boolean => {
    const res = importBackupJSON(jsonStr);
    return res.success;
  };

  const resetAllData = () => {
    setStudents(INITIAL_STUDENTS);
    setTeachers(INITIAL_TEACHERS);
    setAttendance(INITIAL_ATTENDANCE);
    setTeacherAttendance(INITIAL_TEACHER_ATTENDANCE);
    setFees(INITIAL_FEE_TRANSACTIONS);
    setExpenses(INITIAL_EXPENSES);
    setTestSchedules(INITIAL_TEST_SCHEDULES);
    setTestResults(INITIAL_TEST_RESULTS);
    setEvents(INITIAL_SCHOOL_EVENTS);
    setTimeSlots(INITIAL_TIME_SLOTS);
    setTimetableEntries(INITIAL_TIMETABLE_ENTRIES);
  };

  const resetToFactoryData = () => {
    resetAllData();
  };

  // Redundancy CSV Exporters
  const downloadCSVHelper = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportStudentsCSV = () => {
    const headers = [
      'Roll No',
      'Student Name',
      'Father Name',
      'Division',
      'Class / Grade',
      'Gender',
      'Date of Birth',
      'Parent Contact',
      'Emergency Contact',
      'Total Session Fee',
      'Paid Fee',
      'Discount Fee',
      'Pending Balance',
      'Fee Status',
      'Attendance Percentage',
      'Campus Status',
      'Admission Date',
      'Blood Group',
      'Address'
    ];

    const rows = students.map((s) => {
      const due = s.totalFee - s.paidFee - (s.discountFee || 0);
      const att = getStudentAttendanceStats(s.id);
      return [
        s.rollNo,
        `"${(s.name || '').replace(/"/g, '""')}"`,
        `"${(s.fatherName || '').replace(/"/g, '""')}"`,
        s.division,
        `"${s.classGrade}"`,
        s.gender,
        s.dob || '',
        `"${s.parentContact}"`,
        `"${s.emergencyContact}"`,
        s.totalFee,
        s.paidFee,
        s.discountFee || 0,
        Math.max(0, due),
        due <= 0 ? 'Cleared' : 'Pending',
        `${att.percentage}%`,
        s.activeStatus || 'Active',
        s.admissionDate,
        s.bloodGroup || 'O+',
        `"${(s.address || '').replace(/"/g, '""')}"`
      ];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSVHelper(csv, `PREMIER_SCHOOL_STUDENTS_${todayDateStr}.csv`);
  };

  const exportFinancialCSV = () => {
    // 1. Fee Transactions
    const feeHeaders = ['Type', 'Receipt / Voucher #', 'Date', 'Person / Student', 'Class / Category', 'Payment Month / Mode', 'Amount Received (PKR)', 'Amount Disbursed (PKR)', 'Received / Approved By', 'Remarks'];
    
    const feeRows = fees.map((f) => [
      'FEE_RECEIPT',
      f.receiptNo,
      f.paymentDate,
      `"${f.studentName} (Roll #${f.rollNo})"`,
      `"${f.classGrade} (${f.division})"`,
      `"${f.paymentMonth} via ${f.paymentMethod}"`,
      f.amountPaid,
      0,
      `"${f.receivedBy}"`,
      `"${(f.remarks || '').replace(/"/g, '""')}"`
    ]);

    const expenseRows = expenses.map((e) => [
      'CAMPUS_EXPENSE',
      e.voucherNo,
      e.date,
      `"${e.paidTo}"`,
      `"${e.category}"`,
      `"${e.paymentMode}"`,
      0,
      e.amount,
      `"${e.approvedBy}"`,
      `"${(e.description || '').replace(/"/g, '""')}"`
    ]);

    const totalIn = fees.reduce((sum, f) => sum + f.amountPaid, 0);
    const totalOut = expenses.reduce((sum, e) => sum + e.amount, 0);
    const net = totalIn - totalOut;

    const summaryRows = [
      [],
      ['=== FINANCIAL AUDIT SUMMARY ==='],
      ['Total Student Fees Collected (PKR)', totalIn],
      ['Total Operational Expenses Disbursed (PKR)', totalOut],
      ['Net Campus Cash Balance (PKR)', net],
      ['Total Student Pending Dues (PKR)', stats.totalPendingDues],
      ['Total Teacher Pending Salary (PKR)', stats.totalTeacherSalaryPending]
    ];

    const csv = [
      feeHeaders.join(','),
      ...feeRows.map((r) => r.join(',')),
      ...expenseRows.map((r) => r.join(',')),
      ...summaryRows.map((r) => r.join(','))
    ].join('\n');

    downloadCSVHelper(csv, `PREMIER_SCHOOL_FINANCIAL_LEDGER_${todayDateStr}.csv`);
  };

  const exportSalariesCSV = () => {
    const headers = [
      'Faculty Code',
      'Teacher Name',
      'Qualification',
      'Subject Taught',
      'Monthly Salary (PKR)',
      'Paid Salary So Far (PKR)',
      'Pending Salary (PKR)',
      'Salary Status',
      'Shift Reporting Time',
      'Mobile Phone',
      'Campus Status',
      'Joining Date',
      'Assigned Classes'
    ];

    const rows = teachers.map((t) => {
      const pending = Math.max(0, t.monthlySalary - t.paidSalary);
      return [
        t.facultyCode,
        `"${t.name}"`,
        `"${t.qualification}"`,
        `"${t.subject}"`,
        t.monthlySalary,
        t.paidSalary,
        pending,
        pending <= 0 ? 'Cleared' : 'Pending',
        t.reportingTime || '07:45 AM',
        `"${t.mobileNumber}"`,
        t.status || 'Active',
        t.joiningDate,
        `"${(t.assignedClasses || []).join('; ')}"`
      ];
    });

    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    downloadCSVHelper(csv, `PREMIER_SCHOOL_FACULTY_PAYROLL_${todayDateStr}.csv`);
  };

  const exportComprehensiveCSV = () => {
    // Single consolidated CSV file with sections for Students, Fee Collections, Expenses, and Faculty Payroll
    const lines: string[] = [];
    lines.push('PREMIER SCHOOL SYSTEM & SCIENCE ACADEMY - PHYSICAL REDUNDANCY DATA ARCHIVE');
    lines.push(`Export Date: ${todayDateStr}, Lead Engineer: Mudassar Asghar`);
    lines.push('');
    lines.push('===============================================================');
    lines.push('SECTION 1: STUDENT ROSTER & FEE STATUS');
    lines.push('===============================================================');
    lines.push('Roll No,Student Name,Father Name,Division,Class,Parent Contact,Total Fee,Paid Fee,Pending Balance,Fee Status,Attendance Rate,Campus Status');
    
    students.forEach((s) => {
      const due = s.totalFee - s.paidFee - (s.discountFee || 0);
      const att = getStudentAttendanceStats(s.id);
      lines.push(`${s.rollNo},"${s.name}","${s.fatherName}",${s.division},"${s.classGrade}","${s.parentContact}",${s.totalFee},${s.paidFee},${Math.max(0, due)},${due <= 0 ? 'Cleared' : 'Pending'},${att.percentage}%,${s.activeStatus || 'Active'}`);
    });

    lines.push('');
    lines.push('===============================================================');
    lines.push('SECTION 2: FACULTY DIRECTORY & PAYROLL');
    lines.push('===============================================================');
    lines.push('Faculty Code,Teacher Name,Subject,Qualification,Monthly Salary,Paid Salary,Pending Salary,Salary Status,Campus Status,Reporting Time,Mobile Phone');

    teachers.forEach((t) => {
      const pending = Math.max(0, t.monthlySalary - t.paidSalary);
      lines.push(`${t.facultyCode},"${t.name}","${t.subject}","${t.qualification}",${t.monthlySalary},${t.paidSalary},${pending},${pending <= 0 ? 'Cleared' : 'Pending'},${t.status || 'Active'},${t.reportingTime || '07:45 AM'},"${t.mobileNumber}"`);
    });

    lines.push('');
    lines.push('===============================================================');
    lines.push('SECTION 3: FEE COLLECTION TRANSACTIONS');
    lines.push('===============================================================');
    lines.push('Receipt No,Date,Student Name,Roll No,Class,Payment Month,Amount Paid (PKR),Payment Method,Received By');

    fees.forEach((f) => {
      lines.push(`${f.receiptNo},${f.paymentDate},"${f.studentName}",${f.rollNo},"${f.classGrade}","${f.paymentMonth}",${f.amountPaid},"${f.paymentMethod}","${f.receivedBy}"`);
    });

    lines.push('');
    lines.push('===============================================================');
    lines.push('SECTION 4: CAMPUS OPERATIONAL EXPENSES');
    lines.push('===============================================================');
    lines.push('Voucher No,Date,Category,Paid To,Description,Amount (PKR),Payment Mode,Approved By');

    expenses.forEach((e) => {
      lines.push(`${e.voucherNo},${e.date},"${e.category}","${e.paidTo}","${(e.description || '').replace(/"/g, '""')}",${e.amount},"${e.paymentMode}","${e.approvedBy}"`);
    });

    lines.push('');
    lines.push('===============================================================');
    lines.push('SECTION 5: FINANCIAL & CAMPUS AUDIT RECONCILIATION');
    lines.push('===============================================================');
    lines.push(`Total Students,${stats.totalStudents}`);
    lines.push(`Active Students,${stats.activeStudents}`);
    lines.push(`Left Campus / Inactive Students,${stats.leftCampusStudents}`);
    lines.push(`Fee Cleared Students,${stats.totalClearedStudents}`);
    lines.push(`Fee Pending Defaulter Students,${stats.totalPendingStudents}`);
    lines.push(`Total Outstanding Student Dues (PKR),${stats.totalPendingDues}`);
    lines.push(`Total Fees Collected All-Time (PKR),${stats.totalFeesCollectedAllTime}`);
    lines.push(`Total Campus Expenses All-Time (PKR),${stats.totalExpensesAllTime}`);
    lines.push(`Net In-Hand Cash Balance (PKR),${stats.netCashBalance}`);
    lines.push(`Total Teachers,${stats.totalTeachers}`);
    lines.push(`Active Faculty,${stats.activeTeachers}`);
    lines.push(`Left Campus Faculty,${stats.leftCampusTeachers}`);
    lines.push(`Faculty with Cleared Salary,${stats.clearedSalaryTeachers}`);
    lines.push(`Faculty with Pending Salary,${stats.pendingSalaryTeachers}`);
    lines.push(`Total Outstanding Teacher Salary (PKR),${stats.totalTeacherSalaryPending}`);

    downloadCSVHelper(lines.join('\n'), `PREMIER_SCHOOL_MASTER_REDUNDANCY_DATA_${todayDateStr}.csv`);
  };

  return (
    <SchoolContext.Provider
      value={{
        students,
        teachers,
        attendance,
        teacherAttendance,
        fees,
        expenses,
        testSchedules,
        testResults,
        events,
        timeSlots,
        timetableEntries,
        activePrintDoc,
        setActivePrintDoc,

        currentDivision,
        setCurrentDivision,

        addStudent,
        updateStudent,
        deleteStudent,
        toggleStudentStatus,
        getStudentById,
        getStudentAttendanceStats,

        addTeacher,
        updateTeacher,
        deleteTeacher,
        toggleTeacherStatus,
        payTeacherSalary,
        clearTeacherSalary,
        recordTeacherAttendance,

        markStudentAttendance,
        markBatchAttendance,

        submitFee,
        recordFeePayment: submitFee,
        clearStudentFee,
        deleteFeeTransaction,

        addExpense,
        recordExpense: addExpense,
        deleteExpense,

        addTestSchedule,
        deleteTestSchedule,
        addOrUpdateTestResult,

        addSchoolEvent,
        deleteSchoolEvent,

        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        setOrReplaceTimetableEntry,
        batchUpdateTimetable,
        copyTimetableDay,
        clearClassTimetable,
        resetTimetableToDefault,
        addTimeSlot,
        updateTimeSlot,
        deleteTimeSlot,

        todayDateStr,
        stats,

        lastBackupDate,
        exportBackupJSON,
        exportFullDatabaseJSON,
        importBackupJSON,
        importDatabaseJSON,
        resetAllData,
        resetToFactoryData,

        exportStudentsCSV,
        exportFinancialCSV,
        exportSalariesCSV,
        exportComprehensiveCSV
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
