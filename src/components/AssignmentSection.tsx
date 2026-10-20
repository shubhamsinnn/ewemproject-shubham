import React, { useState } from 'react';
import { 
  BookMarked, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Lightbulb, 
  FileText,
  Edit3,
  Check,
  X
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
  onUpdateAssignment: (updated: Assignment) => void;
}

export const AssignmentSection: React.FC<AssignmentSectionProps> = ({
  assignment,
  uploadedRecord,
  onUploadSuccess,
  onRemoveSuccess,
  onPreview,
  onDownload,
  onUpdateAssignment,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [titleInput, setTitleInput] = useState(assignment.title);
  const [subjectInput, setSubjectInput] = useState(assignment.subject);
  const [overviewInput, setOverviewInput] = useState(assignment.overview);
  const [topicsInput, setTopicsInput] = useState(assignment.keyTopics.join(', '));
  const [outcomeInput, setOutcomeInput] = useState(assignment.learningOutcome);

  const isUploaded = !!uploadedRecord;

  const handleSaveEdit = () => {
    const updated: Assignment = {
      ...assignment,
      title: titleInput.trim() || assignment.title,
      subject: subjectInput.trim() || assignment.subject,
      overview: overviewInput.trim() || assignment.overview,
      keyTopics: topicsInput.split(',').map((t) => t.trim()).filter(Boolean),
      learningOutcome: outcomeInput.trim() || assignment.learningOutcome,
      isPlaceholder: false,
    };
    onUpdateAssignment(updated);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTitleInput(assignment.title);
    setSubjectInput(assignment.subject);
    setOverviewInput(assignment.overview);
    setTopicsInput(assignment.keyTopics.join(', '));
    setOutcomeInput(assignment.learningOutcome);
    setIsEditing(false);
  };

  return (
    <article className="assignment-card" id={`assignment-${assignment.number}`}>
      {/* Assignment Header */}
      <div className="assignment-header">
        <div className="assignment-title-area">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span className="assignment-subject-badge">
              <BookMarked size={14} color="#1769FF" />
              {assignment.subject}
            </span>

            {assignment.isPlaceholder && (
              <span 
                style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--color-primary-blue)',
                  background: 'var(--color-primary-blue-light)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(23, 105, 255, 0.2)'
                }}
              >
                Sample Placeholder
              </span>
            )}

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn btn-secondary btn-sm"
              style={{ padding: '2px 8px', fontSize: '0.75rem', height: '24px' }}
              title="Edit assignment information"
            >
              <Edit3 size={12} />
              {isEditing ? 'Cancel Edit' : 'Edit Details'}
            </button>
          </div>

          <h3 className="assignment-title">
            <span className="assignment-num">Assignment {assignment.number}</span>
            <span>&mdash; {assignment.title}</span>
          </h3>
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

      {/* Inline Editing Form */}
      {isEditing && (
        <div 
          style={{
            padding: '20px 28px',
            backgroundColor: '#F8FAFD',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '4px' }}>
                Assignment Title
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '4px' }}>
                Subject Name
              </label>
              <input
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '4px' }}>
              Overview (2-4 sentences describing purpose and activities)
            </label>
            <textarea
              rows={3}
              value={overviewInput}
              onChange={(e) => setOverviewInput(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.9rem', resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '4px' }}>
                Key Topics (Comma-separated)
              </label>
              <input
                type="text"
                value={topicsInput}
                onChange={(e) => setTopicsInput(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-navy)', display: 'block', marginBottom: '4px' }}>
                Learning Outcome
              </label>
              <input
                type="text"
                value={outcomeInput}
                onChange={(e) => setOutcomeInput(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-border)', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
            <button onClick={handleSaveEdit} className="btn btn-primary btn-sm">
              <Check size={14} /> Save Changes
            </button>
            <button onClick={handleCancelEdit} className="btn btn-secondary btn-sm">
              <X size={14} /> Cancel
            </button>
          </div>
        </div>
      )}

      {/* Assignment Body: Details + Upload Area */}
      <div className="assignment-body">
        {/* Left Side: Overview, Key Topics, Learning Outcome */}
        <div className="assignment-details">
          {/* Overview */}
          <div className="detail-block">
            <h4>
              <FileText size={15} color="#1769FF" />
              Overview
            </h4>
            <p>{assignment.overview}</p>
          </div>

          {/* Key Topics */}
          <div className="detail-block">
            <h4>
              <Tag size={15} color="#16A878" />
              Key Topics
            </h4>
            <div className="topics-chips">
              {assignment.keyTopics.map((topic, idx) => (
                <span key={idx} className="topic-chip">
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Learning Outcome */}
          <div className="detail-block">
            <h4>
              <Lightbulb size={15} color="#D97706" />
              Learning Outcome
            </h4>
            <p>{assignment.learningOutcome}</p>
          </div>
        </div>

        {/* Right Side: Upload & Submission Zone */}
        <AssignmentUpload
          assignmentId={assignment.id}
          uploadedRecord={uploadedRecord}
          onUploadSuccess={onUploadSuccess}
          onRemoveSuccess={onRemoveSuccess}
          onPreview={onPreview}
          onDownload={onDownload}
        />
      </div>
    </article>
  );
};
