import React, { useEffect, useState } from 'react';
import { X, Download, FileText, AlertCircle } from 'lucide-react';
import { UploadedFileRecord } from '../types';
import { formatBytes } from '../utils/storage';

interface FilePreviewModalProps {
  record: UploadedFileRecord | null;
  onClose: () => void;
  onDownload: (record: UploadedFileRecord) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  record,
  onClose,
  onDownload,
}) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);

  useEffect(() => {
    if (record?.blob) {
      const url = URL.createObjectURL(record.blob);
      setObjectUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setObjectUrl(null);
    }
  }, [record]);

  if (!record) return null;

  const ext = record.fileName.split('.').pop()?.toLowerCase() || '';
  const isImage = ['png', 'jpg', 'jpeg'].includes(ext);
  const isPdf = ext === 'pdf';
  const fileSrc = objectUrl || record.fileUrl || '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-box" 
        onClick={(e) => e.stopPropagation()} 
        role="dialog" 
        aria-modal="true"
        aria-labelledby="modal-preview-title"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title" id="modal-preview-title">
            <FileText size={18} color="#1769FF" />
            <span>Document Preview: {record.fileName}</span>
          </div>
          <button 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close preview modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {isImage && fileSrc && (
            <img 
              src={fileSrc} 
              alt={record.fileName} 
              className="preview-image" 
            />
          )}

          {isPdf && fileSrc && (
            <iframe
              src={fileSrc}
              title={record.fileName}
              className="preview-iframe"
            />
          )}

          {(!isImage && !isPdf) || !fileSrc ? (
            <div className="preview-document-card">
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  background: 'var(--color-primary-blue-light)',
                  color: 'var(--color-primary-blue)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  fontFamily: 'var(--font-mono)'
                }}
              >
                .{ext.toUpperCase()}
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-navy)' }}>
                {record.fileName}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                Binary document format ({formatBytes(record.fileSize)}). To view the complete formatted contents, charts, or slides, download the file directly to open in your system application.
              </p>
              <button 
                onClick={() => onDownload(record)}
                className="btn btn-primary"
              >
                <Download size={16} />
                Download Document ({formatBytes(record.fileSize)})
              </button>
            </div>
          ) : null}
        </div>

        {/* Modal Footer */}
        <div 
          style={{
            padding: '14px 24px',
            borderTop: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: '#FFFFFF',
          }}
        >
          <div style={{ fontSize: '0.82rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <AlertCircle size={14} />
            <span>Format: .{ext.toUpperCase()} &bull; Size: {formatBytes(record.fileSize)}</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => onDownload(record)} 
              className="btn btn-primary btn-sm"
            >
              <Download size={15} />
              Download
            </button>
            <button 
              onClick={onClose} 
              className="btn btn-secondary btn-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
