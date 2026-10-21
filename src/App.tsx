import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Overview } from './components/Overview';
import { AssignmentIndex } from './components/AssignmentIndex';
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
import { BookOpen, Globe } from 'lucide-react';

export const App: React.FC = () => {
  const [assignments] = useState<Assignment[]>(initialAssignments);
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, UploadedFileRecord>>({});
  const [activeSection, setActiveSection] = useState<string>('home');
  const [previewRecord, setPreviewRecord] = useState<UploadedFileRecord | null>(null);

  // Load uploaded files from Cloud & IndexedDB on component mount, on focus, and via sync interval
  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      try {
        const records = await getAllFileRecords();
        if (isMounted) {
          setUploadedFiles(records);
        }
      } catch (err) {
        console.error('Failed to load files from storage:', err);
      }
    };

    loadFiles();

    // Re-sync when user switches back to this tab (e.g. after uploading from another device)
    const onWindowFocus = () => {
      loadFiles();
    };
    window.addEventListener('focus', onWindowFocus);

    // Periodic background sync every 25 seconds
    const interval = setInterval(loadFiles, 25000);

    return () => {
      isMounted = false;
      window.removeEventListener('focus', onWindowFocus);
      clearInterval(interval);
    };
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

  // Dynamically calculate overview stats from EWEM assignments & uploaded records
  const stats: OverviewStats = useMemo(() => {
    const totalAssignments = assignments.length;
    const submittedCount = assignments.filter((a) => !!uploadedFiles[a.id]).length;
    const pendingCount = totalAssignments - submittedCount;

    return {
      totalAssignments,
      submittedCount,
      pendingCount,
    };
  }, [assignments, uploadedFiles]);

  // File Upload Handler (Syncs to Cloud Blob Storage & local cache)
  const handleUploadSuccess = async (assignmentId: string, file: File) => {
    const record = await saveFileRecord(assignmentId, file);
    setUploadedFiles((prev) => ({
      ...prev,
      [assignmentId]: record,
    }));
  };

  // File Remove Handler (Syncs deletion to Cloud Blob Storage & local cache)
  const handleRemoveSuccess = async (assignmentId: string) => {
    await deleteFileRecord(assignmentId);
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[assignmentId];
      return copy;
    });
  };

  // Universal File Download Handler (Supports local Blobs & Cloud CDN URLs)
  const handleDownload = (record: UploadedFileRecord) => {
    if (record.blob) {
      const url = URL.createObjectURL(record.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = record.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return;
    }

    if (record.downloadUrl || record.fileUrl) {
      const url = record.downloadUrl || record.fileUrl || '';
      const a = document.createElement('a');
      a.href = url;
      a.download = record.fileName;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
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
                <span>EWEM Assignment Spiral</span>
              </div>
              <h2 className="section-title">Coursework &amp; Submissions</h2>
              <p className="section-subtitle">
                Official curriculum sequence for <strong>EWEM — E-Waste &amp; Environmental Management (VEC02)</strong>. 
                Explore the technical concepts, activities, and submit your individual coursework deliverables below.
              </p>
            </div>

            {/* Academic Notice Banner */}
            <div
              style={{
                backgroundColor: 'var(--color-soft-rose)',
                border: '1px solid rgba(128, 0, 32, 0.25)',
                borderRadius: '8px',
                padding: '14px 18px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                fontSize: '0.88rem',
                color: 'var(--color-maroon-dark)',
              }}
            >
              <Globe size={20} color="#800020" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Cross-Device Cloud Sync Active:</strong> Submissions uploaded or edited on any device (phone, laptop, desktop) are automatically stored in persistent cloud storage. 
                Changes are visible and downloadable across all devices in real-time.
              </div>
            </div>

            {/* Assignment Spiral Navigation Index */}
            <AssignmentIndex 
              assignments={assignments} 
              uploadedFiles={uploadedFiles} 
            />

            {/* Vertically Stacked List of Assignment Sections */}
            <div className="assignments-container">
              {assignments.map((assignment) => (
                <AssignmentSection
                  key={assignment.id}
                  assignment={assignment}
                  uploadedRecord={uploadedFiles[assignment.id]}
                  onUploadSuccess={handleUploadSuccess}
                  onRemoveSuccess={handleRemoveSuccess}
                  onPreview={(record) => setPreviewRecord(record)}
                  onDownload={handleDownload}
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
