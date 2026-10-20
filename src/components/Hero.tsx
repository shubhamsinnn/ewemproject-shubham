import React from 'react';
import { Layers, FileText } from 'lucide-react';
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
              <span>ACADEMIC E-PORTFOLIO</span>
              <span>&bull;</span>
              <span className="tag-accent">INFORMATION TECHNOLOGY</span>
            </div>

            <h1 className="hero-main-title">Shubham Singh</h1>
            <h2 className="hero-subheading">Learning. Building. Documenting.</h2>

            <p className="hero-description">
              Welcome to my academic e-portfolio, a collection of my assignments, practical work, 
              technical learning, and academic progress throughout my engineering journey.
            </p>

            {/* Student Details Card */}
            <div className="hero-student-meta-panel">
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
            </div>

            {/* Call to Actions */}
            <div className="hero-actions">
              <button
                onClick={() => scrollTo('assignments')}
                className="btn btn-primary"
              >
                <FileText size={18} />
                Explore Assignments
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
