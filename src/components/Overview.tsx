import React from 'react';
import { BookOpen, Layers, CheckCircle2, Clock, Check, Target } from 'lucide-react';
import { OverviewStats } from '../types';

interface OverviewProps {
  stats: OverviewStats;
}

export const Overview: React.FC<OverviewProps> = ({ stats }) => {
  return (
    <section id="overview" className="section-wrapper" style={{ backgroundColor: '#F8FAFD' }}>
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-badge">
            <Layers size={14} />
            <span>Course Architecture</span>
          </div>
          <h2 className="section-title">Portfolio Overview</h2>
          <p className="section-subtitle">
            This portfolio organizes my coursework assignments and supporting submission materials for 
            <strong> EWEM — E-Waste &amp; Environmental Management (VEC02)</strong>. 
            Each assignment documents its purpose, technical concepts, learning synthesis, and uploaded deliverables.
          </p>
        </div>

        {/* 4 Dynamic Information Panels */}
        <div className="overview-stats-grid">
          {/* Total Assignments */}
          <div className="stat-card blue">
            <div className="stat-card-accent" />
            <div className="stat-icon-wrapper">
              <BookOpen size={22} />
            </div>
            <div className="stat-value">{stats.totalAssignments}</div>
            <div className="stat-title">Assignments</div>
            <div className="stat-desc">Complete EWEM spiral sequence (00–08)</div>
          </div>

          {/* Course Subject */}
          <div className="stat-card emerald">
            <div className="stat-card-accent" />
            <div className="stat-icon-wrapper">
              <Layers size={22} />
            </div>
            <div className="stat-value" style={{ fontSize: '1.75rem', letterSpacing: '-0.02em' }}>
              VEC02
            </div>
            <div className="stat-title">EWEM Course</div>
            <div className="stat-desc">E-Waste &amp; Environmental Management</div>
          </div>

          {/* Submitted Files */}
          <div className="stat-card green">
            <div className="stat-card-accent" />
            <div className="stat-icon-wrapper">
              <CheckCircle2 size={22} />
            </div>
            <div className="stat-value">{stats.submittedCount}</div>
            <div className="stat-title">Submitted</div>
            <div className="stat-desc">Assignments with uploaded files</div>
          </div>

          {/* Pending Files */}
          <div className="stat-card amber">
            <div className="stat-card-accent" />
            <div className="stat-icon-wrapper">
              <Clock size={22} />
            </div>
            <div className="stat-value">{stats.pendingCount}</div>
            <div className="stat-title">Pending</div>
            <div className="stat-desc">Assignments awaiting document upload</div>
          </div>
        </div>

        {/* Learning Objectives Card */}
        <div className="learning-objectives-card">
          <div className="objectives-header">
            <Target size={20} color="#16A878" />
            <h3>EWEM Learning Objectives &amp; Academic Outcomes</h3>
          </div>
          <div className="objectives-grid">
            <div className="objective-item">
              <Check size={18} />
              <span>Strengthen conceptual understanding of e-waste hazards, toxicology, and statutory frameworks (RoHS &amp; EPR).</span>
            </div>
            <div className="objective-item">
              <Check size={18} />
              <span>Apply theoretical engineering knowledge to practical challenges (carbon footprint audits, data modeling, AI upcycling).</span>
            </div>
            <div className="objective-item">
              <Check size={18} />
              <span>Analyze circular economy mechanics: urban mining, precious metal recovery, and certified industrial recycling.</span>
            </div>
            <div className="objective-item">
              <Check size={18} />
              <span>Maintain an organized, verifiable, and transparent digital record of academic submissions.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
