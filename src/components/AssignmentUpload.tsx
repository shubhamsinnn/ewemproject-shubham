import React, { useRef, useState } from 'react';
import { 
  UploadCloud, 
  FileCheck, 
  Eye, 
  Download, 
  RefreshCw, 
  Trash2, 
  AlertTriangle,
  HardDrive
} from 'lucide-react';
import { UploadedFileRecord } from '../types';
import { 
  validateFileType, 
  formatBytes, 
  formatDate 
} from '../utils/storage';

interface AssignmentUploadProps {
  assignmentId: string;
  uploadedRecord?: UploadedFileRecord;
  onUploadSuccess: (assignmentId: string, file: File) => Promise<void>;
  onRemoveSuccess: (assignmentId: string) => Promise<void>;
  onPreview: (record: UploadedFileRecord) => void;
  onDownload: (record: UploadedFileRecord) => void;
}

export const AssignmentUpload: React.FC<AssignmentUploadProps> = ({
  assignmentId,
  uploadedRecord,
  onUploadSuccess,
  onRemoveSuccess,
  onPreview,
  onDownload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFileProcess = async (file: File) => {
    setValidationError(null);
    const validation = validateFileType(file);
    if (!validation.valid) {
      setValidationError(validation.error || 'Invalid file format.');
      return;
    }

    try {
      setIsProcessing(true);
      await onUploadSuccess(assignmentId, file);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      setValidationError('Failed to store file in browser IndexedDB. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileProcess(e.dataTransfer.files[0]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileProcess(e.target.files[0]);
      // Reset input value so re-uploading same file name triggers change
      e.target.value = '';
    }
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  const confirmDelete = async () => {
    try {
      setIsProcessing(true);
      await onRemoveSuccess(assignmentId);
      setShowDeleteConfirm(false);
    } catch (err) {
      console.error(err);
      setValidationError('Failed to remove submission from storage.');
    } finally {
      setIsProcessing(false);
    }
  };

  const getFileBadgeColor = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf': return { bg: '#FEE2E2', text: '#DC2626' }; // Red
      case 'doc':
      case 'docx': return { bg: '#DBEAFE', text: '#2563EB' }; // Blue
      case 'ppt':
      case 'pptx': return { bg: '#FFEDD5', text: '#EA580C' }; // Orange
      case 'xls':
      case 'xlsx': return { bg: '#DCFCE7', text: '#16A34A' }; // Green
      case 'zip': return { bg: '#F3E8FF', text: '#9333EA' }; // Purple
      default: return { bg: '#E0F2FE', text: '#0284C7' }; // Teal
    }
  };

  return (
    <div className="submission-zone">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={handleInputChange}
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.zip,.png,.jpg,.jpeg"
      />

      <div className="submission-zone-header">
        <span>Assignment Submission</span>
        {uploadedRecord ? (
          <span style={{ color: 'var(--color-emerald)', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <FileCheck size={14} /> Uploaded
          </span>
        ) : (
          <span style={{ color: 'var(--color-text-muted)', fontSize: '0.75rem' }}>
            Pending Submission
          </span>
        )}
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="file-error-alert">
          <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
          <span>{validationError}</span>
        </div>
      )}

      {/* EMPTY STATE: Drag & Drop Zone */}
      {!uploadedRecord && (
        <div
          className={`dropzone-empty ${isDragOver ? 'dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleTriggerUpload}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleTriggerUpload(); }}
        >
          <div className="dropzone-icon">
            <UploadCloud size={24} />
          </div>
          <div className="dropzone-text">
            {isProcessing ? 'Processing document...' : (
              <>Drag and drop assignment file here, or <span>Browse</span></>
            )}
          </div>
          <div className="dropzone-hint">
            Supports PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP, PNG, JPG (up to 30MB)
          </div>
        </div>
      )}

      {/* UPLOADED STATE: File Record Display */}
      {uploadedRecord && (
        <div className="uploaded-file-card">
          <div className="file-info-row">
            <div 
              className="file-type-icon" 
              style={{
                backgroundColor: getFileBadgeColor(uploadedRecord.fileName).bg,
                color: getFileBadgeColor(uploadedRecord.fileName).text,
                borderColor: getFileBadgeColor(uploadedRecord.fileName).text + '40',
              }}
            >
              .{uploadedRecord.fileName.split('.').pop()?.toUpperCase() || 'FILE'}
            </div>

            <div className="file-meta-content">
              <div className="file-name" title={uploadedRecord.fileName}>
                {uploadedRecord.fileName}
              </div>
              <div className="file-details">
                <span>{formatBytes(uploadedRecord.fileSize)}</span>
                <span>&bull;</span>
                <span>Uploaded: {formatDate(uploadedRecord.uploadedAt)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons: Preview, Download, Replace, Remove */}
          {!showDeleteConfirm ? (
            <div className="file-actions-row">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => onPreview(uploadedRecord)}
                title="Preview document"
              >
                <Eye size={14} />
                Preview
              </button>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => onDownload(uploadedRecord)}
                title="Download submitted file"
              >
                <Download size={14} />
                Download
              </button>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleTriggerUpload}
                disabled={isProcessing}
                title="Replace with new file"
              >
                <RefreshCw size={14} />
                Replace
              </button>

              <button
                type="button"
                className="btn btn-danger btn-sm"
                onClick={() => setShowDeleteConfirm(true)}
                title="Remove submitted file"
                style={{ marginLeft: 'auto' }}
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          ) : (
            /* Confirmation Dialog for Removal */
            <div 
              style={{
                background: 'var(--color-danger-bg)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '6px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#B91C1C', fontWeight: 600 }}>
                Are you sure you want to remove this submission file?
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={confirmDelete}
                  disabled={isProcessing}
                >
                  Confirm Delete
                </button>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Storage & Academic Disclaimer Note */}
          <div className="file-storage-note">
            <HardDrive size={13} />
            <span>Stored in browser IndexedDB (retained across page refreshes)</span>
          </div>
        </div>
      )}
    </div>
  );
};
