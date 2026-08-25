import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  GraduationCap,
  Atom,
  User,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Receipt,
  Heart,
  FileText,
  Sparkles,
  CheckCircle2,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useSchool } from '../context/SchoolContext';
import { Division, Student, PaymentMethod } from '../types';

interface NewAdmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDivision?: Division;
  onAdmissionSuccess?: (student: Student) => void;
}

const SCHOOL_CLASSES = [
  'Playgroup / Nursery',
  'Prep / KG',
  'Class 1st',
  'Class 2nd',
  'Class 3rd',
  'Class 4th',
  'Class 5th',
  'Class 6th',
  'Class 7th',
  'Class 8th',
  'Grade 9 - Science',
  'Grade 9 - Arts / Computer',
  'Grade 10 - Science',
  'Grade 10 - Arts / Computer'
];

const ACADEMY_CLASSES = [
  '9th Science Evening Coaching',
  '10th Science Evening Coaching',
  '1st Year F.Sc Pre-Medical',
  '1st Year F.Sc Pre-Engineering',
  '1st Year ICS Computer Science',
  '2nd Year F.Sc Pre-Medical',
  '2nd Year F.Sc Pre-Engineering',
  '2nd Year ICS Computer Science',
  'MDCAT / ECAT Entry Test Prep',
  'Matric Board Revision Crash Course'
];

export const NewAdmissionModal: React.FC<NewAdmissionModalProps> = ({
  isOpen,
  onClose,
  defaultDivision = 'School',
  onAdmissionSuccess
}) => {
  const { students, addStudent, setActivePrintDoc } = useSchool();

  const [division, setDivision] = useState<Division>(defaultDivision);
  const [name, setName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [classGrade, setClassGrade] = useState('');
  const [customClass, setCustomClass] = useState('');
  const [isCustomClass, setIsCustomClass] = useState(false);
  const [section, setSection] = useState('A');
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [dob, setDob] = useState('2011-05-15');
  const [parentContact, setParentContact] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [address, setAddress] = useState('');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [totalFee, setTotalFee] = useState<number>(4500);
  const [paidFee, setPaidFee] = useState<number>(0);
  const [discountFee, setDiscountFee] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [academicRemarks, setAcademicRemarks] = useState('');
  const [submittedStudent, setSubmittedStudent] = useState<Student | null>(null);

  // Auto-calculate next Roll Number whenever division changes
  useEffect(() => {
    if (isOpen) {
      setDivision(defaultDivision);
      const isSchool = defaultDivision === 'School';
      const sameDiv = students.filter((s) => s.division === defaultDivision);
      const highestRoll = sameDiv.reduce((max, s) => {
        const num = parseInt(s.rollNo, 10);
        return isNaN(num) ? max : Math.max(max, num);
      }, isSchool ? 100 : 600);

      setRollNo(String(highestRoll + 1));
      setClassGrade(isSchool ? 'Grade 9 - Science' : '9th Science Evening Coaching');
      setTotalFee(isSchool ? 4500 : 6500);
      setPaidFee(0);
      setDiscountFee(0);
      setName('');
      setFatherName('');
      setParentContact('');
      setEmergencyContact('');
      setAddress('');
      setAcademicRemarks('');
      setSubmittedStudent(null);
      setIsCustomClass(false);
      setCustomClass('');
    }
  }, [isOpen, defaultDivision, students]);

  const handleDivisionChange = (newDiv: Division) => {
    setDivision(newDiv);
    const isSchool = newDiv === 'School';
    const sameDiv = students.filter((s) => s.division === newDiv);
    const highestRoll = sameDiv.reduce((max, s) => {
      const num = parseInt(s.rollNo, 10);
      return isNaN(num) ? max : Math.max(max, num);
    }, isSchool ? 100 : 600);

    setRollNo(String(highestRoll + 1));
    setClassGrade(isSchool ? 'Grade 9 - Science' : '9th Science Evening Coaching');
    setTotalFee(isSchool ? 4500 : 6500);
    setIsCustomClass(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      return;
    }

    const finalClass = isCustomClass ? (customClass.trim() || 'General Class') : classGrade;

    const created = addStudent({
      name: name.trim(),
      fatherName: fatherName.trim() || 'Guardian',
      rollNo: rollNo.trim(),
      division,
      classGrade: finalClass,
      section: section.trim() || 'A',
      gender,
      dob: dob || '2011-01-01',
      parentContact: parentContact.trim() || '0300-0000000',
      emergencyContact: emergencyContact.trim() || parentContact.trim() || '0300-0000000',
      address: address.trim() || 'Campus area',
      bloodGroup,
      admissionDate: new Date().toISOString().split('T')[0],
      monthlyFee: Math.round(Number(totalFee) / 10) || 4500,
      totalFee: Number(totalFee) || 4500,
      paidFee: Number(paidFee) || 0,
      discountFee: Number(discountFee) || 0,
      activeStatus: 'Active',
      academicRemarks: academicRemarks.trim() || 'New student admitted in current session.'
    });

    setSubmittedStudent(created);
    confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });

    if (onAdmissionSuccess) {
      onAdmissionSuccess(created);
    }
  };

  const handlePrintAdmissionCard = () => {
    if (!submittedStudent) return;
    setActivePrintDoc({
      type: 'report_card',
      data: submittedStudent,
      student: submittedStudent,
      results: []
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/40 text-blue-300 flex items-center justify-center shadow-inner">
              <Plus className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-black text-lg sm:text-xl tracking-tight text-white">
                  New Student Admission & Enrollment
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Instant Registration
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Premier School System & Science Academy • Official Campus Register
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Success Confirmation State */}
        {submittedStudent ? (
          <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-center animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black text-slate-900">
                Admission Successfully Confirmed!
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Student <strong className="text-slate-900 font-bold">{submittedStudent.name}</strong> has been assigned Roll Number <strong className="text-blue-700 font-mono font-black">#{submittedStudent.rollNo}</strong> in {submittedStudent.division === 'School' ? 'School Wing' : 'Science Academy'}.
              </p>
            </div>

            {/* Student Quick Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left max-w-lg mx-auto space-y-2 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Roll Number:</span>
                <span className="font-mono font-black text-blue-700">#{submittedStudent.rollNo}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Class / Track:</span>
                <span className="font-bold text-slate-900">{submittedStudent.classGrade} ({submittedStudent.division})</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Father / Guardian:</span>
                <span className="font-bold text-slate-900">{submittedStudent.fatherName}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Parent Contact:</span>
                <span className="font-mono font-bold text-slate-800">{submittedStudent.parentContact}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500 font-semibold">Session Total Fee:</span>
                <span className="font-mono font-bold text-slate-900">Rs. {submittedStudent.totalFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-semibold">Admission Deposit Paid:</span>
                <span className="font-mono font-black text-emerald-600">Rs. {submittedStudent.paidFee.toLocaleString()}</span>
              </div>
            </div>

            {/* Success Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3 max-w-md mx-auto">
              <button
                onClick={handlePrintAdmissionCard}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Printer className="w-4 h-4" />
                Print Admission Slip
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md cursor-pointer transition-all"
              >
                View in Students Roster
              </button>
            </div>
          </div>
        ) : (
          /* Admission Form */
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
            
            {/* Division Selector Tabs */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Select Academic Wing / Division *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDivisionChange('School')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    division === 'School'
                      ? 'bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm ring-2 ring-blue-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    division === 'School' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block font-bold text-sm">School Wing</strong>
                    <span className="text-[11px] text-slate-500">Playgroup to 10th Matric</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleDivisionChange('Academy')}
                  className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                    division === 'Academy'
                      ? 'bg-amber-50/80 border-amber-500 text-amber-900 shadow-sm ring-2 ring-amber-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    division === 'Academy' ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                    <Atom className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="block font-bold text-sm">Science Academy</strong>
                    <span className="text-[11px] text-slate-500">Matric & F.Sc Coaching</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Personal Particulars */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-700 block">
                1. Student Profile & Demographics
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Muhammad Hamza"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Father / Guardian Name *</label>
                  <input
                    type="text"
                    required
                    value={fatherName}
                    onChange={(e) => setFatherName(e.target.value)}
                    placeholder="e.g. Muhammad Aslam"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Roll / Student ID Number *</label>
                  <input
                    type="text"
                    required
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    placeholder="e.g. 109"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono font-bold text-blue-800"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Gender & Blood Group</label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value as any)}
                      className="p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>

                    <select
                      value={bloodGroup}
                      onChange={(e) => setBloodGroup(e.target.value)}
                      className="p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                    >
                      <option value="A+">A+</option>
                      <option value="B+">B+</option>
                      <option value="O+">O+</option>
                      <option value="AB+">AB+</option>
                      <option value="A-">A-</option>
                      <option value="B-">B-</option>
                      <option value="O-">O-</option>
                      <option value="AB-">AB-</option>
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Class / Academic Track *</label>
                  {!isCustomClass ? (
                    <div className="flex gap-2">
                      <select
                        value={classGrade}
                        onChange={(e) => setClassGrade(e.target.value)}
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold text-slate-900"
                      >
                        {(division === 'School' ? SCHOOL_CLASSES : ACADEMY_CLASSES).map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => setIsCustomClass(true)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-700 shrink-0 cursor-pointer"
                      >
                        Custom Class
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customClass}
                        onChange={(e) => setCustomClass(e.target.value)}
                        placeholder="e.g. Cambridge O-Levels Physics"
                        className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-bold"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCustomClass(false)}
                        className="px-3 py-2 bg-slate-200 hover:bg-slate-300 rounded-xl text-xs font-bold text-slate-700 shrink-0 cursor-pointer"
                      >
                        Presets List
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-700 block">
                2. Parent Contacts & Residential Address
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Parent Mobile / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={parentContact}
                    onChange={(e) => setParentContact(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Emergency Phone Number</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    placeholder="0312-7654321"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-bold mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House / Street, Locality, City"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Fee & Financial Settlement */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 block">
                3. Session Fee & Admission Payment
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Session Total Fee (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={totalFee}
                    onChange={(e) => setTotalFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-slate-900"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Paid at Admission (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    max={totalFee}
                    value={paidFee}
                    onChange={(e) => setPaidFee(Number(e.target.value))}
                    placeholder="0 for unpaid"
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-black text-emerald-700"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Concession / Discount (PKR)</label>
                  <input
                    type="number"
                    min={0}
                    value={discountFee}
                    onChange={(e) => setDiscountFee(Number(e.target.value))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-mono font-bold text-amber-700"
                  />
                </div>
              </div>

              {paidFee > 0 && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Payment Method</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl font-medium"
                  >
                    <option value="Cash">Cash at Campus Counter</option>
                    <option value="Online / Bank">Online Bank Transfer</option>
                    <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                    <option value="Cheque">Bank Cheque</option>
                  </select>
                </div>
              )}

              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs font-bold">
                <span className="text-slate-500">Remaining Balance / Dues:</span>
                <span className={`font-mono text-sm ${
                  totalFee - paidFee - discountFee > 0 ? 'text-rose-600' : 'text-emerald-600'
                }`}>
                  Rs. {Math.max(0, totalFee - paidFee - discountFee).toLocaleString()} {totalFee - paidFee - discountFee <= 0 ? '(CLEARED)' : '(PENDING)'}
                </span>
              </div>
            </div>

            {/* Academic Remarks */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">Academic Remarks & Notes</label>
              <textarea
                rows={2}
                value={academicRemarks}
                onChange={(e) => setAcademicRemarks(e.target.value)}
                placeholder="e.g. Admitted in Grade 9 Science. Previous school migration certificate verified."
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            {/* Form Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                <Plus className="w-4 h-4" />
                Complete Admission
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
