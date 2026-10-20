import React from 'react';
import { Terminal, ShieldCheck, Leaf } from 'lucide-react';

export const HeroGraphic: React.FC = () => {
  return (
    <div className="hero-visual-container">
      <div className="hero-graphic-card">
        {/* Top Accent Gradient Bar */}
        <div className="hero-graphic-accent-bar" />

        {/* Card Header */}
        <div className="graphic-header">
          <div className="graphic-badge">
            <Leaf size={14} color="#F5E9EC" />
            <span>EWEM // VEC02 RECORD</span>
          </div>
          <div className="graphic-dots">
            <span className="graphic-dot"></span>
            <span className="graphic-dot"></span>
            <span className="graphic-dot"></span>
          </div>
        </div>

        {/* Center Stylized Geometric Pentagon Emblem with SC */}
        <div className="graphic-center-monogram">
          <svg
            viewBox="0 0 120 120"
            className="pentagon-emblem-svg"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="scMaroonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#800020" />
                <stop offset="50%" stopColor="#5B1020" />
                <stop offset="100%" stopColor="#3B0915" />
              </linearGradient>
              <linearGradient id="scBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F5E9EC" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#800020" stopOpacity="0.4" />
              </linearGradient>
            </defs>

            {/* Outer Subtle Dashed Ring */}
            <circle cx="60" cy="60" r="56" fill="none" stroke="rgba(245, 233, 236, 0.2)" strokeWidth="1.5" strokeDasharray="4 4" />

            {/* Geometric Regular Pentagon Shape */}
            <polygon
              points="60,10 108,45 89,102 31,102 12,45"
              fill="url(#scMaroonGrad)"
              stroke="url(#scBorderGrad)"
              strokeWidth="2.5"
            />

            {/* Inner Pentagon Border Accent */}
            <polygon
              points="60,18 99,47 84,94 36,94 21,47"
              fill="none"
              stroke="rgba(245, 233, 236, 0.25)"
              strokeWidth="1"
            />

            {/* Monogram SC Initials */}
            <text
              x="60"
              y="68"
              fontFamily="var(--font-sans)"
              fontSize="30"
              fontWeight="800"
              fill="#FFFFFF"
              letterSpacing="-0.03em"
              textAnchor="middle"
            >
              SC
            </text>
          </svg>

          <div className="graphic-info-title">Shamita Chavan</div>
          <div className="graphic-info-sub">E-Waste &amp; Environmental Management (VEC02)</div>
        </div>

        {/* Decorative Maroon Tech SVG Line */}
        <svg
          viewBox="0 0 320 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', margin: '4px 0 8px 0' }}
        >
          <path
            d="M0 18 H90 L108 4 H212 L230 18 H320"
            stroke="#800020"
            strokeWidth="1.5"
            strokeOpacity="0.5"
          />
          <circle cx="108" cy="4" r="3" fill="#F5E9EC" />
          <circle cx="212" cy="4" r="3" fill="#800020" />
          <circle cx="160" cy="4" r="2" fill="#FFFFFF" />
        </svg>

        {/* Dynamic Metric Indicator Row */}
        <div className="graphic-metrics-row">
          <div className="metric-box">
            <span className="metric-num">VEC02</span>
            <span className="metric-txt">Course Code</span>
          </div>
          <div className="metric-box">
            <span className="metric-num">2 Credits</span>
            <span className="metric-txt">Weighting</span>
          </div>
          <div className="metric-box">
            <span className="metric-num" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
              <ShieldCheck size={14} color="#F5E9EC" /> 24101C0066
            </span>
            <span className="metric-txt">Student ID</span>
          </div>
        </div>

        {/* System Terminal Prompt Footnote */}
        <div
          style={{
            marginTop: '16px',
            background: 'rgba(0, 0, 0, 0.35)',
            borderRadius: '6px',
            padding: '8px 12px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: '#F5E9EC',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <Terminal size={13} color="#F5E9EC" />
          <span>shamita@ewem-portfolio:~$ load --assignments-spiral</span>
        </div>
      </div>
    </div>
  );
};
