import { api } from "../../app/api";
import type { Issue, Status } from "./KanbanBoard";

export async function fetchIssues(): Promise<Issue[]> {
  const response = await api.get<Issue[]>("/issues");
  return response.data;
}

export async function updateIssueStatus(
  issueId: string,
  status: Status
): Promise<Issue> {
  const response = await api.patch<Issue>(`/issues/${issueId}`, {
    status,
  });
  return response.data;
}

export interface CreateIssuePayload {
  title: string;
  description?: string;
  status: Status;
  priority: string;
  project_id: string;      
  assignee_id?: string | null; 
}

export async function createIssue(
  payload: CreateIssuePayload
): Promise<Issue> {
  const response = await api.post<Issue>("/issues", payload);
  return response.data;
}

export interface UpdateIssuePayload {
  title?: string;
  description?: string;
  status?: Status;
  priority?: string;
  assigneeId?: string | null; 
}

export async function updateIssue(
  issueId: string,
  payload: UpdateIssuePayload
): Promise<Issue> {
  const response = await api.patch<Issue>(
    `/issues/${issueId}`,
    payload
  );
  return response.data;
}
