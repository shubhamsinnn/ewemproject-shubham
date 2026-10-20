import React, { useState } from 'react';
import { Menu, X, BookOpen } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="navbar-sticky">
      <div className="container navbar-inner">
        {/* Brand */}
        <a 
          href="#home" 
          onClick={(e) => { e.preventDefault(); scrollTo('home'); }}
          className="nav-brand"
        >
          <div className="nav-logo-mark">
            <BookOpen size={20} strokeWidth={2.5} />
          </div>
          <div className="nav-brand-title">
            <span>SHUBHAM SINGH</span>
            <span>Academic E-Portfolio</span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className="nav-links-desktop">
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); scrollTo('home'); }}
            className={`nav-link-item ${activeSection === 'home' ? 'active' : ''}`}
          >
            Home
          </a>
          <a
            href="#overview"
            onClick={(e) => { e.preventDefault(); scrollTo('overview'); }}
            className={`nav-link-item ${activeSection === 'overview' ? 'active' : ''}`}
          >
            Overview
          </a>
          <a
            href="#assignments"
            onClick={(e) => { e.preventDefault(); scrollTo('assignments'); }}
            className={`nav-link-item ${activeSection === 'assignments' ? 'active' : ''}`}
          >
            Assignments
          </a>
          <a
            href="#about"
            onClick={(e) => { e.preventDefault(); scrollTo('about'); }}
            className={`nav-link-item ${activeSection === 'about' ? 'active' : ''}`}
          >
            About
          </a>

          {/* Roll Number Highlighted Badge */}
          <div className="nav-roll-badge" title="Student University Roll Number">
            <span className="nav-roll-dot"></span>
            Roll No. 24101C0076
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); scrollTo('home'); }}
        >
          Home
        </a>
        <a
          href="#overview"
          onClick={(e) => { e.preventDefault(); scrollTo('overview'); }}
        >
          Overview
        </a>
        <a
          href="#assignments"
          onClick={(e) => { e.preventDefault(); scrollTo('assignments'); }}
        >
          Assignments
        </a>
        <a
          href="#about"
          onClick={(e) => { e.preventDefault(); scrollTo('about'); }}
        >
          About
        </a>
        <div className="nav-roll-badge" style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
          <span className="nav-roll-dot"></span>
          Roll No. 24101C0076
        </div>
      </div>
    </header>
  );
};
