export type Division = 'School' | 'Academy';

export type AttendanceStatus = 'Present' | 'Absent' | 'Late' | 'Leave';
export type TeacherAttendanceStatus = 'On Time' | 'Late' | 'Absent' | 'Leave';

export type PaymentMethod = 'Cash' | 'Online / Bank' | 'Cheque' | 'EasyPaisa / JazzCash';

export interface Student {
  id: string;
  rollNo: string;
  division: Division;
  name: string;
  fatherName: string;
  classGrade: string; // e.g. "Grade 9 - Science", "Grade 10 - Arts", "F.Sc Pre-Medical Part-1"
  section?: string;
  gender: 'Male' | 'Female';
  dob: string;
  parentContact: string; // 03xx-xxxxxxx
  emergencyContact: string;
  address: string;
  admissionDate: string;
  monthlyFee: number;
  totalFee: number; // Annual/Session total
  paidFee: number;
  discountFee: number;
  bloodGroup?: string;
  academicRemarks?: string;
  activeStatus: 'Active' | 'Left Campus' | 'Struck Off' | 'Passed Out';
}

export interface Teacher {
  id: string;
  facultyCode: string; // e.g. "T-101"
  name: string;
  fatherOrHusbandName: string;
  qualification: string; // e.g. "M.Phil Physics", "M.Sc Mathematics"
  subject: string; // e.g. "Physics & Chemistry"
  mobileNumber: string;
  email?: string;
  joiningDate: string;
  monthlySalary: number;
  paidSalary: number; // for current cycle
  reportingTime: string; // e.g. "07:45 AM"
  assignedClasses: string[];
  status: 'Active' | 'Left Campus' | 'On Leave' | 'Resigned';
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  studentName: string;
  rollNo: string;
  division: Division;
  classGrade: string;
  status: AttendanceStatus;
  timeIn?: string;
  remarks?: string;
}

export interface TeacherAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  teacherId: string;
  teacherName: string;
  facultyCode: string;
  scheduledTime: string;
  actualReportingTime: string;
  status: TeacherAttendanceStatus;
  remarks?: string;
}

export interface FeeTransaction {
  id: string;
  receiptNo: string; // e.g. "REC-2026-0042"
  studentId: string;
  studentName: string;
  rollNo: string;
  division: Division;
  classGrade: string;
  amountPaid: number;
  discountApplied: number;
  paymentDate: string;
  paymentMonth: string; // e.g. "August 2026"
  paymentMethod: PaymentMethod;
  receivedBy: string;
  remarks?: string;
}

export type ExpenseCategory =
  | 'Electricity & Utility'
  | 'Stationery & Printing'
  | 'Science Lab Supplies'
  | 'Staff Refreshments'
  | 'Building Maintenance'
  | 'Building Rent'
  | 'Examination Papers'
  | 'Sports & Activities'
  | 'Advertising & Prospectus'
  | 'Miscellaneous';

export interface ExpenseItem {
  id: string;
  voucherNo: string; // e.g. "EXP-109"
  date: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  paidTo: string;
  paymentMode: 'Cash' | 'Online Bank' | 'Cheque';
  approvedBy: string;
}

export interface TestSchedule {
  id: string;
  testTitle: string; // e.g. "1st Monthly Test", "Mid Term Examination"
  sessionName: '1st Term' | 'Mid Term' | 'Final Term' | 'Weekly Assessment' | 'Send-Up Exam';
  classGrade: string;
  division: Division;
  subject: string;
  testDate: string;
  startTime: string;
  totalMarks: number;
  passingMarks: number;
  roomNo: string;
  syllabusCovered: string;
}

export interface StudentTestResult {
  id: string;
  testId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  classGrade: string;
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string; // A+, A, B, C, D, F
  remarks: string;
  evaluatedDate: string;
}

export interface SchoolEvent {
  id: string;
  title: string;
  eventType: 'PTM' | 'Science Fair' | 'Sports Gala' | 'Exam Notification' | 'Holiday Announcement' | 'Annual Function';
  eventDate: string;
  eventTime: string;
  targetDivision: 'All' | 'School' | 'Academy';
  targetClass: string; // "All Classes" or specific
  description: string;
  venue: string;
  broadcastTemplate: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimeSlot {
  id: string;
  periodNumber: number;
  periodName: string; // e.g. "Morning Assembly", "Period 1", "Period 2", "Recess / Break", etc.
  startTime: string; // e.g. "08:00 AM"
  endTime: string; // e.g. "08:45 AM"
  isBreak?: boolean;
}

export type TimetableColorTag = 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'indigo' | 'cyan' | 'slate';

export interface TimetableEntry {
  id: string;
  division: Division;
  classGrade: string; // e.g. "Grade 9 - Science"
  section?: string; // e.g. "A"
  day: DayOfWeek;
  timeSlotId: string;
  subject: string;
  teacherId?: string;
  teacherName?: string;
  roomNo?: string;
  colorTag?: TimetableColorTag;
  notes?: string;
}
