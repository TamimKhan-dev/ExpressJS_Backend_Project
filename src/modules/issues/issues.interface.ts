export interface IIssue {
  title: string;
  description: string;
  type: "bug" | "feature_request";
}

export interface IIssueData {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id: number;
  created_at: string;
  updated_at: string;
}

export interface IIssuesQuery {
  sort?: string;
  status?: string;
  type?: string;
}

export interface IIssueUpdate {
  title: string;
  description: string;
  type: string;
}

export interface IIssueUpdateData {
  id: number;
  title: string;
  description: string;
  type: string;
  status: string;
  reporter_id: number;
  created_at: string;
  updated_at: string;
}
