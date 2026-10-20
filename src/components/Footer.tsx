import React from 'react';
import { BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Roll Number */}
          <div className="footer-brand">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div 
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: 'var(--color-primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF'
                }}
              >
                <BookOpen size={16} />
              </div>
              <h3 style={{ margin: 0 }}>Shubham Singh</h3>
            </div>
            <p>Roll No. 24101C0076 &bull; Academic E-Portfolio</p>
            <p className="footer-quote">
              &ldquo;An ongoing record of learning, practice, and academic growth.&rdquo;
            </p>
          </div>

          {/* Quick Navigation Links */}
          <div className="footer-links-group">
            <div className="footer-nav-col">
              <span>Navigation</span>
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }}>
                Home
              </a>
              <a href="#overview" onClick={(e) => { e.preventDefault(); scrollTo('overview'); }}>
                Overview
              </a>
              <a href="#assignments" onClick={(e) => { e.preventDefault(); scrollTo('assignments'); }}>
                Assignments
              </a>
              <a href="#about" onClick={(e) => { e.preventDefault(); scrollTo('about'); }}>
                About Me
              </a>
            </div>

            <div className="footer-nav-col">
              <span>Programme</span>
              <span style={{ color: '#FFFFFF', fontSize: '0.88rem', textTransform: 'none', fontWeight: 600 }}>
                B.Tech Engineering
              </span>
              <span style={{ color: 'var(--color-mint)', fontSize: '0.85rem', textTransform: 'none', fontWeight: 500 }}>
                Information Technology
              </span>
              <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.82rem', textTransform: 'none' }}>
                Academic Year {currentYear}
              </span>
            </div>
          </div>
        </div>

        {/* Bottom copyright and disclaimer */}
        <div className="footer-bottom">
          <div>
            &copy; {currentYear} Shubham Singh &bull; Roll No. 24101C0076 &bull; All Academic Rights Reserved.
          </div>
          <div>
            Information Technology &bull; B.Tech Degree Portfolio
          </div>
        </div>
      </div>
    </footer>
  );
};
