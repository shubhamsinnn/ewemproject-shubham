export interface Assignment {
  id: string;
  number: string;
  title: string;
  subject: string;
  overview: string;
  keyTopics: string[];
  learningOutcome: string;
  isPlaceholder?: boolean;
}

export interface UploadedFileRecord {
  assignmentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  blob?: Blob;
  previewUrl?: string;
  textContent?: string;
}

export interface OverviewStats {
  totalAssignments: number;
  uniqueSubjects: number;
  submittedCount: number;
  pendingCount: number;
}
