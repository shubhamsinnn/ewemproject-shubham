import React from 'react';
import { 
  BookMarked, 
  CheckCircle2, 
  Clock, 
  Tag, 
  GraduationCap, 
  FileText
} from 'lucide-react';
import { Assignment, UploadedFileRecord } from '../types';
import { AssignmentUpload } from './AssignmentUpload';

interface AssignmentSectionProps {
  assignment: Assignment;
  uploadedRecord?: UploadedFileRecord;
  onUploadSuccess: (assignmentId: string, file: File) => Promise<void>;
  onRemoveSuccess: (assignmentId: string) => Promise<void>;
  onPreview: (record: UploadedFileRecord) => void;
  onDownload: (record: UploadedFileRecord) => void;
}

export const AssignmentSection: React.FC<AssignmentSectionProps> = ({
  assignment,
  uploadedRecord,
  onUploadSuccess,
  onRemoveSuccess,
  onPreview,
  onDownload,
}) => {
  const isUploaded = !!uploadedRecord;

  return (
    <article 
      className="assignment-card" 
      id={`assignment-${assignment.number}`}
      style={{ scrollMarginTop: '90px' }}
    >
      {/* Assignment Header */}
      <div className="assignment-header">
        <div className="assignment-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
            <span className="assignment-subject-badge" style={{ color: 'var(--color-navy)', background: 'var(--color-emerald-light)', borderColor: 'rgba(22, 168, 120, 0.3)' }}>
              <BookMarked size={14} color="#16A878" />
              {assignment.subject}
            </span>

            <span 
              style={{
                fontSize: '0.74rem',
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-primary-blue)',
                background: 'var(--color-primary-blue-light)',
                padding: '3px 8px',
                borderRadius: '4px',
                fontWeight: 600,
                border: '1px solid rgba(23, 105, 255, 0.2)'
              }}
            >
              Spiral Sequence: Stage {assignment.number}
            </span>
          </div>

          <h3 className="assignment-title">
            <span className="assignment-num">Assignment {assignment.number}</span>
            <span>&mdash; {assignment.title}</span>
          </h3>

          <div style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', marginTop: '4px', fontWeight: 500 }}>
            Activity Focus: {assignment.activityTitle}
          </div>
        </div>

        {/* Status Badge */}
        <div className={`assignment-status-badge ${isUploaded ? 'uploaded' : 'not-uploaded'}`}>
          {isUploaded ? (
            <>
              <CheckCircle2 size={15} />
              <span>Uploaded</span>
            </>
          ) : (
            <>
              <Clock size={15} />
              <span>Not Uploaded</span>
            </>
          )}
        </div>
      </div>

      {/* Assignment Body: Overview, What I Learned, Key Topics + Upload Zone */}
      <div className="assignment-body">
        {/* Left Column: Academic Overview & Learning Synthesis */}
        <div className="assignment-details">
          {/* Overview */}
          <div className="detail-block">
            <h4>
              <FileText size={15} color="#1769FF" />
              Overview
            </h4>
            <p style={{ lineHeight: '1.65' }}>{assignment.overview}</p>
          </div>

          {/* What I Learned */}
          <div className="detail-block">
            <h4>
              <GraduationCap size={16} color="#16A878" />
              What I Learned
            </h4>
            <p style={{ lineHeight: '1.65' }}>{assignment.whatILearned}</p>
          </div>

          {/* Key Topics */}
          <div className="detail-block">
            <h4>
              <Tag size={15} color="#D97706" />
              Key Concepts &amp; Topics
            </h4>
            <div className="topics-chips">
              {assignment.keyTopics.map((topic, idx) => (
                <span key={idx} className="topic-chip">
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Independent Upload Area */}
        <div>
          <AssignmentUpload
            assignmentId={assignment.id}
            uploadedRecord={uploadedRecord}
            onUploadSuccess={onUploadSuccess}
            onRemoveSuccess={onRemoveSuccess}
            onPreview={onPreview}
            onDownload={onDownload}
          />
        </div>
      </div>
    </article>
  );
};
