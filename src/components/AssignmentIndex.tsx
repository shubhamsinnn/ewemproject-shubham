import React from 'react';
import { Assignment, UploadedFileRecord } from '../types';
import { Compass, CheckCircle2, Clock, ArrowDownRight } from 'lucide-react';

interface AssignmentIndexProps {
  assignments: Assignment[];
  uploadedFiles: Record<string, UploadedFileRecord>;
}

export const AssignmentIndex: React.FC<AssignmentIndexProps> = ({
  assignments,
  uploadedFiles,
}) => {
  const scrollToAssignment = (assignmentNumber: string) => {
    const el = document.getElementById(`assignment-${assignmentNumber}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--color-border)',
        borderRadius: '12px',
        padding: '24px 28px',
        marginBottom: '36px',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      <div 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '20px',
          paddingBottom: '14px',
          borderBottom: '1px solid var(--color-border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--color-soft-rose)',
              color: 'var(--color-maroon-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Compass size={20} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-maroon-deep)', margin: 0 }}>
              EWEM Assignment Spiral Index
            </h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', margin: 0 }}>
              Curriculum sequence (Assignments 00 to 08) &bull; Click any entry to jump directly
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', fontWeight: 600 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-maroon-primary)' }}>
            <CheckCircle2 size={15} /> Uploaded
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-text-muted)' }}>
            <Clock size={15} /> Pending Upload
          </span>
        </div>
      </div>

      {/* Grid of 9 Assignments */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
        }}
      >
        {assignments.map((assignment) => {
          const isUploaded = !!uploadedFiles[assignment.id];
          return (
            <button
              key={assignment.id}
              onClick={() => scrollToAssignment(assignment.number)}
              type="button"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                borderRadius: '8px',
                background: isUploaded ? 'var(--color-status-uploaded-bg)' : 'var(--color-surface-subtle)',
                border: isUploaded ? '1px solid rgba(128, 0, 32, 0.3)' : '1px solid var(--color-border)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = 'var(--color-maroon-primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = isUploaded ? 'rgba(128, 0, 32, 0.3)' : 'var(--color-border)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                <span 
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: isUploaded ? 'var(--color-maroon-primary)' : 'var(--color-maroon-deep)',
                    background: '#FFFFFF',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    flexShrink: 0,
                  }}
                >
                  Assn {assignment.number}
                </span>
                <div style={{ minWidth: 0 }}>
                  <div 
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 700,
                      color: 'var(--color-maroon-deep)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={assignment.title}
                  >
                    {assignment.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                    {assignment.subtitle}
                  </div>
                </div>
              </div>

              <div style={{ flexShrink: 0, marginLeft: '8px' }}>
                {isUploaded ? (
                  <CheckCircle2 size={16} color="var(--color-maroon-primary)" />
                ) : (
                  <ArrowDownRight size={16} color="var(--color-text-muted)" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
