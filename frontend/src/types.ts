export const STATUSES = ['Saved', 'Applied', 'Interview', 'Offer', 'Rejected'] as const;

export type Status = (typeof STATUSES)[number];

export type BoardView = 'board' | 'list';

export type JobApplication = {
  id: number;
  company: string;
  position: string;
  status: Status;
  appliedDate: string;
  notes: string;
};

export type JobApplicationInput = Omit<JobApplication, 'id'>;

export type ApplicationStats = {
  total: number;
  saved: number;
  applied: number;
  interviews: number;
  offers: number;
  rejections: number;
};

export type Preferences = {
  workspaceName: string;
  defaultStatus: Status;
  pageSize: number;
  confirmDelete: boolean;
  defaultView: BoardView;
};
