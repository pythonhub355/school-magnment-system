import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Calendar,
  Award,
  Search,
  Printer,
  Trash2,
  CheckCircle2,
  Clock,
  BookOpen,
  GraduationCap,
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { TestSchedule, StudentTestResult, Student, Division } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const TestsProgressView: React.FC = () => {
  const {
    students,
    testSchedules,
    testResults,
    addTestSchedule,
    deleteTestSchedule,
    addOrUpdateTestResult,
    getStudentAttendanceStats,
    setActivePrintDoc,
    todayDateStr
  } = useSchool();

  const [activeTab, setActiveTab] = useState<'schedules' | 'marks' | 'report_cards'>('schedules');
  const [isAddScheduleModalOpen, setIsAddScheduleModalOpen] = useState(false);
  const [selectedTestId, setSelectedTestId] = useState<string>(testSchedules[0]?.id || '');
  const [selectedStudentForReport, setSelectedStudentForReport] = useState<string>(students[0]?.id || '');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDeleteSchedule, setConfirmDeleteSchedule] = useState<{ id: string; subject: string; title: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Schedule Form State
  const [scheduleForm, setScheduleForm] = useState({
    testTitle: '',
    sessionName: '1st Term' as const,
    classGrade: 'Grade 9 - Science',
    division: 'School' as Division,
    subject: '',
    testDate: todayDateStr,
    startTime: '08:30 AM',
    totalMarks: 50,
    passingMarks: 20,
    roomNo: 'Hall A (Science Block)',
    syllabusCovered: ''
  });

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = addTestSchedule(scheduleForm);
    setIsAddScheduleModalOpen(false);
    setSelectedTestId(created.id);
    showToast(`Test schedule for ${created.subject} broadcasted successfully!`);
    setScheduleForm({
      testTitle: '',
      sessionName: '1st Term',
      classGrade: 'Grade 9 - Science',
      division: 'School',
      subject: '',
      testDate: todayDateStr,
      startTime: '08:30 AM',
      totalMarks: 50,
      passingMarks: 20,
      roomNo: 'Hall A (Science Block)',
      syllabusCovered: ''
    });
  };

  const selectedTest = testSchedules.find((t) => t.id === selectedTestId);
  const testClassStudents = selectedTest
    ? students.filter((s) => s.classGrade === selectedTest.classGrade)
    : [];

  const calculateGrade = (pct: number) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B+';
    if (pct >= 60) return 'B';
    if (pct >= 50) return 'C';
    if (pct >= 40) return 'D';
    return 'F';
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            <FileSpreadsheet className="w-6 h-6 text-blue-600" />
            Test Schedules & Academic Progress Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Session evaluations, term exam schedules, marks entry, and official progress report cards (DMC)
          </p>
        </div>

        <button
          onClick={() => setIsAddScheduleModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-900/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule New Test / Assessment
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab('schedules')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'schedules'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          Test Schedules ({testSchedules.length})
        </button>

        <button
          onClick={() => setActiveTab('marks')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'marks'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Marks Entry & Gradebook
        </button>

        <button
          onClick={() => setActiveTab('report_cards')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'report_cards'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Printer className="w-4 h-4" />
          Print Progress Report Card / DMC
        </button>
      </div>

      {/* Tab 1: Schedules */}
      {activeTab === 'schedules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testSchedules.map((test) => (
            <div
              key={test.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 text-xs font-bold rounded-md bg-blue-50 text-blue-800 border border-blue-200">
                    {test.sessionName}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {test.testDate} • {test.startTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">
                  {test.subject}: {test.testTitle}
                </h3>
                
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 mt-1">
                  <span>Class: <strong>{test.classGrade}</strong></span>
                  <span>•</span>
                  <span>Total: <strong>{test.totalMarks} Marks</strong></span>
                  <span>•</span>
                  <span>Passing: <strong className="text-emerald-600">{test.passingMarks}</strong></span>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-700 block mb-0.5">Syllabus Covered:</span>
                  <p className="line-clamp-2">{test.syllabusCovered || 'Standard unit assessment syllabus'}</p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">
                  Room: {test.roomNo}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedTestId(test.id);
                      setActiveTab('marks');
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
                  >
                    Enter Marks
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      setConfirmDeleteSchedule({
                        id: test.id,
                        subject: test.subject,
                        title: test.testTitle
                      })
                    }
                    className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                    title="Delete Schedule"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Marks Entry */}
      {activeTab === 'marks' && (
        <div className="space-y-4">
          
          {/* Test Selector */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Select Test:</span>
              <select
                value={selectedTestId}
                onChange={(e) => setSelectedTestId(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs sm:text-sm focus:outline-none"
              >
                {testSchedules.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.subject} - {t.classGrade} ({t.testTitle} - {t.testDate})
                  </option>
                ))}
              </select>
            </div>

            {selectedTest && (
              <div className="flex items-center gap-3 text-xs text-slate-600">
                <span>Total Marks: <strong className="text-slate-900">{selectedTest.totalMarks}</strong></span>
                <span>Passing: <strong className="text-emerald-600">{selectedTest.passingMarks}</strong></span>
              </div>
            )}
          </div>

          {/* Marks Table */}
          {selectedTest && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3.5">Roll No</th>
                      <th className="px-4 py-3.5">Student Name</th>
                      <th className="px-4 py-3.5">Obtained Marks (/{selectedTest.totalMarks})</th>
                      <th className="px-4 py-3.5">Percentage</th>
                      <th className="px-4 py-3.5">Grade</th>
                      <th className="px-4 py-3.5">Teacher Evaluation Remarks</th>
                      <th className="px-4 py-3.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {testClassStudents.length > 0 ? (
                      testClassStudents.map((student) => {
                        const existingRes = testResults.find(
                          (r) => r.testId === selectedTest.id && r.studentId === student.id
                        );
                        const [marks, setMarks] = useState<number>(existingRes ? existingRes.obtainedMarks : 0);
                        const [remarks, setRemarks] = useState<string>(existingRes ? existingRes.remarks : 'Good performance');

                        const pct = Math.round((marks / selectedTest.totalMarks) * 100);
                        const grade = calculateGrade(pct);

                        return (
                          <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                              #{student.rollNo}
                            </td>
                            <td className="px-4 py-3.5 font-bold text-slate-900">
                              {student.name}
                            </td>
                            <td className="px-4 py-3.5">
                              <input
                                type="number"
                                min="0"
                                max={selectedTest.totalMarks}
                                value={marks}
                                onChange={(e) => setMarks(Number(e.target.value))}
                                className="w-24 p-1.5 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold text-slate-900 text-center"
                              />
                            </td>
                            <td className="px-4 py-3.5 font-mono font-bold">
                              {pct}%
                            </td>
                            <td className="px-4 py-3.5">
                              <span
                                className={`px-2 py-0.5 rounded font-black text-xs ${
                                  pct >= 70
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : pct >= 50
                                    ? 'bg-amber-100 text-amber-800'
                                    : 'bg-rose-100 text-rose-800'
                                }`}
                              >
                                {grade}
                              </span>
                            </td>
                            <td className="px-4 py-3.5">
                              <input
                                type="text"
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                className="w-full p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                                placeholder="Add remarks..."
                              />
                            </td>
                            <td className="px-4 py-3.5 text-right">
                              <button
                                onClick={() => {
                                  addOrUpdateTestResult({
                                    testId: selectedTest.id,
                                    studentId: student.id,
                                    studentName: student.name,
                                    rollNo: student.rollNo,
                                    classGrade: student.classGrade,
                                    obtainedMarks: marks,
                                    totalMarks: selectedTest.totalMarks,
                                    percentage: pct,
                                    grade,
                                    remarks,
                                    evaluatedDate: todayDateStr
                                  });
                                  showToast(`Saved marks for ${student.name} (${marks}/${selectedTest.totalMarks})`);
                                }}
                                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-8 text-center text-slate-400">
                          No students currently enrolled in class "{selectedTest.classGrade}".
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Report Cards / DMC */}
      {activeTab === 'report_cards' && (
        <div className="space-y-6">
          
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase">Select Student for DMC:</span>
              <select
                value={selectedStudentForReport}
                onChange={(e) => setSelectedStudentForReport(e.target.value)}
                className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 text-xs sm:text-sm focus:outline-none"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    #{st.rollNo} - {st.name} ({st.classGrade})
                  </option>
                ))}
              </select>
            </div>

            {(() => {
              const target = students.find((s) => s.id === selectedStudentForReport);
              if (!target) return null;
              const results = testResults.filter((r) => r.studentId === target.id);
              const att = getStudentAttendanceStats(target.id);

              return (
                <button
                  onClick={() => {
                    setActivePrintDoc({
                      type: 'report_card',
                      student: target,
                      results,
                      attendanceRate: att.percentage
                    });
                  }}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-md"
                >
                  <Printer className="w-4 h-4 text-amber-400" />
                  Print Official Progress Report / DMC
                </button>
              );
            })()}
          </div>

          {/* Preview of the Report Card */}
          {(() => {
            const student = students.find((s) => s.id === selectedStudentForReport);
            if (!student) return null;
            const results = testResults.filter((r) => r.studentId === student.id);
            const att = getStudentAttendanceStats(student.id);

            const totalMax = results.reduce((sum, r) => sum + r.totalMarks, 0);
            const totalObtained = results.reduce((sum, r) => sum + r.obtainedMarks, 0);
            const overallPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : 0;
            const overallGrade = calculateGrade(overallPct);

            return (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-md max-w-3xl mx-auto space-y-6">
                
                {/* Official School Header */}
                <div className="text-center border-b-2 border-slate-900 pb-4">
                  <div className="w-12 h-12 bg-blue-900 text-amber-400 font-extrabold rounded-xl mx-auto flex items-center justify-center text-lg mb-2 shadow-sm">
                    PS
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 uppercase">
                    Premier School System & Science Academy
                  </h3>
                  <p className="text-xs text-slate-600 font-semibold uppercase tracking-widest mt-0.5">
                    Official Student Detailed Marks Certificate (DMC) & Academic Progress Card
                  </p>
                </div>

                {/* Bio Particulars Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 block">Student Name:</span>
                    <strong className="text-slate-900 text-sm">{student.name}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Father Name:</span>
                    <strong className="text-slate-900">{student.fatherName}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Roll Number:</span>
                    <strong className="text-blue-700 font-mono text-sm font-black">#{student.rollNo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Class & Wing:</span>
                    <strong className="text-slate-900">{student.classGrade} ({student.division})</strong>
                  </div>
                </div>

                {/* Subject Evaluation Table */}
                <div>
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2.5">Subject Assessment</th>
                        <th className="p-2.5 text-center">Total Marks</th>
                        <th className="p-2.5 text-center">Marks Obtained</th>
                        <th className="p-2.5 text-center">Percentage</th>
                        <th className="p-2.5 text-center">Grade</th>
                        <th className="p-2.5">Teacher Remarks</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {results.length > 0 ? (
                        results.map((res) => (
                          <tr key={res.id}>
                            <td className="p-2.5 font-bold text-slate-900">
                              {testSchedules.find((t) => t.id === res.testId)?.subject || 'Subject'}
                            </td>
                            <td className="p-2.5 text-center font-mono">{res.totalMarks}</td>
                            <td className="p-2.5 text-center font-mono font-bold text-blue-700">
                              {res.obtainedMarks}
                            </td>
                            <td className="p-2.5 text-center font-mono font-bold">{res.percentage}%</td>
                            <td className="p-2.5 text-center font-black">{res.grade}</td>
                            <td className="p-2.5 text-slate-600">{res.remarks}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-6 text-center text-slate-400 italic">
                            No evaluated test marks recorded yet for this session.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {results.length > 0 && (
                      <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
                        <tr>
                          <td className="p-2.5">GRAND TOTAL / RESULT</td>
                          <td className="p-2.5 text-center font-mono">{totalMax}</td>
                          <td className="p-2.5 text-center font-mono text-blue-800">{totalObtained}</td>
                          <td className="p-2.5 text-center font-mono">{overallPct}%</td>
                          <td className="p-2.5 text-center text-emerald-700 font-extrabold">{overallGrade}</td>
                          <td className="p-2.5 text-emerald-700 font-bold">
                            {overallPct >= 50 ? 'PASSED & PROMOTED' : 'NEEDS REVISION'}
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>

                {/* Attendance and Signature Footer */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Session Attendance Rate:</span>
                    <strong className="text-slate-900 text-sm">{att.percentage}% ({att.present} Days Present)</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Academic Status:</span>
                    <strong className="text-emerald-700 text-sm">Regular & Punctual</strong>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
                    <span className="text-slate-500 block">Principal Seal:</span>
                    <strong className="text-slate-900 font-serif italic text-right">Mudassar Asghar (Admin)</strong>
                  </div>
                </div>

              </div>
            );
          })()}

        </div>
      )}

      {/* Add Schedule Modal */}
      {isAddScheduleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-blue-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Schedule New Assessment / Test</h3>
              <button onClick={() => setIsAddScheduleModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleScheduleSubmit} className="p-5 overflow-y-auto space-y-3 text-xs sm:text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Test Title</label>
                  <input
                    type="text"
                    value={scheduleForm.testTitle}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, testTitle: e.target.value })}
                    required
                    placeholder="e.g. Monthly Physics Assessment"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Subject</label>
                  <input
                    type="text"
                    value={scheduleForm.subject}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                    required
                    placeholder="e.g. Physics, Chemistry, Biology"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Session / Term</label>
                  <select
                    value={scheduleForm.sessionName}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, sessionName: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                  >
                    <option value="1st Term">1st Term</option>
                    <option value="Mid Term">Mid Term</option>
                    <option value="Final Term">Final Term</option>
                    <option value="Weekly Assessment">Weekly Assessment</option>
                    <option value="Send-Up Exam">Send-Up Exam</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Target Class / Track</label>
                  <input
                    type="text"
                    value={scheduleForm.classGrade}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, classGrade: e.target.value })}
                    required
                    placeholder="e.g. Grade 9 - Science"
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Evaluation Date</label>
                  <input
                    type="date"
                    value={scheduleForm.testDate}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, testDate: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Start Time</label>
                  <input
                    type="text"
                    value={scheduleForm.startTime}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, startTime: e.target.value })}
                    placeholder="08:30 AM"
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Total Marks</label>
                  <input
                    type="number"
                    value={scheduleForm.totalMarks}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, totalMarks: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Passing Marks</label>
                  <input
                    type="number"
                    value={scheduleForm.passingMarks}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, passingMarks: Number(e.target.value) })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Syllabus Covered</label>
                <textarea
                  value={scheduleForm.syllabusCovered}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, syllabusCovered: e.target.value })}
                  placeholder="e.g. Unit 1 Physical Quantities, Unit 2 Kinematics..."
                  rows={2}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 font-bold text-white rounded-xl shadow-md"
                >
                  Broadcast Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Test Schedule Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteSchedule}
        onClose={() => setConfirmDeleteSchedule(null)}
        onConfirm={() => {
          if (confirmDeleteSchedule) {
            deleteTestSchedule(confirmDeleteSchedule.id);
            showToast(`Test schedule for ${confirmDeleteSchedule.subject} deleted.`);
            setConfirmDeleteSchedule(null);
          }
        }}
        title="Delete Test Schedule"
        message={`Are you sure you want to delete the test schedule for "${confirmDeleteSchedule?.subject} (${confirmDeleteSchedule?.title})"? Any unsaved marks entry for this session will be removed.`}
        confirmText="Yes, Delete Schedule"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />

    </div>
  );
};
