export interface Assignment {
  id: string;
  number: string;
  title: string;
  activityTitle: string;
  subtitle: string;
  subject: string;
  overview: string;
  whatILearned: string;
  keyTopics: string[];
}

export interface UploadedFileRecord {
  assignmentId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadedAt: string;
  blob?: Blob;
  fileUrl?: string;
  downloadUrl?: string;
  previewUrl?: string;
  textContent?: string;
}

export interface OverviewStats {
  totalAssignments: number;
  submittedCount: number;
  pendingCount: number;
}
