import React from 'react';
import { Terminal, ShieldCheck, Cpu } from 'lucide-react';

export const HeroGraphic: React.FC = () => {
  return (
    <div className="hero-visual-container">
      <div className="hero-graphic-card">
        {/* Top Accent Gradient Bar */}
        <div className="hero-graphic-accent-bar" />

        {/* Card Header */}
        <div className="graphic-header">
          <div className="graphic-badge">
            <Cpu size={14} />
            <span>IT // ACADEMIC RECORD</span>
          </div>
          <div className="graphic-dots">
            <span className="graphic-dot"></span>
            <span className="graphic-dot"></span>
            <span className="graphic-dot"></span>
          </div>
        </div>

        {/* Center Stylized Monogram */}
        <div className="graphic-center-monogram">
          <div className="monogram-emblem">
            <span>SS</span>
          </div>
          <div className="graphic-info-title">Shubham Singh</div>
          <div className="graphic-info-sub">Information Technology &bull; B.Tech</div>
        </div>

        {/* Decorative Tech SVG Line */}
        <svg
          viewBox="0 0 320 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', margin: '8px 0' }}
        >
          <path
            d="M0 18 H90 L108 4 H212 L230 18 H320"
            stroke="#1769FF"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
          <circle cx="108" cy="4" r="3" fill="#16A878" />
          <circle cx="212" cy="4" r="3" fill="#1769FF" />
          <circle cx="160" cy="4" r="2" fill="#B8F3D5" />
        </svg>

        {/* Dynamic Metric Indicator Row */}
        <div className="graphic-metrics-row">
          <div className="metric-box">
            <span className="metric-num">B.Tech</span>
            <span className="metric-txt">Programme</span>
          </div>
          <div className="metric-box">
            <span className="metric-num">IT</span>
            <span className="metric-txt">Branch</span>
          </div>
          <div className="metric-box">
            <span className="metric-num" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <ShieldCheck size={14} color="#16A878" /> Verified
            </span>
            <span className="metric-txt">Academic ID</span>
          </div>
        </div>

        {/* System Terminal Prompt Footnote */}
        <div
          style={{
            marginTop: '16px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: '#B8F3D5',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Terminal size={13} color="#16A878" />
          <span>student@portfolio:~$ load --assignments</span>
        </div>
      </div>
    </div>
  );
};
