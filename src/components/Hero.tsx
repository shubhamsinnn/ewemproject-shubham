import React from 'react';
import { Layers, FileText, Sparkles } from 'lucide-react';
import { HeroGraphic } from './HeroGraphic';

export const Hero: React.FC = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="hero-grid-bg" />
      <div className="container">
        <div className="hero-split-layout">
          {/* Left Column: Student Details & Intro */}
          <div className="hero-content">
            <div className="hero-tag">
              <Sparkles size={13} color="#B8F3D5" />
              <span>ACADEMIC E-PORTFOLIO</span>
              <span>&bull;</span>
              <span className="tag-accent">EWEM (VEC02)</span>
            </div>

            <h1 className="hero-main-title">Shubham Singh</h1>
            <h2 className="hero-subheading">Learning. Building. Documenting.</h2>

            <p className="hero-description">
              Welcome to my official academic e-portfolio for <strong>EWEM — E-Waste &amp; Environmental Management (VEC02)</strong>. 
              This portal houses my complete coursework assignments, technical concept syntheses, 
              practical deliverables, and individual submission documentation.
            </p>

            {/* Student Details Card */}
            <div className="hero-student-meta-panel">
              <div className="meta-item">
                <span className="meta-label">Student Name</span>
                <span className="meta-value">Shubham Singh</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Roll Number</span>
                <span className="meta-value mono">24101C0076</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Subject &amp; Code</span>
                <span className="meta-value" style={{ color: 'var(--color-emerald)' }}>EWEM (VEC02)</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Programme &amp; Branch</span>
                <span className="meta-value">B.Tech &bull; Information Technology</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="hero-actions">
              <button
                onClick={() => scrollTo('assignments')}
                className="btn btn-primary"
              >
                <FileText size={18} />
                Explore Assignment Spiral
              </button>
              <button
                onClick={() => scrollTo('overview')}
                className="btn btn-secondary"
              >
                <Layers size={18} />
                Portfolio Overview
              </button>
            </div>
          </div>

          {/* Right Column: High-tech Visual & SS Monogram */}
          <HeroGraphic />
        </div>
      </div>
    </section>
  );
};
