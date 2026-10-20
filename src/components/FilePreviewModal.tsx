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
            <FileText size={18} color="#800020" />
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
          {isImage && objectUrl && (
            <img 
              src={objectUrl} 
              alt={record.fileName} 
              className="preview-image" 
            />
          )}

          {isPdf && objectUrl && (
            <iframe
              src={objectUrl}
              title={record.fileName}
              className="preview-iframe"
            />
          )}

          {!isImage && !isPdf && (
            <div className="preview-document-card">
              <div 
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '12px',
                  background: 'var(--color-soft-rose)',
                  color: 'var(--color-maroon-primary)',
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
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-maroon-deep)' }}>
                {record.fileName}
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                Binary document format ({formatBytes(record.fileSize)}). To view the complete formatted contents, slides, or spreadsheets, download the file directly to open in your system application.
              </p>
              <button 
                onClick={() => onDownload(record)}
                className="btn btn-primary"
              >
                <Download size={16} />
                Download Document ({formatBytes(record.fileSize)})
              </button>
            </div>
          )}
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
