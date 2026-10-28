import type { ApplicationStats, JobApplication, JobApplicationInput } from './types';

const API = '/api/applications';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error('Could not connect to the API. Start the Spring Boot backend on port 8080.');
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = (await response.json()) as { message?: string; error?: string };
      detail = body.message || body.error || '';
    } catch {
      // Ignore non-JSON error bodies.
    }
    throw new Error(detail || `Request failed (${response.status})`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function listApplications() {
  return request<JobApplication[]>(API);
}

export function getStats() {
  return request<ApplicationStats>(`${API}/stats`);
}

export function createApplication(input: JobApplicationInput) {
  return request<JobApplication>(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function updateApplication(id: number, input: JobApplicationInput) {
  return request<JobApplication>(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
}

export function deleteApplication(id: number) {
  return request<void>(`${API}/${id}`, { method: 'DELETE' });
}
