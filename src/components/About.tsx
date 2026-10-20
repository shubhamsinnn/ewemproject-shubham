import React from 'react';
import { User, Code2, Database, Network, Cpu, ShieldCheck } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <section id="about" className="section-wrapper" style={{ backgroundColor: '#F8FAFD' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <User size={14} />
            <span>Profile</span>
          </div>
          <h2 className="section-title">About Me</h2>
          <p className="section-subtitle">
            An introduction to my engineering background, core academic interests, and technical foundation.
          </p>
        </div>

        {/* Content Card */}
        <div className="about-card">
          <div className="about-grid">
            {/* Left Column: Narrative and Academic Focus */}
            <div>
              <p className="about-bio-text">
                I am Shubham Singh, a B.Tech Engineering student in Information Technology. 
                This portfolio serves as a structured record of my academic assignments, 
                technical concepts, practical work, and learning progress.
              </p>

              {/* Academic Focus Subsection */}
              <div className="academic-focus-area">
                <h4>Academic Focus</h4>
                <div className="focus-tags">
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Code2 size={16} />
                    <span>Programming & Systems Development</span>
                  </div>
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={16} />
                    <span>Computer Science Fundamentals</span>
                  </div>
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={16} />
                    <span>Analytical Thinking</span>
                  </div>
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Network size={16} />
                    <span>Practical Problem-Solving</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Student Information Panel */}
            <div className="student-info-sidebar">
              <h4>Student Information</h4>

              <div className="meta-item">
                <span className="meta-label">Name</span>
                <span className="meta-value">Shubham Singh</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Roll Number</span>
                <span className="meta-value mono">24101C0076</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Programme</span>
                <span className="meta-value">B.Tech Engineering</span>
              </div>

              <div className="meta-item">
                <span className="meta-label">Branch</span>
                <span className="meta-value">Information Technology</span>
              </div>

              <div 
                style={{
                  marginTop: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.78rem',
                  color: 'var(--color-emerald)',
                  fontWeight: 600,
                }}
              >
                <ShieldCheck size={16} />
                <span>Verified Academic Record</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
