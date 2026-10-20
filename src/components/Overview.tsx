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
            <span>Academic Metrics</span>
          </div>
          <h2 className="section-title">Portfolio Overview</h2>
          <p className="section-subtitle">
            This portfolio organizes my academic assignments and supporting materials in one place. 
            Each entry explains its purpose, key concepts, tasks completed, and the work submitted.
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
            <div className="stat-desc">Total academic assignments cataloged</div>
          </div>

          {/* Unique Subjects */}
          <div className="stat-card emerald">
            <div className="stat-card-accent" />
            <div className="stat-icon-wrapper">
              <Layers size={22} />
            </div>
            <div className="stat-value">{stats.uniqueSubjects}</div>
            <div className="stat-title">Subjects</div>
            <div className="stat-desc">Unique Information Technology courses</div>
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
            <h3>Learning Objectives</h3>
          </div>
          <div className="objectives-grid">
            <div className="objective-item">
              <Check size={18} />
              <span>Strengthen conceptual understanding.</span>
            </div>
            <div className="objective-item">
              <Check size={18} />
              <span>Apply theoretical knowledge to practical problems.</span>
            </div>
            <div className="objective-item">
              <Check size={18} />
              <span>Develop technical and analytical skills.</span>
            </div>
            <div className="objective-item">
              <Check size={18} />
              <span>Maintain an organized record of academic work.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
