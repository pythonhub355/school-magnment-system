import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  MessageSquare,
  Calendar,
  Phone,
  Send,
  Users,
  Search,
  Sparkles,
  CheckCircle2,
  Trash2,
  Share2,
  X
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { SchoolEvent, Student } from '../types';
import { ConfirmModal } from './ConfirmModal';

export const ParentCommunicationView: React.FC = () => {
  const { students, events, addSchoolEvent, deleteSchoolEvent, todayDateStr } = useSchool();

  const [activeSubTab, setActiveSubTab] = useState<'events' | 'messenger' | 'directory'>('events');
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [messageType, setMessageType] = useState<
    'ptm' | 'absence' | 'fee_due' | 'exam' | 'praise' | 'custom'
  >('ptm');
  const [customText, setCustomText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [confirmDeleteEvent, setConfirmDeleteEvent] = useState<{ id: string; title: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // New Event Form State
  const [eventForm, setEventForm] = useState({
    title: '',
    eventType: 'PTM' as const,
    eventDate: todayDateStr,
    eventTime: '09:00 AM to 01:00 PM',
    targetDivision: 'All' as const,
    targetClass: 'All Classes',
    venue: 'Premier School Main Academic Hall',
    description: '',
    broadcastTemplate: ''
  });

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSchoolEvent({
      ...eventForm,
      broadcastTemplate:
        eventForm.broadcastTemplate ||
        `Premier School System & Science Academy Announcement: ${eventForm.title} on ${eventForm.eventDate} at ${eventForm.venue}.`
    });
    setIsAddEventModalOpen(false);
    showToast(`Event "${eventForm.title}" published & broadcasted!`);
  };

  const selectedStudent = students.find((s) => s.id === selectedStudentId);

  // Generate Message Preview
  const generateMessageText = (): string => {
    if (!selectedStudent) return '';
    const name = selectedStudent.name;
    const roll = selectedStudent.rollNo;
    const cls = selectedStudent.classGrade;
    const due = selectedStudent.totalFee - selectedStudent.paidFee - (selectedStudent.discountFee || 0);

    switch (messageType) {
      case 'ptm':
        return `Respected Parents of ${name} (Roll #${roll}, ${cls}),\n\nYou are cordially invited to the Grand Parents-Teacher Meeting (PTM) at Premier School System & Science Academy. Please join us to review your child's academic progress, attendance percentage, and exam performance.\n\nDate: Upcoming Sunday (9:00 AM to 1:00 PM)\nVenue: Main Campus Hall\nPrincipal Office, Premier School System.`;
      case 'absence':
        return `Respected Parents of ${name} (Roll #${roll}),\n\nThis is to inform you that ${name} is marked ABSENT today (${todayDateStr}) at Premier School System & Science Academy. If this is an authorized leave, kindly notify the administration. Regular attendance is strictly monitored.\n\nRegards,\nAttendance Section.`;
      case 'fee_due':
        return `Respected Parents of ${name} (Roll #${roll}, ${cls}),\n\nThis is a gentle reminder that a tuition fee balance of Rs. ${due.toLocaleString()} is currently outstanding. Kindly submit it at the campus accounts counter at your earliest convenience.\n\nThank you,\nAccounts Section, Premier School System & Science Academy.`;
      case 'exam':
        return `Dear Parents of ${name} (Roll #${roll}),\n\nThe upcoming term assessment schedule has been published for ${cls}. Please ensure your child prepares according to the prescribed syllabus for optimal scoring.\n\nPremier School System & Science Academy.`;
      case 'praise':
        return `Congratulations! Respected Parents of ${name},\n\nWe are proud to share that ${name} is performing exceptionally well in class tests and demonstrating excellent discipline at Premier School System & Science Academy. Keep encouraging your child!\n\nBest Regards,\nFaculty & Principal.`;
      case 'custom':
        return (
          customText ||
          `Respected Parents of ${name},\n\nSpecial Announcement from Premier School System & Science Academy administration.`
        );
      default:
        return '';
    }
  };

  const launchWhatsApp = (phone: string, text: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const formatted = cleanPhone.startsWith('0') ? '92' + cleanPhone.substring(1) : cleanPhone;
    window.open(`https://wa.me/${formatted}?text=${encodeURIComponent(text)}`, '_blank');
    showToast('WhatsApp launched with pre-filled school message!');
  };

  const filteredDirectory = students.filter((s) => {
    return (
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.includes(searchQuery) ||
      s.parentContact.includes(searchQuery) ||
      s.classGrade.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
            <Megaphone className="w-6 h-6 text-amber-600" />
            Parents Communication & Activities Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Parents-Teacher Meetings (PTM), activity broadcasts, and 1-click WhatsApp alerts
          </p>
        </div>

        <button
          onClick={() => setIsAddEventModalOpen(true)}
          className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-amber-900/20 flex items-center gap-2 transition-all active:scale-95 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Schedule Event / PTM
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveSubTab('events')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'events'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Calendar className="w-4 h-4 text-amber-400" />
          School Events & PTMs ({events.length})
        </button>

        <button
          onClick={() => setActiveSubTab('messenger')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'messenger'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          WhatsApp Parent Notifier
        </button>

        <button
          onClick={() => setActiveSubTab('directory')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-1.5 ${
            activeSubTab === 'directory'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-4 h-4" />
          Parents Phone Directory ({students.length})
        </button>
      </div>

      {/* Tab 1: Events */}
      {activeSubTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-bold rounded-md ${
                      ev.eventType === 'PTM'
                        ? 'bg-amber-100 text-amber-900 border border-amber-200'
                        : ev.eventType === 'Science Fair'
                        ? 'bg-blue-100 text-blue-900 border border-blue-200'
                        : 'bg-purple-100 text-purple-900 border border-purple-200'
                    }`}
                  >
                    {ev.eventType}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {ev.eventDate} • {ev.eventTime}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">
                  {ev.title}
                </h3>
                <p className="text-xs text-slate-500 font-semibold mt-1">
                  Target: <strong>{ev.targetClass}</strong> ({ev.targetDivision}) • Venue: <strong>{ev.venue}</strong>
                </p>

                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                  {ev.description}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    const txt = `Premier School System & Science Academy Notice: ${ev.title} scheduled on ${ev.eventDate} (${ev.eventTime}) at ${ev.venue}. Details: ${ev.description}`;
                    // Copy to clipboard or open messenger
                    navigator.clipboard.writeText(txt);
                    showToast('Broadcast message copied to clipboard!');
                  }}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-lg border border-emerald-200 transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Copy WhatsApp Broadcast
                </button>

                <button
                  onClick={() =>
                    setConfirmDeleteEvent({
                      id: ev.id,
                      title: ev.title
                    })
                  }
                  className="p-1.5 text-slate-300 hover:text-rose-600 rounded-lg hover:bg-rose-50 cursor-pointer"
                  title="Delete Event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: WhatsApp Messenger */}
      {activeSubTab === 'messenger' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: Configuration */}
          <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-emerald-600" />
              1. Select Recipient & Notice Type
            </h3>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Target Student Parent</label>
              <select
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-none"
              >
                {students.map((st) => (
                  <option key={st.id} value={st.id}>
                    #{st.rollNo} - {st.name} ({st.classGrade})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-bold mb-1">Notice Template</label>
              <div className="space-y-1.5">
                {[
                  { id: 'ptm', label: 'Grand PTM Invitation' },
                  { id: 'absence', label: 'Student Absence Notice' },
                  { id: 'fee_due', label: 'Pending Fee Due Reminder' },
                  { id: 'exam', label: 'Exam Schedule Announcement' },
                  { id: 'praise', label: 'Progress & Appreciation' },
                  { id: 'custom', label: 'Custom Written Message' }
                ].map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                      messageType === item.id
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="msgType"
                      checked={messageType === item.id}
                      onChange={() => setMessageType(item.id as any)}
                      className="text-emerald-600"
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {messageType === 'custom' && (
              <div>
                <label className="block text-slate-500 font-bold mb-1">Type Custom Notice</label>
                <textarea
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  rows={3}
                  placeholder="Enter notice message..."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl"
                />
              </div>
            )}
          </div>

          {/* Right: Message Preview and Send */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Send className="w-4 h-4 text-blue-600" />
                  2. Official WhatsApp Preview
                </h3>
                {selectedStudent && (
                  <span className="text-xs font-mono text-slate-500">
                    Target Phone: <strong>{selectedStudent.parentContact}</strong>
                  </span>
                )}
              </div>

              {/* Chat Bubble Mockup */}
              <div className="p-4 sm:p-5 rounded-2xl bg-emerald-900 text-white font-sans text-xs sm:text-sm whitespace-pre-wrap leading-relaxed shadow-inner border border-emerald-800 relative">
                <div className="flex items-center gap-2 text-amber-300 font-extrabold text-[11px] uppercase tracking-wider mb-2 border-b border-emerald-800 pb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Premier School System & Science Academy Official Dispatch
                </div>
                {generateMessageText()}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-500">
                Directly redirects to WhatsApp Web or Desktop application.
              </span>

              {selectedStudent && (
                <button
                  onClick={() =>
                    launchWhatsApp(selectedStudent.parentContact, generateMessageText())
                  }
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  Send via WhatsApp to {selectedStudent.name}'s Parent
                </button>
              )}
            </div>
          </div>

        </div>
      )}

      {/* Tab 3: Directory */}
      {activeSubTab === 'directory' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Parent Name, Student Name, Roll No, Phone..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-blue-500 font-medium"
              />
            </div>
            <span className="text-xs text-slate-500 font-medium">
              {filteredDirectory.length} parents listed
            </span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[11px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3.5">Roll No</th>
                    <th className="px-4 py-3.5">Student Name</th>
                    <th className="px-4 py-3.5">Father / Guardian</th>
                    <th className="px-4 py-3.5">Class / Wing</th>
                    <th className="px-4 py-3.5">Primary Mobile Contact</th>
                    <th className="px-4 py-3.5">Emergency Number</th>
                    <th className="px-4 py-3.5 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDirectory.map((st) => (
                    <tr key={st.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        #{st.rollNo}
                      </td>
                      <td className="px-4 py-3.5 font-bold text-slate-900">
                        {st.name}
                      </td>
                      <td className="px-4 py-3.5 text-slate-700 font-medium">
                        {st.fatherName}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium text-xs">
                          {st.classGrade} ({st.division})
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-mono font-bold text-slate-900">
                        {st.parentContact}
                      </td>
                      <td className="px-4 py-3.5 font-mono text-rose-600">
                        {st.emergencyContact}
                      </td>
                      <td className="px-4 py-3.5 text-right space-x-1">
                        <button
                          onClick={() => {
                            setSelectedStudentId(st.id);
                            setActiveSubTab('messenger');
                          }}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 inline-flex items-center gap-1 transition-colors"
                        >
                          <MessageSquare className="w-3 h-3" />
                          Message
                        </button>
                        <a
                          href={`tel:${st.parentContact}`}
                          className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 inline-flex items-center gap-1 transition-colors"
                        >
                          <Phone className="w-3 h-3" />
                          Call
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-4 bg-amber-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-base">Schedule School Event / PTM</h3>
              <button onClick={() => setIsAddEventModalOpen(false)} className="text-slate-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEventSubmit} className="p-5 overflow-y-auto space-y-3 text-xs sm:text-sm">
              <div>
                <label className="block text-slate-500 font-bold mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  required
                  placeholder="e.g. Grand Parents-Teacher Meeting (PTM)"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-bold mb-1">Event Category</label>
                  <select
                    value={eventForm.eventType}
                    onChange={(e) => setEventForm({ ...eventForm, eventType: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                  >
                    <option value="PTM">Parents-Teacher Meeting (PTM)</option>
                    <option value="Science Fair">Science & Robotics Fair</option>
                    <option value="Sports Gala">Annual Sports Gala</option>
                    <option value="Exam Notification">Exam Notification</option>
                    <option value="Holiday Announcement">Holiday Announcement</option>
                    <option value="Annual Function">Annual Function</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Target Wing</label>
                  <select
                    value={eventForm.targetDivision}
                    onChange={(e) => setEventForm({ ...eventForm, targetDivision: e.target.value as any })}
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg font-bold text-slate-800"
                  >
                    <option value="All">All Students & Parents</option>
                    <option value="School">School Division Only</option>
                    <option value="Academy">Science Academy Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Event Date</label>
                  <input
                    type="date"
                    value={eventForm.eventDate}
                    onChange={(e) => setEventForm({ ...eventForm, eventDate: e.target.value })}
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-slate-500 font-bold mb-1">Time Schedule</label>
                  <input
                    type="text"
                    value={eventForm.eventTime}
                    onChange={(e) => setEventForm({ ...eventForm, eventTime: e.target.value })}
                    placeholder="09:00 AM to 01:00 PM"
                    required
                    className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Venue / Campus Hall</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="Main Academic Hall & Science Labs"
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-bold mb-1">Full Description / Agenda</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  rows={3}
                  required
                  placeholder="Explain event details, items for parents to bring, etc."
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 font-bold text-white rounded-xl shadow-md"
                >
                  Publish Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Event Modal */}
      <ConfirmModal
        isOpen={!!confirmDeleteEvent}
        onClose={() => setConfirmDeleteEvent(null)}
        onConfirm={() => {
          if (confirmDeleteEvent) {
            deleteSchoolEvent(confirmDeleteEvent.id);
            showToast(`Event "${confirmDeleteEvent.title}" removed.`);
            setConfirmDeleteEvent(null);
          }
        }}
        title="Delete School Announcement / Event"
        message={`Are you sure you want to delete "${confirmDeleteEvent?.title}"? This action cannot be undone.`}
        confirmText="Yes, Delete Event"
        cancelText="Cancel"
        variant="danger"
        icon="trash"
      />

    </div>
  );
};
