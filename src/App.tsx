import React, { useState } from 'react';
import { SchoolProvider, useSchool } from './context/SchoolContext';
import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { StudentsView } from './components/StudentsView';
import { AttendanceView } from './components/AttendanceView';
import { TimetableView } from './components/TimetableView';
import { FeesView } from './components/FeesView';
import { TeachersView } from './components/TeachersView';
import { ExpensesView } from './components/ExpensesView';
import { TestsProgressView } from './components/TestsProgressView';
import { ParentCommunicationView } from './components/ParentCommunicationView';
import { BackupView } from './components/BackupView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { CollectFeeModal } from './components/CollectFeeModal';
import { RecordExpenseModal } from './components/RecordExpenseModal';
import { PrintDocumentModal } from './components/PrintDocumentModal';
import { NewAdmissionModal } from './components/NewAdmissionModal';
import { Student, Division } from './types';
import { Code2 } from 'lucide-react';

const SchoolManagementContent: React.FC = () => {
  const { currentDivision, setCurrentDivision } = useSchool();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCollectFeeOpen, setIsCollectFeeOpen] = useState(false);
  const [isRecordExpenseOpen, setIsRecordExpenseOpen] = useState(false);
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [addStudentDivision, setAddStudentDivision] = useState<Division>('School');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [targetFeeStudent, setTargetFeeStudent] = useState<Student | null>(null);

  const handleOpenCollectFeeForStudent = (student: Student) => {
    setTargetFeeStudent(student);
    setIsCollectFeeOpen(true);
  };

  const handleOpenCollectFeeGeneral = () => {
    setTargetFeeStudent(null);
    setIsCollectFeeOpen(true);
  };

  const handleOpenNewAdmission = (divisionToOpen?: Division) => {
    if (divisionToOpen) {
      setAddStudentDivision(divisionToOpen);
    } else if (activeTab === 'students-academy') {
      setAddStudentDivision('Academy');
    } else {
      setAddStudentDivision('School');
    }
    setIsAddStudentOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenAddStudent={() => handleOpenNewAdmission()}
        onOpenCollectFee={handleOpenCollectFeeGeneral}
        onOpenBackup={() => setActiveTab('backup')}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Layout Grid */}
      <div className="flex-1 flex max-w-[1600px] w-full mx-auto p-3 sm:p-5 gap-5">
        
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
        />

        {/* Dynamic Main Workspace View */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && (
            <DashboardView
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenAddStudent={() => handleOpenNewAdmission()}
              onOpenCollectFee={handleOpenCollectFeeGeneral}
              onOpenAddExpense={() => setIsRecordExpenseOpen(true)}
              onSelectStudent={(student) => {
                setActiveTab(student.division === 'School' ? 'students-school' : 'students-academy');
              }}
            />
          )}

          {activeTab === 'students-school' && (
            <StudentsView
              initialDivision="School"
              onOpenAddStudent={() => handleOpenNewAdmission('School')}
              onOpenCollectFeeForStudent={handleOpenCollectFeeForStudent}
            />
          )}

          {activeTab === 'students-academy' && (
            <StudentsView
              initialDivision="Academy"
              onOpenAddStudent={() => handleOpenNewAdmission('Academy')}
              onOpenCollectFeeForStudent={handleOpenCollectFeeForStudent}
            />
          )}

          {activeTab === 'students' && (
            <StudentsView
              initialDivision="School"
              onOpenAddStudent={() => handleOpenNewAdmission()}
              onOpenCollectFeeForStudent={handleOpenCollectFeeForStudent}
            />
          )}

          {activeTab === 'attendance' && <AttendanceView />}

          {activeTab === 'timetable' && <TimetableView />}

          {activeTab === 'fees' && (
            <FeesView
              onOpenCollectFee={handleOpenCollectFeeGeneral}
              onOpenCollectFeeForStudent={handleOpenCollectFeeForStudent}
            />
          )}

          {activeTab === 'teachers' && <TeachersView />}

          {activeTab === 'expenses' && (
            <ExpensesView onOpenAddExpense={() => setIsRecordExpenseOpen(true)} />
          )}

          {activeTab === 'tests' && <TestsProgressView />}

          {activeTab === 'parents' && <ParentCommunicationView />}

          {activeTab === 'backup' && <BackupView />}

          {/* Persistent Footer Credit Bar */}
          <footer className="mt-12 py-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 no-print">
            <div>
              <strong>Premier School System & Science Academy</strong> • Digitalized Campus Administration ERP
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-800 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-sm">
              <Code2 className="w-3.5 h-3.5 text-blue-600" />
              <span>Developed by <strong className="text-blue-700">MA DEVELOPER</strong></span>
            </div>
          </footer>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectStudent={(student) => {
          setActiveTab(student.division === 'School' ? 'students-school' : 'students-academy');
          setIsSearchOpen(false);
        }}
        onSelectTeacher={(teacher) => {
          setActiveTab('teachers');
          setIsSearchOpen(false);
        }}
        onOpenCollectFee={(student) => {
          setIsSearchOpen(false);
          handleOpenCollectFeeForStudent(student);
        }}
      />

      <NewAdmissionModal
        isOpen={isAddStudentOpen}
        onClose={() => setIsAddStudentOpen(false)}
        defaultDivision={addStudentDivision}
        onAdmissionSuccess={(student) => {
          setActiveTab(student.division === 'School' ? 'students-school' : 'students-academy');
        }}
      />

      <CollectFeeModal
        isOpen={isCollectFeeOpen}
        onClose={() => {
          setIsCollectFeeOpen(false);
          setTargetFeeStudent(null);
        }}
        initialStudent={targetFeeStudent}
      />

      <RecordExpenseModal
        isOpen={isRecordExpenseOpen}
        onClose={() => setIsRecordExpenseOpen(false)}
      />

      <PrintDocumentModal />

    </div>
  );
};

export default function App() {
  return (
    <SchoolProvider>
      <SchoolManagementContent />
    </SchoolProvider>
  );
}
