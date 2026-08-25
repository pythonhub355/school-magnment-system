import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  GraduationCap,
  Atom,
  Users,
  Receipt,
  Phone,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Student, Teacher } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStudent: (student: Student) => void;
  onSelectTeacher: (teacher: Teacher) => void;
  onOpenCollectFeeForStudent: (student: Student) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectStudent,
  onSelectTeacher,
  onOpenCollectFeeForStudent
}) => {
  const { students, teachers, fees, getStudentAttendanceStats } = useSchool();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanQuery = query.toLowerCase().trim();

  // Search Students
  const matchingStudents = cleanQuery
    ? students.filter((s) => {
        return (
          s.name.toLowerCase().includes(cleanQuery) ||
          s.rollNo.toLowerCase().includes(cleanQuery) ||
          s.fatherName.toLowerCase().includes(cleanQuery) ||
          s.classGrade.toLowerCase().includes(cleanQuery) ||
          s.parentContact.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, '')) ||
          s.emergencyContact.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, '')) ||
          s.division.toLowerCase().includes(cleanQuery)
        );
      })
    : students.slice(0, 4);

  // Search Teachers
  const matchingTeachers = cleanQuery
    ? teachers.filter((t) => {
        return (
          t.name.toLowerCase().includes(cleanQuery) ||
          t.facultyCode.toLowerCase().includes(cleanQuery) ||
          t.subject.toLowerCase().includes(cleanQuery) ||
          t.qualification.toLowerCase().includes(cleanQuery) ||
          t.mobileNumber.replace(/[^0-9]/g, '').includes(cleanQuery.replace(/[^0-9]/g, ''))
        );
      })
    : teachers.slice(0, 2);

  // Search Fee Receipts
  const matchingFees = cleanQuery
    ? fees.filter((f) => {
        return (
          f.receiptNo.toLowerCase().includes(cleanQuery) ||
          f.studentName.toLowerCase().includes(cleanQuery) ||
          f.rollNo.toLowerCase().includes(cleanQuery)
        );
      }).slice(0, 3)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Top Search Input Box */}
        <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Target any student by Name, Roll No, Father Name, Phone, Class..."
            className="w-full bg-transparent border-none text-slate-800 placeholder-slate-400 text-sm sm:text-base focus:outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2.5 py-1 text-xs font-semibold text-slate-600 bg-slate-200/80 hover:bg-slate-300 rounded-lg transition-colors"
          >
            Esc
          </button>
        </div>

        {/* Results Body */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1">
          
          {/* Student Results */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Students ({matchingStudents.length})
              </span>
              {!cleanQuery && (
                <span className="text-[11px] text-slate-400">Recently active</span>
              )}
            </div>

            {matchingStudents.length > 0 ? (
              <div className="space-y-2">
                {matchingStudents.map((st) => {
                  const pendingDue = st.totalFee - st.paidFee - (st.discountFee || 0);
                  const att = getStudentAttendanceStats(st.id);
                  const isAcademy = st.division === 'Academy';

                  return (
                    <div
                      key={st.id}
                      className="p-3 rounded-xl border border-slate-200/90 hover:border-blue-400 hover:bg-blue-50/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 ${
                            isAcademy
                              ? 'bg-amber-100 text-amber-800 border border-amber-300'
                              : 'bg-blue-100 text-blue-800 border border-blue-300'
                          }`}
                        >
                          #{st.rollNo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                              {st.name}
                            </h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                isAcademy
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                              }`}
                            >
                              {st.division}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {st.classGrade}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                            <span>S/O, D/O: <strong>{st.fatherName}</strong></span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400" />
                              {st.parentContact}
                            </span>
                            <span>Att: <strong className={att.percentage >= 80 ? 'text-emerald-600' : 'text-rose-600'}>{att.percentage}%</strong></span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {pendingDue > 0 ? (
                          <button
                            onClick={() => {
                              onClose();
                              onOpenCollectFeeForStudent(st);
                            }}
                            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 transition-colors"
                          >
                            <Receipt className="w-3.5 h-3.5" />
                            Due: Rs. {pendingDue.toLocaleString()}
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Fee Paid
                          </span>
                        )}

                        <button
                          onClick={() => {
                            onClose();
                            onSelectStudent(st);
                          }}
                          className="px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-900 hover:bg-blue-600 text-white flex items-center gap-1 transition-colors shadow-sm"
                        >
                          View Profile
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No students matched "{query}"
              </div>
            )}
          </div>

          {/* Teacher Results */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                Faculty & Teachers ({matchingTeachers.length})
              </span>
            </div>

            {matchingTeachers.length > 0 ? (
              <div className="space-y-2">
                {matchingTeachers.map((tch) => (
                  <div
                    key={tch.id}
                    className="p-3 rounded-xl border border-slate-200/90 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all flex items-center justify-between gap-3 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-800 border border-indigo-200 flex items-center justify-center font-bold text-xs">
                        {tch.facultyCode}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 text-sm">{tch.name}</h4>
                          <span className="text-xs text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded font-medium">
                            {tch.subject}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {tch.qualification} • Phone: {tch.mobileNumber} • Reporting: {tch.reportingTime}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectTeacher(tch);
                      }}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1 transition-colors"
                    >
                      View Staff
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No faculty members matched "{query}"
              </div>
            )}
          </div>

          {/* Fee Transactions Matching */}
          {matchingFees.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-600" />
                  Fee Receipts ({matchingFees.length})
                </span>
              </div>
              <div className="space-y-1.5">
                {matchingFees.map((fee) => (
                  <div
                    key={fee.id}
                    className="p-2.5 rounded-lg bg-emerald-50/50 border border-emerald-200 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-emerald-900">{fee.receiptNo}</span>
                      <span className="text-slate-600 ml-2">
                        {fee.studentName} (#{fee.rollNo}) - {fee.paymentMonth}
                      </span>
                    </div>
                    <span className="font-bold text-emerald-700">
                      Rs. {fee.amountPaid.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Search tip: Type student roll numbers like <strong>101</strong> or <strong>601</strong> for instant result.</span>
          <span className="font-medium text-slate-700">Premier School Portal</span>
        </div>

      </div>
    </div>
  );
};
