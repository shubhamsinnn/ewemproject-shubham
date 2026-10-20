import React from 'react';
import { User, Recycle, Leaf, ShieldCheck, Cpu, Database } from 'lucide-react';

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
            An introduction to my engineering background, environmental commitment, and academic coursework.
          </p>
        </div>

        {/* Content Card */}
        <div className="about-card">
          <div className="about-grid">
            {/* Left Column: Narrative and Academic Focus */}
            <div>
              <p className="about-bio-text">
                I am <strong>Shubham Singh</strong>, a B.Tech Engineering student in Information Technology. 
                This portfolio serves as a structured academic record of my assignments, technical concepts, 
                practical coursework, and learning outcomes in <strong>EWEM — E-Waste &amp; Environmental Management (VEC02)</strong>.
              </p>

              {/* Academic Focus Subsection */}
              <div className="academic-focus-area">
                <h4>Academic &amp; Environmental Focus</h4>
                <div className="focus-tags">
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Recycle size={16} />
                    <span>E-Waste Lifecycle &amp; Circular Economy</span>
                  </div>
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Leaf size={16} />
                    <span>Environmental Impact &amp; Carbon Auditing</span>
                  </div>
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Cpu size={16} />
                    <span>Sustainable IT &amp; Green Computing</span>
                  </div>
                  <div className="focus-tag" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    <Database size={16} />
                    <span>Statutory Directives (EPR &amp; RoHS)</span>
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

              <div className="meta-item">
                <span className="meta-label">Course Subject</span>
                <span className="meta-value" style={{ color: 'var(--color-emerald)' }}>EWEM (VEC02)</span>
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
                <span>Verified Academic Record &bull; VEC02</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
