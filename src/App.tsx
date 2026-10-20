import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { AssignmentSection } from './components/AssignmentSection';
import { FilePreviewModal } from './components/FilePreviewModal';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { initialAssignments } from './data/assignments';
import { Assignment, UploadedFileRecord, OverviewStats } from './types';
import { 
  getAllFileRecords, 
  saveFileRecord, 
  deleteFileRecord 
} from './utils/storage';
import { BookOpen, Filter, Info } from 'lucide-react';

const LOCAL_STORAGE_ASSIGNMENTS_KEY = 'shubham_portfolio_custom_assignments';

export const App: React.FC = () => {
  // Load customized assignments from localStorage if user edited them inline, else use initial data
  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ASSIGNMENTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading saved assignments:', e);
    }
    return initialAssignments;
  });

  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileRecord>>({});
  const [activeSection, setActiveSection] = useState<string>('home');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('ALL');
  const [previewRecord, setPreviewRecord] = useState<UploadedFileRecord | null>(null);

  // Load uploaded files from IndexedDB on component mount
  useEffect(() => {
    const loadFiles = async () => {
      try {
        const records = await getAllFileRecords();
        setUploadedFiles(records);
      } catch (err) {
        console.error('Failed to load files from IndexedDB:', err);
      }
    };
    loadFiles();
  }, []);

  // Track active section for navigation highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'overview', 'assignments', 'about'];
      const scrollY = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Dynamically calculate overview stats from real assignments & uploaded records
  const stats: OverviewStats = useMemo(() => {
    const totalAssignments = assignments.length;
    const uniqueSubjects = new Set(assignments.map((a) => a.subject.trim())).size;
    const submittedCount = assignments.filter((a) => !!uploadedFiles[a.id]).length;
    const pendingCount = totalAssignments - submittedCount;

    return {
      totalAssignments,
      uniqueSubjects,
      submittedCount,
      pendingCount,
    };
  }, [assignments, uploadedFiles]);

  // Unique list of subjects for filtering
  const allSubjects = useMemo(() => {
    return Array.from(new Set(assignments.map((a) => a.subject.trim())));
  }, [assignments]);

  // Filtered assignments based on user selection
  const filteredAssignments = useMemo(() => {
    if (selectedSubjectFilter === 'ALL') return assignments;
    return assignments.filter((a) => a.subject.trim() === selectedSubjectFilter);
  }, [assignments, selectedSubjectFilter]);

  // File Upload Handler (Stores in IndexedDB)
  const handleUploadSuccess = async (assignmentId: string, file: File) => {
    const record = await saveFileRecord(assignmentId, file);
    setUploadedFiles((prev) => ({
      ...prev,
      [assignmentId]: record,
    }));
  };

  // File Remove Handler (Deletes from IndexedDB)
  const handleRemoveSuccess = async (assignmentId: string) => {
    await deleteFileRecord(assignmentId);
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[assignmentId];
      return copy;
    });
  };

  // File Download Handler
  const handleDownload = (record: UploadedFileRecord) => {
    if (!record.blob) return;
    const url = URL.createObjectURL(record.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = record.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // In-line Assignment Update Handler
  const handleUpdateAssignment = (updated: Assignment) => {
    const nextList = assignments.map((a) => (a.id === updated.id ? updated : a));
    setAssignments(nextList);
    try {
      localStorage.setItem(LOCAL_STORAGE_ASSIGNMENTS_KEY, JSON.stringify(nextList));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* SECTION A: Navigation Bar */}
      <Navbar activeSection={activeSection} />

      <main style={{ flex: 1 }}>
        {/* SECTION B: Hero Section */}
        <Hero />

        {/* SECTION C: Portfolio Overview */}
        <Overview stats={stats} />

        {/* SECTION D: Assignments (The Main Section) */}
        <section id="assignments" className="section-wrapper">
          <div className="container">
            {/* Section Header */}
            <div className="section-header">
              <div className="section-badge">
                <BookOpen size={14} />
                <span>Coursework &amp; Submissions</span>
              </div>
              <h2 className="section-title">My Assignments</h2>
              <p className="section-subtitle">
                Explore the concepts, tasks, and submissions that document my academic learning.
              </p>
            </div>

            {/* Academic Notice & Guidance Banner */}
            <div
              style={{
                backgroundColor: 'var(--color-primary-blue-light)',
                border: '1px solid rgba(23, 105, 255, 0.25)',
                borderRadius: '8px',
                padding: '14px 18px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.88rem',
                color: 'var(--color-navy)',
              }}
            >
              <Info size={20} color="#1769FF" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Academic Data Integrity:</strong> The entries below serve as structured, 
                customizable placeholders corresponding to core Information Technology subjects. 
                You can upload submissions via drag-and-drop (persisted across refreshes in IndexedDB) 
                or customize topics and overviews anytime in <code>src/data/assignments.ts</code>.
              </div>
            </div>

            {/* Subject Filters Toolbar */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
                marginBottom: '28px',
                paddingBottom: '16px',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-text-muted)', marginRight: '8px' }}>
                <Filter size={14} />
                <span>Filter by Subject:</span>
              </div>

              <button
                type="button"
                className={`btn btn-sm ${selectedSubjectFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setSelectedSubjectFilter('ALL')}
              >
                All Subjects ({assignments.length})
              </button>

              {allSubjects.map((subject) => (
                <button
                  key={subject}
                  type="button"
                  className={`btn btn-sm ${selectedSubjectFilter === subject ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setSelectedSubjectFilter(subject)}
                >
                  {subject}
                </button>
              ))}
            </div>

            {/* Vertically Stacked List of Assignment Sections */}
            <div className="assignments-container">
              {filteredAssignments.map((assignment) => (
                <AssignmentSection
                  key={assignment.id}
                  assignment={assignment}
                  uploadedRecord={uploadedFiles[assignment.id]}
                  onUploadSuccess={handleUploadSuccess}
                  onRemoveSuccess={handleRemoveSuccess}
                  onPreview={(record) => setPreviewRecord(record)}
                  onDownload={handleDownload}
                  onUpdateAssignment={handleUpdateAssignment}
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION E: About Me */}
        <About />
      </main>

      {/* SECTION F: Footer */}
      <Footer />

      {/* Document / Image Preview Modal */}
      {previewRecord && (
        <FilePreviewModal
          record={previewRecord}
          onClose={() => setPreviewRecord(null)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};
